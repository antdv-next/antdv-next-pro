# antdv-next-pro

Pro component library for [antdv-next](https://github.com/antdv-next/antdv-next) — Vue 3 + TSX, built on top of the published `antdv-next` core.

## Structure

| Path | Description |
|------|-------------|
| `packages/pro` | `@antdv-next/pro` — the Pro components (Scrollbar, ProConfigProvider, …) |
| `playground`   | Vite dev app for live validation |
| `docs`         | Standalone documentation site (Vite SPA, ported from the antdv-next docs engine) |

Component docs content lives in `docs/src/pages/components/<component>/`
(`index.zh-CN.md`, `index.en-US.md`, `demo/*.vue`, `locales.ts`) — the same
convention as the antdv-next main repo.

## Getting started

```bash
pnpm install
pnpm dev          # run the docs site (http://localhost:3322)
pnpm dev:play     # run the playground
pnpm dev:pro      # tsdown --watch on @antdv-next/pro
pnpm build:pro    # build @antdv-next/pro
pnpm build        # gen search index + build the docs site (docs/dist)
pnpm test         # run unit tests
pnpm typecheck    # vue-tsc on @antdv-next/pro
pnpm lint         # eslint --fix
```

## Docs site

The docs app consumes `@antdv-next/pro` **from source** (vite alias) so demos
hot-reload, while `antdv-next` itself comes from npm. To add a component page:

1. Create `docs/src/pages/components/<name>/` with `index.zh-CN.md`,
   `index.en-US.md` and `demo/*.vue` (each demo carries `<docs lang="…">`
   caption blocks).
2. Register the menu item in `docs/src/config/menu/components.ts` and its
   label in `docs/src/locales/{zh-CN,en-US}/menu-components.ts`.

Deployment: `pnpm build` produces `docs/dist`; `.github/workflows/deploy.yml`
ships it after a green Test run on `main` (configure the `DEPLOY_*` secrets).
`docs/vercel.json` is also included if you prefer Vercel (set the project
root to `docs`).

## Relationship with antdv-next

`@antdv-next/pro` consumes the published `antdv-next` and `@antdv-next/cssinjs`
packages as regular dependencies. Bump those versions in
`pnpm-workspace.yaml` (the `prod` catalog) to track the core library.

## Publishing

```bash
pnpm -F @antdv-next/pro build
pnpm -F @antdv-next/pro publish --access public
```
