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
exports.activate = activate;
exports.deactivate = deactivate;
exports.getExtensionVersion = getExtensionVersion;
exports.isFirstTimeUser = isFirstTimeUser;
exports.markWelcomeAsSeen = markWelcomeAsSeen;
const vscode = __importStar(require("vscode"));
const previewPanel_1 = require("./previewPanel");
const icons_1 = require("./icons");
const themes_1 = require("./themes");
const languageColor_1 = require("./languageColor");
const EXTENSION_ID = "snow-blue-theme-studio";
const BETA_MODE = true;
const EXTENSION_NAME = "Snow Throne Theme Studio";
// ==================== DATA MODELS ====================
class ThemeItem extends vscode.TreeItem {
    constructor(label, description, collapsibleState, command) {
        super(label, collapsibleState);
        this.label = label;
        this.description = description;
        this.collapsibleState = collapsibleState;
        this.command = command;
        this.description = description;
        this.tooltip = `${label}: ${description}`;
        this.iconPath = new vscode.ThemeIcon("color-mode");
    }
}
class SettingItem extends vscode.TreeItem {
    constructor(label, description, collapsibleState, command, iconName = "settings") {
        super(label, collapsibleState);
        this.label = label;
        this.description = description;
        this.collapsibleState = collapsibleState;
        this.command = command;
        this.iconName = iconName;
        this.description = description;
        this.tooltip = `${label}: ${description}`;
        this.iconPath = new vscode.ThemeIcon(iconName);
    }
}
class PresetItem extends vscode.TreeItem {
    constructor(label, description, collapsibleState, command, iconName = "file") {
        super(label, collapsibleState);
        this.label = label;
        this.description = description;
        this.collapsibleState = collapsibleState;
        this.command = command;
        this.iconName = iconName;
        this.description = description;
        this.tooltip = `${label}: ${description}`;
        this.iconPath = new vscode.ThemeIcon(iconName);
    }
}
// ==================== TREE DATA PROVIDERS ====================
class ThemesViewProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren() {
        const themes = (0, themes_1.loadThemes)();
        if (themes.length === 0) {
            return Promise.resolve([
                new ThemeItem("No themes found", "Create a new theme to get started", vscode.TreeItemCollapsibleState.None),
            ]);
        }
        return Promise.resolve(themes.map((theme) => new ThemeItem(theme.name, theme.description || "Custom theme", vscode.TreeItemCollapsibleState.None, {
            command: `${EXTENSION_ID}.quickThemeSwitch`,
            title: "Select Theme",
            arguments: [theme.name],
        })));
    }
}
class SettingsViewProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren() {
        return Promise.resolve([
            new SettingItem("Snow Theme Studio", "Open Theme Studio dashboard", vscode.TreeItemCollapsibleState.None, {
                command: `${EXTENSION_ID}.showDashboard`,
                title: "Open Theme Studio",
                arguments: [],
            }, "palette"),
            new SettingItem("Export Theme", "Export current theme as JSON", vscode.TreeItemCollapsibleState.None, {
                command: `${EXTENSION_ID}.exportTheme`,
                title: "Export Theme",
                arguments: [],
            }, "cloud-download"),
        ]);
    }
}
class PresetsViewProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren() {
        return Promise.resolve([
            new PresetItem("Theme Library", "Browse and download community themes", vscode.TreeItemCollapsibleState.None, {
                command: `${EXTENSION_ID}.browseThemes`,
                title: "Browse Themes",
                arguments: [],
            }, "library"),
        ]);
    }
}
// ==================== EXTENSION ACTIVATION ====================
let themesProvider;
let settingsProvider;
let presetsProvider;
let panelCount = 0; // Track number of open panels
function activate(context) {
    console.log(`${EXTENSION_NAME} activated!`);
    // Initialize providers
    themesProvider = new ThemesViewProvider();
    settingsProvider = new SettingsViewProvider();
    presetsProvider = new PresetsViewProvider();
    // Register tree data providers
    context.subscriptions.push(vscode.window.registerTreeDataProvider("snow-studio-themes", themesProvider), vscode.window.registerTreeDataProvider("snow-studio-settings", settingsProvider), vscode.window.registerTreeDataProvider("snow-studio-presets", presetsProvider));
    // Initialize themes
    const themes = (0, themes_1.loadThemes)();
    // Initialize file icons
    (0, icons_1.initializeFileIcons)(context);
    // ==================== COMMAND REGISTRATION ====================
    // Main Dashboard Command
    const activityBarCommand = vscode.commands.registerCommand(`${EXTENSION_ID}.showDashboard`, async () => {
        try {
            panelCount++;
            const panel = (0, previewPanel_1.createPreviewPanel)(BETA_MODE);
            // Log analytics
            logEvent("theme_studio_opened", {
                panelNumber: panelCount,
                betaMode: BETA_MODE,
            });
            // Notify user only on first open
            if (panelCount === 1) {
                vscode.window.showInformationMessage("Snow Studio is ready! Watch the intro animation...", "Got it!");
            }
        }
        catch (error) {
            vscode.window.showErrorMessage(`❌ Error opening Theme Studio: ${error}`);
            console.error("Theme Studio Error:", error);
        }
    });
    // Quick Theme Switcher
    const quickThemeCommand = vscode.commands.registerCommand(`${EXTENSION_ID}.quickThemeSwitch`, async (selectedThemeName) => {
        try {
            const themeNames = themes.map((t) => t.name);
            const selected = selectedThemeName ||
                (await vscode.window.showQuickPick(themeNames, {
                    placeHolder: "Select a theme...",
                    title: "Snow Throne Theme Switcher",
                }));
            if (selected) {
                const theme = themes.find((t) => t.name === selected);
                if (theme) {
                    await applyTheme(theme);
                    vscode.window.showInformationMessage(`Theme switched to: ${selected}`, "Open Studio");
                    logEvent("theme_switched", {
                        themeName: selected,
                    });
                }
            }
        }
        catch (error) {
            vscode.window.showErrorMessage(`❌ Error switching theme: ${error}`);
            console.error("Theme Switch Error:", error);
        }
    });
    // Create Custom Theme Command
    const createThemeCommand = vscode.commands.registerCommand(`${EXTENSION_ID}.createTheme`, async () => {
        // Command disabled: theme creation removed per requirements
        vscode.window.showWarningMessage("Theme creation is no longer available.");
    });
    // Export Theme Command
    const exportThemeCommand = vscode.commands.registerCommand(`${EXTENSION_ID}.exportTheme`, async () => {
        try {
            const uri = await vscode.window.showSaveDialog({
                filters: { "JSON Theme": ["json"] },
                defaultUri: vscode.Uri.file("snow-throne-theme.json"),
            });
            if (uri) {
                const successMsg = await vscode.window.showInformationMessage(`Theme exported to ${uri.fsPath}`, "Open Folder", "Done");
                if (successMsg === "Open Folder") {
                    vscode.commands.executeCommand("revealFileInOS", vscode.Uri.file(uri.fsPath));
                }
                logEvent("theme_exported", {
                    exportPath: uri.fsPath,
                });
            }
        }
        catch (error) {
            vscode.window.showErrorMessage(`❌ Error exporting theme: ${error}`);
            console.error("Export Theme Error:", error);
        }
    });
    // Reset Theme Command
    const resetThemeCommand = vscode.commands.registerCommand(`${EXTENSION_ID}.resetTheme`, async () => {
        try {
            await vscode.workspace
                .getConfiguration("workbench")
                .update("colorTheme", "Snow Blue", true);
            vscode.window.showInformationMessage("Theme reset to Snow Blue! Enjoy the fresh start.");
            logEvent("theme_reset", {
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            vscode.window.showErrorMessage(`❌ Error resetting theme: ${error}`);
            console.error("Reset Theme Error:", error);
        }
    });
    // Focus Mode Command
    const focusModeCommand = vscode.commands.registerCommand(`${EXTENSION_ID}.focusMode`, async () => {
        try {
            await vscode.commands.executeCommand("workbench.action.toggleZenMode");
            vscode.window.showInformationMessage("Focus Mode activated! Distraction-free coding time.");
            logEvent("focus_mode_toggled", {
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            vscode.window.showErrorMessage(`❌ Error toggling focus mode: ${error}`);
            console.error("Focus Mode Error:", error);
        }
    });
    // Color Picker Command
    const colorPickerCommand = vscode.commands.registerCommand(`${EXTENSION_ID}.colorPicker`, async () => {
        try {
            (0, previewPanel_1.createPreviewPanel)(BETA_MODE);
            logEvent("color_picker_opened", {
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            vscode.window.showErrorMessage(`❌ Error opening Color Picker: ${error}`);
            console.error("Color Picker Error:", error);
        }
    });
    // Browse Themes Command
    const browseThemesCommand = vscode.commands.registerCommand(`${EXTENSION_ID}.browseThemes`, async () => {
        try {
            const action = await vscode.window.showInformationMessage("📚 Theme Library Coming Soon! Browse community themes and share yours.", "Remind Later", "Notify Me");
            logEvent("browse_themes_clicked", {
                action: action,
            });
        }
        catch (error) {
            console.error("Browse Themes Error:", error);
        }
    });
    // Refresh Commands
    const refreshThemesCommand = vscode.commands.registerCommand(`${EXTENSION_ID}.refreshThemes`, () => {
        themesProvider.refresh();
        vscode.window.showInformationMessage("Themes refreshed!");
    });
    // ==================== STATUS BAR ====================
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = `${EXTENSION_ID}.showDashboard`;
    statusBarItem.text = "$(palette) Theme Studio";
    statusBarItem.tooltip = `Click to open ${EXTENSION_NAME}`;
    statusBarItem.show();
    // ==================== EVENT LISTENERS ====================
    // Listen for configuration changes
    const configChangeListener = vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration("snow-blue-theme")) {
            themesProvider.refresh();
            settingsProvider.refresh();
            presetsProvider.refresh();
            console.log("Theme configuration updated");
        }
    });
    // Listen for theme changes
    const onThemeChange = vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration("workbench.colorTheme")) {
            console.log("Active theme changed");
            logEvent("theme_changed", {
                timestamp: new Date().toISOString(),
            });
        }
    });
    // ==================== SUBSCRIPTIONS ====================
    context.subscriptions.push(activityBarCommand, quickThemeCommand, createThemeCommand, exportThemeCommand, resetThemeCommand, focusModeCommand, colorPickerCommand, browseThemesCommand, refreshThemesCommand, configChangeListener, onThemeChange, statusBarItem);
    console.log(`${EXTENSION_NAME} fully initialized!`);
}
function deactivate() {
    console.log(`${EXTENSION_NAME} deactivated!`);
    logEvent("extension_deactivated", {
        timestamp: new Date().toISOString(),
    });
}
// ==================== UTILITY FUNCTIONS ====================
/**
 * Apply theme to workspace
 */
async function applyTheme(theme) {
    try {
        const config = vscode.workspace.getConfiguration("workbench");
        // Apply theme
        await config.update("colorTheme", theme.name, true);
        // Apply color customizations
        if (theme.colors) {
            await config.update("colorCustomizations", theme.colors, true);
        }
        // Apply token colors (syntax highlighting)
        const tokenColors = (0, languageColor_1.generateTokenColors)();
        if (tokenColors.length > 0) {
            await vscode.workspace.getConfiguration("editor").update("tokenColorCustomizations", {
                textMateRules: tokenColors,
            }, true);
        }
        console.log(`Theme "${theme.name}" applied successfully`);
    }
    catch (error) {
        throw new Error(`Failed to apply theme: ${error}`);
    }
}
/**
 * Telemetry/Analytics logging (non-invasive)
 * Replace with your analytics service if needed
 */
function logEvent(eventName, properties) {
    if (process.env.NODE_ENV === "production") {
        try {
            const eventData = {
                name: eventName,
                extension: EXTENSION_ID,
                timestamp: new Date().toISOString(),
                ...properties,
            };
            console.log(`[Analytics] ${eventName}`, properties || {});
            // TODO: Send to analytics service (e.g., Mixpanel, Segment)
        }
        catch (error) {
            // Silently fail - don't disrupt user experience
            console.debug("Analytics error:", error);
        }
    }
}
/**
 * Get extension version
 */
function getExtensionVersion(context) {
    const packageJson = context.extension.packageJSON;
    return packageJson.version || "unknown";
}
/**
 * Check if user is first-time user
 */
function isFirstTimeUser(context) {
    const hasSeenWelcome = context.globalState.get(`${EXTENSION_ID}.welcomeSeen`);
    return !hasSeenWelcome;
}
/**
 * Mark welcome as seen
 */
function markWelcomeAsSeen(context) {
    context.globalState.update(`${EXTENSION_ID}.welcomeSeen`, true);
}
//# sourceMappingURL=extension.js.map