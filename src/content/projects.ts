import { placeholder, type ProvenancedField } from "./provenance";

export interface ProjectEntry {
  /** Structural key for lists; not a visitor-facing fact. */
  readonly id: string;
  readonly name: ProvenancedField<string>;
  readonly summary: ProvenancedField<string>;
  /**
   * Rendered as a clickable link only when `provenance` is "approved" (see
   * `src/components/content/provenanced-link.tsx`). Placeholder values use
   * the reserved `example.com` domain (RFC 2606) so a placeholder can never
   * be mistaken for a real destination even if the boundary check regresses.
   */
  readonly href: ProvenancedField<string>;
}

// Placeholder entries only; real project evidence is published only after owner approval.
export const projectEntries: readonly ProjectEntry[] = [
  {
    id: "project-placeholder-1",
    name: placeholder("Project name pending approval"),
    summary: placeholder(
      "Project summary pending owner approval."
    ),
    href: placeholder("https://example.com/placeholder-project-1"),
  },
  {
    id: "project-placeholder-2",
    name: placeholder("Project name pending approval"),
    summary: placeholder(
      "Project summary pending owner approval."
    ),
    href: placeholder("https://example.com/placeholder-project-2"),
  },
];
