# Swiss Tools

Swiss Tools is a **modular, privacy-first developer toolbox** designed to provide developers with a set of handy utilities in one place. Each tool is independent but follows consistent UI, state management, and action patterns.

## 🚀 Key Features

- **Modular Tools:** Independent utilities with a consistent interface.
- **Powerful Actions:** Convert, swap, reset, auto-mode, upload, and download.
- **Quick Navigation:** Command palette and collapsible sidebar.
- **Real-Time Feedback:** Notifications via toast messages.
- **Internationalization:** Built with `next-intl` (currently English).

## 🧩 Modules

**Each module is self-contained and follows a consistent interface.**

**Currently includes:**

1. **Number Converter** - Convert numbers between different bases (binary, decimal, hexadecimal, etc.) with custom base support.
2. **Case Converter** - Transform text between various casing formats (uppercase, lowercase, titlecase, camelCase, etc.).
3. **Data Format Converter** - Convert between popular data formats (JSON, YAML, XML, TOML, CSV, INI).
4. **Encoder/Decoder** - Encode and decode text using various codecs.
5. **Hash Generator** - Generate hashes using different algorithms (MD5, SHA-1, SHA-256, etc.).

## 🏗️ Architecture

- Swiss Tools follows a modular architecture where each feature module is self-contained.
- Core components, hooks, constants, and route-persisted stores form the backbone of the system.
- For a detailed breakdown, see [**Architecture**](ARCHITECTURE.md).

## 💻 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI Library:** shadcn/ui primitives + custom core components
- **Styling:** TailwindCSS
- **State Management:** Zustand
- **Forms:** react-hook-form
- **Internationalization:** next-intl
- **Icons:** lucide-react
- **Theme Support:** next-themes
- **Notifications:** sonner

## 📂 Project Structure

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

## ⚙️ Getting Started

### Installation & Development

```bash
# Clone the repository
git clone <repo-url>
cd swiss-tools

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open [http://localhost:3000](http://localhost:3000) to view the app.
```

### Build & Production

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Additional Scripts

```bash
# Run ESLint
pnpm lint

# Build with bundle analyzer
pnpm analyze
```
