# Snow-Blue Theme Extension (Beta)

A modular, extensible VS Code extension framework for theme management and customization. Start with Snow-Blue themes and adapt it for your own theme collection or extension use case.

> **⚠️ Beta Version** — This extension is in active development. Theme definitions and API structure may change.

## Overview

This is a **template-style extension** designed to be forked and customized. It provides:

- Theme management system with easy customization
- Command palette integration for theme switching
- Live preview panel for theme visualization
- Icon set management (extensible)
- Release notes and language color configuration
- Modular architecture for adding new features

## Quick Start

### For End Users

1. Install from VS Code Extensions marketplace
2. Run **Snow Throne: Switch Theme** (`Cmd+Shift+P`)
3. Pick your theme or open **Snow Throne: Open Preview**

### For Developers (Customizing This Extension)

```bash
# Clone and setup
git clone <repo>
cd vscode-snow-blue
npm install
npm run compile

# Edit themes
# → Modify themes/custom-theme.json
# → Update src/themes.ts with your theme list

# Test locally
code --extensionDevelopmentPath=.
```

## Extension Architecture

This extension is organized into modular TypeScript modules for easy customization:

```
src/
├── extension.ts           # Main entry point & command registration
├── previewPanel.ts        # Live preview webview panel
├── themes.ts              # Theme definitions (customize here!)
├── commands.ts            # Command palette commands
├── icons.ts               # Icon set management
├── languageColor.ts       # Language-specific color config
└── releaseNotes.ts        # Version release notes
```

## Customization Guide

### Add Your Own Themes

1. **Create a theme JSON file** in `themes/`:

   ```json
   {
     "name": "My Custom Theme",
     "type": "dark",
     "colors": {
       "editor.background": "#1a1a1a",
       ...
     },
     "tokenColors": [...]
   }
   ```

2. **Register in `src/themes.ts`**:

   ```typescript
   export const THEMES = [
     { id: "my-theme", label: "My Custom Theme", path: "..." },
   ];
   ```

3. **Rebuild**:
   ```bash
   npm run compile
   ```

### Extend Commands

Add new commands in `src/commands.ts`:

```typescript
context.subscriptions.push(
  vscode.commands.registerCommand("extension.myCommand", () => {
    // Your command logic
  }),
);
```

### Modify the Preview Panel

Edit `src/previewPanel.ts` and `responsive-showcase.html` to customize the live preview interface.

## Default Themes (Included)

- **Snow Blue** — Cool-toned dark theme
- **Slate Amber Night** — Deep slate with amber accents
- **Christmas Night** — Festive dark variant
- **Christmas Day** — Festive light variant

All built on the **60-30-10 color system** for readability.

## Available Commands

| Command                   | Description                   |
| ------------------------- | ----------------------------- |
| Snow Throne: Switch Theme | Open theme picker             |
| Snow Throne: Open Preview | View live syntax highlighting |

## Project Structure

```
vscode-snow-blue/
├── src/                    # TypeScript source
├── out/                    # Compiled JavaScript
├── themes/                 # Theme JSON files
├── assets/                 # Images, icons
├── package.json            # Extension manifest
├── tsconfig.json           # TypeScript config
└── README.md               # This file
```

## Features

- ✓ Multiple theme support
- ✓ Quick theme switching
- ✓ Live preview panel
- ✓ Terminal color customization
- ✓ Status bar styling
- ✓ Modular command system
- ✓ Extensible architecture

## Development

### Build

```bash
npm run compile        # Compile TypeScript
npm run watch        # Watch for changes
```

### Package

```bash
vsce package         # Create .vsix file
vsce publish         # Publish to marketplace
```

### Test in Development Mode

```bash
code --extensionDevelopmentPath=.
```

## License

Educational Use License — see [LICENSE](./LICENSE) for details

## Contributing

This extension is designed to be extended. If you create a variant:

1. Fork this repository
2. Customize `src/themes.ts` and create your theme files
3. Update the extension name and ID in `package.json`
4. Build and test locally

For issues with the base extension, open a GitHub issue.
