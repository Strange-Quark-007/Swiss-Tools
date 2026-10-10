# Swiss Tools

Swiss Tools is a **modular, privacy-first developer toolbox** designed to provide developers with a set of handy utilities in one place. Each tool is independent but follows consistent UI, state management, and action patterns.

## 🚀 Key Features

- **Modular Tools:** Independent utilities with a consistent interface.
- **Powerful Actions:** Convert, swap, reset, auto-mode, upload, and download.
- **Quick Navigation:** Command palette and collapsible sidebar.
- **Real-Time Feedback:** Notifications via toast messages.
- **Internationalization:** Built with `next-intl` (currently English).

## 🧩 Modules

Swiss Tools offers a growing collection of **independent, self-contained** modules, each following consistent **architecture, state pattern, and UI design**.

👉 For list of modules see [**App Modules**](/src/constants/appModules.ts).

## 🏗️ Architecture

- Swiss Tools follows a modular architecture where each feature module is self-contained.
- Core components, hooks, constants, and route-persisted stores form the backbone of the system.
- For a detailed overview, including **project structure, module architecture, hooks, state management, and routing, etc.**, see [**ARCHITECTURE.md**](ARCHITECTURE.md).

## 📚 Documentation

Swiss Tools is indexed on **DeepWiki** for structured navigation and cross-reference across all modules and architecture files.

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/Strange-Quark-007/Swiss-Tools)

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
- **Testing:** Vitest + v8 coverage

## 🔒 Privacy

Swiss Tools is privacy-first: only **anonymous analytics** are collected for improving the platform. **No personal data is collected.**

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

# Run unit tests
pnpm test:run

# Run unit tests with coverage
pnpm test:coverage

# Run coverage for a single test file
pnpm test:coverage:file <test-filename>
```

## ⚖️ License

This project is licensed under the [GNU Affero General Public License v3.0 or later (AGPL-3.0-or-later)](LICENSE).
