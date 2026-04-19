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
const vscode = __importStar(require("vscode"));
const previewPanel_1 = require("./previewPanel");
const THEMES = [
    "Snow Blue (Default)",
    "Slate Amber Night (Premium Default)",
    "Christmas Night",
    "Christmas Day",
];
let panel;
const IS_BETA = true;
function activate(context) {
    const switchTheme = vscode.commands.registerCommand("snowthrone.switchTheme", async () => {
        const selected = await vscode.window.showQuickPick(THEMES, {
            placeHolder: "Choose a Snow Throne theme",
        });
        if (!selected)
            return;
        await vscode.workspace
            .getConfiguration()
            .update("workbench.colorTheme", selected, vscode.ConfigurationTarget.Global);
        openPanel();
        panel.webview.postMessage({
            type: "themeChanged",
            theme: selected,
        });
    });
    const openPreview = vscode.commands.registerCommand("snowthrone.openPreview", () => {
        openPanel();
    });
    context.subscriptions.push(switchTheme, openPreview);
}
function openPanel() {
    if (!panel) {
        panel = (0, previewPanel_1.createPreviewPanel)(IS_BETA);
        registerMessages(panel);
    }
    else {
        panel.reveal(vscode.ViewColumn.Two);
    }
}
function registerMessages(panel) {
    panel.webview.onDidReceiveMessage(async (msg) => {
        const config = vscode.workspace.getConfiguration();
        if (msg.type === "updateColor") {
            const current = config.get("workbench.colorCustomizations") ||
                {};
            await config.update("workbench.colorCustomizations", {
                ...current,
                [msg.key]: msg.value,
            }, vscode.ConfigurationTarget.Global);
        }
        if (msg.type === "resetTheme") {
            await config.update("workbench.colorCustomizations", undefined, vscode.ConfigurationTarget.Global);
            panel.webview.postMessage({
                type: "themeReset",
            });
        }
    });
}
function deactivate() { }
//# sourceMappingURL=extension.js.map