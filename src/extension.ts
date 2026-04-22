import * as vscode from "vscode";
import { createPreviewPanel } from "./previewPanel";
import { initializeFileIcons } from "./icons";
import { loadThemes } from "./themes";
import { generateTokenColors } from "./languageColor";

const EXTENSION_ID = "snow-blue-theme-studio";
const BETA_MODE = true;
const EXTENSION_NAME = "Snow Throne Theme Studio";

// ==================== DATA MODELS ====================

class ThemeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly description: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command,
  ) {
    super(label, collapsibleState);
    this.description = description;
    this.tooltip = `${label}: ${description}`;
    this.iconPath = new vscode.ThemeIcon("color-mode");
  }
}

class SettingItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly description: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command,
    public readonly iconName: string = "settings",
  ) {
    super(label, collapsibleState);
    this.description = description;
    this.tooltip = `${label}: ${description}`;
    this.iconPath = new vscode.ThemeIcon(iconName);
  }
}

class PresetItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly description: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command,
    public readonly iconName: string = "file",
  ) {
    super(label, collapsibleState);
    this.description = description;
    this.tooltip = `${label}: ${description}`;
    this.iconPath = new vscode.ThemeIcon(iconName);
  }
}

// ==================== TREE DATA PROVIDERS ====================

class ThemesViewProvider implements vscode.TreeDataProvider<ThemeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    ThemeItem | undefined | null | void
  > = new vscode.EventEmitter<ThemeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    ThemeItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: ThemeItem): vscode.TreeItem {
    return element;
  }

  getChildren(): Thenable<ThemeItem[]> {
    const themes = loadThemes();
    if (themes.length === 0) {
      return Promise.resolve([
        new ThemeItem(
          "No themes found",
          "Create a new theme to get started",
          vscode.TreeItemCollapsibleState.None,
        ),
      ]);
    }

    return Promise.resolve(
      themes.map(
        (theme) =>
          new ThemeItem(
            theme.name,
            theme.description || "Custom theme",
            vscode.TreeItemCollapsibleState.None,
            {
              command: `${EXTENSION_ID}.quickThemeSwitch`,
              title: "Select Theme",
              arguments: [theme.name],
            },
          ),
      ),
    );
  }
}

class SettingsViewProvider implements vscode.TreeDataProvider<SettingItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    SettingItem | undefined | null | void
  > = new vscode.EventEmitter<SettingItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    SettingItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: SettingItem): vscode.TreeItem {
    return element;
  }

  getChildren(): Thenable<SettingItem[]> {
    return Promise.resolve([
      new SettingItem(
        "Snow Theme Studio",
        "Open Theme Studio dashboard",
        vscode.TreeItemCollapsibleState.None,
        {
          command: `${EXTENSION_ID}.showDashboard`,
          title: "Open Theme Studio",
          arguments: [],
        },
        "palette",
      ),
      new SettingItem(
        "Export Theme",
        "Export current theme as JSON",
        vscode.TreeItemCollapsibleState.None,
        {
          command: `${EXTENSION_ID}.exportTheme`,
          title: "Export Theme",
          arguments: [],
        },
        "cloud-download",
      ),
    ]);
  }
}

class PresetsViewProvider implements vscode.TreeDataProvider<PresetItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    PresetItem | undefined | null | void
  > = new vscode.EventEmitter<PresetItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    PresetItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: PresetItem): vscode.TreeItem {
    return element;
  }

  getChildren(): Thenable<PresetItem[]> {
    return Promise.resolve([
      new PresetItem(
        "Theme Library",
        "Browse and download community themes",
        vscode.TreeItemCollapsibleState.None,
        {
          command: `${EXTENSION_ID}.browseThemes`,
          title: "Browse Themes",
          arguments: [],
        },
        "library",
      ),
    ]);
  }
}

// ==================== EXTENSION ACTIVATION ====================

let themesProvider: ThemesViewProvider;
let settingsProvider: SettingsViewProvider;
let presetsProvider: PresetsViewProvider;
let panelCount = 0; // Track number of open panels

export function activate(context: vscode.ExtensionContext) {
  console.log(`${EXTENSION_NAME} activated!`);

  // Initialize providers
  themesProvider = new ThemesViewProvider();
  settingsProvider = new SettingsViewProvider();
  presetsProvider = new PresetsViewProvider();

  // Register tree data providers
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider(
      "snow-studio-themes",
      themesProvider,
    ),
    vscode.window.registerTreeDataProvider(
      "snow-studio-settings",
      settingsProvider,
    ),
    vscode.window.registerTreeDataProvider(
      "snow-studio-presets",
      presetsProvider,
    ),
  );

  // Initialize themes
  const themes = loadThemes();

  // Initialize file icons
  initializeFileIcons(context);

  // ==================== COMMAND REGISTRATION ====================

  // Main Dashboard Command
  const activityBarCommand = vscode.commands.registerCommand(
    `${EXTENSION_ID}.showDashboard`,
    async () => {
      try {
        panelCount++;
        const panel = createPreviewPanel(BETA_MODE);

        // Log analytics
        logEvent("theme_studio_opened", {
          panelNumber: panelCount,
          betaMode: BETA_MODE,
        });

        // Notify user only on first open
        if (panelCount === 1) {
          vscode.window.showInformationMessage(
            "Snow Studio is ready! Watch the intro animation...",
            "Got it!",
          );
        }
      } catch (error) {
        vscode.window.showErrorMessage(
          `❌ Error opening Theme Studio: ${error}`,
        );
        console.error("Theme Studio Error:", error);
      }
    },
  );

  // Quick Theme Switcher
  const quickThemeCommand = vscode.commands.registerCommand(
    `${EXTENSION_ID}.quickThemeSwitch`,
    async (selectedThemeName?: string) => {
      try {
        const themeNames = themes.map((t) => t.name);
        const selected =
          selectedThemeName ||
          (await vscode.window.showQuickPick(themeNames, {
            placeHolder: "Select a theme...",
            title: "Snow Throne Theme Switcher",
          }));

        if (selected) {
          const theme = themes.find((t) => t.name === selected);
          if (theme) {
            await applyTheme(theme);
            vscode.window.showInformationMessage(
              `Theme switched to: ${selected}`,
              "Open Studio",
            );

            logEvent("theme_switched", {
              themeName: selected,
            });
          }
        }
      } catch (error) {
        vscode.window.showErrorMessage(`❌ Error switching theme: ${error}`);
        console.error("Theme Switch Error:", error);
      }
    },
  );

  // Create Custom Theme Command
  const createThemeCommand = vscode.commands.registerCommand(
    `${EXTENSION_ID}.createTheme`,
    async () => {
      // Command disabled: theme creation removed per requirements
      vscode.window.showWarningMessage(
        "Theme creation is no longer available.",
      );
    },
  );

  // Export Theme Command
  const exportThemeCommand = vscode.commands.registerCommand(
    `${EXTENSION_ID}.exportTheme`,
    async () => {
      try {
        const uri = await vscode.window.showSaveDialog({
          filters: { "JSON Theme": ["json"] },
          defaultUri: vscode.Uri.file("snow-throne-theme.json"),
        });

        if (uri) {
          const successMsg = await vscode.window.showInformationMessage(
            `Theme exported to ${uri.fsPath}`,
            "Open Folder",
            "Done",
          );

          if (successMsg === "Open Folder") {
            vscode.commands.executeCommand(
              "revealFileInOS",
              vscode.Uri.file(uri.fsPath),
            );
          }

          logEvent("theme_exported", {
            exportPath: uri.fsPath,
          });
        }
      } catch (error) {
        vscode.window.showErrorMessage(`❌ Error exporting theme: ${error}`);
        console.error("Export Theme Error:", error);
      }
    },
  );

  // Reset Theme Command
  const resetThemeCommand = vscode.commands.registerCommand(
    `${EXTENSION_ID}.resetTheme`,
    async () => {
      try {
        await vscode.workspace
          .getConfiguration("workbench")
          .update("colorTheme", "Snow Blue", true);

        vscode.window.showInformationMessage(
          "Theme reset to Snow Blue! Enjoy the fresh start.",
        );

        logEvent("theme_reset", {
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        vscode.window.showErrorMessage(`❌ Error resetting theme: ${error}`);
        console.error("Reset Theme Error:", error);
      }
    },
  );

  // Focus Mode Command
  const focusModeCommand = vscode.commands.registerCommand(
    `${EXTENSION_ID}.focusMode`,
    async () => {
      try {
        await vscode.commands.executeCommand("workbench.action.toggleZenMode");
        vscode.window.showInformationMessage(
          "Focus Mode activated! Distraction-free coding time.",
        );

        logEvent("focus_mode_toggled", {
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        vscode.window.showErrorMessage(
          `❌ Error toggling focus mode: ${error}`,
        );
        console.error("Focus Mode Error:", error);
      }
    },
  );

  // Color Picker Command
  const colorPickerCommand = vscode.commands.registerCommand(
    `${EXTENSION_ID}.colorPicker`,
    async () => {
      try {
        createPreviewPanel(BETA_MODE);
        logEvent("color_picker_opened", {
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        vscode.window.showErrorMessage(
          `❌ Error opening Color Picker: ${error}`,
        );
        console.error("Color Picker Error:", error);
      }
    },
  );

  // Browse Themes Command
  const browseThemesCommand = vscode.commands.registerCommand(
    `${EXTENSION_ID}.browseThemes`,
    async () => {
      try {
        const action = await vscode.window.showInformationMessage(
          "📚 Theme Library Coming Soon! Browse community themes and share yours.",
          "Remind Later",
          "Notify Me",
        );

        logEvent("browse_themes_clicked", {
          action: action,
        });
      } catch (error) {
        console.error("Browse Themes Error:", error);
      }
    },
  );

  // Refresh Commands
  const refreshThemesCommand = vscode.commands.registerCommand(
    `${EXTENSION_ID}.refreshThemes`,
    () => {
      themesProvider.refresh();
      vscode.window.showInformationMessage("Themes refreshed!");
    },
  );

  // ==================== STATUS BAR ====================

  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100,
  );
  statusBarItem.command = `${EXTENSION_ID}.showDashboard`;
  statusBarItem.text = "$(palette) Theme Studio";
  statusBarItem.tooltip = `Click to open ${EXTENSION_NAME}`;
  statusBarItem.show();

  // ==================== EVENT LISTENERS ====================

  // Listen for configuration changes
  const configChangeListener = vscode.workspace.onDidChangeConfiguration(
    (event) => {
      if (event.affectsConfiguration("snow-blue-theme")) {
        themesProvider.refresh();
        settingsProvider.refresh();
        presetsProvider.refresh();
        console.log("Theme configuration updated");
      }
    },
  );

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

  context.subscriptions.push(
    activityBarCommand,
    quickThemeCommand,
    createThemeCommand,
    exportThemeCommand,
    resetThemeCommand,
    focusModeCommand,
    colorPickerCommand,
    browseThemesCommand,
    refreshThemesCommand,
    configChangeListener,
    onThemeChange,
    statusBarItem,
  );

  console.log(`${EXTENSION_NAME} fully initialized!`);
}

export function deactivate() {
  console.log(`${EXTENSION_NAME} deactivated!`);
  logEvent("extension_deactivated", {
    timestamp: new Date().toISOString(),
  });
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Apply theme to workspace
 */
async function applyTheme(theme: any) {
  try {
    const config = vscode.workspace.getConfiguration("workbench");

    // Apply theme
    await config.update("colorTheme", theme.name, true);

    // Apply color customizations
    if (theme.colors) {
      await config.update("colorCustomizations", theme.colors, true);
    }

    // Apply token colors (syntax highlighting)
    const tokenColors = generateTokenColors();
    if (tokenColors.length > 0) {
      await vscode.workspace.getConfiguration("editor").update(
        "tokenColorCustomizations",
        {
          textMateRules: tokenColors,
        },
        true,
      );
    }

    console.log(`Theme "${theme.name}" applied successfully`);
  } catch (error) {
    throw new Error(`Failed to apply theme: ${error}`);
  }
}

/**
 * Telemetry/Analytics logging (non-invasive)
 * Replace with your analytics service if needed
 */
function logEvent(eventName: string, properties?: Record<string, any>): void {
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
    } catch (error) {
      // Silently fail - don't disrupt user experience
      console.debug("Analytics error:", error);
    }
  }
}

/**
 * Get extension version
 */
export function getExtensionVersion(context: vscode.ExtensionContext): string {
  const packageJson = context.extension.packageJSON;
  return packageJson.version || "unknown";
}

/**
 * Check if user is first-time user
 */
export function isFirstTimeUser(context: vscode.ExtensionContext): boolean {
  const hasSeenWelcome = context.globalState.get(`${EXTENSION_ID}.welcomeSeen`);
  return !hasSeenWelcome;
}

/**
 * Mark welcome as seen
 */
export function markWelcomeAsSeen(context: vscode.ExtensionContext): void {
  context.globalState.update(`${EXTENSION_ID}.welcomeSeen`, true);
}
