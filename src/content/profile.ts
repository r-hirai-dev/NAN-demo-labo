import { placeholder, type ProvenancedField } from "./provenance";

export interface Profile {
  readonly handle: ProvenancedField<string>;
  readonly tagline: ProvenancedField<string>;
  readonly introduction: ProvenancedField<string>;
}

// 以下のフィールドはすべてプレースホルダーである。実名・所属先の詳細・経歴の
// いずれもまだ公開が承認されていない。
export const profile: Profile = {
  handle: placeholder("handle-pending-approval"),
  tagline: placeholder("Tagline pending owner approval."),
  introduction: placeholder(
    "This introduction is placeholder text used to review the site shell's layout and navigation. A real biography replaces it only after the owner approves one."
  ),
};
