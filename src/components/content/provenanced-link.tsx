import type { ReactNode } from "react";
import type { ProvenancedField } from "@/content/provenance";
import { PlaceholderBadge } from "./placeholder-badge";

interface ProvenancedLinkProps {
  field: ProvenancedField<string>;
  children: ReactNode;
}

/**
 * Renders a real, clickable link only when the destination fact is
 * owner-approved. Placeholder destinations render as plain text with a
 * visible placeholder badge instead of a link, so a visitor can never follow
 * an unapproved or illustrative URL.
 */
export function ProvenancedLink({ field, children }: ProvenancedLinkProps) {
  if (field.provenance === "approved") {
    return (
      <a
        href={field.value}
        className="font-medium text-sky-700 underline underline-offset-2 hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-100"
      >
        {children}
      </a>
    );
  }

  return (
    <span>
      {children}
      <PlaceholderBadge />
    </span>
  );
}
