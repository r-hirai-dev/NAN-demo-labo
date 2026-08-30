import { access, readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import process from "node:process";

const REQUIRED_PUBLIC_FILES = [
  ".gitignore",
  "README.md",
  "package.json",
  "docs/repository-publication-policy.md",
  "docs/product/mvp.md",
  "docs/architecture/overview.md",
  "docs/adr/README.md",
  "docs/adr/0001-static-first-aws-hosting.md",
  "docs/delivery/roadmap.md",
];
const REQUIRED_PRIVATE_PATTERNS = [
  "/.local/",
  "/AGENTS.md",
  "/CLAUDE.md",
  ".env",
  "*.tfstate",
  "*.tfvars",
];

// 「散文の何割が日本語文字か」の合格ライン。日本語の文書でも識別子・コマンド名・
// 製品名は英語のまま残るため100%は求められない。一方で見出しと導入部だけ日本語に
// して本文は英語のまま、という中途半端な翻訳は弾きたい。既存文書の比率を実際に
// 測って両者の間に十分な余裕があることを確かめたうえで30%としている。
const JAPANESE_PROSE_RATIO_THRESHOLD = 0.3;

// ひらがな・カタカナ・CJK統合漢字のUnicode範囲。日本語の文章かどうかの判定に使う。
const JAPANESE_CHARACTER_PATTERN = /[぀-ゟ゠-ヿ一-鿿]/g;

// Markdownからコード・URL・リンク先・テーブル罫線などを取り除き、読者が実際に
// 読む散文だけを残す。これらは英語の識別子やコマンドを含むのが自然なため、
// 日本語比率の判定対象に含めると誤検知になる。
function extractProse(markdown) {
  return (
    markdown
      // YAML front matter（先頭の---ブロック）
      .replace(/^---\n[\s\S]*?\n---\n/, "")
      // ~~~ フェンス（```と同様に扱う）
      .replace(/~~~[\s\S]*?~~~/g, "")
      // ``` フェンス（4連バッククォートのネストにも対応）
      .replace(/````[\s\S]*?````/g, "")
      .replace(/```[\s\S]*?```/g, "")
      // HTMLコメント（複数行を含む）
      .replace(/<!--[\s\S]*?-->/g, "")
      // インラインコード
      .replace(/`[^`\n]*`/g, "")
      // 参照リンク定義の行（[ref]: URL "title" のような行）は丸ごと除去
      .split("\n")
      .filter((line) => !/^\s*\[[^\]]+\]:\s*\S+/.test(line))
      .join("\n")
      // インラインリンク [text](href) と参照リンク [text][ref] はリンクテキストだけ残す
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/\[([^\]]*)\]\[[^\]]*\]/g, "$1")
      // 裸のURL
      .replace(/https?:\/\/\S+/g, "")
      .split("\n")
      // 4スペースインデントのコードブロック
      .filter((line) => !/^ {4,}\S/.test(line))
      // テーブルの区切り行
      .filter((line) => !/^\s*\|?[\s:|-]+\|?\s*$/.test(line))
      .join("\n")
  );
}

// 散文全体に対する日本語文字（空白を除く）の比率を返す。
function japaneseProseRatio(markdown) {
  const prose = extractProse(markdown).replace(/\s/g, "");
  if (prose.length === 0) return 0;
  const japaneseCharCount = (prose.match(JAPANESE_CHARACTER_PATTERN) ?? []).length;
  return japaneseCharCount / prose.length;
}

// git管理下のMarkdownファイル一覧を返す。生成物ディレクトリ（out/、.terraform/など）は
// 追跡されないため自然に除外される。git自体が使えない/リポジトリでない環境では
// 黙ってスキップせず、呼び出し元でエラーとして扱えるよう例外を投げる。
function listTrackedMarkdownFiles(cwd) {
  const output = execFileSync("git", ["ls-files", "*.md"], { cwd, encoding: "utf8" });
  return output.split("\n").filter((line) => line.length > 0);
}

async function main() {
  const ROOT_URL = new URL("../", import.meta.url);
  const ROOT_DIR = fileURLToPath(ROOT_URL);
  const errors = [];

  for (const filePath of REQUIRED_PUBLIC_FILES) {
    try {
      await access(new URL(filePath, ROOT_URL));
    } catch {
      errors.push(`missing required public file: ${filePath}`);
    }
  }

  const ignoreRules = new Set(
    (await readFile(new URL(".gitignore", ROOT_URL), "utf8"))
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
  );
  for (const pattern of REQUIRED_PRIVATE_PATTERNS) {
    if (!ignoreRules.has(pattern)) errors.push(`missing required ignore rule: ${pattern}`);
  }

  let trackedMarkdownFiles = [];
  try {
    trackedMarkdownFiles = listTrackedMarkdownFiles(ROOT_DIR);
  } catch (cause) {
    errors.push(
      `unable to list tracked Markdown files with "git ls-files" (is this a git checkout with git available?): ${cause.message}`
    );
  }

  for (const relativePath of trackedMarkdownFiles) {
    const content = await readFile(path.join(ROOT_DIR, relativePath), "utf8");
    const ratio = japaneseProseRatio(content);
    if (ratio < JAPANESE_PROSE_RATIO_THRESHOLD) {
      const percent = (ratio * 100).toFixed(1);
      errors.push(
        `document is not Japanese prose: ${relativePath} (${percent}% Japanese characters, ` +
          `need at least ${(JAPANESE_PROSE_RATIO_THRESHOLD * 100).toFixed(0)}%)`
      );
    }
  }

  if (errors.length > 0) {
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else {
    console.log(
      `Project validation passed (${REQUIRED_PUBLIC_FILES.length} public files, ` +
        `${REQUIRED_PRIVATE_PATTERNS.length} privacy rules, ${trackedMarkdownFiles.length} Markdown documents).`
    );
  }
}

// テストからはextractProse/japaneseProseRatioだけをimportして使うので、
// このファイルが直接実行されたときだけ本体の検証処理を走らせる。
const isDirectlyExecuted = process.argv[1] === fileURLToPath(import.meta.url);
if (isDirectlyExecuted) {
  await main();
}

export { extractProse, japaneseProseRatio, JAPANESE_PROSE_RATIO_THRESHOLD };
