# Swiss Tools Architecture

## 📋 Overview

Swiss Tools is a **modular, privacy-first developer toolbox**, where each utility is **self-contained** within a unified system.

- **UI framework:** Built on shadcn/ui primitives with custom wrappers for consistent look and feel.
- **Consistent layout:** `Page Container`, `Flex Container`, `SplitView` maintain UI consistency.
- **State & Memory management:** Each module uses its own Zustand store. Transient data (e.g., input/output values) is cleared on unmount to prevent memory issues. For persistence, modules can use `createPersistedStore`, or `createRoutePersistedStore` for per-route persistence (using the route key as a unique identifier).
- **Centralized Store Registry:** Centralized, declarative, type-safe registry for all module stores.
- **Module registry:** `appModules.ts` defines modules and drives both the sidebar and command palette.
- **Typed configuration:** Objects like `BASES`, `DATA_FORMATS`, `CODECS`, `HASHING_ALGOS` define valid module options.
- **Enums & Constants:** `SEARCH_PARAM_KEYS`, `MIME_TYPE`, `ROUTES` enforce consistent key, file type, and route usage; stored under `constants/common.ts` and `constants/routes.ts`.
- **Shared action patterns:** `ConverterActions` and `PanelActions` provide standard behavior across modules.
- **Typography:** Core typography components (`Text`, `Heading`, `Paragraph`) ensure consistent text styling across modules.
- **Organized types:** All type definitions are structured under `types/` with folders for panels, actions, and module configurations.
- **Internationalization:** Built with `next-intl` for multi-language support, with translation utilities in `i18n/` and message files in `messages/`.
- **Middleware:** Lightweight Next.js middleware layer for injecting request metadata.

## 💻 Tech Stack

Swiss Tools is built with a modern web stack:

- **Framework:** Next.js 16 (App Router)
- **UI Library:** shadcn/ui primitives with custom components
- **Styling:** TailwindCSS
- **State Management:** Zustand
- **Form Handling:** react-hook-form
- **i18n:** next-intl
- **Icons:** lucide-react
- **Theme Support:** next-themes
- **Notifications:** sonner

## 🧩 Core Components

### UI Layer

- Based on shadcn/ui primitives with custom wrappers for unified behavior.

### Typography

- **Text:** Flexible text component with variants (`inlineCode`, `lead`, `large`, `base`, `small`) and optional muted styling.
- **Heading:** Supports levels 1–4 with consistent styling and optional muted color.
- **Paragraph:** Standard and blockquote styles for structured text.

### Common Components

- **TooltipWrapper:** Wraps any element with a tooltip using shadcn/ui `Tooltip`.
- **ButtonWithTooltip:** Combines a button with a tooltip for enhanced user interaction.
- **BaseTextarea:** A simple wrapper over `shadcn's Textarea` to standardize style.

### App Command & Sidebar

- **AppCommand:** Global keyboard-accessible command palette (`Cmd/Ctrl + K`).
- **AppSidebar:** Collapsible sidebar displaying categorized modules.
- **CategoryList / Category / CategoryItem:** Dynamically render modules, mark selection based on pathname, and integrate icons and tooltips.
- Fully integrated with declarative `appModules.ts` for rendering.

### App Module Configuration

- Modules are structured as an array of **module groups**, where each group contains a `label` and an array of module `items`.
- Each `module item` includes:
  - `id` — unique identifier from the `ROUTES` enum, used for routing and store management.
  - `name` — localized display name.
  - `description` — localized description.
  - `icon` — React component used for UI representation.
  - `shortcut` — optional keyboard shortcut for quick access.
- This hierarchical structure allows **dynamic generation** of the sidebar, command palette, and dashboard module list.
- A dedicated `staticModule` function provides standalone modules e.g., `dashboard`.

- example module

  ```json
  {
    label: t('label.converters'),
    items: [
      {
        id: ROUTES.NUMBER_CONVERTER,
        name: t('numberConverter.name'),
        description: t('numberConverter.description'),
        icon: Binary,
      },
    ],
  }
  ```

- > List of all Module metadata, including names, descriptions, icons, and routing, is maintained in [`appModules.ts`](/src/constants/appModules.ts) as the single source of truth.

### URL & Route State

- **`useUrlSearchParams`:** Typed access and update for single URL parameter.
- **`useBatchUrlSearchParams`:** Batch updates for multiple URL parameters.
- **`validateQueryParams`:** Validates and normalizes search parameters based on config.

### Page Components

- Located at `app/<module>/page.tsx`.
- Normalize and validate URL parameters.
- Set breadcrumbs and render main module component.

### Feature Components

- Rendered via `SplitView` with central and panel actions.
- Central actions: convert, swap, reset, auto.
- Panel actions: copy, upload, clear, download, sample data.

### State & Memory Management

- Each module maintains its own **Zustand store** for isolated state.
- **_Transient data_** (e.g., input/output values) is cleared manually on **_unmount_** using `useUnmountEffect` to prevent memory issues.
- Modules can opt-in to **_persist selected state_** across routes using `createRoutePersistedStore` factory.

### Centralized Store Registry

- Centralized, **declarative**, **type-safe** store registry for all module stores.
- Manage module state and specify which state keys are used as **query/search parameters** during navigation.
- Register module store to central regitry with `registerRouteStore(route, store, params)`.
- Retrieve stores dynamically via `getRouteStore(route)`.
- `params` Optional array of `SEARCH_PARAM_KEYS` present in the store state that should be synced to the URL for navigation.
- Only keys whose names match the values in SEARCH_PARAM_KEYS and exist in the store state are allowed.

### Converter Panels & Selectors

- Panels: editable (input) or read-only (output).
- Bind selectors to URL parameters.
- Panel actions: copy, upload, clear, download, sample data.
- Selectors: typed configurations, generics for valid option types, dynamic extra UI (e.g., custom input).

### Common Action Components

- **ConverterActions:** convert, swap, reset, auto mode.
- **PanelActions:** copy, upload, clear, download, sample data.

## 🧩 Key Hooks & Utilities

- **`useDebounceEffect`:** Runs a callback on dependency change with debouncing, e.g., for auto convert.
- **`useUnmountEffect:`** Executes a callback function when a component unmounts, e.g., to reset ephemeral data.
- **`useUrlSearchParams`:** Type-safe access and update of a single URL parameter.
- **`useBatchUrlSearchParams`:** Update multiple URL parameters simultaneously.
- **`validateQueryParams`:** Validate and normalize query parameters using enums and mappings.
- **`createPersistedStore`:** Utility to create a Zustand store with persistence in localStorage.
- **`createRoutePersistedStore`:** Wrapper around `createPersistedStore` that uses `ROUTES` as the key.
- **`registerRouteStore`:** register a module store with optional params to sync with query/search parameters.
- **`useRegisterStores`:** Registers individual stores in memory on app load
- **`useModuleNavigation`:** Navigates to a module route, dynamically syncing store values to URL query parameters.
- **`getRouteStore`:** Retrieve a registered store dynamically by route.
- **`downloadFile`:** Trigger client-side file download.
- **`useFileUpload`:** Handle file selection, MIME validation, reading content, and user feedback.
- **`useT` / `getT`:** Translation hooks and async getter with rich text support and appName injected.
- **`Proxy:`** Enriches requests with URL metadata for consistent, route-aware behavior in server components.
- **`StringUtils`:** Utility class for string normalization, parsing, and transformations, including sanitization.

## 🗂 Project Structure

```
src/
├─ app/                 # Next.js app router pages and layouts
├─ components/          # Core UI, typography, common components
│  ├─ app-converter/    # Converter-specific components
│  ├─ app-layout/       # Layout components (sidebar, command palette, etc.)
│  ├─ common/           # Shared UI components
│  └─ ui/               # shadcn/ui primitive components
├─ constants/           # Module configuration, routes, and enums
├─ features/            # Self-contained modules (see "Modules")
├─ hooks/               # Reusable hooks (URL params, file upload, etc.)
├─ i18n/                # Internationalization utilities (getT/useT)
├─ lib/                 # Utility functions and helpers
├─ messages/            # Translation files (en-US currently)
├─ store/               # Global state and route-persisted store factory
└─ types/               # Centralized type definitions
```

## 🗂 Module Structure

Swiss Tools is built around a growing collection of `independent`, `self-contained` modules, each following consistent `architecture`, `state pattern`, and `UI design`.

Each module follows a standard folder layout under `src/features/<module>`:

```
src/features/<module>/
  ├─ <module>.tsx           # Main feature component
  ├─ <module>-selector.tsx  # Module-specific selectors
  ├─ utils.ts               # Module-specific utilities
  ├─ <module>-store.ts      # Zustand store for module state
  └─ *.tsx                  # Additional module-specific components
```

- **`<module>.tsx`:** Main feature component rendering panels, actions, and selectors.
- **`<module>-selector.tsx`:** Handles dynamic selection tied to URL parameters.
- **`utils.ts`:** Pure functions, validators, converters.
- **`<module>-store.ts`:** Module-specific state management, with optional persistence for module settings.
- **`*.tsx`:** Extra components unique to the module.

## 🧠 Type Safety & Configuration

- Configuration objects exported as `const` for strict type inference.
- Panels use discriminated unions for compile-time correctness.
- Selectors leverage generics for valid option types.
- Query parameters validated via enums (`SEARCH_PARAM_KEYS`, `MIME_TYPE`, `ROUTES`).
- Strong typing applies to hooks, stores, components, and utilities, ensuring consistency.
- Type safety emphasized across app command, sidebar, actions, common components, typography, feature modules, and enums/constants.
