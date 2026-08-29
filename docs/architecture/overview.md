# Architecture

## Recommended MVP

```text
GitHub PR -> CI quality gates -> Next.js static export
                                      |
                                      v
                                private S3 bucket
                                      |
Route 53 -> CloudFront + ACM ---------+
```

The application is a TypeScript Next.js App Router project exported as static assets. CloudFront serves a private S3 origin through Origin Access Control. Route 53 provides DNS and a non-exportable ACM certificate in `us-east-1` terminates TLS at CloudFront. Terraform owns AWS resources; GitHub Actions assumes a narrowly scoped deploy role through OIDC.

## Why this shape

- The MVP is read-only content, so runtime compute, a database, and authentication add cost and failure modes without user value.
- Next.js matches existing team expertise and leaves a familiar route/component model for later labs.
- Static export keeps the portfolio reliable and cheap while allowing future dynamic labs to live behind isolated serverless APIs.
- A private origin, HTTPS, security headers, least-privilege deployment, and reproducible IaC provide production discipline without copying an enterprise platform wholesale.

## Alternatives considered

| Alternative                      | Benefit                                                        | Why not now                                                                                                   |
| -------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Astro on S3/CloudFront           | Excellent content-first defaults and minimal client JavaScript | Adds a new primary framework without an MVP need; Next.js static output can meet the same budget              |
| Amplify Hosting                  | Fast setup and managed previews                                | Hides more infrastructure behavior and weakens the Terraform/AWS architecture evidence sought by this project |
| Next.js server runtime on Lambda | Supports SSR and route handlers                                | No MVP request-time requirement justifies compute, observability, and deployment complexity                   |
| ECS/Fargate                      | Flexible runtime                                               | Always-on cost and operations are disproportionate for a low-traffic static portfolio                         |

## Content and boundaries

Initial profile, experience, skill, and project content lives in typed local data. MDX is introduced only when long-form notes become an accepted Story. External GitHub data is fetched at build time only if deterministic fallback behavior and rate-limit handling are designed first.

Dynamic experiments are separate deployable boundaries under `/labs/<name>` or an API subdomain. They do not force the static portfolio shell onto a server runtime.

## Quality and security controls

- TypeScript strict mode, ESLint, formatting, and dependency lockfile.
- Vitest and Testing Library for behavior; a Playwright + axe-core smoke, driven by the built static export's actual route list rather than a hardcoded one, over every route for WCAG 2.1 AA regressions.
- Immutable artifact deployment, CloudFront security headers, S3 public access block, TLS, and least-privilege OIDC roles.
- GitHub Actions runs validation, formatting, lint, types, tests, the accessibility smoke, and a production build on every pull request with least-privilege, job-scoped permissions (`docs/delivery/quality-gates.md`). Dependency review and `npm audit` run alongside; secret scanning and push protection are repository settings CI cannot enable itself. WAF is deferred until a threat model or dynamic endpoint justifies it.
- CloudFront standard metrics and deployment failures are the MVP observability surface. Request logs are off by default until a concrete diagnostic need and retention policy exist.

## Estimated monthly AWS cost

Assumptions: one small static site, low traffic, one hosted zone, standard on-demand pricing, no WAF/log ingestion/runtime API, and traffic within CloudFront's included allowance.

| Component                                 |           Expected monthly cost |
| ----------------------------------------- | ------------------------------: |
| Route 53 hosted zone and low query volume |                  about USD 0.50 |
| S3 storage and deployment requests        |              less than USD 0.10 |
| CloudFront transfer and requests          | USD 0 within included allowance |
| ACM certificate used by CloudFront        |                           USD 0 |
| Terraform state storage                   |              less than USD 0.10 |
| **Expected infrastructure total**         |         **about USD 0.60-1.00** |

Domain registration is separate, typically an annual charge determined by the TLD. Budget USD 10-30/year until a domain is selected. AWS states that CloudFront includes monthly transfer/request allowances, Route 53 charges USD 0.50 per hosted zone for the first 25 zones, and ACM non-exportable public certificates used with integrated services have no certificate charge. Pricing should be rechecked before provisioning:

- https://aws.amazon.com/cloudfront/pricing/
- https://aws.amazon.com/route53/pricing/
- https://aws.amazon.com/s3/pricing/
- https://aws.amazon.com/certificate-manager/pricing/

## Evolution rule

Add a service only when an accepted Story needs a capability the current architecture cannot provide. Record a new ADR when that addition changes a durable boundary, operating model, security posture, or material recurring cost.
