# ADR-0001: Static-first AWS hosting for the MVP

- Status: Proposed
- Date: 2026-08-19

## Context

The MVP is public, read-only portfolio content with low expected traffic. It must be production deployable, inexpensive, reviewable through Terraform, and capable of evolving into a Personal Engineering Lab. There is no accepted requirement for request-time rendering, a database, authentication, or an always-on backend.

## Decision

Build the MVP with Next.js App Router and TypeScript using static export. Serve generated assets through CloudFront from a private S3 origin protected by Origin Access Control. Manage Route 53, ACM, S3, CloudFront, and GitHub Actions OIDC permissions with Terraform.

Future dynamic labs will be isolated serverless boundaries rather than changing the entire portfolio to a server runtime.

## Alternatives

- Astro with the same AWS hosting: strong static-content fit, but introduces another primary framework without current value.
- AWS Amplify Hosting: reduces setup, but provides less direct infrastructure evidence and control.
- Next.js server runtime on Lambda: enables SSR and APIs, but adds runtime cost and operational surface before a requirement exists.

## Consequences

- The site remains cheap, highly cacheable, and available without application compute.
- Features requiring request-time behavior need a separate service or an explicit architecture revision.
- Next.js features incompatible with static export are unavailable in the MVP.
- Content updates require a build and deployment, which is acceptable for the expected publishing frequency.

## Revisit when

An accepted Story requires per-request personalization, protected content, runtime writes, preview workflows that cannot be met in CI, or a dynamic feature whose isolation would materially harm the user experience.
