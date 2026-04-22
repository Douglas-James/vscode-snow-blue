import * as vscode from "vscode";

export function initializeFileIcons(context: vscode.ExtensionContext) {
  console.log("File icons initialized for Snow Blue Theme Studio");
}

export function getFileIcon(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";

  const iconMap: { [key: string]: string } = {
    js: "📄 JS",
    jsx: "📄 JSX",
    ts: "📄 TS",
    tsx: "📄 TSX",
    html: "🌐 HTML",
    htm: "🌐 HTML",
    css: "🎨 CSS",
    scss: "🎨 SCSS",
    less: "🎨 LESS",
    py: "🐍 Python",
    json: "📋 JSON",
    md: "📝 Markdown",
    txt: "📄 Text",
  };

  return iconMap[ext] || "📄 File";
}
