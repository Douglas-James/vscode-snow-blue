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
exports.createPreviewPanel = createPreviewPanel;
const vscode = __importStar(require("vscode"));
const languageColor_1 = require("./languageColor");
const releaseNotes_1 = require("./releaseNotes");
function createPreviewPanel(isBeta) {
    try {
        const panel = vscode.window.createWebviewPanel("snowThemePreview", "Snow Throne Theme Studio", vscode.ViewColumn.Two, {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [],
        });
        const releaseNotesHtml = (0, releaseNotes_1.getReleaseNotesHTML)();
        panel.webview.html = getThemeStudioHtml(isBeta, releaseNotesHtml);
        // Handle messages from webview
        panel.webview.onDidReceiveMessage((message) => {
            handleWebviewMessage(message, panel);
        }, undefined);
        return panel;
    }
    catch (error) {
        console.error("Error creating preview panel:", error);
        throw error;
    }
}
function handleWebviewMessage(message, panel) {
    switch (message.type) {
        case "updateColor":
            updateColorTheme(message.key, message.value);
            break;
        case "resetTheme":
            resetTheme();
            break;
        case "exportTheme":
            exportTheme(message.theme);
            break;
        case "createTheme":
            createNewTheme(message.name);
            break;
        case "updateSyntaxColor":
            updateSyntaxColor(message.language, message.scope, message.color);
            break;
        case "getLanguageRules":
            const rules = (0, languageColor_1.getLanguageColorRules)(message.language);
            panel.webview.postMessage({
                type: "languageRules",
                language: message.language,
                rules: rules,
            });
            break;
    }
}
async function updateColorTheme(key, value) {
    const config = vscode.workspace.getConfiguration("workbench");
    const colorCustomizations = config.get("colorCustomizations") || {};
    colorCustomizations[key] = value;
    await config.update("colorCustomizations", colorCustomizations, true);
}
async function updateSyntaxColor(language, scope, color) {
    const config = vscode.workspace.getConfiguration("editor");
    const tokenColorCustomizations = config.get("tokenColorCustomizations") || {
        textMateRules: [],
    };
    const textMateRules = tokenColorCustomizations.textMateRules || [];
    // Find or create the rule
    const existingRuleIndex = textMateRules.findIndex((rule) => Array.isArray(rule.scope)
        ? rule.scope.includes(scope)
        : rule.scope === scope);
    if (existingRuleIndex >= 0) {
        textMateRules[existingRuleIndex].settings.foreground = color;
    }
    else {
        textMateRules.push({
            name: `${language} - ${scope}`,
            scope: scope,
            settings: {
                foreground: color,
            },
        });
    }
    await config.update("tokenColorCustomizations", { textMateRules: textMateRules }, true);
}
async function resetTheme() {
    const config = vscode.workspace.getConfiguration("workbench");
    // Reset all color customizations
    await config.update("colorCustomizations", {}, true);
    // Reset to Snow Blue theme
    await config.update("colorTheme", "Snow Blue", true);
    vscode.window.showInformationMessage("✅ Theme reset to defaults!");
}
async function exportTheme(theme) {
    const uri = await vscode.window.showSaveDialog({
        filters: { "JSON Theme": ["json"] },
    });
    if (uri) {
        vscode.window.showInformationMessage(`Theme exported to ${uri.fsPath}`);
    }
}
async function createNewTheme(name) {
    if (!name || name.trim() === "") {
        vscode.window.showErrorMessage("Theme name cannot be empty!");
        return;
    }
    try {
        const fs = require("fs");
        const path = require("path");
        const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        if (!workspacePath) {
            vscode.window.showErrorMessage("No workspace folder open!");
            return;
        }
        // Create themes directory if it doesn't exist
        const themesDir = path.join(workspacePath, "themes");
        if (!fs.existsSync(themesDir)) {
            fs.mkdirSync(themesDir, { recursive: true });
        }
        // Get current colors from VS Code settings
        const config = vscode.workspace.getConfiguration("workbench");
        const currentColors = config.get("colorCustomizations") || {};
        const tokenColors = config.get("editor.tokenColorCustomizations") || {};
        // Create theme file
        const themeFileName = name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
        const themeFilePath = path.join(themesDir, `${themeFileName}.json`);
        const themeData = {
            name: name,
            type: "dark",
            colors: currentColors,
            tokenColors: tokenColors,
            createdAt: new Date().toISOString(),
        };
        fs.writeFileSync(themeFilePath, JSON.stringify(themeData, null, 2));
        vscode.window.showInformationMessage(`✅ Theme "${name}" created successfully at:\n${themeFilePath}`);
    }
    catch (error) {
        vscode.window.showErrorMessage(`Error creating theme: ${error}`);
        console.error("Create theme error:", error);
    }
}
function getThemeStudioHtml(isBeta, releaseNotesHtml) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Snow Throne Theme Studio</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: #0b1220;
      color: #e0e0e0;
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    /* ==================== INTRO ANIMATION ==================== */
    .intro-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #0b1220;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: introFadeOut 0.6s ease-in-out 2.4s forwards;
    }

    .intro-content {
      text-align: center;
      pointer-events: none;
    }

    .intro-snowflake {
      font-size: 80px;
      margin-bottom: 20px;
      display: inline-block;
      animation: snowflakeScale 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards;
      opacity: 0;
    }

    .intro-text {
      font-family: 'Courier New', monospace;
      font-size: 56px;
      font-weight: 800;
      color: #4da6ff;
      letter-spacing: -1px;
      margin-bottom: 30px;
      opacity: 0;
      animation: textReveal 1.2s ease-out 0.4s forwards;
    }

    .intro-subtitle {
      font-size: 14px;
      color: #8fa3c8;
      letter-spacing: 2px;
      text-transform: uppercase;
      opacity: 0;
      animation: textReveal 0.8s ease-out 1s forwards;
    }

    .intro-bar {
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      height: 3px;
      background: linear-gradient(90deg, #4da6ff, #22c55e);
      opacity: 0;
      animation: barExpand 1.2s ease-out 1.6s forwards;
    }

    @keyframes snowflakeScale {
      from {
        opacity: 0;
        transform: scale(0);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes textReveal {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes barExpand {
      from {
        opacity: 0;
        width: 0;
      }
      to {
        opacity: 1;
        width: 200px;
      }
    }

    @keyframes introFadeOut {
      to {
        opacity: 0;
        visibility: hidden;
      }
    }

    /* ==================== MAIN UI ==================== */
    .app-wrapper {
      opacity: 0;
      animation: appFadeIn 0.8s ease-out 2.4s forwards;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    @keyframes appFadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    /* HEADER */
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 50px;
      background: linear-gradient(135deg, #0f172a 0%, #1a2a3a 100%);
      border-bottom: 1px solid rgba(77, 166, 255, 0.2);
      display: flex;
      align-items: center;
      padding: 0 20px;
      z-index: 100;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
      animation: headerSlideDown 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 2.4s backwards;
      justify-content: space-between;
    }

    @keyframes headerSlideDown {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .header-title {
      font-size: 18px;
      font-weight: 600;
      color: #4da6ff;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .header-tabs {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .tab-button {
      padding: 6px 16px;
      border: 1px solid rgba(77, 166, 255, 0.3);
      background: transparent;
      color: rgba(224, 224, 224, 0.7);
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .tab-button:hover {
      border-color: rgba(77, 166, 255, 0.6);
      color: #e0e0e0;
    }

    .tab-button.active {
      background: rgba(77, 166, 255, 0.2);
      border-color: #4da6ff;
      color: #4da6ff;
    }

    .beta-badge {
      background: #ff6b6b;
      color: white;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
    }

    /* MAIN LAYOUT */
    .main-container {
      display: flex;
      width: 100%;
      margin-top: 50px;
      flex: 1;
    }

    /* LEFT SIDEBAR - Controls */
    .sidebar {
      width: 280px;
      background: #0f172a;
      border-right: 1px solid rgba(255, 255, 255, 0.06);
      overflow-y: auto;
      padding: 20px;
      animation: sidebarSlideIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 2.5s backwards;
    }

    @keyframes sidebarSlideIn {
      from {
        transform: translateX(-100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .sidebar-section {
      margin-bottom: 25px;
    }

    .sidebar-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      color: #4da6ff;
      margin-bottom: 12px;
      opacity: 0.8;
      letter-spacing: 0.5px;
    }

    .color-group {
      margin-bottom: 15px;
    }

    .color-label {
      font-size: 11px;
      opacity: 0.7;
      text-transform: capitalize;
      margin-bottom: 6px;
      display: block;
    }

    input[type="color"] {
      width: 100%;
      height: 40px;
      border: 1px solid rgba(77, 166, 255, 0.3);
      border-radius: 6px;
      cursor: pointer;
      background: none;
      transition: all 0.2s ease;
    }

    input[type="color"]:hover {
      border-color: rgba(77, 166, 255, 0.6);
      box-shadow: 0 0 12px rgba(77, 166, 255, 0.2);
    }

    select {
      transition: all 0.2s ease;
    }

    select:hover {
      border-color: rgba(77, 166, 255, 0.6) !important;
      box-shadow: 0 0 12px rgba(77, 166, 255, 0.2) !important;
    }

    select:focus {
      outline: none;
      border-color: #4da6ff !important;
      box-shadow: 0 0 16px rgba(77, 166, 255, 0.4) !important;
    }

    #syntaxColorsContainer {
      scrollbar-width: thin;
      scrollbar-color: rgba(77, 166, 255, 0.3) transparent;
    }

    #syntaxColorsContainer::-webkit-scrollbar {
      width: 6px;
    }

    #syntaxColorsContainer::-webkit-scrollbar-track {
      background: transparent;
    }

    #syntaxColorsContainer::-webkit-scrollbar-thumb {
      background: rgba(77, 166, 255, 0.3);
      border-radius: 3px;
    }

    #syntaxColorsContainer::-webkit-scrollbar-thumb:hover {
      background: rgba(77, 166, 255, 0.5);
    }

    /* BUTTONS */
    .button-group {
      display: flex;
      gap: 8px;
      margin-top: 15px;
    }

    button {
      flex: 1;
      padding: 10px 16px;
      border: none;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    }

    button:active {
      transform: translateY(0);
    }

    .btn-primary {
      background: #4da6ff;
      color: white;
    }

    .btn-primary:hover {
      background: #3d96ff;
      box-shadow: 0 0 20px rgba(77, 166, 255, 0.4);
    }

    .btn-secondary {
      background: #22c55e;
      color: white;
    }

    .btn-secondary:hover {
      background: #16a34a;
    }

    .btn-danger {
      background: #ef4444;
      color: white;
      flex: 1;
      width: 100%;
    }

    .btn-danger:hover {
      background: #dc2626;
      box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
    }

    /* CENTER - PREVIEW */
    .preview-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: radial-gradient(circle at top, #111c33, #0b1220);
      overflow: hidden;
      animation: previewFadeIn 0.8s ease-out 2.5s backwards;
    }

    .release-notes-container {
      flex: 1;
      overflow-y: auto;
      background: radial-gradient(circle at top, #111c33, #0b1220);
      display: none;
    }

    .release-notes-container.active {
      display: block;
    }

    .preview-area.hidden {
      display: none;
    }

    @keyframes previewFadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .preview-header {
      padding: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      text-align: center;
    }

    .preview-header h2 {
      font-size: 14px;
      color: #4da6ff;
      opacity: 0.9;
      margin-bottom: 8px;
    }

    .preview-container {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 40px;
      overflow: auto;
    }

    .preview-frame {
      width: 100%;
      max-width: 500px;
      background: #1e293b;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      transition: all 0.3s ease;
      transform: translateY(0);
      animation: frameSlideUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 2.6s backwards;
    }

    @keyframes frameSlideUp {
      from {
        transform: translateY(40px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .preview-frame:hover {
      transform: translateY(-4px);
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.7);
    }

    .preview-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 20px;
      color: #e0e0e0;
    }

    .preview-content {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .preview-btn {
      padding: 12px 20px;
      background: #22c55e;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s ease;
    }

    .preview-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 0 15px rgba(34, 197, 94, 0.6);
    }

    .preview-card {
      background: #111c33;
      border: 1px solid rgba(77, 166, 255, 0.2);
      border-radius: 8px;
      padding: 15px;
      font-size: 13px;
      opacity: 0.9;
    }

    .preview-input {
      background: #0f172a;
      border: 1px solid rgba(77, 166, 255, 0.3);
      border-radius: 6px;
      padding: 10px 12px;
      color: #e0e0e0;
      font-size: 13px;
    }

    /* RIGHT SIDEBAR - Layout & Settings */
    .right-sidebar {
      width: 260px;
      background: #0f172a;
      border-left: 1px solid rgba(255, 255, 255, 0.06);
      overflow-y: auto;
      padding: 20px;
      animation: rightSidebarSlideIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 2.6s backwards;
    }

    @keyframes rightSidebarSlideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .layout-option {
      margin-bottom: 12px;
      padding: 10px;
      background: rgba(77, 166, 255, 0.1);
      border: 1px solid rgba(77, 166, 255, 0.2);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 12px;
      text-align: center;
    }

    .layout-option:hover {
      background: rgba(77, 166, 255, 0.2);
      border-color: rgba(77, 166, 255, 0.4);
    }

    .layout-option.active {
      background: rgba(77, 166, 255, 0.3);
      border-color: #4da6ff;
      color: #4da6ff;
    }

    /* FLASH ANIMATION */
    .flash {
      animation: flash 0.3s ease;
    }

    @keyframes flash {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.02); opacity: 0.8; }
      100% { transform: scale(1); opacity: 1; }
    }

    /* SCROLLBAR */
    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-track {
      background: transparent;
    }

    ::-webkit-scrollbar-thumb {
      background: rgba(77, 166, 255, 0.3);
      border-radius: 4px;
    }

    /* RESPONSIVE DESIGN */
    @media (max-width: 1400px) {
      .sidebar {
        width: 240px;
      }
      .right-sidebar {
        width: 240px;
      }
    }

    @media (max-width: 1200px) {
      .main-container {
        flex-direction: column;
      }

      .sidebar {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        max-height: 200px;
        overflow-x: auto;
        display: flex;
        flex-direction: row;
        padding: 15px;
      }

      .sidebar-section {
        margin-right: 30px;
        margin-bottom: 0;
        flex-shrink: 0;
      }

      .preview-area {
        flex: 1;
        min-height: 400px;
      }

      .right-sidebar {
        width: 100%;
        border-left: none;
        border-top: 1px solid rgba(255, 255, 255, 0.06);
        max-height: 350px;
        overflow-y: auto;
        display: flex;
        flex-direction: row;
        padding: 15px;
      }

      .right-sidebar .sidebar-section {
        margin-right: 40px;
        margin-bottom: 0;
        flex-shrink: 0;
        min-width: 280px;
      }
    }

    @media (max-width: 768px) {
      .header {
        height: 45px;
        padding: 0 12px;
      }

      .header-title {
        font-size: 16px;
        gap: 6px;
      }

      .main-container {
        margin-top: 45px;
        height: calc(100vh - 45px);
      }

      .sidebar {
        max-height: 150px;
        padding: 10px;
      }

      .sidebar-section {
        margin-right: 20px;
      }

      .sidebar-title {
        font-size: 10px;
        margin-bottom: 8px;
      }

      .color-group {
        margin-bottom: 10px;
      }

      .color-label {
        font-size: 10px;
        margin-bottom: 4px;
      }

      input[type="color"] {
        height: 32px;
      }

      .button-group {
        gap: 6px;
      }

      button {
        padding: 8px 12px;
        font-size: 10px;
      }

      .preview-area {
        min-height: 300px;
      }

      .preview-container {
        padding: 20px;
      }

      .preview-frame {
        max-width: 100%;
        padding: 20px;
      }

      .right-sidebar {
        max-height: 300px;
        padding: 10px;
      }

      .right-sidebar .sidebar-section {
        min-width: 250px;
        margin-right: 20px;
      }

      select {
        font-size: 11px;
        padding: 6px;
      }
    }

    @media (max-width: 480px) {
      body {
        font-size: 12px;
      }

      .header {
        height: 40px;
        padding: 0 10px;
      }

      .header-title {
        font-size: 14px;
      }

      .main-container {
        margin-top: 40px;
        height: calc(100vh - 40px);
      }

      .sidebar {
        flex-direction: column;
        max-height: 200px;
      }

      .sidebar-section {
        margin-right: 0;
        margin-bottom: 12px;
      }

      .preview-container {
        padding: 10px;
      }

      .preview-frame {
        padding: 15px;
        border-radius: 8px;
      }

      .preview-title {
        font-size: 14px;
        margin-bottom: 12px;
      }

      .preview-content {
        gap: 10px;
      }

      .right-sidebar {
        flex-direction: column;
        max-height: 100%;
      }

      .right-sidebar .sidebar-section {
        min-width: 100%;
        margin-right: 0;
        margin-bottom: 15px;
      }

      input[type="color"] {
        height: 28px;
      }

      #syntaxColorsContainer {
        max-height: 150px;
        overflow-y: auto;
      }
    }
  </style>
</head>
<body>

  <!-- NETFLIX-STYLE INTRO -->
  <div class="intro-overlay">
    <div class="intro-content">
      <div class="intro-snowflake" style="font-size: 80px; display: inline-block;">
        <svg width="80" height="80" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 20 L110 50 L140 40 L125 65 L155 75 L125 85 L145 115 L115 105 L100 135 L85 105 L55 115 L75 85 L45 75 L75 65 L60 40 L90 50 Z" fill="#005BB5" stroke="#005BB5" stroke-width="2" stroke-linejoin="round"/>
          <path d="M100 35 L105 55 L125 50 L115 65 L135 75 L115 85 L125 105 L105 95 L100 115 L95 95 L75 105 L85 85 L65 75 L85 65 L75 50 L95 55 Z" fill="white"/>
          <circle cx="100" cy="75" r="10" fill="#E63946"/>
        </svg>
      </div>
      <div class="intro-text">SNOW STUDIO</div>
      <div class="intro-subtitle">Theme Studio</div>
      <div class="intro-bar" style="width: 200px;"></div>
    </div>
  </div>

  <!-- APP WRAPPER -->
  <div class="app-wrapper">

    <!-- HEADER -->
    <div class="header">
      <div class="header-title">
        <span style="display: inline-block; width: 20px; height: 20px; margin-right: 8px;">
          <svg width="20" height="20" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 20 L110 50 L140 40 L125 65 L155 75 L125 85 L145 115 L115 105 L100 135 L85 105 L55 115 L75 85 L45 75 L75 65 L60 40 L90 50 Z" fill="#60a5fa" stroke="#60a5fa" stroke-width="2" stroke-linejoin="round"/>
            <path d="M100 35 L105 55 L125 50 L115 65 L135 75 L115 85 L125 105 L105 95 L100 115 L95 95 L75 105 L85 85 L65 75 L85 65 L75 50 L95 55 Z" fill="white"/>
            <circle cx="100" cy="75" r="10" fill="#E63946"/>
          </svg>
        </span>
        Snow Studio
      </div>
      <div class="header-tabs">
        <button class="tab-button active" id="studioTab">Studio</button>
        <button class="tab-button" id="releaseNotesTab">Release Notes</button>
        ${isBeta ? '<div class="beta-badge">BETA</div>' : ""}
      </div>
    </div>

    <!-- MAIN CONTAINER -->
    <div class="main-container">
      <div class="sidebar">
        <div class="sidebar-section">
          <div class="sidebar-title">Color Controls</div>

          <div class="color-group">
            <label class="color-label">Background</label>
            <input type="color" id="bgColor" value="#0F172A"/>
          </div>

          <div class="color-group">
            <label class="color-label">Surface</label>
            <input type="color" id="surfaceColor" value="#1E293B"/>
          </div>

          <div class="color-group">
            <label class="color-label">Primary Accent</label>
            <input type="color" id="accentColor" value="#4DA6FF"/>
          </div>

          <div class="color-group">
            <label class="color-label">Secondary Accent</label>
            <input type="color" id="secondaryColor" value="#22C55E"/>
          </div>

          <div class="color-group">
            <label class="color-label">Text / Foreground</label>
            <input type="color" id="textColor" value="#FFFFFF"/>
          </div>
        </div>

        <div class="sidebar-section">
          <div class="sidebar-title">🎯 Theme Actions</div>
          <div class="button-group">
            <button class="btn-primary" id="createBtn">Create</button>
            <button class="btn-secondary" id="exportBtn">Export</button>
          </div>
          <button class="btn-danger" id="resetBtn" style="width: 100%; margin-top: 10px;">Reset Theme</button>
        </div>

        <div class="sidebar-section">
          <div class="sidebar-title">💾 Presets</div>
          <div style="font-size: 12px; opacity: 0.6;">
            Coming Soon: Saved theme presets
          </div>
        </div>
      </div>

      <!-- CENTER - PREVIEW AREA -->
      <div class="preview-area">
        <div class="preview-header">
          <h2>Live Theme Preview</h2>
          <div style="font-size: 11px; opacity: 0.6;">Changes apply in real-time</div>
        </div>

        <div class="preview-container" id="canvas">
          <div class="preview-frame" id="frame">
            <div class="preview-title">Snow Throne Theme Studio</div>

            <div class="preview-content">
              <button class="preview-btn">Primary Button</button>

              <input type="text" class="preview-input" placeholder="Text input field">

              <div class="preview-card">
                <strong>Component Card</strong><br>
                <span style="opacity: 0.7;">Theme preview card (Figma style)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT SIDEBAR - LANGUAGE SYNTAX COLORS -->
      <div class="right-sidebar">
        <div class="sidebar-section">
          <div class="sidebar-title">🎨 Language Syntax Colors</div>
          <div style="margin-bottom: 12px;">
            <label class="color-label">Select Language</label>
            <select id="languageSelect" style="width: 100%; padding: 10px; border-radius: 6px; border: 2px solid rgba(77, 166, 255, 0.5); background: #1e293b; color: #e0e0e0; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.2s ease;" onchange="this.style.borderColor='rgba(77, 166, 255, 0.8)';">
              <option value="html">🔖 HTML - Tags & Attributes</option>
              <option value="css">🎨 CSS - Properties & Selectors</option>
              <option value="javascript">⚙️ JavaScript - Functions & Keywords</option>
              <option value="python">🐍 Python - Classes & Decorators</option>
            </select>
          </div>
        </div>

        <div class="sidebar-section">
          <div class="sidebar-title">🌈 Customize Syntax</div>
          <div id="syntaxColorsContainer" style="margin-top: 10px; max-height: 400px; overflow-y: auto; padding-right: 5px;">
            <!-- Syntax color pickers will be dynamically inserted here -->
          </div>
        </div>

        <div class="sidebar-section">
          <div class="sidebar-title">💡 Quick Reference</div>
          <div style="font-size: 11px; opacity: 0.6; background: rgba(77, 166, 255, 0.1); padding: 12px; border-radius: 6px; border-left: 3px solid #4da6ff;">
            <strong style="color: #4da6ff;">Language Colors:</strong><br>
            <div style="margin-top: 8px; line-height: 1.8;">
              <strong>HTML:</strong> Tags (red), Attrs (amber)<br>
              <strong>CSS:</strong> Props (blue), Values (green)<br>
              <strong>JS:</strong> Functions (cyan), Keywords (pink)<br>
              <strong>Python:</strong> Classes (purple), Deco (amber)
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- RELEASE NOTES CONTAINER -->
    <div class="release-notes-container" id="releaseNotesContainer">
      <!-- Release notes will be injected here by JavaScript -->
    </div>

  </div>

  <script>
    const vscode = acquireVsCodeApi();
    window.releaseNotesHTML = ${JSON.stringify(releaseNotesHtml)};

    function send(type, data = {}) {
      vscode.postMessage({ type, ...data });
    }

    // ==================== TAB MANAGEMENT ====================
    const studioTab = document.getElementById("studioTab");
    const releaseNotesTab = document.getElementById("releaseNotesTab");
    const mainContainer = document.querySelector(".main-container");
    const releaseNotesContainer = document.getElementById("releaseNotesContainer");

    studioTab.addEventListener("click", () => {
      studioTab.classList.add("active");
      releaseNotesTab.classList.remove("active");
      mainContainer.classList.remove("hidden");
      releaseNotesContainer.classList.remove("active");
    });

    releaseNotesTab.addEventListener("click", () => {
      releaseNotesTab.classList.add("active");
      studioTab.classList.remove("active");
      mainContainer.classList.add("hidden");
      releaseNotesContainer.classList.add("active");
    });

    // Release notes will be injected via iframe or loaded dynamically
    // For now, show a placeholder
    function loadReleaseNotes() {
      releaseNotesContainer.innerHTML = window.releaseNotesHTML || '<div style="padding: 40px; text-align: center; color: #4da6ff;"><h2>📝 Release Notes</h2><p style="margin-top: 20px; color: #94a3b8;">Snow Studio Release notes loaded</p></div>';
    }

    // Initialize release notes on first load
    loadReleaseNotes();

    function animate() {
      const frame = document.getElementById("frame");
      frame.classList.remove("flash");
      void frame.offsetWidth;
      frame.classList.add("flash");
    }

    // Language syntax colors
    const languageSelect = document.getElementById("languageSelect");
    const syntaxColorsContainer = document.getElementById("syntaxColorsContainer");

    languageSelect.addEventListener("change", (e) => {
      loadLanguageRules(e.target.value);
      languageSelect.style.borderColor = "rgba(77, 166, 255, 0.8)";
      setTimeout(() => {
        languageSelect.style.borderColor = "rgba(77, 166, 255, 0.5)";
      }, 200);
    });

    function loadLanguageRules(language) {
      send("getLanguageRules", { language });
    }

    window.addEventListener("message", (event) => {
      const message = event.data;
      if (message.type === "languageRules") {
        displayLanguageRules(message.language, message.rules);
      }
    });

    function displayLanguageRules(language, rules) {
      syntaxColorsContainer.innerHTML = "";

      if (rules.length === 0) {
        syntaxColorsContainer.innerHTML =
          '<div style="opacity: 0.6; font-size: 12px;">No rules found for this language</div>';
        return;
      }

      rules.forEach((rule, index) => {
        const foreground = rule.settings?.foreground || "#ffffff";
        const colorGroup = document.createElement("div");
        colorGroup.className = "color-group";
        colorGroup.style.animation = "slideIn 0.3s ease " + (index * 0.05) + "s";
        colorGroup.style.animationFillMode = "both";

        const label = document.createElement("label");
        label.className = "color-label";
        label.textContent = rule.name || rule.scope;
        label.title = Array.isArray(rule.scope) ? rule.scope.join(", ") : rule.scope;
        label.style.display = "flex";
        label.style.justifyContent = "space-between";
        label.style.alignItems = "center";

        const colorPreview = document.createElement("span");
        colorPreview.style.display = "inline-block";
        colorPreview.style.width = "12px";
        colorPreview.style.height = "12px";
        colorPreview.style.borderRadius = "2px";
        colorPreview.style.backgroundColor = foreground;
        colorPreview.style.border = "1px solid rgba(255,255,255,0.2)";
        label.appendChild(colorPreview);

        const input = document.createElement("input");
        input.type = "color";
        input.value = foreground;
        input.style.cursor = "pointer";
        input.addEventListener("input", (e) => {
          colorPreview.style.backgroundColor = e.target.value;
          send("updateSyntaxColor", {
            language: language,
            scope: Array.isArray(rule.scope) ? rule.scope[0] : rule.scope,
            color: e.target.value,
          });
        });

        colorGroup.appendChild(label);
        colorGroup.appendChild(input);
        syntaxColorsContainer.appendChild(colorGroup);
      });
    }

    // Add slide-in animation
    const style = document.createElement("style");
    style.textContent = "@keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }";
    document.head.appendChild(style);

    // Load initial language rules
    loadLanguageRules("html");

    // Color input handlers
    document.getElementById("bgColor").addEventListener("input", (e) => {
      document.getElementById("canvas").style.background = e.target.value;
      animate();
      send("updateColor", { key: "editor.background", value: e.target.value });
    });

    document.getElementById("accentColor").addEventListener("input", (e) => {
      document.documentElement.style.setProperty("--accent-color", e.target.value);
      animate();
      send("updateColor", { key: "button.background", value: e.target.value });
    });

    document.getElementById("textColor").addEventListener("input", (e) => {
      document.getElementById("frame").style.color = e.target.value;
      animate();
      send("updateColor", { key: "editor.foreground", value: e.target.value });
    });

    // Action buttons
    document.getElementById("resetBtn").addEventListener("click", () => {
      document.getElementById("canvas").style.background = "#0b1220";
      document.getElementById("bgColor").value = "#0F172A";
      document.getElementById("textColor").value = "#FFFFFF";
      animate();
      send("resetTheme");
    });

    document.getElementById("exportBtn").addEventListener("click", () => {
      send("exportTheme", { theme: "current" });
    });

    document.getElementById("createBtn").addEventListener("click", () => {
      send("createTheme", { name: "Custom Theme" });
    });

    // Handle window resize for responsive behavior
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        loadLanguageRules(languageSelect.value);
      }, 500);
    });
  </script>

</body>
</html>
  `;
}
//# sourceMappingURL=previewPanel.js.map