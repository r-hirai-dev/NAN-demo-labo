/**
 * プライマリナビゲーションはサイトの構成要素であり、訪問者向けの経歴情報ではない
 * ため、各項目は `ProvenancedField` を持たない（src/content/provenance.ts を参照）。
 */
export interface NavigationItem {
  readonly href: string;
  readonly label: string;
}

export const navigationItems: readonly NavigationItem[] = [
  { href: "/", label: "Home" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/lab", label: "Lab" },
];
