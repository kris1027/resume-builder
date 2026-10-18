# 0001. Stack review: keep, upgrade or replace each layer

**Date**: 2026-10-18
**Status**: In Progress

## Summary

This spec checks every layer of the app's toolchain and libraries against what is current in October 2026, and gives each one a verdict: keep, upgrade, or replace. Most layers stay and move to their latest major version, as long as that major has been out for at least four weeks. A few things change shape: one Radix package replaces seven, the browser's own date formatting (`Intl`) replaces `date-fns`, the security policy (CSP) is written once in `vercel.json` and read by the dev build, two unused packages go, and the React Compiler (a build step that adds memoization automatically) is switched on. Feature 3 (Upgrades & replacements) builds this, one layer per commit, keeping tests and the build green after each.

## Requirements

**User stories**:

- As the maintainer, I want every dependency on a current, supported major so that security fixes and ecosystem plugins keep reaching me without an emergency jump later.
- As the maintainer, I want the security policy (CSP, the rules telling the browser what the page may load) written once so that the dev server and production can never drift apart.
- As a job seeker, I want the app to keep working exactly as before (export, import, offline, both languages) while the tools underneath change.

**Acceptance criteria**:

- **AC-1**: `package.json`, `.nvmrc` and the lockfile match the verdict table below (no package left on a superseded major unless the table says hold), and `pnpm pre-commit` (Prettier, lint, tests, typecheck, build) plus CI's `format:check` pass on Node 24 with pnpm 12, locally, in CI, and in the Vercel build.
- **AC-2**: The production build (`pnpm build && pnpm preview`) loads every route (`/`, `/templates`, `/templates/$templateId`, `/builder`, `/preview`) with no console errors or CSP violations, in EN and PL, light and dark. Checked by hand (or through the Playwright MCP) across that 5 × 2 × 2 matrix.
- **AC-3**: For each of the three templates, a resume exported to PDF in the production build imports back into the form with every field intact (embedded metadata path), and the text fallback parser tests still pass. The round trip is checked by hand; the parser tests are automated.
- **AC-4**: The PWA still installs, updates and works offline after the upgrade, including PDF preview, export and import. The service worker precaches the pdf.js worker and the PDF fonts. Checked with DevTools offline mode plus the Cache Storage listing.
- **AC-5**: Month and year text renders the same as today in the app and in all three PDF templates, in EN and PL, for the long form (`styczeń 2024`, `January 2024`), the short form (`sty 2024`, `Jan 2024`) and the month picker list. A unit test pins these strings for all 12 months.
- **AC-6**: The developer template's web preview still shows the GitHub and LinkedIn icons after lucide 1.x (which removed brand icons), with the same glyphs as today. Checked by a side by side look against the current deployment.
- **AC-7**: The CSP is written in exactly one place (`vercel.json`). The `<meta>` tag injected by `vite.config.ts` is built from it at build time, so the two cannot differ. The SPA rewrite still works in production.
- **AC-8**: The React Compiler runs in the production build and in the Vitest run, the React hooks lint preset reports compiler rule violations, and the builder (typing, drag to reorder, add and remove entries, validation after touch) behaves as before under the existing tests. One profile of typing in the builder is recorded in the PR (informational, no threshold).
- **AC-9**: `package.json` lists none of `@tanstack/react-router-devtools`, `date-fns`, `react-day-picker`, or any `@radix-ui/react-*` package; the unified `radix-ui` package provides every primitive.
- **AC-10**: Before and after JS chunk sizes from `vite build` are recorded in the PR description (informational, it feeds feature 5 performance budgets; no budget is enforced here).

## Decision

**Chosen option**: Option 2: Upgrade in place under a four week rule, replace only with a clear win.

Every layer moves to its latest major once that major is at least four weeks old (cutoff for this pass: released on or before 2026-09-20) and its plugins support it. A library is replaced only when the replacement clearly wins on bundle size, upkeep or a scope goal.

**Implementation skills**: `vite` (`antfu/skills`, `.agents/skills/vite/`) · `vitest` (`antfu/skills`, `.agents/skills/vitest/`) · `tanstack-router` (`tanstack-skills/tanstack-skills`, `.agents/skills/tanstack-router/`) · `tanstack-form` (`tanstack-skills/tanstack-skills`, `.agents/skills/tanstack-form/`) · `react-pdf` (`molefrog/skills`, `.agents/skills/react-pdf/`) · `vercel:shadcn` (Vercel plugin, for the Radix migration)

## Rationale

Reasoning, options and the landscape evidence: see [rationale.md](rationale.md).

## Verdict per layer

Versions checked against the npm registry on 2026-10-18. "Target" is the version range to install; patch level floats to latest at build time.

| Layer           | Today                                                           | Verdict                    | Target                                                                                                                                                                       | Why                                                                                                                    |
| --------------- | --------------------------------------------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Runtime         | Node 22 (`.nvmrc`), engines `>=20.19`                           | Upgrade                    | Node 24 LTS in `.nvmrc`, `engines.node: ">=24"`, Vercel project Node 24                                                                                                      | Node 20 is end of life; 24 is the current LTS and the Vercel default. Vitest 5 wants `@types/node` 22 or 24+.          |
| Package manager | pnpm 10.8                                                       | Upgrade                    | pnpm 12 (`packageManager` field), overrides moved to `pnpm-workspace.yaml`, Vercel env `ENABLE_EXPERIMENTAL_COREPACK=1`                                                      | 12.0 shipped 2026-08-26, past the cutoff. CI reads `packageManager`; Vercel only does with corepack on.                |
| Language        | TypeScript 5.8                                                  | Upgrade, hold at 6         | `typescript ~6.0`                                                                                                                                                            | TS 7 (native compiler) is stable, but `typescript-eslint` only supports `<6.1`. Revisit (follow up).                   |
| Build           | Vite 7, `@vitejs/plugin-react` 5                                | Upgrade                    | `vite ^8`, `@vitejs/plugin-react ^6`                                                                                                                                         | 8.0 shipped 2026-03-12. Router, Tailwind and PWA plugins all list Vite 8 in their peers.                               |
| Compiler        | none                                                            | **Add**                    | `babel-plugin-react-compiler ^1`, `@rolldown/plugin-babel ~0.2`, `@babel/core ^7`                                                                                            | Your pick: automatic memoization now, ahead of feature 11.                                                             |
| UI runtime      | React 19.1                                                      | Upgrade (minor)            | `react`, `react-dom`, `@types/react*` `^19.3`                                                                                                                                | Same major.                                                                                                            |
| Router          | TanStack Router 1.131                                           | Keep, upgrade minor        | `@tanstack/react-router` `^1.170.45` and `@tanstack/router-plugin` `^1.168` (together)                                                                                       | Still the best typed SPA router for this setup. The plugin's peer needs router `^1.170.45`.                            |
| Router devtools | `@tanstack/react-router-devtools` (never imported)              | **Remove**                 | none                                                                                                                                                                         | Dead dependency.                                                                                                       |
| Forms           | TanStack Form 1.28                                              | Keep, upgrade minor        | `@tanstack/react-form` latest 1.x                                                                                                                                            | Works, typed, Zod friendly.                                                                                            |
| Validation      | Zod 4.3                                                         | Keep, upgrade minor        | `zod` latest 4.x                                                                                                                                                             | Single source of truth per `AGENTS.md`.                                                                                |
| Styling         | Tailwind 4.1, tailwind-merge 3.4, cva 0.7, tw-animate-css       | Keep, upgrade minor        | `tailwindcss` and `@tailwindcss/vite` 4.x latest, `tailwind-merge` 3.x, `tw-animate-css` 1.x                                                                                 | Current majors.                                                                                                        |
| UI primitives   | 7 separate `@radix-ui/react-*` packages                         | **Replace** (package swap) | `radix-ui` 1.x (unified)                                                                                                                                                     | One dependency, the current shadcn default, same components.                                                           |
| Icons           | lucide-react 0.542                                              | Upgrade                    | `lucide-react` 1.x                                                                                                                                                           | 1.0 shipped 2026-03-23. It removed `Github` and `Linkedin`, see AC-6.                                                  |
| Animation       | motion 12.34                                                    | Upgrade, hold at 13        | `motion ^13`                                                                                                                                                                 | 13.0 (2026-08-05) passes the rule; 14.0 (2026-10-02) does not yet. Lazy loading stays in feature 10.                   |
| Drag and drop   | `@dnd-kit/core` 6.3, sortable 10                                | Keep                       | unchanged (already latest)                                                                                                                                                   | `@dnd-kit/react` is still 0.5 (pre 1.0). Revisit at 1.0 (follow up).                                                   |
| Date picker     | react-day-picker 9.9 in `ui/calendar.tsx` (never imported)      | **Remove**                 | none; delete `src/components/ui/calendar.tsx`                                                                                                                                | Dead code. `date-picker.tsx` uses Popover and Select, not the calendar. rdp 10 would also keep `date-fns` in the tree. |
| Dates           | date-fns 4.1 (`format` plus EN/PL locales)                      | **Replace**                | `Intl.DateTimeFormat` (no dependency)                                                                                                                                        | Only month plus year is formatted. The browser does it natively; drops a dependency and locale data.                   |
| i18n            | i18next 25, react-i18next 16, language detector 8.2             | Upgrade                    | `i18next ^26.2`, `react-i18next ^17`, `i18next-browser-languagedetector` 8.x                                                                                                 | 26.0 and 17.0 shipped in March 2026. react-i18next 17 needs i18next `>=26.2`. Peers accept TS 6.                       |
| PDF render      | @react-pdf/renderer 4.5                                         | Keep, upgrade minor        | `@react-pdf/renderer` latest 4.x                                                                                                                                             | Supports React 19; no better client side option.                                                                       |
| PDF parse       | pdfjs-dist 5.4                                                  | Upgrade                    | `pdfjs-dist ^6`, worker copied to `public/pdf.worker.min.mjs`                                                                                                                | 6.0 shipped 2026-05-30. Worker file and library must match versions.                                                   |
| Lint            | ESLint 9, typescript-eslint 8.41, react-hooks 5                 | Upgrade                    | `eslint ^10`, `@eslint/js ^10`, `typescript-eslint` latest 8.x, `eslint-plugin-react-hooks ^7`, `globals ^17`, `eslint-plugin-react-refresh` latest                          | All list ESLint 10 in their peers. Hooks 7 adds the React Compiler rules.                                              |
| Format          | Prettier 3.8, tailwind plugin 0.7                               | Keep, upgrade              | `prettier` 3.x latest, `prettier-plugin-tailwindcss ^0.8`                                                                                                                    | Upgrade in place; Oxfmt is still beta.                                                                                 |
| Tests           | Vitest 4, jsdom 28, jest-dom 6, RTL 16                          | Upgrade                    | `vitest ^5`, `@vitest/coverage-v8 ^5`, `jsdom ^30`, `@testing-library/jest-dom ^7`, RTL and user-event latest, plus `@testing-library/dom ^10` as an explicit dev dependency | 5.0 shipped 2026-09-03. jest-dom 7 needs `@testing-library/dom` as a direct peer.                                      |
| PWA             | vite-plugin-pwa 1.2, workbox-window 7.4                         | Upgrade minor, hold at 1   | `vite-plugin-pwa ^1.3` (first with Vite 8 support), `workbox-window ^7.4.1`                                                                                                  | 2.0 shipped 2026-10-03, too new.                                                                                       |
| Hosting config  | `vercel.json` with the CSP copied by hand into `vite.config.ts` | Keep, make it the source   | `vercel.json` unchanged; `vite.config.ts` reads the CSP from it                                                                                                              | Removes the drift risk with no new dependency. `vercel.ts` waits for `@vercel/config` 1.0 (follow up).                 |
| Node types      | `@types/node` 25                                                | Upgrade                    | `@types/node ^24`                                                                                                                                                            | Match the runtime (Node 24), not the newest.                                                                           |

### Decided implementation details

These are the small calls made here, so the build does not have to invent them.

- **Brand icons (AC-6)**: add `src/components/icons/brand-icons.tsx` exporting `GithubIcon` and `LinkedinIcon` as inline SVG components that take `className` (stroke style, `currentColor`, 24 × 24 viewBox, like lucide). Reuse the paths in `src/lib/pdf-templates/pdf-icons.tsx`, which are the lucide paths, so web and PDF stay identical. Runner up: the `simple-icons` package (a dependency for two glyphs, and a different look).
- **Dates (AC-5)**: `src/lib/date-utils.ts` exposes `formatCVDate(date, lang?)`, `formatCVDateShort(date, lang?)` and `getMonthNames(style, lang?)`, where `lang` is `'en' | 'pl'` and defaults to the current i18n language (today's behavior). Each keeps one cached `Intl.DateTimeFormat` per `(lang, style)`, with locale tags `en-US` and `pl-PL`. Long is `{ month: 'long', year: 'numeric' }`, short is `{ month: 'short', year: 'numeric' }`, and the month list uses `{ month: 'long' }` or `{ month: 'short' }` alone. The three PDF templates (`developer-pdf.tsx`, `default-pdf.tsx`, `veterinary-pdf.tsx`) delete their local `format()` copies and call these helpers with their `lang` prop. `pdf-translations.ts` drops `getDateFnsLocale`, the `date-fns/locale` import and the `Locale` type. Write the pinning test first, against today's `date-fns` output for all 12 months in both languages, then swap the implementation. On Node 24 the `Intl` output already matches `date-fns` exactly, so no post processing is needed.
- **Single CSP (AC-7)**: `vercel.json` stays the only place the CSP is written. `vite.config.ts` replaces its `contentSecurityPolicy` array with `import vercelConfig from './vercel.json' with { type: 'json' }` and reads the value of the `Content-Security-Policy` header on the `/(.*)` source, throwing at config load if it is missing (so a broken edit fails the build, not production). Add `"resolveJsonModule": true` and `vercel.json` to `tsconfig.node.json` so the import typechecks. The rest of the `htmlCsp` plugin is unchanged. No new test is needed: there is only one string.
- **React Compiler (AC-8)**: in `vite.config.ts`, add `babel({ presets: [reactCompilerPreset()] })` from `@rolldown/plugin-babel` (with `reactCompilerPreset` imported from `@vitejs/plugin-react`) right after `react()`; the `babel` option on `react()` is gone in v6. Add `@babel/core` as a dev dependency (a required peer of `@rolldown/plugin-babel`). Add the same two plugins to `vitest.config.ts` (which today has no plugins and does not merge `vite.config.ts`), so the tests run compiled components. Use the default compilation mode (all components). If a component misbehaves, opt it out with `'use no memo'` plus a comment naming the reason, never by turning the compiler off globally. Rejected: plugin-react 6.1's native `react({ compiler: true })` (Oxc based), because it is still experimental.
- **ESLint config**: move from `tseslint.config(...)` to `defineConfig(...)` from `eslint/config`, and replace `reactHooks.configs['recommended-latest']` with `reactHooks.configs.flat.recommended` (the stable v7 preset; `flat['recommended-latest']` is the experimental one). Keep the rest of today's rule set.
- **TypeScript 6 config (AC-1)**: add `"types": ["node"]` to `tsconfig.node.json` (TS 6 defaults `types` to an empty list, and `vite.config.ts` uses `path` and `__dirname`). Set `strict`, `target` and `module` explicitly in both tsconfigs, as they are today, so new defaults change nothing. Read the TS 6 release notes for other default changes and fix errors without loosening `strict`.
- **Radix (AC-9)**: run the shadcn Radix migration (`npx shadcn@latest migrate radix`) to rewrite imports in `src/components/ui/` to `radix-ui`, then remove the seven `@radix-ui/react-*` entries. Review the diff by hand: only import paths should change. The `radix` rule in `manualChunks` still matches, since `radix-ui` pulls in `@radix-ui/*` internally.
- **pdf.js worker and offline (AC-3, AC-4)**: after the bump, copy `node_modules/pdfjs-dist/build/pdf.worker.min.mjs` over `public/pdf.worker.min.mjs` in the same commit, and add `public/pdf.worker.min.mjs` to `.prettierignore` (Prettier has already reformatted the current copy from about 1.07 MB to 1.9 MB). It stays a manual step, with no `postinstall` script. In `VitePWA` `workbox`, extend `globPatterns` to `**/*.{js,css,html,svg,png,woff2,mjs,ttf}` and set `maximumFileSizeToCacheInBytes` to 3 MiB, so the worker and the PDF fonts are precached.
- **Vite 8 chunking (AC-10)**: rename `build.rollupOptions` to `build.rolldownOptions` and keep the existing `manualChunks` function. If Rolldown warns that it is deprecated, leave it; redesigning chunks belongs to feature 10.
- **pnpm 12 (AC-1)**: move the `pnpm.overrides` block from `package.json` to `overrides` in a new `pnpm-workspace.yaml`. After all bumps, drop each override whose package no longer resolves to a vulnerable range (`pnpm why <pkg>`), keeping the rest. On the Vercel project set `ENABLE_EXPERIMENTAL_COREPACK=1`, so Vercel builds with the `packageManager` version rather than one guessed from the lockfile.
- **Major version notes**: before each major bump commit, read that package's changelog or migration guide (i18next 26, react-i18next 17, motion 13, pdfjs-dist 6, lucide 1, ESLint 10, Vitest 5, Vite 8) and fix what it lists. Any finding that forces a design choice, not just a code fix, comes back to `/architect`.

## Build plan

Tracer Bullet here means each step is one commit (or a short series) that leaves `pnpm pre-commit` green and the app shippable. Order goes from the base of the toolchain up, so each layer is upgraded on top of a working one.

1. Runtime and package manager: `.nvmrc` to 24, `engines.node` to `>=24`, `packageManager` to pnpm 12, overrides into `pnpm-workspace.yaml`, Vercel project Node 24 plus `ENABLE_EXPERIMENTAL_COREPACK=1`, reinstall; remove `@tanstack/react-router-devtools`, `react-day-picker` and `src/components/ui/calendar.tsx`; confirm a Vercel preview build, satisfies **AC-1**, **AC-9**
2. Minor and patch bumps within current majors: React 19.3 and types, TanStack Router (router and plugin together) and Form, Zod, Tailwind and `@tailwindcss/vite`, tailwind-merge, tw-animate-css, `@react-pdf/renderer`, Prettier and its Tailwind plugin, `@types/node ^24`. Commit any Prettier reformat on its own, satisfies **AC-1**, **AC-2**
3. TypeScript 6.0 with the tsconfig changes above, satisfies **AC-1**
4. Vite 8, `@vitejs/plugin-react` 6, `vite-plugin-pwa ^1.3`, `rolldownOptions`, and the precache patterns; check dev, build, preview, route code splitting, the CSP meta and offline mode, satisfies **AC-1**, **AC-2**, **AC-4**, **AC-10**
5. Test stack: Vitest 5, coverage-v8 5, jsdom 30, jest-dom 7, `@testing-library/dom` as an explicit dev dependency, RTL and user-event latest; keep the 50% coverage floor, satisfies **AC-1**
6. Lint stack: ESLint 10, `@eslint/js` 10, typescript-eslint latest, react-hooks 7 (`flat.recommended`), react-refresh, globals 17; move to `defineConfig`; fix new findings, satisfies **AC-1**
7. App library majors, one commit each: i18next 26.2 and react-i18next 17; motion 13; lucide 1.x with the brand icon components; pdfjs-dist 6 with the worker copy, `.prettierignore` entry and a full export and import round trip, satisfies **AC-2**, **AC-3**, **AC-4**, **AC-6**
8. Replace the Radix packages with `radix-ui`, satisfies **AC-2**, **AC-9**
9. Replace `date-fns` with `Intl` (pinning test first, then the helper signatures and the three PDF templates), satisfies **AC-5**, **AC-9**
10. Make `vercel.json` the single CSP source for `vite.config.ts`; confirm the meta tag and the deployed header match on a preview deployment, satisfies **AC-7**, **AC-2**
11. Turn on the React Compiler in `vite.config.ts` and `vitest.config.ts`; profile one typing session in the builder and record it, satisfies **AC-8**
12. Final pass: production preview over the full AC-2 matrix; PWA offline; export and import for all three templates; record chunk sizes in the PR, satisfies **AC-2**, **AC-3**, **AC-4**, **AC-10**

## Consequences

**Positive**:

- Every layer is on a supported major, so the next year's upgrades are minors, not a cliff.
- The CSP lives in one place; the "keep both in sync" rule in `AGENTS.md` goes away.
- Fewer dependencies: `date-fns`, `react-day-picker`, router devtools and one unused component go, and seven Radix packages become one.
- Offline mode now really covers PDF import and the PDF fonts.
- The React Compiler removes most manual memoization work ahead of builder responsiveness (feature 11).

**Negative / tradeoffs**:

- `@rolldown/plugin-babel` is pre 1.0 (0.2). A breaking minor can fail the build; pinning it with `~` contains that.
- The React Compiler adds a Babel pass inside a Rolldown build (slower builds and tests) and can expose code that breaks the rules of React, which shows up as stale UI, not a crash.
- Holding TS at 6, motion at 13 and vite-plugin-pwa at 1 means a second, smaller upgrade round later.
- Formatting dates with `Intl` depends on the browser's locale data (CLDR). A browser could print a Polish abbreviation differently from Node; the pinning test runs on Node's ICU and cannot catch that.
- Precaching the worker and fonts makes the first service worker install a few MB larger.
- Larger diffs (Prettier reformat, Radix import rewrite) make `git blame` noisier for these files.

**Neutral**:

- `AGENTS.md` needs updating after the build: Node 24, pnpm 12, TS 6, `vercel.json` as the CSP source, the React Compiler, `Intl` dates (owned by `/sync`).
- `src/lib/pdf-templates/AGENTS.md` mentions the `date-fns` locale and needs the worker copy step plus its `.prettierignore` entry.

## Migration plan

**Strategy**: no runtime migration (no stored data changes); a staged toolchain upgrade, one layer per commit.
**Phases**:

1. Steps 1 to 6: toolchain (runtime, build, types, tests, lint). No user visible change.
2. Steps 7 to 9: app libraries and replacements. User visible surfaces must look and behave the same.
3. Steps 10 and 11: the CSP source and the compiler. Ship to a preview deployment first and check the CSP header and the builder there before merging.

**Rollback**: each step is its own commit; revert that commit and reinstall.
**Risks**: Vercel building with a different pnpm than CI (corepack env covers it, step 1 confirms it); a plugin that claims Vite 8 support but breaks at runtime (PWA, router code splitting); a pdf.js worker version mismatch (import fails only at runtime, AC-3 catches it); a security override dropped by the pnpm 12 move (step 1 checks `pnpm why`).

## Follow-up

- [ ] Move to TypeScript 7 once `typescript-eslint` supports it (its peer range is `<6.1.0` today).
- [ ] Move to motion 14 and vite-plugin-pwa 2 once they pass the four week rule; fold motion into the design system refresh (feature 6) decision.
- [ ] Revisit `@dnd-kit/react` when it reaches 1.0.
- [ ] Revisit Base UI as the primitive layer during the design system refresh (feature 6), not before.
- [ ] Revisit `vercel.ts` when `@vercel/config` reaches 1.0.
- [ ] `AGENTS.md` has no `## Agent skills` section yet: record the five skills installed for this pass (`vite`, `vitest`, `tanstack-router`, `tanstack-form` project wide at root; `react-pdf` in `src/lib/pdf-templates/AGENTS.md`), owned by `/sync`.
- [ ] `AGENTS.md` and `src/lib/pdf-templates/AGENTS.md` updates listed under Consequences, owned by `/sync`.
