import type { ReactNode } from "react";
import type { ProvenancedField } from "@/content/provenance";
import { PlaceholderBadge } from "./placeholder-badge";

interface ProvenancedLinkProps {
  field: ProvenancedField<string>;
  children: ReactNode;
}

/**
 * 遷移先の情報がオーナーによって承認されている場合のみ、実際にクリック可能な
 * リンクを描画する。プレースホルダーの遷移先はリンクではなく、可視のプレース
 * ホルダーバッジ付きのプレーンテキストとして描画されるため、訪問者が未承認・
 * 例示用の URL へ遷移することはない。
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
