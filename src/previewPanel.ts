import * as vscode from "vscode";

export function createPreviewPanel(isBeta: boolean) {
  const panel = vscode.window.createWebviewPanel(
    "snowThemePreview",
    "Snow Throne Theme Studio",
    vscode.ViewColumn.Two,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
    },
  );

  panel.webview.html = getHtml(isBeta);

  return panel;
}

function getHtml(isBeta: boolean) {
  return `
  <html>
  <body>

  <style>
    body {
      margin: 0;
      font-family: sans-serif;
      background: #0b1220;
      color: white;
      display: flex;
      height: 100vh;
    }

    /* LEFT PANEL (like Figma sidebar) */
    .sidebar {
      width: 260px;
      padding: 20px;
      background: #0f172a;
      border-right: 1px solid rgba(255,255,255,0.06);
    }

    .sidebar h3 {
      margin-bottom: 15px;
      opacity: 0.9;
    }

    label {
      font-size: 12px;
      opacity: 0.7;
    }

    input[type="color"] {
      width: 100%;
      height: 35px;
      margin-bottom: 15px;
      border: none;
      background: none;
      cursor: pointer;
    }

    /* MAIN CANVAS */
    .canvas {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      background: radial-gradient(circle at top, #111c33, #0b1220);
      transition: all 0.5s ease;
    }

    /* DESIGN FRAME */
    .frame {
      width: 420px;
      padding: 20px;
      border-radius: 14px;
      background: #1e293b;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      transition: all 0.3s ease;
      transform: translateY(0);
    }

    .frame:hover {
      transform: translateY(-6px);
      box-shadow: 0 30px 80px rgba(0,0,0,0.7);
    }

    /* BUTTON */
    button {
      padding: 10px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.25s ease;
    }

    #btn {
      background: #22C55E;
      color: white;
    }

    #btn:hover {
      transform: scale(1.05);
      box-shadow: 0 0 15px rgba(34,197,94,0.6);
    }

    #resetBtn {
      background: #ef4444;
      color: white;
      width: 100%;
      margin-top: 10px;
    }

    /* TOP LABEL */
    .title {
      font-size: 14px;
      opacity: 0.8;
      margin-bottom: 10px;
    }

    .beta {
      font-size: 11px;
      opacity: 0.5;
    }

    /* smooth flash */
    .flash {
      animation: flash 0.3s ease;
    }

    @keyframes flash {
      0% { transform: scale(1); }
      50% { transform: scale(1.01); }
      100% { transform: scale(1); }
    }

  </style>

  <!-- SIDEBAR -->
  <div class="sidebar">
    <h3>Theme Studio</h3>
    <div class="beta">${isBeta ? "BETA MODE" : ""}</div>

    <br/>

    <label>Background</label>
    <input type="color" id="bgColor" value="#0F172A"/>

    <label>Accent</label>
    <input type="color" id="accentColor" value="#22C55E"/>

    <label>Text</label>
    <input type="color" id="textColor" value="#FFFFFF"/>

    <button id="resetBtn">Reset</button>
  </div>

  <!-- CANVAS -->
  <div class="canvas" id="canvas">

    <div class="frame" id="frame">

      <div class="title" id="title">
        Snow Throne Theme Studio
      </div>

      <button id="btn">Button</button>

      <div style="margin-top:15px; padding:12px; background:#111c33; border-radius:10px;">
        Card Preview (Figma Style)
      </div>

    </div>

  </div>

  <script>
    const vscode = acquireVsCodeApi();

    function send(key, value) {
      vscode.postMessage({ type: "updateColor", key, value });
    }

    function animate() {
      const frame = document.getElementById("frame");
      frame.classList.remove("flash");
      void frame.offsetWidth;
      frame.classList.add("flash");
    }

    document.getElementById("bgColor").addEventListener("input", (e) => {
      document.getElementById("canvas").style.background = e.target.value;
      animate();
      send("editor.background", e.target.value);
    });

    document.getElementById("accentColor").addEventListener("input", (e) => {
      document.getElementById("btn").style.background = e.target.value;
      animate();
      send("button.background", e.target.value);
    });

    document.getElementById("textColor").addEventListener("input", (e) => {
      document.getElementById("frame").style.color = e.target.value;
      animate();
      send("editor.foreground", e.target.value);
    });

    document.getElementById("resetBtn").addEventListener("click", () => {
      document.getElementById("canvas").style.background = "#0b1220";
      document.getElementById("btn").style.background = "#22C55E";
      document.getElementById("frame").style.color = "white";
      animate();

      vscode.postMessage({ type: "resetTheme" });
    });

  </script>

  </body>
  </html>
  `;
}
