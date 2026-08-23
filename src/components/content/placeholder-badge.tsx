/**
 * Visible marker rendered next to any placeholder fact so it can never be
 * mistaken for owner-approved content (see docs/product/mvp.md quality bar).
 */
export function PlaceholderBadge() {
  return (
    <span
      className="ml-2 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 align-middle text-xs font-medium text-amber-900 dark:bg-amber-900 dark:text-amber-100"
      role="note"
      aria-label="Placeholder content, pending owner approval"
    >
      Placeholder
    </span>
  );
}
