import { placeholder, type ProvenancedField } from "./provenance";

export interface SkillCategory {
  /** リスト表示用の構造上のキーであり、訪問者向けの情報ではない。 */
  readonly id: string;
  readonly category: ProvenancedField<string>;
  readonly items: readonly ProvenancedField<string>[];
}

// プレースホルダーのカテゴリのみ。実際のスキル情報はオーナーの承認後に公開する。
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
