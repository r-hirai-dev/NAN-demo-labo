import { placeholder, type ProvenancedField } from "./provenance";

export interface ExperienceEntry {
  /** Structural key for lists; not a visitor-facing fact. */
  readonly id: string;
  readonly role: ProvenancedField<string>;
  readonly organization: ProvenancedField<string>;
  readonly period: ProvenancedField<string>;
  readonly summary: ProvenancedField<string>;
}

// Placeholder entries only. Real experience content is an owner decision
// and must never name an employer without approval.
export const experienceEntries: readonly ExperienceEntry[] = [
  {
    id: "experience-placeholder-1",
    role: placeholder("Role title pending approval"),
    organization: placeholder("Organization name pending approval"),
    period: placeholder("Period pending approval"),
    summary: placeholder(
      "Experience summary pending owner approval."
    ),
  },
  {
    id: "experience-placeholder-2",
    role: placeholder("Role title pending approval"),
    organization: placeholder("Organization name pending approval"),
    period: placeholder("Period pending approval"),
    summary: placeholder(
      "Experience summary pending owner approval."
    ),
  },
];
