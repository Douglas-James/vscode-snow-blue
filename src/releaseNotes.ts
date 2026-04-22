/**
 * Snow Studio Release Notes
 * Contains only Snow Studio tool updates, not theme content changes
 */

export interface ReleaseNote {
  version: string;
  date: string;
  title: string;
  highlights: string[];
  features?: string[];
}

export const RELEASE_NOTES: ReleaseNote[] = [
  {
    version: "2.1.0",
    date: "April 19, 2026",
    title: "Snow Studio Theme Switcher",
    highlights: [
      "⚡ New Snow Throne: Switch Theme command",
      "Switch between themes directly from Command Palette",
      "60-30-10 unified design system across all themes",
      "Improved color system for better readability",
    ],
    features: [
      "Quick theme switching without opening theme picker",
      "Standardized color hierarchy across dark and light modes",
      "Better contrast behavior for all themes",
    ],
  },
  {
    version: "1.1.0",
    date: "January 30, 2025",
    title: "Snow Studio Theme Management",
    highlights: [
      "🎨 Theme management system",
      "Multi-theme extension structure",
      "Enhanced theme switching experience",
    ],
    features: [
      "Support for multiple seasonal themes",
      "Improved theme switching UI",
      "Better readability for HTML, CSS, and JavaScript",
    ],
  },
  {
    version: "1.0.4",
    date: "January 28, 2025",
    title: "Marketplace Ready",
    highlights: [
      "📦 Marketplace-ready extension packaging",
      "GitHub Actions CI/CD workflow",
      "Improved README documentation",
    ],
  },
  {
    version: "1.0.3",
    date: "January 27, 2025",
    title: "Initial Snow Studio Release",
    highlights: [
      "🚀 Initial Snow Studio release",
      "Web development optimized defaults",
      "Markdown-friendly styling system",
    ],
  },
];

export function getReleaseNotesHTML(): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Snow Studio Release Notes</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #e2e8f0;
          line-height: 1.6;
          padding: 20px;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 2px solid #64748b;
          padding-bottom: 20px;
        }

        .header h1 {
          font-size: 2.5em;
          margin-bottom: 10px;
          background: linear-gradient(135deg, #60a5fa 0%, #93c5fd 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header p {
          color: #94a3b8;
          font-size: 0.95em;
        }

        .release {
          margin-bottom: 40px;
          padding: 20px;
          background: rgba(30, 41, 59, 0.6);
          border-left: 4px solid #60a5fa;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .release:hover {
          background: rgba(30, 41, 59, 0.8);
          border-left-color: #93c5fd;
        }

        .release-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 15px;
        }

        .release-version {
          font-size: 1.4em;
          font-weight: bold;
          color: #60a5fa;
        }

        .release-date {
          font-size: 0.9em;
          color: #94a3b8;
        }

        .release-title {
          font-size: 1.1em;
          color: #e2e8f0;
          margin-bottom: 15px;
          font-weight: 600;
        }

        .highlights {
          margin-bottom: 15px;
        }

        .highlights h4 {
          font-size: 0.9em;
          color: #cbd5e1;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
          opacity: 0.8;
        }

        .highlights ul {
          list-style: none;
          padding: 0;
        }

        .highlights li {
          padding: 6px 0 6px 24px;
          position: relative;
          color: #cbd5e1;
          font-size: 0.95em;
        }

        .highlights li:before {
          content: "▸";
          position: absolute;
          left: 0;
          color: #60a5fa;
        }

        .footer {
          text-align: center;
          padding-top: 20px;
          border-top: 2px solid #64748b;
          color: #94a3b8;
          font-size: 0.9em;
        }

        .badge {
          display: inline-block;
          padding: 4px 12px;
          background: rgba(96, 165, 250, 0.1);
          border: 1px solid #60a5fa;
          border-radius: 12px;
          font-size: 0.8em;
          color: #60a5fa;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>❄️ Snow Studio</h1>
          <p>Release Notes & What's New</p>
        </div>

        ${RELEASE_NOTES.map(
          (release) => `
          <div class="release">
            <div class="release-header">
              <span class="release-version">v${release.version}</span>
              <span class="release-date">${release.date}</span>
            </div>
            <div class="release-title">${release.title}</div>
            <div class="highlights">
              <h4>Highlights</h4>
              <ul>
                ${release.highlights.map((h) => `<li>${h}</li>`).join("")}
              </ul>
            </div>
            ${
              release.features
                ? `
              <div class="highlights">
                <h4>Features</h4>
                <ul>
                  ${release.features.map((f) => `<li>${f}</li>`).join("")}
                </ul>
              </div>
            `
                : ""
            }
            <span class="badge">Studio Tool Update</span>
          </div>
        `,
        ).join("")}

        <div class="footer">
          <p>🎨 Snow Studio — Premium Theme System for VS Code</p>
          <p style="margin-top: 10px; font-size: 0.85em;">Made with ❄️ for long coding sessions</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
