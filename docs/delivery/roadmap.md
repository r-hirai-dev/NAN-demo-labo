# Incremental roadmap

Each phase is a user-visible or engineering-value increment. Implementation units remain large enough to deliver coherent value and small enough to review as one pull request.

## Phase 0: Foundation

Outcome: a new contributor can understand the product, its constraints, and how to validate the repository locally.

- Project context, MVP, Architecture, cost envelope, ADR process.
- Repository publication policy and local validation.
- Scope for the first implementation pull request.

## Phase 1: Publishable MVP

Outcome: a visitor can understand the public engineering identity and inspect selected evidence on a fast, accessible production site.

1. Site shell and design system with placeholder-safe typed content.
2. Approved profile, experience, skills, projects, and Lab overview.
3. Test pyramid and CI quality gates.
4. Terraform, domain approval gate, preview artifact, and production deployment.

## Phase 2: Engineering evidence

Outcome: the site demonstrates architecture and delivery quality through maintained artifacts rather than claims alone.

- Architecture views generated or verified from source.
- Curated technical notes with an intentional publishing workflow.
- Independent PR review checklist and measurable escaped-defect feedback.
- Lightweight availability/deployment monitoring with explicit retention and cost.

## Phase 3: Interactive labs

Outcome: visitors can use one focused technical experiment without compromising the static site's reliability or budget.

- Select one AI or AWS demo based on a concrete visitor outcome.
- Threat model, abuse controls, quota/cost guardrails, and isolated serverless backend.
- Usage and error telemetry limited to what operates the demo.

## Phase 4: Sustainable growth

Outcome: new experiments, articles, or services can be added without turning the repository into an accidental platform.

- Add search/CMS/analytics only when content volume or decisions justify them.
- Evaluate monetization separately from core UX.
- Periodically retire stale labs, dependencies, instructions, and ADR assumptions.

## First implementation PR after foundation

The first implementation pull request delivers the navigable, responsive site shell and typed placeholder content model. It deliberately excludes real biography content, AWS resources, and deployment so visual and technical conventions can be reviewed before public facts or infrastructure are introduced.
