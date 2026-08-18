# Repository publication policy

This repository is public. Commit only material that helps a visitor inspect, build, test, secure, or operate the portfolio without exposing private development context.

## Public and tracked

- Application source and sanitized public content.
- Automated tests, fixtures containing synthetic data, and quality configuration.
- Architecture documents and accepted ADRs.
- CI/CD definitions, Terraform, dependency manifests, and lockfiles.
- Reproducible build and deployment instructions.
- Public issue and pull request context after privacy review.

Public infrastructure code must use placeholders or variable references for account-specific values. Public content must use only the approved handle, biography, experience, project details, and external links.

## Local and ignored

- Agent instructions, prompts, model routing, transcripts, and generated review notes.
- Local Epic/Story/Task backlog, scratch plans, drafts, and unpublished personal content.
- Credentials, environment values, Terraform state/plans/variable values, account IDs, and private endpoints.
- Editor state, caches, dependencies, build output, test artifacts, and logs.

The local boundary is `.local/`; root `AGENTS.md` and `CLAUDE.md` remain beside the project only because their tools discover them there. All three paths are ignored explicitly.

## Before publishing

1. Run `npm run validate`.
2. Review `git status --short --ignored` and confirm every tracked file belongs in the public list.
3. Search the staged diff for secrets, personal identifiers, account IDs, internal hostnames, and unapproved employer information.
4. Inspect generated Terraform plans and deployment logs locally; never commit them.
5. Review the final commit from a clean clone before creating the public remote.

`.gitignore` prevents accidental inclusion of known local paths, but it is not a security boundary. If sensitive data is ever committed, remove it from history and rotate the affected credential before publishing.
