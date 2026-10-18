# Verify: Upgrades & replacements · spec 0001 · updated 2026-10-18

_Steps derived from spec 0001 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual

- [x] Push a branch and open the Vercel preview build log → it reports Node 24 and pnpm 12.14, install and build succeed → AC-1 (PR #86: `Done in 8.2s using pnpm v12.14.0`, project on Node 24.x)
- [x] `pnpm build && pnpm preview`, then visit `/`, `/templates`, `/templates/developer`, `/templates/default`, `/templates/veterinary`, `/builder?templateId=developer`, `/preview?templateId=developer` in EN and PL, light and dark → no console errors, no CSP violations → AC-2
- [x] For each template (developer, default, veterinary): load sample data with the GDPR clause on, open `/preview`, click Download PDF, then on `/builder` load that PDF → every field matches what was exported → AC-3
- [x] On `/preview`, use a resume long enough to spill onto page two → the Multi / Single toggle appears; a one page resume shows no toggle (pdf.js 6 page count path) → AC-3
- [x] After a first visit, DevTools Application → Cache Storage lists `/pdf.worker.min.mjs` and the ten `/fonts/*.ttf` files → AC-4
- [x] DevTools offline: open `/preview` with saved data → PDF preview renders; Download PDF works; load the PDF on `/builder` → fields come back. Fonts are served by the service worker even with the `?v=` query → AC-4
- [x] Gallery card for the developer template, side by side with the live site → GitHub and LinkedIn icons look the same → AC-6

## Commands

- [x] `pnpm pre-commit` → Prettier, lint, 126 tests, typecheck and build all pass → AC-1
- [x] `pnpm format:check` → passes (CI runs it) → AC-1
- [x] `node -v` matches `.nvmrc` (24) and `pnpm -v` prints 12.14.0 → AC-1
- [x] `grep -E "react-router-devtools|react-day-picker" package.json` → no match → AC-9
- [x] `pnpm audit` → no known vulnerabilities; `pnpm peers check` → no issues → AC-1
- [x] `pnpm why tar js-yaml diff seroval seroval-plugins` → each resolves above its old override floor or is gone, so all five `pnpm.overrides` were dropped rather than moved to `pnpm-workspace.yaml` → AC-1
- [x] `pnpm build` → compare chunk sizes against the table in the PR description → AC-10 (table recorded in PR #86)

## Acceptance criteria coverage

- AC-1: preview build log, `pnpm pre-commit`, `format:check`, versions, audit
- AC-2: route matrix in the production preview
- AC-3: export and import round trip per template, multi page toggle
- AC-4: Cache Storage listing, offline preview, export and import
- AC-5, AC-7, AC-8: belong to features 18, 19 and 20, not this one
- AC-6: icon side by side
- AC-9: partly here (devtools and react-day-picker gone); `date-fns` and `@radix-ui/react-*` go in features 18 and 17
- AC-10: chunk table in the PR
