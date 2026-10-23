# Swiss Tools Architecture Decision Records (ADRs)

This document records the **Architecture Decision Records (ADRs)** made throughout the evolution of **Swiss Tools**, including design rationale, constraints, trade-offs, and rejected alternatives.

For a detailed overview, including project structure, module architecture, hooks, state management, routing, and SEO, see [**ARCHITECTURE.md**](./ARCHITECTURE.md).

Entries are ordered in strict chronological sequence by GitHub Pull Request.

---

## Core Design Principles

The decisions in this document build upon the foundational architectural rules governing Swiss Tools:

- **Two-Tier State Contract & Zero-Server Processing:** All transformations, encodings, and calculations execute purely client-side in the browser (zero backend API endpoints). Non-sensitive user preferences (e.g. `auto`, `from`, `to`) persist to `localStorage` via explicit whitelist filtering (`partializeSettings`). User calculation inputs, outputs, payloads, and errors remain strictly in-memory and are never written to disk or sent to a server.
- **Module-Scoped Store Singletons:** Zustand stores exist as module-level singletons outside React's component tree. Navigating between routes does not destroy or reset store instances automatically.
- **URL as Server-Validated State Channel:** Tool routes support shareable deep links. Route parameters are validated server-side in Next.js Server Components before rendering and bidirectionally mirrored with client Zustand stores.
- **Single Source of Truth Module Catalog (`appModules`):** Application metadata is structured data, not scattered JSX. A single translation-injected catalog function `appModules(t)` serves as the sole source of truth powering the Sidebar category tree, `Cmd+K` command search palette, Dashboard card grid, and dynamic sitemap route generation.

---

## Table of Decisions

- [**ADR-001**](#adr-001-whitelist-based-localstorage-persistence-partializesettings-for-privacy) — Whitelist-based LocalStorage Persistence (`partializeSettings`) for Privacy
- [**ADR-002**](#adr-002-explicit-per-component-ephemeral-reset-via-useunmounteffect) — Explicit Per-Component Ephemeral Reset via `useUnmountEffect`
- [**ADR-003**](#adr-003-bidirectional-server-validated-url-to-store-synchronization-via-queryablekeyst) — Bidirectional Server-Validated URL-to-Store Synchronization via `QueryableKeys<T>`
- [**ADR-004**](#adr-004-exclusion-of-high-frequency-color-picker-interactions-from-url-query-parameter-synchronization) — Exclusion of High-Frequency Color Picker Interactions from URL Query Parameter Synchronization
- [**ADR-005**](#adr-005-modular-per-feature-stores-over-a-monolithic-central-store) — Modular Per-Feature Stores over a Monolithic Central Store
- [**ADR-006**](#adr-006-strictly-typed-config-driven-store-registration-store_config-and-validroutes) — Strictly Typed Config-Driven Store Registration (`STORE_CONFIG` and `ValidRoutes`)
- [**ADR-007**](#adr-007-unified-affine-transformation-engine-for-physical-unit-converters) — Unified Affine Transformation Engine for Physical Unit Converters
- [**ADR-008**](#adr-008-isswappingref-guard-against-swap-race-conditions) — `isSwappingRef` Guard against Swap Race Conditions
- [**ADR-009**](#adr-009-configurable-data-retention-modes-strict-privacy-vs-session-memory) — Configurable Data Retention Modes (`STRICT` vs. `SESSION`)

---

## ADR-001: Whitelist-based LocalStorage Persistence (`partializeSettings`) for Privacy

- **PR:** [PR #19](https://github.com/Strange-Quark-007/Swiss-Tools/pull/19)
- **Affected Files:** `src/store/store-factory.ts`, `src/features/*/*-store.ts`

### Context

By default, Zustand's `persist` middleware serializes the entire store into browser `localStorage`. For tools where users paste sensitive inputs (JWTs, private keys, hashes, internal database payloads), saving raw data to unencrypted local disk compromises user privacy.

### Decision

Never persist data payloads. Every route store passes an explicit `partializeSettings` function to `createRoutePersistedStore` that whitelists only non-sensitive configuration keys (e.g. `auto`, `from`, `to`):

```ts
const partializeSettings = (state: SpeedConverterState) => ({
  auto: state.auto,
  from: state.from,
  to: state.to,
});
```

Input/output fields (`fromValue`, `toValue`, `toError`) are excluded from storage and remain strictly in-memory.

---

## ADR-002: Explicit Per-Component Ephemeral Reset via `useUnmountEffect`

- **PR:** [PR #27](https://github.com/Strange-Quark-007/Swiss-Tools/pull/27)
- **Affected Files:** `src/features/*/*.tsx`, `src/store/slices.ts`

### Context

Zustand stores are module-scoped singletons that exist outside React's component tree lifecycle. When navigating away from a tool, non-persisted in-memory state (error messages, stale calculation outputs, ephemeral inputs) remains in the store.

### Decision

Feature container components explicitly invoke `useUnmountEffect(reset)` on unmount:

```tsx
useUnmountEffect(reset);
```

Each store provides a standardized `reset` action (via `createResetSlice` or store creator) that resets transient calculation values back to their initial state without touching persisted user preferences.

> **Universal `reset` Contract:** `reset` is strictly bounded to clearing transient calculation inputs, outputs, and errors. It preserves user-configured settings (e.g. selected units, custom bases in `number-converter-store.ts`, and regex pattern/flags in `regex-tester-store.ts`). The Color Picker's selected color is treated as ephemeral input rather than a persisted setting, so `reset` restores `DEFAULT_HSL_COLOR`; ADR-009 controls whether unmount resets run.

> **Update (ADR-009):** In addition to the default per-component reset mechanism, Swiss Tools now supports configurable retention modes via `DATA_RETENTION_MODE`. When set to `SESSION`, `useUnmountEffect` conditionally suppresses ephemeral resets during client-side navigation, retaining active in-memory state until a page reload, tab close, or transition back to `STRICT` mode. See [ADR-009](#adr-009-configurable-data-retention-modes-strict-privacy-vs-session-memory) for details.

---

## ADR-003: Bidirectional Server-Validated URL-to-Store Synchronization via `QueryableKeys<T>`

- **PR:** [PR #29](https://github.com/Strange-Quark-007/Swiss-Tools/pull/29)
- **Affected Files:** `src/app/**/page.tsx`, `src/lib/validate-params.ts`, `src/types/store/index.ts`, `src/constants/common.ts`

### Context

Converter tools require shareable, bookmarkable deep links (e.g. `?from=bin&to=hex` or `?codec=base64&mode=encode`). However, allowing arbitrary query parameters directly into client stores creates two major risks:

1. Malformed or invalid parameters (e.g., non-existent units or invalid base formats) can crash conversion logic or cause hydration mismatches.
2. Internal state actions, methods, and sensitive calculation payloads might be accidentally bound to or leaked through the URL.

### Decision

Implement a **three-stage runtime synchronization pipeline** governed by **compile-time type safety**:

#### The 3 Runtime Synchronization Stages

1. **Server-Side Parameter Validation (`page.tsx`):**
   Next.js Server Components intercept incoming search parameters and run `validateQueryParams(params, config, ROUTE)`. Malformed, unsupported, or missing parameters trigger an immediate server redirect (`redirect()`) to the canonical URL with safe default parameters _before_ any client code renders:

   ```tsx
   // src/app/number-converter/page.tsx (Server Component)
   export default async function NumberConverterPage({ searchParams }: PageProps) {
     const params = await searchParams;
     const { from, to } = validateQueryParams(params, config, ROUTES.NUMBER_CONVERTER);
     return <NumberConverter from={from} to={to} />;
   }
   ```

2. **Prop-to-Store Hydration (`useEffect`):**
   Client components receive validated props and sync them into their corresponding Zustand store:

   ```tsx
   useEffect(() => {
     setFrom(from);
     setTo(to);
   }, [from, to, setFrom, setTo]);
   ```

3. **Store-to-URL Mirroring (`batchSetSearchParams`):**
   When users select new units or click "Swap", the client component updates the URL parameters asynchronously via `batchSetSearchParams`.

#### Type-Safe Parameter Whitelist (`QueryableKeys<T>`)

To strictly constrain which store keys may synchronize with URL parameters, allowable keys are enforced at compile time using TypeScript:

```ts
export type QueryableKeys<T> = Extract<keyof T, `${SEARCH_PARAM_KEYS}`>;
```

Only keys that exist on state `T` **and** match the canonical `SEARCH_PARAM_KEYS` enum (such as `from`, `to`, `codec`, `mode`) can ever participate in URL synchronization, preventing actions, internal flags, or data payloads from touching the URL.

> **Architectural Note:** This bidirectional sync mechanism—where local store state updates immediately but Next.js router URL updates resolve asynchronously over multiple render frames—is the exact timing tension that introduced the swap race condition resolved in [**ADR-008**](#adr-008-isswappingref-guard-against-swap-race-conditions).

---

## ADR-004: Exclusion of High-Frequency Color Picker Interactions from URL Query Parameter Synchronization

- **PR:** [PR #96](https://github.com/Strange-Quark-007/Swiss-Tools/pull/96)
- **Affected Files:** `src/features/color-picker/color-picker.tsx`, `src/features/color-picker/color-picker-store.ts`, `src/store/use-register-stores.ts`

### Context

While `ADR-003` synchronizes discrete form selections (e.g. units, codecs) to URL search parameters, dragging a 2D color canvas and hue slider emits continuous high-frequency updates. Debounced router updates (`router.replace`) during active drag gestures trigger Next.js route transitions and abort pointer capture, causing browser drag-selection glitches.

### Decision

Exclude the Color Picker from URL query parameter synchronization. In `src/store/use-register-stores.ts`, Color Picker is registered with `params` omitted (defaulting to `[]` via `registerRouteStore`):

```ts
[ROUTES.COLOR_PICKER]: {
  store: useColorPickerStore,
},
```

Color state updates synchronously in-memory within the Zustand store (`useColorPickerStore`), keeping drag gestures fluid without router updates. Retention across navigation follows ADR-002's reset contract and the active mode in ADR-009.

---

## ADR-005: Modular Per-Feature Stores over a Monolithic Central Store

- **PR:** [PR #106](https://github.com/Strange-Quark-007/Swiss-Tools/pull/106)
- **Affected Files:** `src/features/*/*-store.ts`, `src/store/slices.ts`, `src/store/store-factory.ts`

### Context

As tools expanded to 20+, keeping state in a central location disconnected state definitions from the features that actually used them and led to bloated store files.

### Decision

Enforce a **one-store-per-module** architecture colocated inside each feature folder (`src/features/<feature>/<feature>-store.ts`).

To prevent duplication across similar converter tools, common store behaviors are broken into reusable composable slices in `src/store/slices.ts` (`createAutoSlice`, `createFromSlice`, `createToSlice`, `createInputSlice`, `createOutputSlice`, `createResetSlice`) and assembled via `createBaseConverterStore`.

---

## ADR-006: Strictly Typed Config-Driven Store Registration (`STORE_CONFIG` and `ValidRoutes`)

- **PR:** [PR #126](https://github.com/Strange-Quark-007/Swiss-Tools/pull/126)
- **Affected Files:** `src/store/use-register-stores.ts`, `src/types/store/index.ts`

### Context

Originally, stores registered themselves with the centralized registry via individual imperative `registerRouteStore(...)` calls. If a new route and store were created but not registered, URL query parameter synchronization would silently fail at runtime with zero compiler feedback.

Furthermore, declaring all tool state shapes centrally would violate feature encapsulation, while having no central index made compile-time exhaustiveness checking impossible.

### Decision

Migrate to a declarative, exhaustively typed `STORE_CONFIG` object backed by an inverted `StoreStates` mapping where feature stores own and export their own types:

```ts
// src/types/store/index.ts — central mapping importing feature-owned states
export interface StoreStates {
  [ROUTES.NUMBER_CONVERTER]: NumberConverterState;
  [ROUTES.SPEED_CONVERTER]: SpeedConverterState;
  // ...
}

// src/store/use-register-stores.ts — compile-time exhaustiveness check
type ValidRoutes = { [R in keyof StoreStates]: StoreStates[R] extends undefined ? never : R }[keyof StoreStates];

type StoreConfig = {
  [R in ValidRoutes]: {
    store: StoreApi<StoreStates[R]>;
    params?: QueryableKeys<StoreStates[R]>[];
  };
};

const STORE_CONFIG: StoreConfig = { ... };
```

`ValidRoutes` extracts all routes from `StoreStates` that have an associated store state. TypeScript enforces that every route with a store must be declared in `STORE_CONFIG`, guaranteeing zero silent registration omissions at compile time without breaking feature store encapsulation.

> **Trade-off:** Adding a new tool touches several explicit touchpoints by design: `ROUTES`, `StoreStates`, `STORE_CONFIG`, `src/constants/app-modules.ts`, `src/app/<route>/page.tsx`, and `src/messages/en-US.json`. While this involves explicit declarations across files, the compiler strictly enforces store exhaustiveness (missing `StoreStates` or `STORE_CONFIG` entries fail the build), while `app-modules.test.ts` and the `src/features/sample/` scaffold ensure complete metadata and localization consistency.

---

## ADR-007: Unified Affine Transformation Engine for Physical Unit Converters

- **PR:** [PR #137](https://github.com/Strange-Quark-007/Swiss-Tools/pull/137)
- **Affected Files:** `src/features/unit-converter/shared/converter-engine.ts`, `src/features/unit-converter/*/*`

### Context

Linear unit conversions (length, speed, area, data size) obey simple scaling ($y = k \cdot x$), but temperature conversions involve an affine offset ($y = a \cdot x + b$, e.g. Celsius to Fahrenheit). Maintaining separate conversion routines across 8 converter tools resulted in duplicate math, validation, and precision formatting logic.

### Decision

Unify all unit converters under a single generalized **affine transformation engine** in `converter-engine.ts`:

```ts
export interface UnitConversionConfig {
  scale: number;
  offset?: number;
}

export const convertUnitValue = (
  value: number,
  fromConfig: UnitConversionConfig,
  toConfig: UnitConversionConfig
): number => {
  const fromOffset = fromConfig.offset ?? 0;
  const toOffset = toConfig.offset ?? 0;

  const baseValue = (value + fromOffset) * fromConfig.scale;
  const converted = baseValue / toConfig.scale - toOffset;

  return Math.abs(converted) < 1e-12 ? 0 : converted;
};
```

For linear units, `offset` defaults to `0`. For affine units (temperature), `offset` normalizes the value to and from the SI base unit (Kelvin).

---

## ADR-008: `isSwappingRef` Guard against Swap Race Conditions

- **PR:** [PR #150](https://github.com/Strange-Quark-007/Swiss-Tools/pull/150)
- **Affected Files:**
  - `src/features/number-converter/number-converter.tsx`
  - `src/features/unit-converter/shared/base-unit-converter.tsx`
  - `src/features/data-format-converter/data-format-converter.tsx`
  - `src/features/case-converter/case-converter.tsx`
  - `src/features/encoder-decoder/encoder-decoder.tsx`
  - `src/features/timestamp-converter/timestamp-converter.tsx`
  - `src/features/sample/sample-converter.tsx`
  - `src/components/app-converter/converter-actions.tsx`

### Context

In converter tools, clicking "Swap" exchanges inputs and outputs (`fromValue` $\leftrightarrow$ `toValue`, `from` $\leftrightarrow$ `to`, and URL search params via `batchSetSearchParams`).

When swapping, Next.js updates URL parameters asynchronously over multiple render ticks. Because `ConverterActions` also runs `onSwap` in `startTransition`, local input/output state swaps immediately, but the URL and unit selectors lag behind by a frame or two.

Meanwhile, converters automatically run a debounced conversion on every change:

```tsx
useDebouncedEffect({ auto }, handleConvert, [fromValue, from, to, ...]);
```

Without a guard, the debounced converter triggers mid-swap: it sees the new input value (which is previous output $B$), but the formats or units haven't finished flipping yet. Attempting to parse data $B$ using the old rules of format $A$ results in immediate parsing errors (e.g. invalid syntax, wrong base digits) or corrupted outputs.

### Decision

Use a mutable `isSwappingRef` guard via `useRef(false)`:

```tsx
const isSwappingRef = useRef(false);

const handleConvert = useCallback(() => {
  if (isSwappingRef.current) {
    isSwappingRef.current = false;
    return;
  }
  // ... perform conversion
}, [...]);

const handleSwap = () => {
  isSwappingRef.current = true;
  batchSetSearchParams({ [SEARCH_PARAM_KEYS.FROM]: to, [SEARCH_PARAM_KEYS.TO]: from });
  setFromValue(toValue);
  setToValue(fromValue);
  // ...
};
```

When a swap initiates, `isSwappingRef.current = true`. When the debounced conversion effect fires due to the swapped values, it hits the guard, resets it to `false`, and immediately aborts execution. The swapped values already represent a valid conversion pair and do not require re-computation.

### Why not cancel the debounce timer instead?

Canceling the timer is insufficient because Next.js router search parameter updates trigger _new_ render passes that re-arm the debounce timer after the swap handler has already finished executing. The mutable ref flag guarantees whichever render tick runs the debounced conversion will be safely intercepted.

#### Variant: Explicit Action Bypass in `data-format-converter.tsx`

In `data-format-converter.tsx`, the guard condition is refined to:

```tsx
if (isSwappingRef.current && !value) {
  isSwappingRef.current = false;
  return;
}
```

Explicit user actions like clicking "Minify" or "Pretty" invoke `convert(toValue, mode)` with a defined string `value`. The `!value` check ensures deliberate user commands immediately bypass the swap guard and execute rather than being swallowed by an in-flight swap flag.

---

## ADR-009: Configurable Data Retention Modes (`STRICT` vs. `SESSION`)

- **PR:** Pending
- **Affected Files:** `src/constants/common.ts`, `src/hooks/use-unmount-effect.ts`, `src/store/preferences-store.ts`, `src/store/store-registry.ts`, `src/preferences/data-retention-preferences.tsx`

### Context

Under ADR-002, tools unconditionally clear ephemeral inputs and outputs on unmount. While optimal for strict privacy, navigating between tools erases working inputs and results during multi-tool workflows.

### Decision

Introduce a user-configurable data retention preference (`DATA_RETENTION_MODE`):

1. **`STRICT` (Default):** Retains ADR-002 behavior. Navigating away immediately clears ephemeral inputs, outputs, and errors.
2. **`SESSION`:** Suppresses unmount resets. In-memory Zustand state singletons remain active across client-side route transitions until a page reload, tab close, or switch back to `STRICT`.

`useUnmountEffect` checks the active retention mode before invoking `reset()`:

```tsx
export const useUnmountEffect = (callback: () => void) => {
  // ...
  useEffect(() => {
    return () => {
      if (usePreferencesStore.getState().dataRetentionMode === DATA_RETENTION_MODE.STRICT) {
        callbackRef.current();
      }
    };
  }, []);
};
```

When transitioning from `SESSION` back to `STRICT`, the Preferences UI prompts for user confirmation before executing `resetAllRegisteredStores()` to purge in-memory state across all registered tools.
