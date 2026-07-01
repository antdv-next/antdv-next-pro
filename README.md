# antdv-next-pro

Pro component library for [antdv-next](https://github.com/antdv-next/antdv-next) — Vue 3 + TSX, built on top of the published `antdv-next` core.

## Structure

| Path | Description |
|------|-------------|
| `packages/pro` | `@antdv-next/pro` — the Pro components (Scrollbar, ProConfigProvider, …) |
| `playground`   | Vite dev app for live validation |
| `docs`         | Source demos & markdown for the Pro docs site |

## Getting started

```bash
pnpm install
pnpm build        # build @antdv-next/pro
pnpm dev:play     # run the playground
pnpm test         # run unit tests
pnpm lint         # eslint --fix
```

## Relationship with antdv-next

`@antdv-next/pro` consumes the published `antdv-next` and `@antdv-next/cssinjs`
packages as regular dependencies. Bump those versions in
`pnpm-workspace.yaml` (the `prod` catalog) to track the core library.

## Publishing

```bash
pnpm -F @antdv-next/pro build
pnpm -F @antdv-next/pro publish --access public
```
