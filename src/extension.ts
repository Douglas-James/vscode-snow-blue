import * as vscode from "vscode";
import { createPreviewPanel } from "./previewPanel";

const THEMES = [
  "Snow Blue (Default)",
  "Slate Amber Night (Premium Default)",
  "Christmas Night",
  "Christmas Day",
];

let panel: vscode.WebviewPanel | undefined;

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

      if (!panel) {
        panel = createPreviewPanel();
        registerWebviewMessages(panel);
      } else {
        panel.reveal(vscode.ViewColumn.Two);
      }

      panel.webview.postMessage({
        type: "themeChanged",
        theme: selected,
      });
    },
  );

  const openPreview = vscode.commands.registerCommand(
    "snowthrone.openPreview",
    () => {
      if (!panel) {
        panel = createPreviewPanel();
        registerWebviewMessages(panel);
      } else {
        panel.reveal(vscode.ViewColumn.Two);
      }
    },
  );

  context.subscriptions.push(switchTheme, openPreview);
}

function registerWebviewMessages(panel: vscode.WebviewPanel) {
  panel.webview.onDidReceiveMessage(async (msg) => {
    if (msg.type === "updateColor") {
      const config = vscode.workspace.getConfiguration();

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
  });
}

export function deactivate() {}
