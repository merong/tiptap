# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

Tiptap is a headless, framework-agnostic rich text editor built on top of ProseMirror. The repository is organized as a monorepo using pnpm workspaces with Turbo for build orchestration.

## Architecture

### Monorepo Structure

- **packages/core** - The core editor implementation containing the Editor class, CommandManager, ExtensionManager, and base abstractions (Extension, Node, Mark)
- **packages/extension-\*** - Individual extension packages (50+ extensions for nodes, marks, and functionality)
- **packages/pm** - ProseMirror wrapper package that re-exports all ProseMirror libraries with consistent versioning
- **packages/react**, **packages/vue-2**, **packages/vue-3** - Framework-specific integrations
- **packages/html**, **packages/markdown**, **packages/static-renderer** - Content transformation utilities
- **packages/starter-kit**, **packages/extensions** - Bundled extension collections
- **demos/src** - Interactive demos organized by category (Examples, Extensions, Nodes, Marks, Commands, etc.)
- **tests/cypress** - Integration tests using Cypress

### Key Architectural Concepts

**Extension System**: Tiptap's architecture is built around extensions. Everything is an extension - nodes, marks, and functionality. Extensions can:
- Define ProseMirror schemas (nodes/marks)
- Register commands (editor.commands.*)
- Add keyboard shortcuts via keymaps
- Implement input rules and paste rules
- Provide plugin functionality
- Store state in extension storage

**Command Chain**: Commands can be chained (editor.chain().foo().bar().run()) or checked (editor.can().undo()). The CommandManager creates a chainable proxy that batches commands into a single transaction.

**ProseMirror Abstraction**: The @tiptap/pm package wraps all ProseMirror libraries. Always import from @tiptap/pm/* rather than prosemirror-* directly to ensure version consistency.

**Node Views and Mark Views**: Custom rendering is achieved through NodeView and MarkView classes that bridge ProseMirror nodes/marks with DOM rendering or framework components.

## Development Commands

### Package Management
```bash
pnpm install                    # Install dependencies (requires pnpm@9.15.4)
pnpm run reset                  # Clean everything and reinstall
```

### Building
```bash
pnpm run build                  # Build all packages using Turbo
turbo build                     # Alternative - direct Turbo invocation
pnpm run clean:packages         # Clean all dist directories
```

### Linting
```bash
pnpm run lint                   # Lint all packages with Turbo
pnpm run lint:fix               # Auto-fix with Prettier and ESLint
pnpm run lint:staged            # Lint staged files (used by husky)
```

### Testing
```bash
pnpm run test                   # Build + run all Cypress tests
pnpm run test:open              # Open Cypress UI
pnpm run test:run               # Run Cypress tests headlessly
cypress run --project tests --spec "path/to/spec.ts"  # Run specific test file
```

### Demos
```bash
pnpm run dev                    # Start demo development server (runs pnpm --prefix demos run start)
pnpm run build:demos            # Build demo site
pnpm run serve                  # Build and serve demos on port 3000
pnpm run make:demo              # Interactive script to scaffold new demo
```

### Package Development
```bash
cd packages/extension-foo
pnpm run build                  # Build single package
pnpm run lint                   # Lint single package
```

## Working with Extensions

### Creating a New Extension

Extensions are in `packages/extension-[name]` with this structure:
```
extension-foo/
├── src/
│   └── foo.ts              # Extension implementation
├── package.json
└── tsup.config.ts          # Build configuration
```

Extension packages should:
- Export a default extension factory function
- Use @tiptap/core for base classes (Extension, Node, Mark)
- Import ProseMirror types from @tiptap/pm/*
- Follow the naming pattern @tiptap/extension-[name]

### Extension Implementation Pattern

Extensions extend one of three base classes:
- **Extension** - For functionality (no schema impact)
- **Node** - For block or inline content nodes
- **Mark** - For text annotations

Common extension options:
- `addOptions()` - Define configurable options
- `addAttributes()` - Define node/mark attributes
- `addCommands()` - Expose editor commands
- `addKeyboardShortcuts()` - Register keyboard handlers
- `addInputRules()` - Define input transformations
- `addPasteRules()` - Handle paste behavior
- `addProseMirrorPlugins()` - Add ProseMirror plugins

## Testing

### Test Organization

- Integration tests in `tests/cypress/integration/`
- Demo tests in `demos/src/[Category]/[Name]/index.spec.ts`
- Test spec files use Cypress and create Editor instances directly

### Writing Tests

Tests follow this pattern:
```typescript
import { Editor } from '@tiptap/core'
import Document from '@tiptap/extension-document'
// ... other extensions

describe('feature name', () => {
  it('does something', () => {
    const editor = new Editor({
      extensions: [Document, /* ... */],
      content: '<p>initial content</p>',
    })

    editor.commands.someCommand()
    expect(editor.getHTML()).to.eq('<p>expected</p>')
  })
})
```

## Package Publishing

### Changesets

Always include a changeset when making user-facing changes:
```bash
pnpm changeset                  # Create a changeset interactively
pnpm run version                # Version packages and update changelogs
pnpm run publish                # Build and publish to npm
```

Changesets are required for PR approval - they drive changelog generation and semantic versioning.

## Framework-Specific Notes

**React Integration** (`packages/react`):
- Provides `useEditor` hook and `EditorProvider`/`EditorConsumer` for context
- Renders using React components for node/mark views

**Vue 2/3 Integration** (`packages/vue-2`, `packages/vue-3`):
- Separate packages for Vue 2 and Vue 3 due to API differences
- Provide `useEditor` composition API
- Vue components can be used for node/mark views

## Build System

- **Turbo**: Orchestrates parallel builds with caching (config in turbo.json)
- **tsup**: Bundles TypeScript packages (ESM + CJS, with types)
- **tsconfig.json**: Root TypeScript config with path aliases for @tiptap/* packages
- All packages use `src/` for source and `dist/` for build output

## ESLint Configuration

- Extends airbnb-base, prettier, and TypeScript recommended rules
- Uses simple-import-sort plugin (imports should end with .js extension)
- Requires semicolons = never
- Curly braces required for all control structures

## Demo Project (Planned)

A standalone demo system is planned (see `demo-implementation-plan.md`) featuring:
- Vanilla JavaScript and jQuery examples
- Korean language manual with Cloudflare UI design
- localStorage-based save/load functionality
- Real-time configuration panel

When implemented, the demo will be in the `demo/` directory with its own build commands.