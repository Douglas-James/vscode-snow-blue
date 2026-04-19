import * as vscode from "vscode";
import { createPreviewPanel } from "./previewPanel";

const THEMES = [
  "Snow Blue (Default)",
  "Slate Amber Night (Premium Default)",
  "Christmas Night",
  "Christmas Day",
];

let panel: vscode.WebviewPanel | undefined;

const IS_BETA = true;

export function activate(context: vscode.ExtensionContext) {
  const switchTheme = vscode.commands.registerCommand(
    "snowthrone.switchTheme",
    async () => {
      const selected = await vscode.window.showQuickPick(THEMES, {
        placeHolder: "Choose a Snow Throne theme",
      });

      if (!selected) return;

      await vscode.workspace
        .getConfiguration()
        .update(
          "workbench.colorTheme",
          selected,
          vscode.ConfigurationTarget.Global,
        );

      openPanel();

      panel!.webview.postMessage({
        type: "themeChanged",
        theme: selected,
      });
    },
  );

  const openPreview = vscode.commands.registerCommand(
    "snowthrone.openPreview",
    () => {
      openPanel();
    },
  );

  context.subscriptions.push(switchTheme, openPreview);
}

function openPanel() {
  if (!panel) {
    panel = createPreviewPanel(IS_BETA);
    registerMessages(panel);
  } else {
    panel.reveal(vscode.ViewColumn.Two);
  }
}

function registerMessages(panel: vscode.WebviewPanel) {
  panel.webview.onDidReceiveMessage(async (msg) => {
    const config = vscode.workspace.getConfiguration();

    if (msg.type === "updateColor") {
      const current =
        config.get<Record<string, string>>("workbench.colorCustomizations") ||
        {};

      await config.update(
        "workbench.colorCustomizations",
        {
          ...current,
          [msg.key]: msg.value,
        },
        vscode.ConfigurationTarget.Global,
      );
    }

    if (msg.type === "resetTheme") {
      await config.update(
        "workbench.colorCustomizations",
        undefined,
        vscode.ConfigurationTarget.Global,
      );

      panel.webview.postMessage({
        type: "themeReset",
      });
    }
  });
}

export function deactivate() {}
