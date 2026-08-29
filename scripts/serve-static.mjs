import { createServer } from "node:http";
import { readFile, realpath, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, normalize, relative, resolve, sep } from "node:path";
import process from "node:process";

// アクセシビリティ・スモーク（Playwright + axe）が `next build` の静的
// エクスポート（`out/`）をそのまま検証できるよう、依存を増やさずに
// 最小限の静的ファイルサーバーを自前で用意する。
// `next.config.ts` の `trailingSlash: true` により各ルートは
// `out/<route>/index.html` として書き出されるため、ディレクトリ相当の
// パスは `index.html` に解決する。

const rootArg = process.argv[2] ?? "out";
const portArg = process.argv[3] ?? "4173";

const ROOT = resolve(rootArg);
const PORT = Number(portArg);

// ポート指定は数値以外を渡すと `Number(...)` が `NaN` になり、Node が
// ランダムな空きポートへ待ち受けてしまう。呼び出し元（Playwright の
// webServer 設定）が期待するポートに立たない事故を早期に検出する。
if (!Number.isInteger(PORT) || PORT <= 0 || PORT > 65535) {
  console.error(`Invalid port: "${portArg}". Expected an integer between 1 and 65535.`);
  process.exit(1);
}

// `out/` が存在しない、あるいは `npm run build` が未実行のまま呼ばれた場合、
// Playwright の webServer は 30 秒待って原因不明のタイムアウトを返すだけに
// なる。ここで前もって検出し、原因と対処（`npm run build`）を明示する。
if (!existsSync(join(ROOT, "index.html"))) {
  console.error(
    `Missing "${join(ROOT, "index.html")}". Run "npm run build" to generate the static export before starting this server.`
  );
  process.exit(1);
}

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".xml": "application/xml; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
};

// リクエストパスを `ROOT` 配下の実ファイルパスへ解決する。
// `normalize` 後も `ROOT` から外れる場合はパストラバーサルとみなし拒否する。
// パーセントエンコーディングが壊れている（例: 単独の `%`）と
// `decodeURIComponent` が `URIError` を投げるため、呼び出し側で捕捉できる
// よう `null` を返す（呼び出し側は 400 を返す）。
function resolveFilePath(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath.split("?")[0] ?? "/");
  } catch {
    return null;
  }
  const withoutLeadingSlash = normalize(decoded).replace(/^([/\\])+/, "");
  const candidate = resolve(ROOT, withoutLeadingSlash);

  // `path.relative` ベースの判定にすることで、区切り文字やプラットフォーム
  // 依存の綴りに関わらず「ROOT の外に出ていないか」を移植可能に検査する。
  const relativePath = relative(ROOT, candidate);
  if (relativePath.startsWith("..") || relativePath.split(sep)[0] === "..") {
    return null;
  }

  return candidate;
}

async function readIfFile(path) {
  try {
    // シンボリックリンクが ROOT の外側を指していないかを実体パスで確認する。
    // `path.relative` の文字列比較だけではシンボリックリンク越しの
    // トラバーサルを検出できないため、実体解決を挟む。
    const real = await realpath(path);
    const relativeReal = relative(ROOT, real);
    if (relativeReal.startsWith("..") || relativeReal.split(sep)[0] === "..") {
      return null;
    }

    const info = await stat(real);
    if (info.isDirectory()) return null;
    return await readFile(real);
  } catch {
    return null;
  }
}

const ALLOWED_METHODS = new Set(["GET", "HEAD"]);

const server = createServer(async (req, res) => {
  if (!ALLOWED_METHODS.has(req.method ?? "")) {
    res.writeHead(405, { Allow: "GET, HEAD" }).end("Method not allowed");
    return;
  }

  const requestedPath = resolveFilePath(req.url ?? "/");
  if (!requestedPath) {
    res.writeHead(400).end("Bad request");
    return;
  }

  const candidates = [requestedPath, join(requestedPath, "index.html")];

  for (const candidate of candidates) {
    const body = await readIfFile(candidate);
    if (body) {
      const contentType = CONTENT_TYPES[extname(candidate)] ?? "application/octet-stream";
      if (req.method === "HEAD") {
        res.writeHead(200, { "Content-Type": contentType }).end();
        return;
      }
      res.writeHead(200, { "Content-Type": contentType }).end(body);
      return;
    }
  }

  res.writeHead(404).end("Not found");
});

// `EADDRINUSE` などの起動失敗を無言のまま放置すると、Playwright の
// webServer は原因の分からない 30 秒タイムアウトになる。ここで検出し、
// 明確なメッセージとともに非ゼロ終了する。
server.on("error", (error) => {
  console.error(`Failed to start static server on port ${PORT}: ${error.message}`);
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`Serving ${ROOT} at http://127.0.0.1:${PORT}`);
});
