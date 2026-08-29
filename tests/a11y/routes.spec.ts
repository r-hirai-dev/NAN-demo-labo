import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

// axe が判定に使うタグの一覧。散在させず、この定数だけを唯一のソースにする。
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

const OUT_DIR = fileURLToPath(new URL("../../out", import.meta.url));

// Next.js が生成するカスタム 404 ページと内部の未一致ルートページは、サイト
// ナビゲーションから到達できる「公開ルート」ではないため対象から除く。
const RESERVED_SEGMENTS = new Set(["404", "_not-found"]);

// `out/` を再帰的に走査し `index.html` を含むディレクトリを集める。
// `@types/node` が固定しているバージョンには `fs.globSync` の型定義が
// 無いため、新規依存を増やさずに自前の最小限の探索で代替する。
function findIndexHtmlDirs(dir: string, segments: string[] = []): string[][] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const hasIndexHtml = entries.some((entry) => entry.isFile() && entry.name === "index.html");
  const results = hasIndexHtml ? [segments] : [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      results.push(...findIndexHtmlDirs(`${dir}/${entry.name}`, [...segments, entry.name]));
    }
  }

  return results;
}

// `out/**/index.html` を実際に走査してルート一覧を組み立てる。ハードコードを
// やめることで、新しいページが追加されたときにテストの更新漏れで
// 未検証のまま緑になる事故を防ぐ。
function discoverRoutes(): string[] {
  let dirs: string[][];
  try {
    dirs = findIndexHtmlDirs(OUT_DIR);
  } catch {
    // `out/` 自体が存在しない場合。ENOENT のスタックトレースをそのまま
    // 見せるより、対処が分かるメッセージで即座に失敗させる方が親切。
    dirs = [];
  }

  const routes = dirs
    .filter((segments) => !segments.some((segment) => RESERVED_SEGMENTS.has(segment)))
    .map((segments) => (segments.length === 0 ? "/" : `/${segments.join("/")}/`));

  if (routes.length === 0) {
    // `out/` が存在しない、あるいは空のまま実行された場合に空リストで
    // 静かに成功（0 テストで green）してしまうと、検証していないのに
    // 検証済みに見える最悪のケースになる。ここで必ず失敗させる。
    throw new Error(
      `No routes found under "${OUT_DIR}". Run "npm run build" to generate the static export before running the accessibility smoke.`
    );
  }

  return routes;
}

const ROUTES = discoverRoutes();

for (const route of ROUTES) {
  test(`${route} has no detectable WCAG 2.1 AA violations`, async ({ page }) => {
    const response = await page.goto(route);
    // `page.goto` の戻り値を捨てると 404 応答でもテストが通り得るため、
    // レスポンスが実際に解決したことを明示的に検証する。
    expect(response?.ok(), `expected ${route} to resolve with an OK response`).toBe(true);

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

    // axe の結果オブジェクトをそのまま出力すると CI ログが読めなくなるため、
    // 違反の要点だけを抜き出して比較・出力する。
    const violationSummary = results.violations.map(({ id, help, nodes }) => ({
      id,
      help,
      nodes: nodes.length,
    }));
    expect(violationSummary).toEqual([]);
  });
}
