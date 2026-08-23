/**
 * Every visitor-facing biographical or professional fact (profile, experience,
 * skills, projects) must declare whether it is an owner-approved public fact
 * or placeholder content awaiting approval. STORY-002 replaces placeholder
 * content with approved facts; until then, placeholder content must never be
 * presented to a visitor as if it were real (see docs/product/mvp.md).
 *
 * UI components that render a `ProvenancedField` are responsible for making
 * placeholder content visibly distinguishable (see
 * `src/components/content/provenanced-text.tsx` and `provenanced-link.tsx`).
 */
export type ContentProvenance = "approved" | "placeholder";

export interface ProvenancedField<T> {
  readonly value: T;
  readonly provenance: ContentProvenance;
}

/** Wrap a fact that the owner has explicitly approved for public display. */
export function approved<T>(value: T): ProvenancedField<T> {
  return { value, provenance: "approved" };
}

/** Wrap placeholder content that must render with a visible placeholder marker. */
export function placeholder<T>(value: T): ProvenancedField<T> {
  return { value, provenance: "placeholder" };
}
