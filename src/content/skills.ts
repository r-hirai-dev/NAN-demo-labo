import { placeholder, type ProvenancedField } from "./provenance";

export interface SkillCategory {
  /** Structural key for lists; not a visitor-facing fact. */
  readonly id: string;
  readonly category: ProvenancedField<string>;
  readonly items: readonly ProvenancedField<string>[];
}

// Placeholder categories only; approved skill content arrives in STORY-002.
export const skillCategories: readonly SkillCategory[] = [
  {
    id: "skills-placeholder-1",
    category: placeholder("Skill category pending approval"),
    items: [placeholder("Skill pending approval"), placeholder("Skill pending approval")],
  },
  {
    id: "skills-placeholder-2",
    category: placeholder("Skill category pending approval"),
    items: [placeholder("Skill pending approval"), placeholder("Skill pending approval")],
  },
];
