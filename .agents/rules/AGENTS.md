---
trigger: always_on
---

# AGENTS.md

Single-package Next.js 16 App Router browser toolbox. There is no backend and there are no API routes.

**Toolchain:** pnpm only (lockfile v9). CI uses pnpm 9 and Node 22.

## Commands

```bash
pnpm dev # :3000
pnpm lint # tsc --noEmit && eslint .
pnpm build # eslint . && next build (CI build)
pnpm build:local # next build only, skips lint
pnpm test # Vitest watch
pnpm test:run [file-or-pattern] # single run, accepts Vitest filters
pnpm test:coverage
pnpm test:coverage:file <test-filename> # basename match, e.g. string-utils.test.ts
pnpm analyze # bundle analyzer, forces webpack
```

### Verification policy

- CI (`.github/workflows/ci.yml`) runs only `pnpm build` and `pnpm test:run`.
- Prefer targeted `pnpm test:run <file>` while iterating. Do not run full lint or build after every edit.
- When you finish, state which checks you skipped.

### Environment

Copy `env.example` to `.env` if needed.

- `NEXT_PUBLIC_BASE_URL` feeds canonical URLs, OpenGraph, and `sitemap.xml`.
- `NEXT_PUBLIC_GOOGLE_ANALYTICS` and `ALLOWED_DEV_ORIGINS` are optional.

## Lint and Formatting

- **Prettier:** 120 columns, single quotes, semicolons, `es5` trailing commas. ESLint runs Prettier, so `pnpm lint` also checks formatting.
- **ESLint:** `curly: all`, `eqeqeq: always`, no unused imports.
- **Import order:** external, then `@/**`, then relative, with a blank line between groups. Groups and named specifiers are alphabetical.
- **Lodash:** import per method (`import set from 'lodash/set'`). Whole-package imports are rejected.
- **JSON keys under `src/`:** alphabetical. `src/messages/en-US.json` uses flat dotted keys (e.g. `numberConverter.meta.title`), not nested objects.
- **Helpers:** `cn` comes from the `cn` package. `@/lib/utils` holds repo helpers such as `getRoutePrefix` and `exhaustiveCheck`.

## Architecture

### Routes

`src/app/<route>/page.tsx` is a thin async Server Component. It must:

1. Await `searchParams` (it is a Promise).
2. Validate with `validateQueryParams(params, config, ROUTES.X)`, which redirects to canonical defaults when params are missing or invalid.
3. Render the breadcrumb, JSON-LD, and the feature component.
4. Export `generateMetadata()` via `createToolMetadata(ROUTES.X)`.

### Features

- Feature UI, logic, selectors, and stores live in `src/features/<tool>/`, with colocated `__tests__/`.
- `src/features/sample/` is the scaffold. Its store deliberately uses `ROUTES.CASE_CONVERTER` with `@ts-expect-error`. Replace the route and remove the suppression.
- **Unit converters** (length, area, volume, weight, temperature, time, speed, data-size) share `src/features/unit-converter/shared/`:
  - `converter-engine.ts`: affine scale/offset math
  - `base-unit-converter.tsx`
  - `base-unit-selector.tsx`

  Add units there. Do not duplicate conversion math.

### Labs

- Experiments live in `src/experiments/`, gated by persisted `usePreferencesStore` flags, with toggle cards in `src/labs/labs-features.tsx`.
- Never gate `src/features/` behind a Labs flag.

### Framework configuration

- `proxy.ts` is the Next 16 proxy (formerly middleware). It injects `x-url`, `x-origin`, and `x-pathname`. `src/app/layout.tsx` reads `x-pathname` for the page title. **Do not rename it to `middleware.ts`.**
- `next.config.ts` enables React Compiler and Turbopack dev caching. The analyzer requires `--webpack`.

## State and URL Contract

- **Stores:** Zustand stores are module-level singletons. `createBaseConverterStore` assembles the standard slices.
- **Persistence:** persist only non-sensitive settings via `createRoutePersistedStore(route, creator, partializeSettings)`. Never persist inputs, outputs, or errors (ADR-001).
- **Reset:** `reset` clears transient values but preserves settings (units, regex). Color Picker `color` is transient and resets to `DEFAULT_HSL_COLOR` (ADR-002). Feature containers call `useUnmountEffect(reset)`.
- **URL sync:** only keys present in both `SEARCH_PARAM_KEYS` and store state may sync to the URL (`QueryableKeys`). Update URLs with `useBatchUrlSearchParams`.
- **Swap handlers:** converter Swap handlers require the `isSwappingRef` guard (ADR-008). It prevents debounced auto-conversion between the local swap and the async URL update. `data-format-converter.tsx` keeps the `&& !value` variant so explicit actions bypass the guard.

## Adding a Module

All touchpoints are required.

1. Add the route to `ROUTES` in `src/constants/routes.ts`.
2. Add the state type and `StoreStates` entry in `src/types/store/index.ts`.
3. Add the store under `src/features/<tool>/` and a `STORE_CONFIG` entry in `src/store/use-register-stores.ts`.
4. Add the module to `appModules` in `src/constants/app-modules.ts` (feeds the sidebar, Cmd+K palette, dashboard, and sitemap).
5. Add `src/app/<route>/page.tsx`.
6. Add flat keys to `src/messages/en-US.json`, using the `getRoutePrefix(route)` prefix (e.g. `/unit-converter/data-size` becomes `dataSizeConverter`).
7. Add colocated tests.

**Guardrails:** `pnpm lint` enforces `StoreStates` and `STORE_CONFIG` exhaustiveness. `src/constants/__tests__/app-modules.test.ts` catches missing metadata or translations.

## Tests

- **Stack:** Vitest with jsdom.
- **Global mocks** (`src/test-helpers/setup.tsx`): `next/navigation`, `next/link`, `sonner`, `@/i18n/utils`, GA hooks, download/upload hooks, and `AppBreadcrumb`. Mock feature components locally only.
- **Strings:** use `testT` (validates keys against `en-US.json`) instead of literal UI strings.
- **Shared runners:** `describeBaseConverterStore` and `describeUnitConverter` cover standard store and unit behavior.
- **Preferences state:** set Labs flags with `usePreferencesStore.getState().setLabsFlag(...)` instead of replacing the whole `labs` object, so new config keys don't break test setup.
- **Locations:** page tests in `src/app/__tests__/`; feature tests in `src/features/<tool>/__tests__/`.

### Coverage

- Target **100%** coverage everywhere except `src/components/ui`.
- Keep UI primitives in the coverage report (do not add them to `coverage.exclude`), but they are exempt from the target.
- Restore coverage to 100% whenever you touch a covered file.

## Comments

- Write comments only for current behavior, constraints, rationale, or required tooling directives (`// eslint-disable-next-line`, `// @ts-expect-error`).
- Never narrate edits, additions, removals, refactors, or requests (e.g. "updated X", "removed old loop", "added check below", "as requested").
- Remove change-narration comments from files you edit. Preserve meaningful documentation and all other comments; do not delete comments indiscriminately.
- `TODO` and `FIXME` markers are allowed.

## Git

- Do not commit, amend, rebase, or push unless explicitly asked.
- Use Conventional Commits (`feat`, `fix`, `docs`, `refactor`, `style`, `test`, `build`, `perf`, `chore`).
- **Subject:** `type: lowercase imperative summary`. No scope and no trailing period.
  - Do not add `(#PR)`. GitHub's squash-and-merge appends it, and the number is unknown on a feature branch.
  - The only scope exception is Dependabot's `chore(deps)`.
- **Body:** blank line after the subject, then consecutive `-` bullets with no blank lines between them.
  - Bullets are lowercase with no trailing periods.
  - Wrap identifiers, routes, and keys in backticks.
  - Put detail in the body, not in an overlong subject.

## Documentation

| File                  | Purpose                                                                                            |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| `README.md`           | Concise, user-facing                                                                               |
| `ARCHITECTURE.md`     | System design and directory map; short bullets, bold lead-ins, backticked identifiers              |
| `DESIGN-DECISIONS.md` | ADRs; keep the `PR` / `Affected Files` header and `Context` / `Decision` sections, rationale first |

- Read the relevant ADRs before changing stores, URL sync, swap behavior, or unit math. Update them when a decision changes.
- Match the target file's voice and layout: mirror nearby headings, capitalization, punctuation, list density, and formatting.
- Reuse established product terminology (e.g. `Labs`, `Alpha`, `Magic Drop`).
- Keep architecture docs at the flow/component level. Name the responsible module and its behavior, and leave return values, event handlers, and method-level details to code and tests.
- Keep one canonical entry per fact. Cross-link instead of repeating it across README, ARCHITECTURE, and ADRs.
