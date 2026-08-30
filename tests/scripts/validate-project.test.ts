import { describe, expect, it } from "vitest";
import {
  extractProse,
  japaneseProseRatio,
  JAPANESE_PROSE_RATIO_THRESHOLD,
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
