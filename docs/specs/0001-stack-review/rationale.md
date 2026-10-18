# 0001. Stack review: rationale

Decision record for [index.md](index.md). `/develop` skips this file.

## Context

The resume builder is a client only React SPA (no backend) on Vite, hosted on Vercel, built by one maintainer. Scope feature 2 asks for a verdict per layer before the refactor and UI refresh slices start, so later work lands on a current base instead of upgrading mid feature.

As of 2026-10-18 the lockfile is behind on almost every layer. Many tools are a major version or more behind: Vite 8, Vitest 5, ESLint 10, TypeScript 6 and 7, i18next 26, pdfjs 6, lucide 1, react-day-picker 10, jsdom 30, motion 13 and 14, vite-plugin-pwa 2. The runtime pin (Node 22, engines `>=20.19`) trails Vercel's default (Node 24), and Node 20 is end of life. Several of these majors are only days old, and plugins do not always keep up (typescript-eslint caps TypeScript below 6.1).

The constraints on this pass: the app must stay shippable after each step (Tracer Bullet). The three templates must look exactly the same in web and PDF. PDF export and import is a round trip that breaks quietly if render and parse drift. The CSP is copied by hand between `vite.config.ts` and `vercel.json`, and a mismatch breaks preview and export in production only. The saved localStorage shape may break, so no data migration is owed. Later features set performance budgets (5), lazy load heavy engines (10) and tune builder responsiveness (11), so this pass should not pre empt their measurements.

Not deciding means each later feature hits an outdated plugin or a breaking major in the middle of unrelated work, which is the most expensive time to meet it.

## Options considered

### Option 1: Minor and patch updates only

Stay on every current major and take only safe updates.

**Pros**:

- Lowest risk, smallest diff, almost no code changes.

**Cons**:

- Leaves Node 20 era tooling and several majors that are a year behind, so later features meet the cliff mid work.
- Ecosystem plugins increasingly drop the old majors (for example `@types/node` ranges in Vitest 5).

### Option 2: Latest major after four weeks, replace only with a clear win (chosen)

Upgrade every layer to its latest major once that major is at least four weeks old and its plugins support it. Swap a library only when the replacement clearly wins.

**Pros**:

- Current base for the whole pass, with a buffer that skips most x.0.0 regressions.
- Replacements are limited to the four that pay for themselves (Radix unification, `Intl` dates, shared CSP, React Compiler).

**Cons**:

- The largest change set of the conservative options. It needs a disciplined one layer per commit sequence.
- Some layers are held (TS 7, motion 14, vite-plugin-pwa 2), so a second, smaller round follows.

### Option 3: Bleeding edge plus modernization

Take every latest major now, and swap tools for newer ones where a modest win exists (Oxlint and Oxfmt or Biome for ESLint and Prettier, Base UI for Radix, `@dnd-kit/react`, Vitest browser mode).

**Pros**:

- The newest toolchain, with the fastest lint and format.

**Cons**:

- TS 7 cannot run typescript-eslint yet, Oxfmt is beta, `@dnd-kit/react` is pre 1.0, motion 14 and PWA 2 are under three weeks old.
- Base UI rewrites every `ui/` component right before the design system refresh would rewrite them again.
- At about 100 source files, a faster linter saves seconds.

### Per layer alternatives weighed

| Layer           | Chosen                          | Runner up                          | Why not the runner up                                                                 |
| --------------- | ------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------- |
| TypeScript      | 6.0 now, 7 later                | TS 7 typecheck plus TS 6 lint      | Two compilers can disagree; more moving parts than the speed is worth here.           |
| Lint, format    | ESLint 10 plus Prettier         | Oxlint plus Oxfmt                  | Oxfmt beta; type aware Oxlint runs on TS 7 tooling.                                   |
| Primitives      | `radix-ui` unified              | Keep separate packages             | Seven versions to keep in step, off the shadcn default path.                          |
| Dates           | `Intl.DateTimeFormat`           | Keep `date-fns`                    | A dependency plus locale data for one format call.                                    |
| Drag and drop   | Keep classic dnd-kit            | `@dnd-kit/react`                   | Pre 1.0, breaking changes likely mid pass.                                            |
| Animation       | motion 13, lazy loaded later    | CSS scroll driven animations       | Rewrites parallax and reduced motion handling before the design refresh.              |
| Test env        | Vitest 5 plus jsdom 30          | happy-dom                          | Less complete DOM; Radix and PDF related tests may hit gaps.                          |
| React Compiler  | Adopt now, through Babel        | Decide in feature 11               | The engineer chose to adopt now (see Rationale).                                      |
| Compiler wiring | `@rolldown/plugin-babel` preset | Native `react({ compiler: true })` | The Oxc based native path is still experimental in plugin-react 6.1.                  |
| CSP source      | `vercel.json`, read by Vite     | `vercel.ts` plus shared module     | Same single source, but adds a pre 1.0 `@vercel/config`, tsconfig changes and a test. |
| Date picker     | Remove (dead code)              | Upgrade to rdp 10                  | Nothing imports `calendar.tsx`, and rdp 10 keeps `date-fns` in the tree.              |

## Rationale

The forces that decide this are one maintainer, a Tracer Bullet build that must stay shippable, and a refactor plus UI refresh coming right after. Option 1 defers the cost into those features, where it is most expensive. Option 3 brings in tools that are either blocked (TS 7 with typescript-eslint), beta (Oxfmt), pre 1.0 (`@dnd-kit/react`) or about to be redone (Base UI before the design refresh). Option 2 gives a current base with a four week buffer, which in practice skips the first regression wave of each major.

Each replacement clears the "clear win" bar on a specific force. Unifying Radix cuts seven version pins to one and follows the shadcn default the `ui/` folder already tracks. `Intl` removes a dependency used for one month plus year format. Making `vercel.json` the CSP source that `vite.config.ts` reads removes the drift risk the `AGENTS.md` gotcha warns about, which only shows up in production. The first draft used `vercel.ts` with a shared module; the cross check showed the JSON import reaches the same single source with no pre 1.0 dependency, and the engineer switched. Removing `react-day-picker` was also a cross check finding: its only user, `calendar.tsx`, is never imported. The held layers are held by the rule, not by preference, and are tracked as follow ups.

On the React Compiler: I recommended deciding it in feature 11, so it is judged against a measured builder profile and TanStack Form's own subscription model. You chose to adopt it now, which is reasonable, since it is stable at 1.0 and plugin-react 6 supports it. The tradeoff you are accepting is that compiler related behavior changes land in the same pass as the toolchain upgrades. That is why it is the last build step, after everything else is green, why the opt out is per component (`'use no memo'`), and why feature 11 should still profile with it on and off.

One judgment call against my own earlier framing: the animation question offered "latest 12.x", but motion 13.0 shipped on 2026-08-05, which passes the four week rule. The verdict uses 13 to stay consistent with the rule you set.

## Landscape evidence (checked 2026-10-18)

First stable release dates from the npm registry `time` field, unless noted otherwise:

- vite 8.0.0: 2026-03-12 · @vitejs/plugin-react 6.0.0: 2026-03-12 (peer `vite ^8`)
- vitest 5.0.0: 2026-09-03 · jsdom 30.0.0: 2026-07-27
- eslint 10.0.0: 2026-02-06 · eslint-plugin-react-hooks 7.0.0: 2025-10-08 (peers include ESLint 10)
- typescript 6.0.2: 2026-03-23, latest 6.0.3 · typescript 7.0.x stable (7.0.2) · typescript-eslint latest 8.71 with peer `typescript >=4.8.4 <6.1.0`
- i18next 26.0.0: 2026-03-28 · react-i18next 17.0.0: 2026-03-27
- pdfjs-dist 6.0.227: 2026-05-30, latest 6.4.299
- react-day-picker 10.0.0: 2026-05-08 · lucide-react 1.0.0: 2026-03-23 (`Github` and `Linkedin` absent in 1.59.0, checked in the package types)
- motion 13.0.0: 2026-08-05 · motion 14.0.0: 2026-10-02 (held)
- vite-plugin-pwa 2.0.0: 2026-10-03 (held); 1.x peers include `vite ^8`
- pnpm 11.0.0: 2026-04-28 · pnpm 12.0.0: 2026-08-26
- @dnd-kit/react latest 0.5.1 (pre 1.0); @dnd-kit/core 6.3.1 is current
- babel-plugin-react-compiler 1.0.0: 2025-10-07 · @rolldown/plugin-babel 0.2.4 · @vercel/config 0.12.0 · radix-ui 1.8.1 · @base-ui/react 1.9.0
- Node.js: 20 end of life, 22 and 24 LTS, 26 current

## References

**Project sources**:

- `AGENTS.md` (stack, the CSP sync rule, the template rules, Tracer Bullet)
- `src/lib/pdf-templates/AGENTS.md` (render and parse round trip, the CSP gotcha, the pdf.js worker)
- `docs/scope/scope.md` features 2, 3, 5, 6, 10, 11
- `package.json`, `vite.config.ts`, `vercel.json`, `eslint.config.js`, `.github/workflows/ci.yml`

**Practices & standards**:

- Let new majors settle before adopting them (a fixed age buffer)
- Single source of truth for security configuration
- Upgrade one layer at a time with a green build between steps (strangler style for toolchains)
- Pin pre 1.0 dependencies to a minor range

**Links** (web verified during the landscape check):

- npm registry, vite: https://registry.npmjs.org/vite
- npm registry, vitest: https://registry.npmjs.org/vitest
- npm registry, eslint: https://registry.npmjs.org/eslint
- npm registry, typescript: https://registry.npmjs.org/typescript
- npm registry, typescript-eslint: https://registry.npmjs.org/typescript-eslint
- typescript-eslint TS 7 tracking issue: https://github.com/typescript-eslint/typescript-eslint/issues/12518
- npm registry, @vitejs/plugin-react: https://registry.npmjs.org/@vitejs/plugin-react
- React Compiler installation: https://react.dev/learn/react-compiler/installation
- npm registry, motion: https://registry.npmjs.org/motion
- npm registry, vite-plugin-pwa: https://registry.npmjs.org/vite-plugin-pwa
- npm registry, @dnd-kit/react: https://registry.npmjs.org/@dnd-kit/react
- npm registry, radix-ui: https://registry.npmjs.org/radix-ui
- npm registry, @base-ui/react: https://registry.npmjs.org/@base-ui/react
- npm registry, @react-pdf/renderer: https://registry.npmjs.org/@react-pdf/renderer
- npm registry, pnpm: https://registry.npmjs.org/pnpm
- Node.js releases: https://nodejs.org/en/about/previous-releases
- Oxfmt beta announcement: https://oxc.rs/blog/2026-02-24-oxfmt-beta
