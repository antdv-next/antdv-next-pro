# docs

Standalone documentation site for `@antdv-next/pro`, ported from the
[antdv-next](https://github.com/antdv-next/antdv-next) docs engine (custom
Vite SPA — markdown-to-vue plugin, `<demo>` loader, vue-router, pinia, UnoCSS).

## Commands

```bash
pnpm -F docs dev         # dev server on http://localhost:3322
pnpm -F docs build       # production build -> docs/dist
pnpm -F docs gen:search  # regenerate public/search.{en,cn}.json
```

## Layout

- `src/pages/components/<component>/` — component docs content:
  `index.zh-CN.md`, `index.en-US.md`, `demo/*.vue`, `locales.ts`
  (semantic-DOM labels). `_*.vue` demos use docs-site helpers
  (`SemanticPreview`) and are excluded from unit tests.
- `plugins/` — markdown/demo Vite plugins (md → vue SFC, `virtual:demos`).
- `src/config/menu/` — sidebar & header menus (hardcoded; update when adding
  a component, together with `src/locales/*/menu-components.ts`).
- `scripts/gen-search.ts` — builds the FlexSearch index consumed by the
  in-site search.

## Resolution notes

- `antdv-next` comes from **npm**; non-exported internals are remapped via
  vite aliases onto the published `./dist/*` wildcard export
  (see `vite.config.ts`).
- `@antdv-next/pro` is aliased to `../packages/pro/src` so demos hot-reload
  against workspace source.
- `src/assets/token.json` / `token-meta.json` are vendored snapshots from the
  antdv-next build (used by the token tables); refresh them when upgrading
  the `antdv-next` dependency.
