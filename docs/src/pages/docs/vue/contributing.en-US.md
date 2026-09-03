---
title: Contributing
---

This guide will help you contribute to `@antdv-next/pro`. Please take a few minutes to read it before opening an issue or a pull request.

## Code of Conduct {#code-of-conduct}

We follow the same [Code of Conduct](https://github.com/antdv-next/antdv-next/blob/main/CODE_OF_CONDUCT.md) as the Antdv Next community.

## Open Development {#open-development}

All development happens on [GitHub](https://github.com/antdv-next/antdv-next-pro). Pull requests from both team members and community contributors go through the same review flow.

## Branch Management {#branch-management}

We maintain a single long-lived `main` branch. All changes (bug fixes or features) should be developed on a feature branch (`feat-xxx` / `fix-xxx`) based on `main` and merged via a pull request. Releases are published by maintainers from `main` (see [RELEASE.md](https://github.com/antdv-next/antdv-next-pro/blob/main/RELEASE.md)).

## First-time contributors {#first-time-contributors}

Not sure how to open a pull request on GitHub? This [guide](https://segmentfault.com/a/1190000000736629) (Chinese) is a good start.

We label some easy bugs and small features with [good first issues](https://github.com/antdv-next/antdv-next-pro/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) — a great place for your first attempt.

Before working on an issue, check the comments to make sure nobody else is already on it; if you want to take over an abandoned one, leave a comment first.

## Pull Requests {#pull-requests}

**Before sending a Pull Request**, please make sure you followed these steps:

1. Create a feature branch based on the latest `main`.
2. Run `pnpm install` in the repository root.
3. If you fixed a bug or added a feature, write the corresponding unit tests (component tests live under `packages/pro/src/<component>/tests/`).
4. Pass the checks locally: `pnpm ci:lint` (lint), `pnpm typecheck`, `pnpm test`.

**Pull Request description** should follow the [template](https://github.com/antdv-next/antdv-next-pro/blob/main/.github/PULL_REQUEST_TEMPLATE.md). Note that:

- PR titles follow conventional commits (`feat` / `fix` / `docs` …) and are validated by CI;
- the **"📝 Change Log" section is mandatory** (one line each in English and Chinese) — it is the only source for manually curating release notes (only component-behavior `feat` / `fix` entries are recorded; see the [Changelog page](/components/changelog)).

## Development Workflow {#development-workflow}

This is a monorepo managed with [pnpm workspaces](https://pnpm.io/workspaces) — make sure pnpm (node >= 22) is installed and configured.

1. Fork the repository to your account.
2. Clone your fork: `git clone https://github.com/xxx/antdv-next-pro.git`
3. Enter the directory: `cd antdv-next-pro`
4. Install dependencies: `pnpm install`
5. Start the docs dev server: `pnpm dev` (or `pnpm dev:pro` to work on the component library)
6. Run lint: `pnpm lint`
7. Run type checks: `pnpm typecheck`
8. Run tests: `pnpm test`
9. Build the site: `pnpm build`

> Commit messages must follow conventional commits (`feat` / `fix` / `docs` …) — the `commit-msg` hook validates the format; the `pre-commit` hook runs lint-staged on staged files. See [verify-commit.js](https://github.com/antdv-next/antdv-next-pro/blob/main/scripts/verify-commit.js) for the accepted format.

## Acknowledgements {#acknowledgements}

Thank you to everyone contributing code and documentation to `@antdv-next/pro`!

<ContributorList />
