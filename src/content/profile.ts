import { placeholder, type ProvenancedField } from "./provenance";

export interface Profile {
  readonly handle: ProvenancedField<string>;
  readonly tagline: ProvenancedField<string>;
  readonly introduction: ProvenancedField<string>;
}

// Every field below is a placeholder: no real name, employer detail, or
// biography has been approved for publication yet.
export const profile: Profile = {
  handle: placeholder("handle-pending-approval"),
  tagline: placeholder("Tagline pending owner approval."),
  introduction: placeholder(
    "This introduction is placeholder text used to review the site shell's layout and navigation. A real biography replaces it only after the owner approves one."
  ),
};
