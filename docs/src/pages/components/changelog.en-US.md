---
title: Component Changelog
sourceFile: components/changelog.en-US.md
---

## V1.0.2 {#v1-0-2}

Release Date: 2026-09-01

This release adds ProConfigProvider and locale wrappers that mirror antdv-next locale objects.

**✨ Features**

* feat(config-provider): add ProConfigProvider with the Antdv ConfigProvider surface and locale wrappers available through public locale import paths.

## V1.0.0 {#v1-0-0}

Release Date: 2026-08-29

The first official release of `@antdv-next/pro`. This package is split out of the antdv-next monorepo to provide ready-to-use components for high-frequency Pro scenarios, shipped with a dedicated docs site and engineering infrastructure.

**✨ Features**

* feat(scrollbar): add the Scrollbar container component with content-size observation, `auto` / `visible` / `hidden` visibility modes, animated and static transitions, and `classes` / `styles` semantic customization ([#2](https://github.com/antdv-next/antdv-next-pro/pull/2))

## Maintaining This Page {#maintaining-this-page}

This page is maintained by hand: on every release, collect the entries from the "📝 Change Log" section of the merged Pull Requests, **recording only component-behavior features (`feat`) and bug fixes (`fix`) — docs-only changes are excluded** — and prepend a new version block. See [RELEASE.md](https://github.com/antdv-next/antdv-next-pro/blob/main/RELEASE.md) for the full process.
