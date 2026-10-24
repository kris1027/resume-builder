# 0002. Feature based folder structure with a one way import rule

**Date**: 2026-10-24
**Status**: Accepted

## Summary

This spec moves `src/` from folders grouped by kind (`components`, `lib`, `pages`, `types`) to folders grouped by feature: an app shell, seven feature areas, and a shared layer that keeps today's `components/ui`, `lib` and `hooks` paths. Imports may only point one way (pages, then the resume domain, then shared code), and an ESLint rule fails the build when they don't. The change moves files and fixes imports; it also pulls the PDF metadata helpers out of the parser so templates stop depending on the import code. Nothing the user sees changes. Feature 4 builds it in one PR, one commit per area.

## Requirements

**User stories**:

- As the maintainer, I want every file to live in the folder of the feature that owns it so that later refactors (features 7, 8, 9) land in clear homes.
- As the maintainer, I want the build to reject an import that points the wrong way so that the layout can't drift back into a tangle.
- As a job seeker, I want the app to keep working exactly as before while the files move underneath it.

**Acceptance criteria**:

- **AC-1**: The top level of `src/` holds only `app/`, `features/`, `components/`, `lib/`, `hooks/`, `i18n/`, `locales/`, `routes/`, `test/`, `assets/` plus the files `main.tsx`, `index.css`, `vite-env.d.ts` and `routeTree.gen.ts`. The folders `pages/`, `contexts/`, `types/`, `data/`, `schemas/`, `components/form-sections/`, `components/templates/`, `components/template-previews/`, `components/icons/` and `lib/pdf-templates/` no longer exist, and every file sits where the move map below says.
- **AC-2**: `src/features/` holds exactly seven areas: `landing`, `gallery`, `builder`, `preview`, `templates`, `pdf`, `resume`.
- **AC-3**: `pnpm lint` fails with a message naming spec 0002 when any of these is added: a page area importing another page area; `resume` importing `templates` or `pdf`; `templates` importing `pdf`; a domain area importing a page area; shared code (`components/`, `lib/`, `hooks/`, `i18n/`) importing `features/`, `app/` or `routes/`; any feature importing `app/` or `routes/`; any import with a `../` segment, at the start or inside an `@/` path. With none of these present, `pnpm lint` passes.
- **AC-4**: There are no barrel files: no `index.ts` or `index.tsx` anywhere in `src/` except the route file `src/routes/index.tsx`, and no `export * from` lines in `src/` outside `routeTree.gen.ts`. The three single name pass throughs that exist today (`form-types.ts` → `ResumeFormValues`, `date-utils.ts` → `formatCVYear`, `test-utils.tsx` → Testing Library) may stay.
- **AC-5**: No file under `features/templates/` imports from `features/pdf/`. `buildResumeMetadata` and `parseResumeMetadata` live in `src/features/resume/resume-metadata.ts` with their tests in `resume-metadata.test.ts`, and the payload format (`v: 1`) is unchanged, so a PDF exported before the move still imports with every field intact.
- **AC-6**: `src/components/scale-to-fit-container.tsx` and `src/hooks/use-scale-to-fit.ts` are deleted.
- **AC-7**: Behavior is unchanged: `pnpm pre-commit` passes; the test count is the same as before the move; the production build loads every route (`/`, `/templates`, `/templates/$templateId`, `/builder`, `/preview`) in EN and PL with no console errors; each of the three templates exports a PDF that imports back with every field intact; and the entry chunk still contains neither `@react-pdf/renderer` nor `pdfjs-dist` (`grep -l "react-pdf\|pdfjs" dist/assets/index-*.js` prints nothing, before and after).
- **AC-8**: Every move is a `git mv` with only import lines edited in the same commit, so `git log --follow` on a moved file shows its history from before the move (the new `resume-metadata.ts` starts fresh), and every commit in the PR passes `pnpm pre-commit` on its own.
- **AC-9**: The README `Project Structure` tree matches the new layout. The PDF context file lives at `src/features/templates/pdf/AGENTS.md` (with its `CLAUDE.md` pointer) and its Key files table names the new paths; `src/features/pdf/AGENTS.md` is a short file pointing to it for the export and import side. Root `AGENTS.md` names no path that no longer exists.

## Decision

**Chosen option**: Feature areas plus shared layers, with a layered one way import rule enforced by ESLint `no-restricted-imports`, moved in one PR with one commit per area.

`src/` gets an `app/` shell and seven areas under `features/`; shared code stays at `components/` (with `ui/`), `lib/` and `hooks/`, so the shadcn aliases in `components.json` keep working.

**Implementation skills**: `tanstack-router` (`.claude/skills/tanstack-router/`) for keeping route files thin and the generated route tree untouched · `vite` (`.claude/skills/vite/`) for the `@/` alias and chunk checks · `react-pdf` (`.claude/skills/react-pdf/`) for keeping the renderer out of eager chunks.

## Standard definition

### The layers

| Layer      | Folders                                                            | May import                                             |
| ---------- | ------------------------------------------------------------------ | ------------------------------------------------------ |
| Entry      | `routes/`, `app/`, `main.tsx`                                      | everything below; `routes/` may import `app/`          |
| Page areas | `features/landing`, `gallery`, `builder`, `preview`                | domain areas and shared; never another page area       |
| Domain     | `features/pdf` → `features/templates` → `features/resume`          | only the areas to its right (in that order) and shared |
| Shared     | `components/` (incl. `ui/`), `lib/`, `hooks/`, `i18n/`, `locales/` | shared only                                            |

`src/test/` and `src/assets/` sit outside the layers. Tests live next to the file they test and follow that file's layer.

**Canonical pattern** (inside `src/features/builder/builder-page.tsx`):

```ts
import { Button } from '@/components/ui/button'; // shared: always fine
import { safeStorage } from '@/lib/storage'; // shared: always fine
import { loadResumeFromPDF } from '@/features/pdf/pdf-parser'; // page area → domain: fine
import type { ResumeFormValues } from '@/features/resume/form-types'; // page area → domain: fine
import { PersonalInfoSection } from '@/features/builder/form-sections/personal-info-section'; // own area: @/ path

// Inside features/gallery/developer-preview.tsx, a sibling in the same folder may use ./
// import { TemplateCardPreview } from './template-card-preview';

// Not allowed:
// import { GalleryPage } from '@/features/gallery/templates-page'; // page area → page area
// import { cn } from '../../lib/utils'; // parent relative path
```

**Rules in words**:

1. Imports use the `@/` alias. `../` is never allowed (lint enforces it). `./` is for a sibling file in the same folder; the one exception is `main.tsx` importing `./index.css`.
2. Import the exact file. No `index.ts` barrels and no `export *`. (A barrel is a file that gathers and passes on other files' exports; in `pdf` or `templates` one could pull `@react-pdf/renderer` into the eager bundle.)
3. Inside an area, files sit flat. Once an area passes about 10 files, group them in subfolders by purpose (as `templates/html/`, `templates/pdf/` and `builder/form-sections/` do from day one).
4. A page component lives in its area (`features/builder/builder-page.tsx`); its route file keeps only `head()` and `component`.
5. Code used by two or more page areas goes down a layer: into a domain area if it is about resumes, templates or PDFs, otherwise into shared.

**Replaces**:

- Folders grouped by kind: `pages/`, `contexts/`, `types/`, `data/`, `schemas/`, and feature code inside `components/` and `lib/`.
- `src/lib/pdf-templates/*-pdf.tsx` importing `buildResumeMetadata` from `src/lib/pdf-parser.ts` (render code depending on import code).
- Relative imports across folders (`../`).

**Enforcement**: ESLint core rule `no-restricted-imports` in `eslint.config.js`, already run by `pnpm lint`, `pnpm pre-commit` and CI. No new package. Shape (the exact code is the build's call):

```js
const PAGE_AREAS = ['landing', 'gallery', 'builder', 'preview'];
const noParent = { regex: '(^|/)\\.\\.(/|$)', message: 'Use the @/ alias, never ../ (spec 0002).' };
const ban = (paths, why) => ({ group: paths, message: `${why} (spec 0002).` });

// ESLint applies the last matching block for a rule, so every block repeats noParent.
const restrict = (files, bans) => ({
    files,
    rules: { 'no-restricted-imports': ['error', { patterns: [noParent, ...bans] }] },
});

const featureDirs = (names) => names.map((n) => `@/features/${n}/**`);
const entryBan = ban(
    ['@/app/**', '@/routes/**'],
    'Features and shared code never import the app shell or routes',
);

export default defineConfig([
    // …existing blocks…
    { ...restrict(['src/**/*.{ts,tsx}'], []), ignores: ['src/routeTree.gen.ts'] },
    restrict(
        ['src/{components,lib,hooks,i18n}/**/*.{ts,tsx}'],
        [ban(['@/features/**'], 'Shared code never imports a feature area'), entryBan],
    ),
    restrict(
        ['src/features/resume/**/*.{ts,tsx}'],
        [
            ban(
                featureDirs([...PAGE_AREAS, 'templates', 'pdf']),
                'resume is the bottom domain area',
            ),
            entryBan,
        ],
    ),
    restrict(
        ['src/features/templates/**/*.{ts,tsx}'],
        [
            ban(featureDirs([...PAGE_AREAS, 'pdf']), 'templates may import only resume and shared'),
            entryBan,
        ],
    ),
    restrict(
        ['src/features/pdf/**/*.{ts,tsx}'],
        [
            ban(featureDirs(PAGE_AREAS), 'pdf may import only templates, resume and shared'),
            entryBan,
        ],
    ),
    ...PAGE_AREAS.map((area) =>
        restrict(
            [`src/features/${area}/**/*.{ts,tsx}`],
            [
                ban(
                    featureDirs(PAGE_AREAS.filter((a) => a !== area)),
                    'Page areas never import each other',
                ),
                entryBan,
            ],
        ),
    ),
    restrict(
        ['src/app/**/*.{ts,tsx}'],
        [ban(['@/routes/**'], 'The app shell never imports routes')],
    ),
    eslintConfigPrettier,
]);
```

**Rollout**: one PR (`chore/feature-folders`), one commit per area, every commit green. See _Build plan_.

**Exceptions**:

- `src/routeTree.gen.ts` is generated, keeps whatever paths TanStack Router writes, and is left out of the rule.
- `src/test/` (setup, test utils, mocks) has no layer rule beyond the `../` ban.
- Dynamic `import('…')` calls are not checked by `no-restricted-imports`. Today they are `pdf-export.tsx` (react-pdf and the PDF templates), `preview-page.tsx` (react-pdf), `pdfjs-singleton.ts` (pdfjs) and `storage.test.ts` (`./storage`); all point an allowed way, and review catches any new one.
- `vi.mock('@/…')` path strings are not checked by lint either; a wrong one fails the test instead.

## Move map

Every file in `src/` and where it goes. Moves use `git mv`; "stays" means no move. Tests (`*.test.ts(x)`) move with their file and are listed only where they split.

**Entry and shell**

| From                                                         | To                           |
| ------------------------------------------------------------ | ---------------------------- |
| `main.tsx`, `index.css`, `vite-env.d.ts`, `routeTree.gen.ts` | stay                         |
| `routes/*`                                                   | stay (imports updated)       |
| `components/root-layout.tsx`                                 | `app/root-layout.tsx`        |
| `components/privacy-notice.tsx`                              | `app/privacy-notice.tsx`     |
| `components/pwa-install-prompt.tsx`                          | `app/pwa-install-prompt.tsx` |
| `components/pwa-reload-prompt.tsx`                           | `app/pwa-reload-prompt.tsx`  |
| `components/offline-indicator.tsx`                           | `app/offline-indicator.tsx`  |

**Page areas**

| From                                       | To                                             |
| ------------------------------------------ | ---------------------------------------------- |
| `pages/index-page.tsx`                     | `features/landing/landing-page.tsx` (renamed)  |
| `pages/templates-page.tsx`                 | `features/gallery/templates-page.tsx`          |
| `pages/template-page.tsx`                  | `features/gallery/template-page.tsx`           |
| `components/template-previews/*` (4 files) | `features/gallery/` (same names)               |
| `pages/builder-page.tsx`                   | `features/builder/builder-page.tsx`            |
| `components/form-sections/*` (9 files)     | `features/builder/form-sections/` (same names) |
| `types/form-component-types.ts`            | `features/builder/form-component-types.ts`     |
| `pages/preview-page.tsx`                   | `features/preview/preview-page.tsx`            |

**Domain areas**

| From                                                                  | To                                                                                                                                                                     |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lib/pdf-export.tsx`                                                  | `features/pdf/pdf-export.tsx`                                                                                                                                          |
| `lib/pdf-parser.ts`                                                   | `features/pdf/pdf-parser.ts` (minus the metadata helpers)                                                                                                              |
| `lib/pdfjs-singleton.ts`                                              | `features/pdf/pdfjs-singleton.ts`                                                                                                                                      |
| `lib/pdf-templates/AGENTS.md`, `CLAUDE.md`                            | `features/templates/pdf/AGENTS.md`, `CLAUDE.md` (Key files table rewritten to the new paths), plus a new short `features/pdf/AGENTS.md` and `CLAUDE.md` pointing to it |
| `components/templates/{developer,default,veterinary}-template.tsx`    | `features/templates/html/` (same names)                                                                                                                                |
| `components/description-list.tsx`                                     | `features/templates/html/description-list.tsx`                                                                                                                         |
| `components/icons/brand-icons.tsx`                                    | `features/templates/html/brand-icons.tsx`                                                                                                                              |
| `lib/pdf-templates/{developer,default,veterinary}-pdf.tsx`            | `features/templates/pdf/` (same names)                                                                                                                                 |
| `lib/pdf-templates/pdf-icons.tsx`                                     | `features/templates/pdf/pdf-icons.tsx`                                                                                                                                 |
| `lib/pdf-fonts.ts`                                                    | `features/templates/pdf/pdf-fonts.ts`                                                                                                                                  |
| `lib/pdf-translations.ts`                                             | `features/templates/pdf/pdf-translations.ts`                                                                                                                           |
| `lib/brand-icon-paths.ts`                                             | `features/templates/brand-icon-paths.ts` (html and pdf both use it)                                                                                                    |
| `schemas/resume-schema.ts`                                            | `features/resume/resume-schema.ts`                                                                                                                                     |
| `types/form-types.ts`                                                 | `features/resume/form-types.ts`                                                                                                                                        |
| `data/sample-resume-data.ts`, `sample-resume-data-pl.ts`              | `features/resume/` (same names)                                                                                                                                        |
| `lib/stored-resume.ts`                                                | `features/resume/stored-resume.ts`                                                                                                                                     |
| `lib/language-levels.ts`                                              | `features/resume/language-levels.ts`                                                                                                                                   |
| `buildResumeMetadata`, `parseResumeMetadata` from `lib/pdf-parser.ts` | `features/resume/resume-metadata.ts` (new file; their `describe('embedded resume metadata round-trip')` block moves to `resume-metadata.test.ts`)                      |

**Shared**

| From                                                                                                         | To                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `components/ui/*`                                                                                            | stay                                                                                                                  |
| `components/{theme-toggle,language-toggle,parallax-background,geometric-shapes}.tsx`                         | stay                                                                                                                  |
| `contexts/theme-context.tsx`                                                                                 | `components/theme-provider.tsx`                                                                                       |
| `types/theme-context-types.ts`                                                                               | `lib/theme-context.ts` (holds `ThemeContext` and the theme types, so `theme-provider.tsx` exports only the component) |
| `hooks/use-theme.ts`, `hooks/use-parallax.ts`                                                                | stay                                                                                                                  |
| `lib/{animation-variants,app-lang,button-variants,date-format,date-utils,seo,storage,template-ids,utils}.ts` | stay                                                                                                                  |
| `i18n/`, `locales/`, `test/`, `assets/`                                                                      | stay                                                                                                                  |
| `components/scale-to-fit-container.tsx`, `hooks/use-scale-to-fit.ts`                                         | deleted (nothing imports them)                                                                                        |

`lib/template-ids.ts` stays shared on purpose: the schema, SEO, templates and pdf all need the template list, and keeping it at the bottom means no layer has to reach up for it.

## Build plan

Tracer Bullet: the first commit proves the whole thread (lint rule, route, page area, shared code) on the smallest area, then each commit moves one area and leaves the app shippable.

**Order rule for the build**: move a file before you move the files it imports (top down). A feature importing shared code is always legal, but shared code importing a feature is not, so moving importers first keeps every commit passing the lint rule, which is on from commit 2.

0. Record the baseline on `main`: the test count from `pnpm test`, the list of chunks from `pnpm build`, and the output of `grep -l "react-pdf\|pdfjs" dist/assets/*.js` (which chunks hold the PDF engines). Put all three in the PR description. Satisfies **AC-7**.
1. Create the branch. Move `pages/index-page.tsx` to `features/landing/landing-page.tsx` and update `routes/index.tsx`. Satisfies **AC-1**, **AC-8**.
2. Add the `no-restricted-imports` blocks to `eslint.config.js` as in _Standard definition_. Fix the two existing `../` imports in `i18n/config.ts` (the locale JSON files) to `@/locales/…`, and change `./i18n/config` in `main.tsx` to `@/i18n/config`. Satisfies **AC-3**.
3. Gallery: move `templates-page.tsx`, `template-page.tsx` and the four `template-previews/*` files. Satisfies **AC-1**, **AC-2**.
4. Builder: move `builder-page.tsx`, `form-sections/`, `form-component-types.ts`. Satisfies **AC-1**, **AC-2**.
5. Preview: move `preview-page.tsx`. Satisfies **AC-1**, **AC-2**.
6. PDF and templates together (they are tangled today): create `features/resume/resume-metadata.ts` with the two helpers and their tests, point the three PDF templates and `pdf-parser.ts` at it, then move the pdf area files and the templates area files (html and pdf). Update the `vi.mock` paths in `pdf-export.test.ts`. Move the context file to `features/templates/pdf/`, rewrite its Key files table to the new paths, and add the short `features/pdf/AGENTS.md` and `CLAUDE.md` pointer. In root `AGENTS.md`, fix only the path lines this commit breaks (the Templates rule naming `src/components/templates/` and `src/lib/pdf-templates/`, and the Context files link). Satisfies **AC-5**, **AC-1**, **AC-2**, **AC-9**.
7. Resume: move schema, form types, sample data, `stored-resume.ts`, `language-levels.ts`. Satisfies **AC-1**, **AC-2**.
8. App shell and shared cleanup: move the five shell files to `app/`, the theme provider and context to their new homes (the `vi.mock` in `pwa-reload-prompt.test.tsx` points at `src/test/`, which does not move, so it needs no change), delete the two dead files, and remove the empty folders. Satisfies **AC-1**, **AC-6**.
9. Check there are no barrels or pass through exports (`AC-4`), update the README `Project Structure` tree, fix any other root `AGENTS.md` path that no longer exists (Validation, Storage, Animations, Templates ids lines) (`AC-9`), then run the _verify.md_ checks and record the after chunk list and test count next to the baseline. Satisfies **AC-4**, **AC-7**, **AC-9**.

Every commit runs `pnpm pre-commit` before the next one starts (**AC-8**).

## Consequences

**Positive**:

- Each scope feature still to come has an obvious home: feature 7 works inside `features/builder/`, feature 8 inside `features/templates/` (html and pdf side by side), feature 9 inside `features/pdf/`.
- The render side no longer depends on the import side, so the parser can be split (feature 9) without touching templates.
- Wrong way imports fail in lint and CI instead of in review.

**Negative / tradeoffs**:

- Every import path in the app changes once; open branches will conflict and need a rebase after the PR merges.
- The lint config grows by about 10 blocks, and it must be kept in step when an area is added or renamed.
- Dynamic imports and `vi.mock` strings are outside the lint rule; those two rely on tests and review.
- The build edits path lines in root `AGENTS.md` and the PDF context file so agents never read dead paths mid PR; `/sync` normally owns those files, so it should treat the lines as already current. The scope still names old code paths until `/sync` runs.

**Neutral**:

- `components.json` needs no change, since `@/components`, `@/components/ui`, `@/lib` and `@/hooks` all still exist.
- Route files, the generated route tree, the Vite entry and the PWA config are unaffected.

## Follow-up

- [ ] Run `/sync` after the merge: add the layer rule to root `AGENTS.md` `## Rules`, and update the code areas in `docs/scope/scope.md` to the new paths.
- [ ] `CONTRIBUTING.md` only names `src/locales/`, which does not move; no change expected, but recheck it during the build.

## Rationale

Reasoning and options: see [rationale.md](rationale.md).
