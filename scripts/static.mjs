// Generates the static SVG assets (hero, buttons, headings, stack, featured cards). Run: node scripts/static.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { W, THEMES, esc, tw, wrap, icon, svg, glassCard, MONO } from "./lib.mjs";

const out = new URL("../assets/", import.meta.url);
mkdirSync(out, { recursive: true });
const save = (name, theme, s) => writeFileSync(new URL(`${name}-${theme}.svg`, out), s);

const BUTTONS = [
  ["telegram", "Message on Telegram", true],
  ["email", "Email me"],
  ["linkedin", "LinkedIn"],
  ["portfolio", "Portfolio"],
];
const STACK = {
  "Front end": [["TypeScript", "typescript"], ["JavaScript", "javascript"], ["React", "react"], ["Astro", "astro"], ["Tailwind", "tailwindcss"]],
  "Back end": [["Node.js", "nodedotjs"], ["Go", "go"], ["Rust", "rust"], ["Python", "python"], ["C#", "csharp"]],
  Tools: [["Electron", "electron"], ["Docker", "docker"], ["Git", "git"]],
};
const CARDS = [
  { id: "portfolio", title: "portfolio", desc: "Developer portfolio site.", tags: ["HTML", "CSS", "JavaScript"], note: "Public" },
  { id: "claude-plugins", title: "claude-plugins", desc: "Claude Code plugin marketplace: design-stack, a frontend design workflow.", tags: ["JavaScript"], note: "Public" },
  { id: "g69-config", title: "g69-config", desc: "Offline Windows configurator for the Onikuma G69 keyboard.", tags: ["Electron", "React", "TypeScript"], note: "Public · 2 stars" },
  { id: "claude-kit-manager", title: "claude-kit-manager", desc: "Local dashboard for Claude Code setup: skills, MCP, plugins and projects.", tags: ["TypeScript", "Express"], priv: true },
  { id: "shaneh", title: "Shaneh · Nextcloud stack", wide: true, priv: true, tags: ["Astro", "Go", "PHP", "Vue", "Docker"], desc: "Persian RTL product site (Astro 5, Vazirmatn) and a self-hosted Nextcloud fork for schools and companies." },
];

function hero(t) {
  const defs = `<linearGradient id="g" x1="14" y1="8" x2="50" y2="58" gradientUnits="userSpaceOnUse"><stop stop-color="${t.amber2}"/><stop offset="1" stop-color="${t.amber}"/></linearGradient>
<linearGradient id="tile" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${t.glass2}"/><stop offset="1" stop-color="${t.glass}"/></linearGradient>
<radialGradient id="gl" cx="82%" cy="-4%" r="55%"><stop stop-color="${t.glow}"/><stop offset="1" stop-color="${t.glow}" stop-opacity="0"/></radialGradient>
<radialGradient id="cl" cx="6%" cy="115%" r="45%"><stop stop-color="${t.cool}"/><stop offset="1" stop-color="${t.cool}" stop-opacity="0"/></radialGradient>
<clipPath id="c"><rect width="${W}" height="250" rx="20"/></clipPath>`;
  const chip = (y, h) => glassCard(t, 620, y, 220, h, 14);
  const body = `<g clip-path="url(#c)"><rect width="${W}" height="250" fill="${t.glass}"/><rect width="${W}" height="250" fill="url(#gl)"/><rect width="${W}" height="250" fill="url(#cl)"/></g>
<rect x=".5" y=".5" width="${W - 1}" height="249" rx="20" fill="none" stroke="${t.line}"/>
<g class="dr"><rect x="34" y="63" width="124" height="124" rx="34" fill="${t.glow}" opacity=".35"/>
<rect x="40.5" y="69.5" width="111" height="111" rx="28" fill="url(#tile)" stroke="${t.line}"/>
<g transform="translate(66 99)"><svg width="60" height="60" viewBox="0 0 64 64" fill="none"><path d="M44 18c-3-4-8-6-13-6-8 0-13 4-13 10 0 14 28 6 28 21 0 6-6 11-15 11-6 0-12-2-16-7" stroke="url(#g)" stroke-width="6" stroke-linecap="round"/></svg></g></g>
<text x="184" y="103" font-size="52" font-weight="700" letter-spacing="-1.5" fill="${t.ink}">Hossein Salehi</text>
<text class="m" x="186" y="130" font-size="15" fill="${t.mute}">@Ssizy</text>
<text x="185" y="164" font-size="18" fill="${t.ink}">I turn rough ideas into shipped products:</text>
<text x="185" y="187" font-size="18" fill="${t.ink}">sites, desktop tools and everything between.</text>
<text class="m" x="185" y="219" font-size="13" fill="${t.mute}">Front-end &amp; full-stack · Astro · React · TypeScript</text>
${chip(62, 50)}<circle cx="642" cy="87" r="4" fill="${t.amber}"/><text x="658" y="92" font-size="14" fill="${t.ink}">Open for freelance work</text>
${chip(124, 62)}<text x="642" y="150" font-size="14" fill="${t.ink}">Working hours</text><text class="m" x="642" y="171" font-size="12" fill="${t.mute}">UTC+3:30</text>`;
  const css = `@keyframes d{from{transform:translateY(0)}to{transform:translateY(-6px)}}.dr{animation:d 9s ease-in-out infinite alternate}@media (prefers-reduced-motion:reduce){.dr{animation:none}}`;
  return svg(W, 250, t, body, defs, css);
}

function button(t, label, primary) {
  const w = Math.ceil(tw(label, 14, false, true)) + 44;
  const b = primary
    ? `<rect x="2" y="2" width="${w}" height="40" rx="20" fill="${t.amber}"/>`
    : `<rect x="2.5" y="2.5" width="${w - 1}" height="39" rx="19.5" fill="${t.glass}" stroke="${t.line}"/>`;
  const txt = `<text x="${2 + w / 2}" y="27" font-size="14" font-weight="600" text-anchor="middle" fill="${primary ? t.onAmber : t.ink}">${esc(label)}</text>`;
  return [w + 4, svg(w + 4, 44, t, b + txt)];
}

function heading(t, title) {
  const x = Math.ceil(tw(title, 15, false, true)) + 14;
  return svg(W, 36, t, `<text x="0" y="22" font-size="15" font-weight="600" fill="${t.ink}">${esc(title)}</text><line x1="${x}" x2="${W}" y1="17.500" y2="17.500" stroke="${t.line}"/>`);
}

function chips(t, items, x0, y0, maxW) {
  let x = 0, y = 0, body = "", paths = "";
  for (const [name, ic] of items) {
    const w = 6 + 26 + 8 + Math.ceil(tw(name, 13)) + 14;
    if (x && x + w > maxW) { x = 0; y += 40; }
    const cx = x0 + x, cy = y0 + y;
    body += `<rect x="${cx + .5}" y="${cy + .5}" width="${w - 1}" height="31" rx="15.500" fill="${t.glass2}" stroke="${t.line}"/>`
      + `<circle cx="${cx + 19}" cy="${cy + 16}" r="13" fill="${t.iconBg}"/>`
      + `<path transform="translate(${cx + 12} ${cy + 9}) scale(${14 / 24})" fill="${t.amber2}" d="${icon(ic)}"/>`
      + `<text x="${cx + 40}" y="${cy + 20.500}" font-size="13" fill="${t.ink}">${esc(name)}</text>`;
    x += w + 8;
  }
  return [body, y + 32];
}

function stack(t) {
  const gap = 14, gw = (W - gap * 2) / 3;
  const laid = Object.entries(STACK).map(([title, items]) => [title, ...chips(t, items, 0, 46, gw - 36 + 8)]);
  const h = Math.max(...laid.map((l) => l[2])) + 46 + 18;
  let body = "";
  Object.entries(STACK).forEach(([title, items], i) => {
    const gx = i * (gw + gap);
    body += glassCard(t, gx, 0, gw, h);
    body += `<text class="m" x="${gx + 18}" y="31" font-size="13" font-weight="500" fill="${t.amber}">${esc(title)}</text>`;
    body += chips(t, items, gx + 18, 46, gw - 36 + 8)[0];
  });
  return svg(W, h, t, body);
}

function card(t, c) {
  const cw = c.wide ? W : (W - 14) / 2, svgW = c.wide ? W : W / 2, h = 172;
  const x = c.wide ? 0 : c.pos === "right" ? svgW - cw : 0;
  const glow = `<radialGradient id="cg" cx="100%" cy="0" r="40%"><stop stop-color="${t.glow}"/><stop offset="1" stop-color="${t.glow}" stop-opacity="0"/></radialGradient><clipPath id="cc"><rect x="${x}" width="${cw}" height="${h}" rx="18"/></clipPath>`;
  let b = glassCard(t, x, 0, cw, h, 18, t.glass2);
  b += `<g clip-path="url(#cc)"><rect x="${x}" width="${cw}" height="${h}" fill="url(#cg)"/></g>`;
  b += `<text x="${x + 20}" y="41" font-size="17" font-weight="600" fill="${t.ink}">${esc(c.title)}</text>`;
  wrap(c.desc, 14, cw - 40, 2).forEach((l, i) => (b += `<text x="${x + 20}" y="${66 + i * 20}" font-size="14" fill="${t.mute}">${esc(l)}</text>`));
  let tx = x + 20;
  for (const tag of c.tags) {
    const w = Math.ceil(tw(tag, 12, true)) + 20;
    b += `<rect x="${tx + .5}" y="105.500" width="${w - 1}" height="22" rx="11" fill="none" stroke="${t.line}"/><text class="m" x="${tx + w / 2}" y="120.500" font-size="12" text-anchor="middle" fill="${t.mute}">${esc(tag)}</text>`;
    tx += w + 6;
  }
  const col = c.priv ? t.mute : t.amber;
  b += `<text class="m" x="${x + 20}" y="154" font-size="13" fill="${col}">${esc(c.priv ? "Private" : c.note)}</text>`;
  b += `<text class="m" x="${x + cw - 20}" y="154" font-size="13" text-anchor="end" fill="${col}">${c.priv ? "Description only" : "View repository →"}</text>`;
  return svg(svgW, h, t, b, glow);
}

for (const [theme, t] of Object.entries(THEMES)) {
  save("hero", theme, hero(t));
  for (const [id, label, primary] of BUTTONS) save(`btn-${id}`, theme, button(t, label, primary)[1]);
  for (const h of ["Stack", "Featured", "Currently building"]) save(`h-${h.split(" ")[0].toLowerCase()}`, theme, heading(t, h));
  save("stack", theme, stack(t));
  CARDS.forEach((c, i) => save(`card-${c.id}`, theme, card(t, { ...c, pos: i % 2 ? "right" : "left" })));
}
console.log("static assets written");
