// Writes README.md from the asset names. Run: node scripts/readme.mjs
import { writeFileSync, readFileSync } from "node:fs";
const pct = (id) => (readFileSync(new URL(`../assets/btn-${id}-dark.svg`, import.meta.url), "utf8").match(/width="(\d+)"/)[1] / 880 * 100).toFixed(2) + "%";

const pic = (name, alt, attrs = "") =>
  `<picture><source media="(prefers-color-scheme: dark)" srcset="assets/${name}-dark.svg"><img src="assets/${name}-light.svg" alt="${alt}" ${attrs}></picture>`;
const link = (href, inner) => (href ? `<a href="${href}">${inner}</a>` : inner);

const LINKS = {
  telegram: "https://t.me/ssizy",
  email: "mailto:hossein85salehi@gmail.com",
  linkedin: "https://www.linkedin.com/in/hossein-salehi-b94759303/",
  portfolio: "https://ssizyyy.github.io/portfolio/",
};
const BTN = [["telegram", "Message on Telegram"], ["email", "Email me"], ["linkedin", "LinkedIn"], ["portfolio", "Portfolio"]];
const REPO = (n) => `https://github.com/Ssizyyy/${n}`;
const ROWS = [
  [["portfolio", "portfolio", "Developer portfolio site", true], ["claude-plugins", "claude-plugins", "Claude Code plugin marketplace", true]],
  [["g69-config", "g69-config", "Offline Windows configurator for the Onikuma G69 keyboard", true], ["claude-kit-manager", "claude-kit-manager", "Local dashboard for Claude Code setup (private)", false]],
];

const md = `<p>${pic("hero", "Hossein Salehi, @Ssizy. I turn rough ideas into shipped products: sites, desktop tools and everything between. Open for freelance work, UTC+3:30.", 'width="100%"')}</p>

<p>
${BTN.map(([id, label]) => link(LINKS[id], pic(`btn-${id}`, label, `width="${pct(id)}"`))).join("\n")}
</p>

${pic("h-stack", "Stack", 'width="100%"')}

${pic("stack", "Stack: TypeScript, JavaScript, React, Astro, Tailwind; Node.js, Go, Rust, Python, C#; Electron, Docker, Git.", 'width="100%"')}

${pic("h-featured", "Featured", 'width="100%"')}

${ROWS.map((row) => "<p>\n" + row.map(([id, , alt, pub]) => link(pub ? REPO(id) : "", pic(`card-${id}`, alt, 'width="49%"'))).join("\n") + "\n</p>").join("\n\n")}

<p>${pic("card-shaneh", "Shaneh · Nextcloud stack (private): Persian RTL product site and a self-hosted Nextcloud fork for schools and companies.", 'width="100%"')}</p>

${pic("h-currently", "Currently building", 'width="100%"')}

${pic("building", "Recently active repositories, refreshed automatically.", 'width="100%"')}

<p align="center"><sub>© Hossein Salehi · built with SVG, no widgets</sub></p>
`;
writeFileSync(new URL("../README.md", import.meta.url), md);
