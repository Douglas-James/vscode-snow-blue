"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeFileIcons = initializeFileIcons;
exports.getFileIcon = getFileIcon;
function initializeFileIcons(context) {
    console.log("File icons initialized for Snow Blue Theme Studio");
}
function getFileIcon(fileName) {
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    const iconMap = {
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
//# sourceMappingURL=icons.js.map