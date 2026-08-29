import { placeholder, type ProvenancedField } from "./provenance";

export interface ProjectEntry {
  /** リスト表示用の構造上のキーであり、訪問者向けの情報ではない。 */
  readonly id: string;
  readonly name: ProvenancedField<string>;
  readonly summary: ProvenancedField<string>;
  /**
   * `provenance` が "approved" の場合のみクリック可能なリンクとして描画される
   * （`src/components/content/provenanced-link.tsx` を参照）。プレースホルダー
   * の値には予約ドメイン `example.com`（RFC 2606）を使うことで、境界チェックが
   * 万一退行しても実在の宛先と誤認されないようにしている。
   */
  readonly href: ProvenancedField<string>;
}

// プレースホルダーのみ。実際のプロジェクト実績はオーナーの承認後に公開する。
export const projectEntries: readonly ProjectEntry[] = [
  {
    id: "project-placeholder-1",
    name: placeholder("Project name pending approval"),
    summary: placeholder("Project summary pending owner approval."),
    href: placeholder("https://example.com/placeholder-project-1"),
  },
  {
    id: "project-placeholder-2",
    name: placeholder("Project name pending approval"),
    summary: placeholder("Project summary pending owner approval."),
    href: placeholder("https://example.com/placeholder-project-2"),
  },
];
