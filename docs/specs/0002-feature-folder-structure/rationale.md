# 0002. Feature based folder structure: rationale

The decision record behind [index.md](index.md). `/develop` builds from `index.md`; this file explains why.

## Context

`src/` holds 108 TypeScript files grouped by kind: `components/`, `lib/`, `pages/`, `hooks/`, `types/`, `contexts/`, `data/`, `schemas/`. To work on one feature you open four or five folders. The builder alone spans `pages/builder-page.tsx`, `components/form-sections/`, `types/form-component-types.ts`, `schemas/` and parts of `lib/`. `lib/` mixes general helpers (`utils`, `storage`, `date-format`) with the whole PDF engine (`pdf-export`, `pdf-parser`, `pdfjs-singleton`, `pdf-fonts`, `pdf-translations`, `pdf-templates/`).

Nothing stops an import from pointing anywhere, and one tangle already exists: the three PDF templates import `buildResumeMetadata` from `lib/pdf-parser.ts`, so the render side depends on the 872 line import parser. Feature 9 (split the parser) would have to touch the templates to move anything.

The scope queues three refactors right after this one: the builder page split (feature 7), a shared template model (feature 8) and the parser restructure (feature 9). Each needs a clear home before it starts, or it will invent its own layout. The forces: one maintainer, a small codebase, a Tracer Bullet delivery approach where every commit stays shippable, shadcn aliases fixed in `components.json`, and a hard rule that `@react-pdf/renderer` never lands in an eager chunk.

### Current imports between would be areas

What the code imports today, mapped onto the target areas (from a scan of every `@/` import on 2026-10-24):

| Importer             | Imports                                                                        |
| -------------------- | ------------------------------------------------------------------------------ |
| builder page         | pdf parser, schema, form types, stored resume, storage, ui                     |
| preview page         | pdf export, PDF templates, stored resume, template ids, ui                     |
| template detail page | PDF templates, sample data, parallax, ui                                       |
| gallery page         | HTML card previews, storage, parallax, ui                                      |
| HTML card previews   | HTML templates, sample data                                                    |
| PDF templates        | **pdf parser** (metadata), form types, date format, pdf translations           |
| pdf export           | form types, template ids, pdfjs singleton (and the PDF templates, dynamically) |
| resume schema        | template ids                                                                   |
| seo                  | template ids                                                                   |

No page imports another page. The only wrong way link is PDF templates → parser.

## Options considered

### Layout

**Option 1: Feature areas plus shared layers in place.** `app/` for the shell, `features/<area>/` for seven areas, and shared code left at `components/` (with `ui/`), `lib/` and `hooks/`.

- Pros: smallest diff for shared code; shadcn's `components.json` aliases keep working, so `shadcn add` still drops files in the right place; matches the layout most React SPA guides use.
- Cons: "shared" is three folders rather than one, so the rule has to list them.

**Option 2: Feature areas plus one `shared/` folder.** Everything not in a feature moves under `src/shared/{ui,lib,hooks}`.

- Pros: one obvious place for shared code; the lint rule names one folder.
- Cons: every shared import in the app changes too; `components.json` aliases must be rewritten, and shadcn tooling must follow them.

**Option 3: Feature Sliced Design.** The full set of FSD layers (app, pages, widgets, features, entities, shared) with its own slice and segment rules.

- Pros: a published, well known standard with strict, documented import rules.
- Cons: six layers and slice public APIs for a 108 file app with one maintainer; most layers would hold one or two files; heavy vocabulary to learn.

### Import rule enforcement

**Option A: ESLint `no-restricted-imports`.** Core ESLint rule, one block per layer.

- Pros: no new dependency; runs where lint already runs (`pnpm lint`, `pre-commit`, CI); clear per block messages.
- Cons: blocks override rather than merge, so each repeats the shared bans (handled with a small helper); does not check dynamic `import()`.

**Option B: `eslint-plugin-boundaries`.** A plugin built for this: declare element types and allowed directions once.

- Pros: rules read as a dependency matrix; good messages; can catch dynamic imports.
- Cons: one more dependency to keep current with each ESLint major (feature 2 just spent a cycle on exactly that).

**Option C: dependency-cruiser.** A separate graph checker run in CI.

- Pros: also finds cycles and can draw the graph.
- Cons: a second tool and config, a separate CI step, and slower feedback than the editor lint.

**Option D: Documentation only.** Write the rule in `AGENTS.md` and rely on review.

- Pros: zero setup.
- Cons: nothing stops drift; with AI written changes, unenforced rules decay fastest.

### Rollout

**One PR, one commit per area** · **one PR per area** · **one big commit**. The middle option leaves the tree half old and half new for days and needs the lint rule to allow both layouts; the last is hard to review and to bisect.

## Decision

Option 1 for the layout, Option A for enforcement, one PR with one commit per area. Smaller calls made with the engineer: seven areas including a `resume` domain area; HTML and PDF templates side by side in one `templates` area; layered one way imports (page areas → pdf → templates → resume → shared); no barrels; flat files inside an area until it passes about 10 files; page components in their area with thin route files; app wide widgets in the shared layer; `@/` everywhere with `../` banned; the PDF metadata helpers moved to `resume`; the PDF context file moved to `features/templates/pdf/` (changed from `features/pdf/` after the cross check: most of its rules govern the templates, and nested context files load by folder) with a short pointer left in `features/pdf/`; dead `scale-to-fit` code deleted; no References section.

## Rationale

The layout follows the code that exists, not a framework's vocabulary. The scan above shows pages never import each other and everything else flows downward, so a layered rule fits today's code with a single fix (the metadata helpers). FSD would enforce the same direction with three times the folders, which fails the "can one person keep this in their head" test for a 108 file app. Keeping shared code where it is (rather than a new `shared/`) wins on the one force that matters most here: shadcn tooling and its aliases keep working with zero config change, and roughly half the import churn disappears.

`templates` holds both renderers because "a new section must land in all three templates, in both versions" is the most expensive rule in `AGENTS.md`, and feature 8 exists to fix it. Putting the six files in one area makes that pairing visible and gives feature 8 its home. `resume` sits at the bottom because the schema, types and stored data are what every other area talks about; the metadata payload is a serialization of that data, so it belongs there too, and moving it is what breaks the render → parser link.

`no-restricted-imports` over a plugin: the rule needs about ten blocks, the project just finished a dependency upgrade cycle, and the core rule cannot fall behind an ESLint major. The gap it leaves (dynamic `import()`) is a single file today and goes in the allowed direction. Barrels are banned because Vite serves them as one module graph in dev and because a barrel in `pdf` or `templates` is the easiest way to drag `@react-pdf/renderer` into the landing chunk, which `src/lib/pdf-templates/AGENTS.md` forbids.

One PR with a commit per area fits Tracer Bullet: the first commit proves the thread (rule, route, area, shared), each later commit stays green, and the half moved state never reaches `main`. Moving importers before what they import is what lets the lint rule stay on from the second commit.

`template-ids.ts` stays in shared `lib/` rather than `resume`: `seo.ts` (shared) and the schema both need it, and placing it in a feature would force shared code to reach up. The theme context object stays in its own file (`lib/theme-context.ts`) rather than inside the provider, so `theme-provider.tsx` exports only the component and the context object has one plain home that the hook and the provider both import.
