---
trigger: always_on
---

# AGENTS.md

Single-package Next.js 16 App Router developer toolbox. Every tool runs entirely in the browser; there is no backend or API routes. pnpm only (lockfile v9; CI uses pnpm 9 / Node 22).

## Commands

```bash
pnpm install
pnpm dev                                # Next dev server on :3000
pnpm lint                               # tsc --noEmit && eslint .
pnpm build                              # eslint . && next build (this is the CI build)
pnpm build:local                        # next build only, skips lint
pnpm test                               # Vitest watch
pnpm test:run [file-or-pattern]         # single run; accepts Vitest filters
pnpm test:coverage
pnpm test:coverage:file <test-filename> # matches by basename, e.g. string-utils.test.ts
pnpm analyze                            # bundle analyzer, forces webpack
```

CI (`.github/workflows/ci.yml`) runs only `pnpm build` and `pnpm test:run`. Prefer targeted `pnpm test:run <file>` over the full suite, and don't run full lint/build after every edit — say which checks you skipped.

Copy `env.example` to `.env` if needed. `NEXT_PUBLIC_BASE_URL` feeds canonical URLs, OpenGraph, and `sitemap.xml`; `NEXT_PUBLIC_GOOGLE_ANALYTICS` and `ALLOWED_DEV_ORIGINS` are optional.

## Lint / formatting traps

- Prettier: 120 columns, single quotes, semicolons, `es5` trailing commas. It runs through ESLint, so `pnpm lint` is also the format check (no separate format script).
- ESLint: `curly: all`, `eqeqeq: always`, no unused imports. Import groups must be external → `@/**` → relative, blank line between groups, alphabetized; named import specifiers must also be alphabetical.
- Import lodash per method (`import set from 'lodash/set'`); `lodash/import-scope` rejects whole-package imports.
- Every JSON file under `src/` must have alphabetically sorted keys. `src/messages/en-US.json` uses flat dotted keys (`numberConverter.meta.title`), not nested objects.
- `cn` comes from the `cn` package (`import { cn } from 'cn'`). `@/lib/utils` holds repo helpers such as `getRoutePrefix` and `exhaustiveCheck`.

## Architecture

- `src/app/<route>/page.tsx` is a thin async Server Component: `searchParams` is a Promise, params go through `validateQueryParams(params, config, ROUTES.X)` (it redirects to canonical defaults when missing/invalid), then it renders breadcrumb + JSON-LD + the feature component and exports `generateMetadata()` via `createToolMetadata(ROUTES.X)`.
- Feature UI, logic, and stores live in `src/features/<tool>/` (`<tool>.tsx`, `utils.ts`, `<tool>-store.ts`, selectors, `__tests__/`). `src/features/sample/` is the scaffold — its store deliberately uses `ROUTES.CASE_CONVERTER` with a `@ts-expect-error`; replace the route and remove the suppression.
- Unit converters (length, area, volume, weight, temperature, time, speed, data-size) share `src/features/unit-converter/shared/`: `converter-engine.ts` (affine scale/offset math), `base-unit-converter.tsx`, `base-unit-selector.tsx`. Add units there instead of duplicating conversion math.
- Labs experiments live in `src/experiments/`, are gated by persisted `usePreferencesStore` flags, and get their toggle card in `src/labs/labs-features.tsx`. Don't gate anything in `src/features/` behind a Labs flag.
- `proxy.ts` is the Next 16 proxy (formerly middleware). It injects `x-url`/`x-origin`/`x-pathname`, and `src/app/layout.tsx` reads `x-pathname` for the page title. Do not rename it back to `middleware.ts`.
- `next.config.ts` enables React Compiler and Turbopack dev caching; the analyzer needs `--webpack`.

## State and URL contract

- Zustand stores are module-level singletons. Persist only non-sensitive settings through `createRoutePersistedStore(route, creator, partializeSettings)`; never persist inputs, outputs, or errors (ADR-001). `createBaseConverterStore` assembles the standard slices.
- `reset` must clear only transient values and preserve settings (units, regex). The Color Picker's `color` is transient input and resets to `DEFAULT_HSL_COLOR` (ADR-002). Feature containers call `useUnmountEffect(reset)`.
- Only keys that are both in `SEARCH_PARAM_KEYS` and in the store state may sync to the URL (`QueryableKeys`). Update the URL with `useBatchUrlSearchParams`.
- Converter "Swap" handlers need the `isSwappingRef` guard from ADR-008; it prevents the debounced auto-convert from running between the local swap and the async URL update. `data-format-converter.tsx` keeps the `&& !value` variant so explicit actions bypass the guard.

## Adding a module (all touchpoints required)

1. `ROUTES` in `src/constants/routes.ts`.
2. State type and `StoreStates` entry in `src/types/store/index.ts`.
3. Store in `src/features/<tool>/` plus a `STORE_CONFIG` entry in `src/store/use-register-stores.ts`.
4. Item in `appModules` (`src/constants/app-modules.ts`) — this drives sidebar, Cmd+K palette, dashboard, and sitemap.
5. Page at `src/app/<route>/page.tsx`.
6. Flat keys in `src/messages/en-US.json`; the prefix must match `getRoutePrefix(route)` (e.g. `/unit-converter/data-size` → `dataSizeConverter`), and keys stay alphabetical.
7. Colocated tests.

`pnpm lint` enforces the `StoreStates`/`STORE_CONFIG` exhaustiveness; `src/constants/__tests__/app-modules.test.ts` catches missing metadata or translations.

## Tests

- Vitest + jsdom with `src/test-helpers/setup.tsx` globally mocking `next/navigation`, `next/link`, `sonner`, `@/i18n/utils`, GA hooks, download/upload hooks, and `AppBreadcrumb`. Only mock feature components locally.
- Use `testT` (validates keys against `en-US.json`) instead of literal UI strings. `describeBaseConverterStore` and `describeUnitConverter` are parameterized runners for standard store/unit behavior.
- Page tests live in `src/app/__tests__/`; feature tests in `src/features/<tool>/__tests__/`.
- Target 100% coverage for all code outside `src/components/ui`. UI primitives stay in the report (don't add them to `coverage.exclude`) but are exempt from the target; no thresholds are configured, so this is a convention rather than a CI gate.

## Commits

- Follow the existing Conventional Commit style in `git log`: `type: lowercase imperative summary`, no trailing period, and omit scopes (`feat: add ...`, `fix: ...`, `docs: ...`); Dependabot's `chore(deps)` is the only exception. Append `(#PR)` only when a PR number is supplied.
- Use `feat:`, `fix:`, `docs:`, `refactor:`, `style:`, `test:`, `build:`, `perf:`, or `chore:`; put details in a blank-line-separated body of `-` bullets instead of stretching the subject.
- Write body bullets as concise lowercase change descriptions, wrap identifiers, routes, and keys in backticks, and omit trailing periods.

## Docs

- `ARCHITECTURE.md` — system design and directory map.
- `DESIGN-DECISIONS.md` — ADRs; read the relevant ADR before changing stores, URL sync, swap behavior, or unit math, and update it when a decision changes.
- Match the target file's voice and layout: `README.md` is concise and user-facing; `ARCHITECTURE.md` is system-facing with short bullets, bold lead-ins, and backticked identifiers; `DESIGN-DECISIONS.md` keeps the ADR `PR`/`Affected Files` header and `Context`/`Decision` sections with rationale first. Mirror nearby heading levels, capitalization, punctuation, list density, and code formatting, and reuse established product terminology from the UI and `src/messages/en-US.json` (e.g. `Labs`, `Alpha`, `Magic Drop`).
- Keep architecture docs at the flow and component level: name the responsible module and behavior, but leave return values, event handlers, and method-level details to code and tests. Put each fact in its owning document, keep one canonical entry per fact, and cross-link instead of repeating it across README, ARCHITECTURE, and ADRs.
