# Dependabot & Auto-merge

This repository uses Dependabot to keep npm dependencies and GitHub Actions up to date.

- Dependabot config: `.github/dependabot.yml` (weekly checks; PRs include `dependencies` labels).
- CI + Auto-merge: `.github/workflows/dependabot-ci.yml` — Dependabot PRs run frontend builds and server tests; PRs are automatically merged when all checks pass.

If you prefer a different schedule or want to opt out of auto-merge for selected packages, edit `.github/dependabot.yml` and the workflow accordingly.
