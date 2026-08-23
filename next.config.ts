import type { NextConfig } from "next";

// STORY-001: static export only. See docs/adr/0001-static-first-aws-hosting.md.
// - `output: "export"` produces the pre-rendered assets CloudFront/S3 will serve;
//   no route handlers, server actions, or request-time rendering are available.
// - `images.unoptimized` is required because static export cannot run the
//   default Next.js image optimization server.
// - `trailingSlash` exports each route as `<route>/index.html`, which matches
//   how a static S3 origin resolves directory-style paths without a rewrite
//   function in front of CloudFront.
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
