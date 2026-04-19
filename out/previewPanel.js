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
function createPreviewPanel() {
    const panel = vscode.window.createWebviewPanel("snowThemePreview", "Snow Throne Live Preview", vscode.ViewColumn.Two, {
        enableScripts: true,
        retainContextWhenHidden: true,
    });
    panel.webview.html = getHtml();
    return panel;
}
function getHtml() {
    return `
  <html>
  <body style="font-family: sans-serif; padding: 20px;">

    <h2 id="title">Snow Throne Theme Studio</h2>

    <div style="margin-bottom:20px;">

      <label>Background</label><br/>
      <input type="color" id="bgColor" value="#0F172A" />

      <br/><br/>

      <label>Accent</label><br/>
      <input type="color" id="accentColor" value="#22C55E" />

      <br/><br/>

      <label>Text</label><br/>
      <input type="color" id="textColor" value="#FFFFFF" />

    </div>

    <button id="btn" style="padding:10px;background:#22C55E;color:white;">
      Button
    </button>

    <div id="card" style="margin-top:20px;padding:10px;background:#1E293B;color:white;">
      Card Preview
    </div>

    <pre style="margin-top:20px;background:#0F172A;color:#F8B229;padding:10px;">
const theme = "Snow Throne";
    </pre>

    <script>
      const vscode = acquireVsCodeApi();

      function sendUpdate(key, value) {
        vscode.postMessage({
          type: "updateColor",
          key,
          value
        });
      }

      document.getElementById("bgColor").addEventListener("input", (e) => {
        document.body.style.background = e.target.value;
        sendUpdate("editor.background", e.target.value);
      });

      document.getElementById("accentColor").addEventListener("input", (e) => {
        document.getElementById("btn").style.background = e.target.value;
        sendUpdate("button.background", e.target.value);
      });

      document.getElementById("textColor").addEventListener("input", (e) => {
        document.body.style.color = e.target.value;
        sendUpdate("editor.foreground", e.target.value);
      });

      window.addEventListener("message", (event) => {
        const msg = event.data;

        if (msg.type === "themeChanged") {
          document.getElementById("title").innerText =
            "Theme: " + msg.theme;
        }
      });
    </script>

  </body>
  </html>
  `;
}
//# sourceMappingURL=previewPanel.js.map