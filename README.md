# Swiss Tools

Swiss Tools is a **modular, privacy-first developer toolbox** designed to provide developers with a set of handy utilities in one place. Each tool is independent but follows consistent UI, state management, and action patterns.

## 🚀 Key Features

- **Modular Tools:** Independent utilities with a consistent interface.
- **Powerful Actions:** Convert, swap, reset, auto-mode, upload, and download.
- **Quick Navigation:** Command palette and collapsible sidebar.
- **Real-Time Feedback:** Notifications via toast messages.
- **Internationalization:** Built with `next-intl` (currently English).

## 🧩 Modules

Swiss Tools is built around a growing collection of **independent, self-contained** modules, each following consistent **architecture, state pattern, and UI design**.

👉 For list of modules see [**App Modules**](/src/constants/appModules.ts).

## 🏗️ Architecture

- Swiss Tools follows a modular architecture where each feature module is self-contained.
- Core components, hooks, constants, and route-persisted stores form the backbone of the system.
- For a detailed breakdown, see [**Architecture**](ARCHITECTURE.md).

## 💻 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI Library:** shadcn/ui primitives + custom core components
- **Styling:** TailwindCSS
- **State Management:** Zustand
- **Forms:** react-hook-form
- **Internationalization:** next-intl
- **Icons:** lucide-react
- **Theme Support:** next-themes
- **Notifications:** sonner

## 📂 Project Structure

```t
src/
├─ app/                 # Next.js app router pages and layouts
├─ components/          # Core UI, typography, common components
│  ├─ app-converter/    # Converter-specific components
│  ├─ app-layout/       # Layout components (sidebar, command palette, etc.)
│  ├─ common/           # Shared UI components
│  └─ ui/               # shadcn/ui primitive components
├─ constants/           # Module configuration, routes, and enums
├─ dashboard/           # Components for dashboard page
├─ features/            # Self-contained modules (see "Modules")
├─ hooks/               # Reusable hooks (URL params, file upload, etc.)
├─ i18n/                # Internationalization utilities (getT/useT)
├─ landing/             # Components for the landing/home page
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
