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

// 公開ファイルに書いてよい識別子の接頭辞。ここに載っていない接頭辞は
// 「公開文書で定義されていない識別子形式」として検出対象になる。新しい接頭辞を
// 使いたくなったら、まず公開文書（例: ADRやロードマップ）でその接頭辞と意味を
// 定義してからここに追加する。現時点ではどの公開仕様も3桁の採番識別子を
// 定義していないため空にしている。
const PUBLICLY_DEFINED_ID_PREFIXES = new Set();

// 「大文字2文字以上 + ハイフン + 数字ちょうど3桁」を、公開読者には解決できない
// 未定義の識別子形式とみなすパターン。3桁ちょうどに絞っているのは、桁数を
// 手がかりにするだけで一般的な規格・製品名の表記を誤検知しないため:
//   - ADR-0001 のように4桁で採番している公開ADR番号を誤検知しない
//   - ISO-8601 / RFC-2119 のような規格名は末尾が4桁のため一致しない
//   - UTF-8 のようなエンコーディング名は末尾が1桁のため一致しない
//   - CVE-2024-1234 も、ハイフン直後の数字列が4桁であるため一致しない
// このスクリプトは「私的な語彙が何か」を知らなくてよい。形式だけを見て、
// 公開文書で定義済みと申告された接頭辞（PUBLICLY_DEFINED_ID_PREFIXES）だけを
// 通す設計にすることで、私的な作業単位の名前自体をここに書く必要がなくなる。
const UNDEFINED_ID_PATTERN = /\b([A-Z]{2,})-(\d{3})\b/g;

// 公開文書に紐づかないローカル専用パスへの参照。この語自体は
// `docs/repository-publication-policy.md`が公開境界として明記しているので、
// 検査コード側に書いても私的語彙の漏洩にはあたらない。
const LOCAL_PATH_REFERENCE_PATTERN = /\.local\//;

// 「.local/参照ルール」だけを免除するファイル。境界そのものを定義・強制する
// 3ファイルは、その説明の中で`.local/`という文字列そのものに言及する必要がある
// （そうでなければポリシー文書自身や検査スクリプト自身がこの検査に落ちる）。
// 免除はルール単位であり、ファイル単位の丸ごと免除ではない。未定義識別子形式
// ルールにはこのような免除は存在しない。境界を定義する文書やスクリプトであっても、
// 公開読者に解決できないID形式の値をそこに書く正当な理由はないため、
// 免除なしに全ファイルへ適用する。
const LOCAL_PATH_RULE_EXEMPT_FILES = new Set([
  ".gitignore",
  "docs/repository-publication-policy.md",
  "scripts/validate-project.mjs",
]);

// 与えられたテキストの各行を走査し、(a)公開文書で定義されていない識別子形式、
// (b)ローカル専用パスへの参照、のいずれかにマッチした行番号と内容を返す。
// 純関数として切り出すことでテキストと相対パスだけを渡して単体テストできるようにする。
// (a)は免除なしに全ファイルへ適用し、(b)だけをLOCAL_PATH_RULE_EXEMPT_FILESで免除する。
function findPublicationBoundaryViolations(
  content,
  relativePath,
  allowedIdPrefixes = PUBLICLY_DEFINED_ID_PREFIXES
) {
  const violations = [];
  const lines = content.split("\n");
  const isExemptFromLocalPathRule = LOCAL_PATH_RULE_EXEMPT_FILES.has(relativePath);
  for (const [index, line] of lines.entries()) {
    const hasUndefinedId = [...line.matchAll(UNDEFINED_ID_PATTERN)].some(
      ([, prefix]) => !allowedIdPrefixes.has(prefix)
    );
    if (hasUndefinedId) {
      violations.push({
        line: index + 1,
        text: line.trim(),
        reason: "identifier format not defined in public documentation",
      });
      continue;
    }
    if (!isExemptFromLocalPathRule && LOCAL_PATH_REFERENCE_PATTERN.test(line)) {
      violations.push({
        line: index + 1,
        text: line.trim(),
        reason: "reference to a local-only path",
      });
    }
  }
  return violations;
}

// git管理下の全ファイル一覧を返す。生成物ディレクトリ（out/、.terraform/など）は
// 追跡されないため自然に除外される。
function listTrackedFiles(cwd) {
  const output = execFileSync("git", ["ls-files"], { cwd, encoding: "utf8" });
  return output.split("\n").filter((line) => line.length > 0);
}

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

  let trackedFiles = [];
  try {
    trackedFiles = listTrackedFiles(ROOT_DIR);
  } catch (cause) {
    errors.push(
      `unable to list tracked files with "git ls-files" (is this a git checkout with git available?): ${cause.message}`
    );
  }

  // Markdown限定にせず、追跡ファイル全体を対象にする。未定義の識別子やローカル
  // パス参照はコードコメントやスクリプト、CI定義にも紛れ込みうるため。
  for (const relativePath of trackedFiles) {
    const content = await readFile(path.join(ROOT_DIR, relativePath), "utf8");
    for (const violation of findPublicationBoundaryViolations(content, relativePath)) {
      errors.push(`${violation.reason}: ${relativePath}:${violation.line}: ${violation.text}`);
    }
  }

  if (errors.length > 0) {
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else {
    console.log(
      `Project validation passed (${REQUIRED_PUBLIC_FILES.length} public files, ` +
        `${REQUIRED_PRIVATE_PATTERNS.length} privacy rules, ${trackedMarkdownFiles.length} Markdown documents, ` +
        `${trackedFiles.length} tracked files scanned for public identifier conventions).`
    );
  }
}

// テストからはextractProse/japaneseProseRatioだけをimportして使うので、
// このファイルが直接実行されたときだけ本体の検証処理を走らせる。
const isDirectlyExecuted = process.argv[1] === fileURLToPath(import.meta.url);
if (isDirectlyExecuted) {
  await main();
}

export {
  extractProse,
  japaneseProseRatio,
  JAPANESE_PROSE_RATIO_THRESHOLD,
  findPublicationBoundaryViolations,
  PUBLICLY_DEFINED_ID_PREFIXES,
};
