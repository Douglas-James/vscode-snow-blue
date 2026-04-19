const fs = require("fs");

const themes = [
  {
    name: "Snow Blue",
    bg: "#0f172a",
    card: "#1e293b",
    accent: "#78c0f0",
  },
  {
    name: "Slate Amber Night",
    bg: "#0f172a",
    card: "#1e293b",
    accent: "#f59e0b",
  },
  {
    name: "Christmas Night",
    bg: "#0b3d2e",
    card: "#165b33",
    accent: "#ea4630",
  },
  {
    name: "Christmas Day",
    bg: "#ffffff",
    card: "#f3f4f6",
    accent: "#bb2528",
  },
];

for (const theme of themes) {
  const html = `
  <html>
  <body style="background:${theme.bg};color:${theme.accent};font-family:sans-serif;padding:40px;">
    <h1>${theme.name}</h1>

    <button style="background:${theme.accent};color:white;padding:10px;border:none;">
      Button
    </button>

    <div style="margin-top:20px;background:${theme.card};padding:20px;">
      Card Preview
    </div>
  </body>
  </html>
  `;

  fs.writeFileSync(`preview-${theme.name}.html`, html);
}

console.log("All previews generated");
