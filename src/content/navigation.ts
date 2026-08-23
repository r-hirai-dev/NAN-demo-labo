/**
 * Primary navigation is site chrome, not a visitor-facing biographical fact,
 * so entries do not carry a `ProvenancedField` (see src/content/provenance.ts).
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
