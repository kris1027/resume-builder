# Verify: Upgrades & replacements · spec 0001 · updated 2026-10-21

_Steps derived from spec 0001 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual

- [x] Push a branch and open the Vercel preview build log → it reports Node 24 and pnpm 12.14, install and build succeed → AC-1 (PR #86: `Done in 8.2s using pnpm v12.14.0`, project on Node 24.x)
- [x] `pnpm build && pnpm preview`, then visit `/`, `/templates`, `/templates/developer`, `/templates/default`, `/templates/veterinary`, `/builder?templateId=developer`, `/preview?templateId=developer` in EN and PL, light and dark → no console errors, no CSP violations → AC-2
- [x] For each template (developer, default, veterinary): load sample data with the GDPR clause on, open `/preview`, click Download PDF, then on `/builder` load that PDF → every field matches what was exported → AC-3
- [x] On `/preview`, use a resume long enough to spill onto page two → the Multi / Single toggle appears; a one page resume shows no toggle (pdf.js 6 page count path) → AC-3
- [x] After a first visit, DevTools Application → Cache Storage lists `/pdf.worker.min.mjs` and the ten `/fonts/*.ttf` files → AC-4
- [x] DevTools offline: open `/preview` with saved data → PDF preview renders; Download PDF works; load the PDF on `/builder` → fields come back. Fonts are served by the service worker even with the `?v=` query → AC-4
- [x] Gallery card for the developer template, side by side with the live site → GitHub and LinkedIn icons look the same → AC-6
- [x] Feature 17 (`radix-ui`): rerun the AC-2 route matrix in the production preview, then on `/builder` open the language and theme menus (DropdownMenu), tick and untick a checkbox through its label (Checkbox, Label), pick a level in a language Select, open and close a date Popover, open and cancel the Reset AlertDialog, and follow the Back to Templates link (`Button asChild`, Slot) → all 28 route combinations and every primitive behave as before, no console errors → AC-2, AC-9
- [ ] Feature 18 (`Intl` dates): with sample data that has work and education dates, check in EN and PL the builder date picker month lists, the three gallery cards, and `/preview` for each template (developer long month, default and veterinary short month, years on education) → month names and casing match the pinned strings in `date-format.test.ts`, e.g. `styczeń 2024` / `sty 2024` → AC-5

## Commands

- [x] `pnpm pre-commit` → Prettier, lint, 126 tests, typecheck and build all pass → AC-1
- [x] `pnpm format:check` → passes (CI runs it) → AC-1
- [x] `node -v` matches `.nvmrc` (24) and `pnpm -v` prints 12.14.0 → AC-1
- [x] `grep -E "react-router-devtools|react-day-picker" package.json` → no match → AC-9
- [x] `grep "@radix-ui/react-" package.json` → no match; `pnpm build` still emits the `radix` chunk → AC-9 (feature 17)
- [x] `pnpm audit` → no known vulnerabilities; `pnpm peers check` → no issues → AC-1
- [x] `pnpm why tar js-yaml diff seroval seroval-plugins` → each resolves above its old override floor or is gone, so all five `pnpm.overrides` were dropped rather than moved to `pnpm-workspace.yaml` → AC-1
- [x] `pnpm build` → compare chunk sizes against the table in the PR description → AC-10 (table recorded in PR #86)
- [x] Feature 18: `format()` from date-fns 4.1.0 with `enUS` and `pl` (`LLLL yyyy`, `LLL yyyy`, `LLLL`, `LLL`, all 12 months of 2024) → all 48 strings equal the pins in `src/lib/date-format.test.ts` → AC-5
- [x] `grep date-fns package.json pnpm-lock.yaml` and `grep -r date-fns src` → no match except the pin comment in `date-format.test.ts` → AC-9 (feature 18)
- [x] Feature 19: `grep -rn "Content-Security-Policy" --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git . | grep -v docs/` → only `vercel.json` holds the policy; `vite.config.ts` names the header key, not the value → AC-7
- [x] Feature 19: `pnpm build`, then compare the `<meta http-equiv="Content-Security-Policy">` content in `dist/index.html` with the `vercel.json` value → identical → AC-7
- [x] Feature 19: rename the header key in `vercel.json` and run `pnpm exec vite build` → fails with `vercel.json is missing the Content-Security-Policy header on "/(.*)"`; restore the file → AC-7
- [x] Feature 19: on the PR preview deployment, `vercel curl <preview>/` and `<preview>/builder` → the `Content-Security-Policy` response header equals the meta tag in the served HTML, and `/builder` still returns 200 through the SPA rewrite → AC-7, AC-2

## Acceptance criteria coverage

- AC-1: preview build log, `pnpm pre-commit`, `format:check`, versions, audit
- AC-2: route matrix in the production preview, rerun with a primitives pass for feature 17
- AC-3: export and import round trip per template, multi page toggle
- AC-4: Cache Storage listing, offline preview, export and import
- AC-5: date-fns pin check plus the EN/PL visual pass (feature 18)
- AC-7: single source grep, built meta versus `vercel.json`, the missing header guard, and the preview header check (feature 19)
- AC-8: belongs to feature 20, not this one
- AC-6: icon side by side
- AC-9: devtools and react-day-picker gone here, `@radix-ui/react-*` gone in feature 17, `date-fns` gone in feature 18
- AC-10: chunk table in the PR
