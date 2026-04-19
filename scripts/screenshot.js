const puppeteer = require("puppeteer");
const fs = require("fs");

const previews = [
  { file: "preview-Snow Blue.html", out: "images/snow-blue.png" },
  { file: "preview-Slate Amber Night.html", out: "images/slate-amber.png" },
  { file: "preview-Christmas Night.html", out: "images/christmas-night.png" },
  { file: "preview-Christmas Day.html", out: "images/christmas-day.png" },
];

(async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (const p of previews) {
    const page = await browser.newPage();
    const html = fs.readFileSync(p.file, "utf8");

    await page.setContent(html);
    await page.setViewport({ width: 1200, height: 700 });

    await page.screenshot({ path: p.out, fullPage: true });

    await page.close();

    console.log("Saved:", p.out);
  }

  await browser.close();
})();
