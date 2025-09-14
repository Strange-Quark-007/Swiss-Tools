# Swiss Tools Architecture

## 📋 Overview

Swiss Tools is a **modular, privacy-first developer toolbox**, where each utility is **self-contained** within a unified system.

- **UI framework:** Built on shadcn/ui primitives with custom wrappers for consistent look and feel.
- **Consistent layout:** `Page Container`, `Flex Container`, `SplitView` maintain UI consistency.
- **State & Memory management:** Each module uses its own Zustand store. Transient data (e.g., input/output values) is cleared on unmount to avoid memory issues, while selected module can opt-in for per-route persistence via `createRoutePersistedStore`.
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

- **Framework:** Next.js 15 (App Router)
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

### App Command & Sidebar

- **AppCommand:** Global keyboard-accessible command palette (`Cmd/Ctrl + K`).
- **AppSidebar:** Collapsible sidebar displaying categorized modules.
- **CategoryList / Category / CategoryItem:** Dynamically render modules, mark selection based on pathname, and integrate icons and tooltips.
- Fully integrated with declarative `appModules.ts` for rendering.

### Common Components

- **TooltipWrapper:** Wraps any element with a tooltip using shadcn/ui `Tooltip`.
- **ButtonWithTooltip:** Combines a button with a tooltip for enhanced user interaction.

### Module Configuration

- Modules defined with `id`, `name`, `icon`, `onSelect`, and optional `shortcut`.
- Organized into categories like Converters and Cyphers.
- Powers sidebar and command palette dynamically.

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

### Converter Panels & Selectors

- Panels: editable (input) or read-only (output).
- Bind selectors to URL parameters.
- Panel actions: copy, upload, clear, download, sample data.
- Selectors: typed configurations, generics for valid option types, dynamic extra UI (e.g., custom input).

### Common Action Components

- **ConverterActions:** convert, swap, reset, auto mode.
- **PanelActions:** copy, upload, clear, download, sample data.

## 🧩 Key Hooks & Utilities

- **`useUrlSearchParams`:** Type-safe access and update of a single URL parameter.
- **`useBatchUrlSearchParams`:** Update multiple URL parameters simultaneously.
- **`validateQueryParams`:** Validate and normalize query parameters using enums and mappings.
- **`createRoutePersistedStore`:** Zustand store with optional per-route persistence.
- **`downloadFile`:** Trigger client-side file download.
- **`useFileUpload`:** Handle file selection, MIME validation, reading content, and user feedback.
- **`useT` / `getT`:** Translation hook and async getter with appName injected.
- **Middleware:** Enriches requests with URL metadata for consistent, route-aware behavior in server components.

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

Each module is **modular and self-contained** and follows a standard folder layout under `src/features/<module>`:

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

## 🧩 Modules

Swiss Tools currently includes the following modules:

1. **Number Converter** - Convert numbers between different bases (binary, decimal, hexadecimal, etc.) with custom base support.
2. **Case Converter** - Transform text between various casing formats (uppercase, lowercase, titlecase, camelCase, etc.).
3. **Data Format Converter** - Convert between popular data formats (JSON, YAML, XML, TOML, CSV, INI).
4. **Encoder/Decoder** - Encode and decode text using various codecs.
5. **Hash Generator** - Generate hashes using different algorithms (MD5, SHA-1, SHA-256, etc.).

## 🧠 Type Safety & Configuration

- Configuration objects exported as `const` for strict type inference.
- Panels use discriminated unions for compile-time correctness.
- Selectors leverage generics for valid option types.
- Query parameters validated via enums (`SEARCH_PARAM_KEYS`, `MIME_TYPE`, `ROUTES`).
- Strong typing applies to hooks, stores, components, and utilities, ensuring consistency.
- Type safety emphasized across app command, sidebar, actions, common components, typography, feature modules, and enums/constants.
