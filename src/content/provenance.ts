/**
 * 訪問者に見える経歴・職務上の情報（profile, experience, skills, projects）は
 * すべて、オーナーが承認済みの公開情報なのか、承認待ちのプレースホルダーなのか
 * を明示しなければならない。プレースホルダーはオーナーの承認後に承認済みの情報
 * へ差し替えられる。それまでの間、プレースホルダーを訪問者にあたかも実データの
 * ように提示してはならない（docs/product/mvp.md を参照）。
 *
 * `ProvenancedField` を描画する UI コンポーネントは、プレースホルダーであること
 * を視覚的に区別できるようにする責務を負う（`src/components/content/
 * provenanced-text.tsx` と `provenanced-link.tsx` を参照）。
 */
export type ContentProvenance = "approved" | "placeholder";

export interface ProvenancedField<T> {
  readonly value: T;
  readonly provenance: ContentProvenance;
}

/** オーナーが公開を明示的に承認した情報をラップする。 */
export function approved<T>(value: T): ProvenancedField<T> {
  return { value, provenance: "approved" };
}

/** 可視のプレースホルダーマーカー付きで描画すべき、未承認の情報をラップする。 */
export function placeholder<T>(value: T): ProvenancedField<T> {
  return { value, provenance: "placeholder" };
}
