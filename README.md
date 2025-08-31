# Swiss Army Tank - Dev Tools

A browser-based, modular, and privacy-first toolbox that offers a suite of fast, lightweight utilities. The app is built to help developers with tools ranging from number conversions to data manipulation, and everything in between. It's designed to be responsive, cross-platform, and entirely privacy-respecting with no tracking or ads.

## Features

- **Modular Architecture**: Add or remove tools dynamically, keeping your workspace streamlined. Each utility (e.g., number conversion, data processing) is self-contained and easily extendable.
- **Customizable Sidebar**: Easily organize tools by categories like "Developer Tools" or "Designer Tools." Sidebar modules can be pinned or customized by the user.
- **Privacy-First**: No tracking, no login required. Data stays local and only what's necessary is processed.
- **Cross-Platform**: Fully functional on both desktop and mobile browsers.
- **SEO-Friendly**: With dynamic routing and handling of query parameters, the app supports SEO and social sharing.
- **Number Conversion**: Binary, Octal, Decimal, Hexadecimal, and Custom bases (2–36). Supports bulk input via comma or newline.
- **Text Case Conversion**: Lowercase, UPPERCASE, Title Case, camelCase, snake_case, and more. Supports bulk input via newline.
- **Data Format Conversion**: Convert between JSON, YAML, TOML, XML, CSV, and INI with validation and helpful error messages.
- **Encoder / Decoder**: Base2, Base8, Base16 (Hex), Base32, Base58, Base62, Base64, ASCII85, Base91, Base128, URL, HTML entities. Note: Base128 may produce non-printable characters.
- **Command Palette**: Quick navigation and actions with a keyboard shortcut.
- **Theming**: Light/Dark themes with system preference support.
- **Internationalization (i18n)**: Localized text and metadata (default locale: en-US).

## Key Components

1. **Sidebar**: Houses the list of tools, categorized and grouped for easy access.
2. **Dashboard**: A list of all tools available for quick access. Users can pick tools to pin to the sidebar.
3. **Current Tool**: The active tool displayed when selected, with a button to add it to the sidebar for quick access.
4. **Theme Toggle**: The user can switch between light/dark modes, with the current theme saved locally.
5. **App Navbar**: Displays the dynamic page title, search button (command palette), and theme toggle.
6. **Command Palette**: Global quick search/action interface (⌘ K) for navigation and actions.
7. **Breadcrumb & Page Container**: Consistent content layout with navigation context.
8. **Middleware**: Adds headers (x-url, x-origin, x-pathname) to support dynamic metadata and titles.
9. **State Store**: Lightweight global state using Zustand (e.g., navbar title).

---

## Routes

- `/number-conversion`
- `/case-conversion`
- `/data-format-conversion`
- `/encoder-decoder`

These are defined in `src/constants/routes.ts` and surfaced in the sidebar via `src/constants/appModules.ts`.

### URL Parameters

- **Shared keys** (see `src/constants/common.ts`):
  - `from`, `to` — conversion endpoints (number/text/data)
  - `codec`, `mode` — encoder/decoder
- **Canonicalization** (see `src/lib/validate-params.ts`):
  - `validateParams(...)` redirects to canonical `from/to` if invalid or missing.
  - `validateEncoderParams(...)` redirects to canonical `codec/mode` if invalid or missing.

Examples:

- `/number-conversion?from=decimal&to=hex`
- `/case-conversion?from=lowercase&to=snakecase`
- `/data-format-conversion?from=json&to=yaml`
- `/encoder-decoder?codec=base64&mode=encode`

### Data Format Constraints

- **CSV**: Expects an array of flat objects (no nested arrays/objects).
- **INI**: Flat key-value or arrays of primitives; no nested objects.
- **TOML**: Root must be an object with string keys (no primitive/array root).
- **XML**: Root must be an object; builder preserves attributes.

Friendly error messages are defined in `src/messages/en-US.json`.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **UI**: Radix UI primitives, lucide-react icons, sonner toasts, cmdk command palette
- **State**: Zustand
- **Forms/Validation**: react-hook-form, zod
- **i18n**: next-intl (default locale `en-US`)
- **Utilities**: lodash, buffer, fast-xml-parser, @iarna/toml, yaml, csv, ini, base-x, hi-base32, ascii85, node-base91

---

## Development

Requirements: Node.js 18+

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Start development server:
   ```bash
   pnpm dev
   ```
3. Build for production:
   ```bash
   pnpm build
   ```
4. Start production server:
   ```bash
   pnpm start
   ```

Additional scripts:

- `pnpm lint` — Run ESLint

---

## Project Structure (key paths)

- `src/app/*` — App Router pages and layout
- `src/features/*` — Feature modules (number-conversion, case-conversion, data-format-conversion, encoder-decoder)
- `src/components/*` — UI components (layout, sidebar, ui primitives, typography, providers)
- `src/constants/*` — Common constants, routes, app modules
- `src/i18n/*` — i18n helpers (`useT`, `getT`), request config, messages
- `src/lib/*` — Utilities (e.g., URL param validation)
- `src/store/*` — Zustand store

---

## Notes

- Titles and descriptions are localized via next-intl and resolved per-route.
- Sidebar is modular—add tools by extending `appModules` and creating a page under `src/app/<tool>/page.tsx`.
- Some encodings (e.g., Base128) can produce non-printable characters; use with caution.
