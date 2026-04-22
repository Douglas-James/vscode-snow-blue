"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCommands = registerCommands;
const vscode = __importStar(require("vscode"));
function registerCommands(context, themes) {
    // Command: Snow Throne: Switch Theme
    const switchThemeCommand = vscode.commands.registerCommand("snow-blue-theme-studio.switchTheme", async () => {
        const themeNames = themes.map((t) => t.name);
        const selected = await vscode.window.showQuickPick(themeNames, {
            placeHolder: "Select a theme...",
        });
        if (selected) {
            const theme = themes.find((t) => t.name === selected);
            if (theme) {
                await applyTheme(theme);
                vscode.window.showInformationMessage(`Theme switched to: ${selected}`);
            }
        }
    });
    // Command: Snow Throne: Open Preview
    const openPreviewCommand = vscode.commands.registerCommand("snow-blue-theme-studio.openPreview", async () => {
        // This will be handled by extension.ts calling createPreviewPanel
        vscode.window.showInformationMessage("Opening Theme Studio Preview...");
    });
    // Command: Snow Throne: Create Theme
    const createThemeCommand = vscode.commands.registerCommand("snow-blue-theme-studio.createTheme", async () => {
        const name = await vscode.window.showInputBox({
            prompt: "Enter new theme name",
            placeHolder: "My Custom Theme",
        });
        if (name) {
            vscode.window.showInformationMessage(`Theme "${name}" created! Open Theme Studio to customize.`);
        }
    });
    // Command: Snow Throne: Export Theme
    const exportThemeCommand = vscode.commands.registerCommand("snow-blue-theme-studio.exportTheme", async () => {
        const uri = await vscode.window.showSaveDialog({
            filters: { "JSON Theme": ["json"] },
            defaultUri: vscode.Uri.file("my-theme.json"),
        });
        if (uri) {
            vscode.window.showInformationMessage(`Theme exported to ${uri.fsPath}`);
        }
    });
    // Command: Snow Throne: Reset Theme
    const resetThemeCommand = vscode.commands.registerCommand("snow-blue-theme-studio.resetTheme", async () => {
        await vscode.workspace
            .getConfiguration("workbench")
            .update("colorTheme", "Snow Blue", true);
        vscode.window.showInformationMessage("Theme reset to Snow Blue!");
    });
    // Register all commands
    context.subscriptions.push(switchThemeCommand, openPreviewCommand, createThemeCommand, exportThemeCommand, resetThemeCommand);
}
async function applyTheme(theme) {
    const config = vscode.workspace.getConfiguration("workbench");
    await config.update("colorTheme", theme.name, true);
    const colorCustomizations = theme.colors || {};
    await vscode.workspace
        .getConfiguration("workbench")
        .update("colorCustomizations", colorCustomizations, true);
}
//# sourceMappingURL=commands.js.map