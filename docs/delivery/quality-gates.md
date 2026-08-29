# Pull request quality gates

GitHub Actions (`.github/workflows/ci.yml`) runs on every pull request targeting `main` and on
every push to `main`. It gives reviewers repeatable evidence before human review, and every
check can be reproduced locally with the same command CI runs.

## Gates

| Gate                | What it checks                                                                        | Local reproduction                   |
| ------------------- | ------------------------------------------------------------------------------------- | ------------------------------------ |
| Validate            | Required public files and privacy/ignore rules exist (`scripts/validate-project.mjs`) | `npm run validate`                   |
| Format              | Prettier formatting matches the repository style                                      | `npm run format:check`               |
| Lint                | ESLint rules, including Next.js and accessibility lint rules                          | `npm run lint`                       |
| Types               | TypeScript strict mode compiles with no errors                                        | `npm run typecheck`                  |
| Unit tests          | Vitest + Testing Library behavior and regression tests                                | `npm run test`                       |
| Production build    | The static export (`out/`) that CloudFront/S3 would serve builds cleanly              | `npm run build`                      |
| Accessibility smoke | Zero axe violations at WCAG 2.1 A/AA on every published route                         | `npm run build && npm run test:a11y` |
| Dependency review   | New/changed dependencies introduced by the pull request (pull request only)           | Runs only in CI, against the PR diff |
| Dependency audit    | Known high/critical vulnerabilities in the dependency tree                            | `npm audit --audit-level=high`       |

The accessibility smoke is a narrow Playwright + axe-core check over the built static export, not
a general end-to-end suite. The route list is not hardcoded: `tests/a11y/routes.spec.ts` walks the
built `out/` directory for every `index.html` it finds (currently `/`, `/projects/`, `/lab/`, and
`/experience/`, excluding Next.js's own reserved `404`/not-found pages) and asserts no detectable
violation on each one, so a newly published page is covered automatically without a test-file edit.
`scripts/serve-static.mjs` is a small Node `http` static file server written for this purpose so
the CI job does not need an extra server dependency; it resolves `<route>/` to `<route>/index.html`
to match the `trailingSlash: true` export shape and refuses to serve paths outside `out/`.

## Least-privilege permission model

- The workflow sets `permissions: contents: read` at the top level and repeats it explicitly on
  every job. No job is granted write access; none of these checks need to push commits, create
  releases, or comment on pull requests.
- Pull requests run under the `pull_request` event, not `pull_request_target`. `pull_request`
  checks out and runs the PR's own code with a token scoped to the PR, so a malicious PR cannot
  use CI to reach repository secrets or push privileged changes. `pull_request_target` would run
  the same untrusted code with the base branch's write-capable token, which this repository does
  not accept.
- The dependency review job restricts itself to `contents: read` and runs only on `pull_request`
  events, since comparing dependency changes against a base ref has no meaning on a direct push.
  The dependency audit job is separate and runs on both `pull_request` and push to `main`, so an
  advisory published after merge is still surfaced even without a new pull request.

## Repository settings, not workflow YAML

Some controls are account/repository configuration rather than CI steps:

- **Secret scanning and push protection** — required for this repository, and blocking committed
  credentials before they land is what makes them complement (rather than duplicate) the
  dependency and audit gates here. Neither can be turned on from workflow YAML. Verify the
  current state on the repository's Code security settings page, or through the API:

  ```bash
  gh api repos/<owner>/<repo> --jq '.security_and_analysis | {secret_scanning, secret_scanning_push_protection}'
  ```

- **Dependency graph** — required for `actions/dependency-review-action` to have anything to
  compare. It is enabled by default for public repositories, or requires GitHub Advanced Security
  on private ones. If the dependency graph is off, the dependency-review job fails; that failure
  is intentional and is not caught with `continue-on-error`, so a missing prerequisite is visible
  rather than silently skipped.

## Out of scope

Branch protection rules (making these checks "required"), Dependabot/Renovate configuration,
deployment workflows, and broader end-to-end scenario coverage are deliberately not part of this
gate set.
