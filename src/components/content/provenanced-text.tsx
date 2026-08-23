import type { ProvenancedField } from "@/content/provenance";
import { PlaceholderBadge } from "./placeholder-badge";

interface ProvenancedTextProps {
  field: ProvenancedField<string>;
}

/**
 * Renders a text fact and, when it is a placeholder, a visible badge marking
 * it as not yet approved. This is the content boundary described in
 * STORY-001's acceptance criteria.
 */
export function ProvenancedText({ field }: ProvenancedTextProps) {
  return (
    <span>
      {field.value}
      {field.provenance === "placeholder" && <PlaceholderBadge />}
    </span>
  );
}
