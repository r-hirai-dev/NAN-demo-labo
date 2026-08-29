## Outcome

<!-- The visitor- or contributor-facing outcome this PR delivers, in one or two sentences. -->

## Acceptance criteria

<!-- One line per acceptance criterion this PR claims to meet, each with the evidence that satisfies it. -->

| Criterion | Evidence |
| --------- | -------- |
|           |          |

## Evidence

<!-- Commands actually run and their result. Paste real output for anything that is not obvious. CI runs the same gates on every pull request; link the run or paste local output if it differs. -->

- [ ] `npm run validate`
- [ ] `npm run format:check`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run test`
- [ ] `npm run build`
- [ ] `npm run build && npm run test:a11y` (accessibility smoke over the static export)
- [ ] Dependency review / `npm audit --audit-level=high` (dependency changes)

## Risk and boundaries

- Boundaries touched: <!-- application / infrastructure / delivery / documentation -->
- Public-data boundary: <!-- confirm no real names, employer detail, credentials, private URLs, or account identifiers -->
- ADR impact: <!-- none, or the ADR this follows / adds / supersedes -->

## Deployment impact

- Paid resources or production state changed: <!-- no, or what and why it needs approval -->
- Rollback: <!-- how this is reverted -->

## Deliberately not included

<!-- Scope left out and why, so review does not treat it as an oversight. -->
