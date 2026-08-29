import { placeholder, type ProvenancedField } from "./provenance";

export interface ExperienceEntry {
  /** リスト表示用の構造上のキーであり、訪問者向けの情報ではない。 */
  readonly id: string;
  readonly role: ProvenancedField<string>;
  readonly organization: ProvenancedField<string>;
  readonly period: ProvenancedField<string>;
  readonly summary: ProvenancedField<string>;
}

// プレースホルダーのみ。実際の経歴内容はオーナーが決定するものであり、
// 承認なしに所属先名を記載してはならない。
export const experienceEntries: readonly ExperienceEntry[] = [
  {
    id: "experience-placeholder-1",
    role: placeholder("Role title pending approval"),
    organization: placeholder("Organization name pending approval"),
    period: placeholder("Period pending approval"),
    summary: placeholder("Experience summary pending owner approval."),
  },
  {
    id: "experience-placeholder-2",
    role: placeholder("Role title pending approval"),
    organization: placeholder("Organization name pending approval"),
    period: placeholder("Period pending approval"),
    summary: placeholder("Experience summary pending owner approval."),
  },
];
