# MVP definition

## Purpose

The MVP is a production-deployable public identity for a software/cloud engineer and visible evidence of a reviewable engineering process. It is not a blog platform or a collection of unfinished demos.

## Audience outcome

Within a few minutes, a technical visitor can understand:

- who the engineer is under a public handle;
- the kind of software and cloud problems they work on;
- representative skills and projects;
- how this repository is designed, tested, and delivered;
- how to reach public profiles without exposing private information.

## In scope

1. Responsive site shell with clear navigation and accessible typography.
2. Home/profile, experience, skills, and selected projects content.
3. A concise Lab page linking to public Architecture and selected engineering documentation.
4. SEO metadata, social preview metadata, sitemap, robots policy, and a custom not-found page.
5. Static build deployed through CloudFront from a private S3 origin with HTTPS and an approved domain.
6. Automated lint, type, unit/component, accessibility, build, and smoke/E2E checks.
7. Terraform and GitHub Actions using OIDC, with production deployment requiring the repository's normal review path.

## Explicitly out of scope

- Authentication, database, CMS, comments, search, analytics, ads, contact forms, and runtime APIs.
- AI demos, long-form blog authoring, WAF, RDS, ECS, EKS, and always-on compute.
- Importing employer-confidential project details or automatically publishing GitHub data.

These are candidates for later Stories only after a concrete visitor or learning outcome exists.

## MVP quality bar

- No critical or serious automated accessibility findings on primary routes.
- Mobile and desktop navigation works with keyboard and pointer input.
- Static generation succeeds without network access to private services.
- No secret values or personal data beyond explicitly approved public content enter Git history.
- Deployment is reproducible from Terraform and CI; the S3 bucket is not public.
- Each implementation unit's acceptance criteria are executable where practical and independently reviewed.

## Product decisions still requiring the owner

- Public handle and approved biography/experience wording.
- Initial project list and external profile links.
- Visual direction and whether a portrait/avatar may be published.
- Domain name and AWS account/region boundaries.

Placeholders may be used in local development, but they must never be silently presented as real facts.
