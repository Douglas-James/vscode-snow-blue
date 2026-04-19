import * as vscode from "vscode";

export function createPreviewPanel() {
  const panel = vscode.window.createWebviewPanel(
    "snowThemePreview",
    "Snow Throne Live Preview",
    vscode.ViewColumn.Two,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
    },
  );

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
