/**
 * 現在サイト上のすべての情報はプレースホルダーであり、実データはオーナーの承認後
 * にのみ公開される。個々の情報にはすでにマークが付いているが、このバナーはその
 * 事実をより明確にするためのもの（docs/product/mvp.md の品質基準
 * "placeholders ... must never be silently presented as real facts" を参照）。
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
