# PDF templates, export and import

## Overview

The three resume templates rendered with `@react-pdf/renderer`. They drive the live preview, the template detail page and the downloaded file. The import side (`pdfjs-dist`) reads an exported PDF back into the form, so render and parse are one round trip and change together.

## Key files

| File                                                           | Owns                                                                             |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `src/lib/pdf-templates/{developer,default,veterinary}-pdf.tsx` | One PDF component per template, props `data`, `compactScale`, `lang`             |
| `src/lib/pdf-templates/pdf-icons.tsx`                          | Contact icons drawn as react-pdf SVG                                             |
| `src/lib/pdf-translations.ts`                                  | EN/PL strings and date-fns locale for PDFs (`getPDFStrings`, `normalizePDFLang`) |
| `src/lib/pdf-fonts.ts`                                         | Font registration from `public/fonts/`, with a `?v=` cache buster                |
| `src/lib/pdf-export.tsx`                                       | Download (`exportToPDF`), page counting, filename                                |
| `src/lib/pdf-parser.ts`                                        | Import: embedded metadata first, text parsing fallback                           |
| `src/lib/pdfjs-singleton.ts`                                   | Lazy pdfjs load, worker at `public/pdf.worker.min.mjs`                           |
| `src/pages/preview-page.tsx`                                   | Picks the PDF component and searches for the compact scale that fits one page    |

## Conventions

- No `t()` or React context here: react-pdf renders outside the i18n provider. Section titles and the GDPR text come from `pdf-translations.ts`; add new strings there in both `en` and `pl`, keeping the wording in step with `cv.*` keys in the locale files.
- Every template imports `@/lib/pdf-fonts` and styles through `createStyles(compactScale)`, where `lerp(normal, min, t)` shrinks sizes from 0 (normal) to 1 (most compact). New sizes should go through `lerp` so the one page fit keeps working.
- Colors are literal hex in a local `C` object; the page background stays white.
- Each template embeds `buildResumeMetadata(templateId, data)` in the PDF `creator` field (versioned payload `v: 1`). Import reads that first, so a shape change to `ResumeData` needs the payload handled (bump `v` or keep it compatible).
- The text fallback in `pdf-parser.ts` matches the section headers each template prints. Renaming a header or adding a section means updating the parser and `pdf-parser.test.ts`.
- `@react-pdf/renderer` is heavy: `pdf-export.tsx` and `preview-page.tsx` import it dynamically, and route code splitting keeps the PDF pages in their own chunks. Never import it from shared code the landing page or builder loads eagerly.

## Gotchas

- react-pdf needs WebAssembly and blob frames: the CSP in both `vite.config.ts` and `vercel.json` allows `wasm-unsafe-eval` and `blob:`. Tightening either breaks preview and export in production only.
- Changing a font file requires bumping `v` in `pdf-fonts.ts`, or the PWA cache serves the old one. JetBrains Mono was dropped for Fira Code because of a fontkit incompatibility.

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
