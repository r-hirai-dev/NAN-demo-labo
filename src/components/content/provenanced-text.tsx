import type { ProvenancedField } from "@/content/provenance";
import { PlaceholderBadge } from "./placeholder-badge";

interface ProvenancedTextProps {
  field: ProvenancedField<string>;
}

/**
 * テキスト情報を描画し、それがプレースホルダーである場合は未承認であることを
 * 示す可視バッジも表示する。これは docs/product/mvp.md のコンテンツ品質基準に
 * 記載されたコンテンツ境界にあたる。
 */
export function ProvenancedText({ field }: ProvenancedTextProps) {
  return (
    <span>
      {field.value}
      {field.provenance === "placeholder" && <PlaceholderBadge />}
    </span>
  );
}
