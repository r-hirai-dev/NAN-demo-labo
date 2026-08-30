import { describe, expect, it } from "vitest";
import {
  extractProse,
  japaneseProseRatio,
  JAPANESE_PROSE_RATIO_THRESHOLD,
  findPublicationBoundaryViolations,
} from "../../scripts/validate-project.mjs";

describe("extractProse", () => {
  it("fenced code blockと4連バッククォートのネストを除去する", () => {
    const markdown = [
      "前置きの日本語文。",
      "````",
      "```",
      "code inside nested fence",
      "```",
      "````",
      "後書きの日本語文。",
    ].join("\n");

    const prose = extractProse(markdown);

    expect(prose).not.toContain("code inside nested fence");
    expect(prose).toContain("前置きの日本語文。");
    expect(prose).toContain("後書きの日本語文。");
  });

  it("~~~フェンスを除去する", () => {
    const markdown = ["説明文。", "~~~", "some code", "~~~", "続きの説明文。"].join("\n");

    const prose = extractProse(markdown);

    expect(prose).not.toContain("some code");
  });

  it("4スペースインデントのコードブロックを除去する", () => {
    const markdown = ["説明文。", "    indented code line", "続きの説明文。"].join("\n");

    const prose = extractProse(markdown);

    expect(prose).not.toContain("indented code line");
  });

  it("インラインコードを除去する", () => {
    const markdown = "コマンドは`npm run build`を実行する。";

    const prose = extractProse(markdown);

    expect(prose).not.toContain("npm run build");
    expect(prose).toContain("コマンドは");
  });

  it("HTMLコメント（複数行を含む）を除去する", () => {
    const markdown = [
      "本文の説明。",
      "<!--",
      "this is an internal note",
      "spanning multiple lines",
      "-->",
      "続きの本文。",
    ].join("\n");

    const prose = extractProse(markdown);

    expect(prose).not.toContain("internal note");
    expect(prose).not.toContain("multiple lines");
    expect(prose).toContain("本文の説明。");
  });

  it("YAML front matterを除去する", () => {
    const markdown = ["---", "title: Example", "draft: true", "---", "本文はここから。"].join("\n");

    const prose = extractProse(markdown);

    expect(prose).not.toContain("title: Example");
    expect(prose).toContain("本文はここから。");
  });

  it("裸のURLを除去する", () => {
    const markdown = "詳細はhttps://example.com/docsを参照。";

    const prose = extractProse(markdown);

    expect(prose).not.toContain("https://example.com/docs");
    expect(prose).toContain("詳細は");
  });

  it("インラインリンクのhrefを除去し、リンクテキストは残す", () => {
    const markdown = "[ロードマップ](docs/delivery/roadmap.md)を参照。";

    const prose = extractProse(markdown);

    expect(prose).not.toContain("docs/delivery/roadmap.md");
    expect(prose).toContain("ロードマップ");
  });

  it("参照リンクのhrefを除去し、リンクテキストは残す", () => {
    const markdown = [
      "[品質ゲート][gates]について。",
      "",
      "[gates]: docs/delivery/quality-gates.md",
    ].join("\n");

    const prose = extractProse(markdown);

    expect(prose).not.toContain("docs/delivery/quality-gates.md");
    expect(prose).toContain("品質ゲート");
  });

  it("テーブルの区切り行を除去し、セル本文は散文として残す", () => {
    const markdown = ["| 項目 | 説明 |", "| --- | --- |", "| 対象 | 日本語のセル本文 |"].join("\n");

    const prose = extractProse(markdown);

    expect(prose).not.toMatch(/^\|\s*---/m);
    expect(prose).toContain("日本語のセル本文");
  });
});

describe("japaneseProseRatio", () => {
  it("英語のみの文書は閾値を下回る", () => {
    const markdown = "# Example\n\nThis document is written entirely in English prose.";

    expect(japaneseProseRatio(markdown)).toBeLessThan(JAPANESE_PROSE_RATIO_THRESHOLD);
  });

  it("日本語の文書は閾値以上になる", () => {
    const markdown =
      "# 見出し\n\nこの文書は日本語の散文として書かれており、識別子や`npm run build`のようなコマンドだけが英語のままである。";

    expect(japaneseProseRatio(markdown)).toBeGreaterThanOrEqual(JAPANESE_PROSE_RATIO_THRESHOLD);
  });
});

// このテストファイル自体もtrackedファイルなので`npm run validate`の走査対象になる。
// 検出パターンに一致する文字列をソース上にそのまま書くと、このテストファイル自身が
// 公開識別子規約違反として検出されてしまうため、実行時にのみ組み立つ合成値を使い、
// ソーステキスト上は検出パターンに一致しない形にする。値そのものに秘匿すべき意味は
// なく、あくまで検査対象パターンとの自己参照を避けるための組み立てである。
const SYNTHETIC_UNDEFINED_ID = ["ABC", "123"].join("-");
const SYNTHETIC_ALLOWED_PREFIX_ID = ["SPEC", "123"].join("-");
const SYNTHETIC_LOCAL_PATH = [".", "local", "/scripts/agent.mjs"].join("");

describe("findPublicationBoundaryViolations", () => {
  it("公開文書で定義されていない識別子形式を検出する", () => {
    const content = `この変更は${SYNTHETIC_UNDEFINED_ID}で計画された。`;

    const violations = findPublicationBoundaryViolations(content, "README.md");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({
      line: 1,
      reason: "identifier format not defined in public documentation",
    });
  });

  it("ローカル専用パスへの参照を検出する", () => {
    const content = `設定は${SYNTHETIC_LOCAL_PATH}にある。`;

    const violations = findPublicationBoundaryViolations(content, "README.md");

    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({ line: 1, reason: "reference to a local-only path" });
  });

  it("境界を定義・強制するファイルではローカル専用パス参照ルールを免除する", () => {
    const content = `${SYNTHETIC_LOCAL_PATH}を説明する文書。`;

    expect(
      findPublicationBoundaryViolations(content, "docs/repository-publication-policy.md")
    ).toEqual([]);
    expect(findPublicationBoundaryViolations(content, "scripts/validate-project.mjs")).toEqual([]);
    expect(findPublicationBoundaryViolations(content, ".gitignore")).toEqual([]);
  });

  it("境界を定義・強制するファイルであっても未定義の識別子形式は免除しない", () => {
    const content = `${SYNTHETIC_UNDEFINED_ID}を説明する文書。`;

    for (const relativePath of [
      "docs/repository-publication-policy.md",
      "scripts/validate-project.mjs",
      ".gitignore",
    ]) {
      const violations = findPublicationBoundaryViolations(content, relativePath);
      expect(violations).toHaveLength(1);
      expect(violations[0]).toMatchObject({
        reason: "identifier format not defined in public documentation",
      });
    }
  });

  it("ADR番号（4桁）や規格名の一般表記では誤検知しない", () => {
    const content = [
      "詳細はADR-0001を参照。",
      "This document follows ISO-8601 for dates.",
      "See RFC-2119 for the meaning of MUST and SHOULD.",
      "The API responds with UTF-8 encoded JSON.",
      "CVE-2024-1234 was patched in the latest release.",
    ].join("\n");

    expect(findPublicationBoundaryViolations(content, "README.md")).toEqual([]);
  });

  it("公開文書で定義済みの接頭辞は許可される", () => {
    const content = `この機能は${SYNTHETIC_ALLOWED_PREFIX_ID}で定義されている。`;

    expect(findPublicationBoundaryViolations(content, "README.md")).toHaveLength(1);
    expect(findPublicationBoundaryViolations(content, "README.md", new Set(["SPEC"]))).toEqual([]);
  });
});
