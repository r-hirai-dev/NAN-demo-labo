import type { NextConfig } from "next";

// 静的エクスポートのみをサポートする。docs/adr/0001-static-first-aws-hosting.md を参照。
// - `output: "export"` は CloudFront/S3 が配信する事前レンダリング済みアセットを
//   生成する。ルートハンドラー、サーバーアクション、リクエスト時レンダリングは
//   利用できない。
// - `images.unoptimized` は必須。静的エクスポートでは既定の Next.js 画像最適化
//   サーバーを実行できないため。
// - `trailingSlash` は各ルートを `<route>/index.html` としてエクスポートする。
//   これは CloudFront の前段にリライト用の関数を置かずに、静的な S3 オリジンが
//   ディレクトリ形式のパスを解決する方式と一致する。
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
