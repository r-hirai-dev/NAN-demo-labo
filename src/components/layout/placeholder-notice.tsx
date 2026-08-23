/**
 * Every fact on the site is currently a placeholder (STORY-002 introduces
 * approved content). This banner keeps that unambiguous even though each
 * individual fact is already marked; see docs/product/mvp.md quality bar
 * ("placeholders ... must never be silently presented as real facts").
 */
export function PlaceholderNotice() {
  return (
    <div className="border-b border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
      <p className="mx-auto max-w-5xl px-4 py-2 text-center text-sm text-amber-900 dark:text-amber-200">
        This site is a work-in-progress shell. Profile, experience, and project details shown below
        are placeholders pending owner approval.
      </p>
    </div>
  );
}
