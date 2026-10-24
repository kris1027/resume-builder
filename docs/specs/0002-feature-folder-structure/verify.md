# Verify: Feature based folder structure · spec 0002

_Steps derived from spec 0002 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## Commands

- [ ] `find src -maxdepth 1 | sort` → only `app`, `assets`, `components`, `features`, `hooks`, `i18n`, `lib`, `locales`, `routes`, `test`, `index.css`, `main.tsx`, `routeTree.gen.ts`, `vite-env.d.ts` → AC-1
- [ ] `ls src/features` → exactly `builder gallery landing pdf preview resume templates` → AC-2
- [ ] Every row of the move map: the target file exists and the source path does not → AC-1
- [ ] `find src -name 'index.ts*' -not -path 'src/routes/*'` → no output; `grep -rn "export \* from" src --exclude=routeTree.gen.ts` → no output → AC-4
- [ ] `grep -rn "features/pdf" src/features/templates` → no output; `resume-metadata.test.ts` exists and passes → AC-5
- [ ] `ls src/components/scale-to-fit-container.tsx src/hooks/use-scale-to-fit.ts` → both missing → AC-6
- [ ] `pnpm pre-commit` passes; `pnpm test` count equals the baseline in the PR description → AC-7
- [ ] `git log --follow --oneline src/features/pdf/pdf-parser.ts` shows commits from before the move → AC-8
- [ ] `git rebase -x 'pnpm pre-commit' main` (or check each commit in CI) → every commit in the PR passes → AC-8

## Lint rule (AC-3)

Add each import below on its own, run `pnpm lint`, expect an error that mentions spec 0002, then remove it:

- [ ] In `features/builder/builder-page.tsx`: `import '@/features/gallery/templates-page';` (page area → page area)
- [ ] In `features/resume/form-types.ts`: `import '@/features/templates/pdf/pdf-fonts';` (resume → templates)
- [ ] In `features/templates/pdf/default-pdf.tsx`: `import '@/features/pdf/pdf-parser';` (templates → pdf)
- [ ] In `features/pdf/pdf-export.tsx`: `import '@/features/preview/preview-page';` (domain → page area)
- [ ] In `lib/utils.ts`: `import '@/features/resume/form-types';` (shared → feature)
- [ ] In `features/landing/landing-page.tsx`: `import '@/app/root-layout';` (feature → app)
- [ ] In `features/gallery/templates-page.tsx`: `import '../../lib/utils';` (parent relative path)
- [ ] With all of them removed, `pnpm lint` passes

## UI / manual (AC-7)

- [ ] `pnpm build && pnpm preview`, then visit `/`, `/templates`, `/templates/developer`, `/templates/default`, `/templates/veterinary`, `/builder?templateId=developer`, `/preview?templateId=developer` in EN and PL → every page renders, no console errors
- [ ] Fill the builder with test data: in DevTools on `/builder`, run `localStorage.setItem('resumeData', JSON.stringify(<the object from src/features/resume/sample-resume-data.ts, with the GDPR clause on and a company name>))` and reload (or fill every section by hand with at least one entry each). Then for each template: open `/preview?templateId=<id>`, Download PDF, reset the builder, load that PDF on `/builder` → every field matches
- [ ] Load a PDF exported from the current production site (before the move) on `/builder` → every field matches (metadata `v: 1` still read) → AC-5
- [ ] After `pnpm build`, `grep -l "react-pdf\|pdfjs" dist/assets/index-*.js` prints nothing, and `grep -l "react-pdf\|pdfjs" dist/assets/*.js` lists the same kind of lazy chunks as the baseline in the PR description
- [ ] README `Project Structure` tree matches `find src -maxdepth 2 -type d`; `src/features/templates/pdf/AGENTS.md` (paths in its Key files table all exist) and `src/features/pdf/AGENTS.md` exist, each with a `CLAUDE.md`; every `src/` path named in root `AGENTS.md` exists → AC-9
