/**
 * プレースホルダーの情報の横に表示する可視マーカー。オーナー承認済みの情報と
 * 誤認されないようにするためのもの（docs/product/mvp.md の品質基準を参照）。
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
