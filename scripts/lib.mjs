// Shared SVG helpers. GitHub renders README SVGs via <img>: no web fonts, no scripts.
import { readFileSync } from "node:fs";

export const W = 880;
export const SANS = "'Segoe UI',-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif";
export const MONO = "ui-monospace,'Cascadia Mono',SFMono-Regular,Consolas,'Liberation Mono',monospace";

export const THEMES = {
  dark: {
    ink: "#e6edf3", mute: "#9198a1", amber: "#f5a524", amber2: "#ffcf6b", onAmber: "#1a1200",
    glass: "rgba(255,255,255,.045)", glass2: "rgba(255,255,255,.075)", line: "rgba(255,255,255,.09)",
    glow: "rgba(245,165,36,.22)", cool: "rgba(120,140,255,.10)", iconBg: "rgba(255,255,255,.045)",
  },
  light: {
    ink: "#1f2328", mute: "#59636e", amber: "#8f5200", amber2: "#8f5200", onAmber: "#ffffff",
    glass: "rgba(0,0,0,.03)", glass2: "rgba(0,0,0,.06)", line: "rgba(0,0,0,.12)",
    glow: "rgba(217,138,0,.18)", cool: "rgba(80,100,255,.06)", iconBg: "rgba(0,0,0,.03)",
  },
};

export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Rough text width (px) for system sans / mono, good enough to size pills.
export function tw(s, size, mono = false, bold = false) {
  if (mono) return s.length * size * 0.6;
  let w = 0;
  for (const c of s) {
    if ("iljtf.,;:'|! ".includes(c)) w += 0.3;
    else if ("mwMW@".includes(c)) w += 0.85;
    else if (/[A-Z]/.test(c)) w += 0.64;
    else w += 0.54;
  }
  return w * size * (bold ? 1.06 : 1);
}

export function wrap(text, size, maxW, maxLines) {
  const lines = []; let cur = "";
  for (const word of text.split(" ")) {
    const next = cur ? cur + " " + word : word;
    if (tw(next, size) > maxW && cur) { lines.push(cur); cur = word; } else cur = next;
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) { lines.length = maxLines; lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, "") + "…"; }
  return lines;
}

const ICONS = {};
export function icon(name) {
  if (!ICONS[name]) {
    const f = new URL(`./icons/${name}.svg`, import.meta.url);
    ICONS[name] = readFileSync(f, "utf8").match(/<path d="([^"]+)"/)[1];
  }
  return ICONS[name];
}

export function svg(w, h, t, body, defs = "", css = "") {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img">
<style>text{font-family:${SANS}}.m{font-family:${MONO}}${css}</style>
<defs>${defs}</defs>
${body}
</svg>
`;
}

export const glassCard = (t, x, y, w, h, r = 18, fill = t.glass) =>
  `<rect x="${x + .5}" y="${y + .5}" width="${w - 1}" height="${h - 1}" rx="${r}" fill="${fill}" stroke="${t.line}"/>`;

// "Currently building" card: rows = [{repo, msg, when}]
export function renderBuilding(t, rows, stamp) {
  const rh = 46, pad = 6, h = pad * 2 + rows.length * rh + 26;
  let b = glassCard(t, 0, 0, W, h - 26);
  rows.forEach((r, i) => {
    const y = pad + i * rh;
    if (i) b += `<line x1="20" x2="${W - 20}" y1="${y}" y2="${y}" stroke="${t.line}"/>`;
    const cy = y + rh / 2;
    b += `<circle cx="28" cy="${cy}" r="4" fill="${t.amber}"/>`;
    b += `<text x="48" y="${cy + 5}" font-size="14" font-weight="600" fill="${t.ink}">${esc(r.repo)}</text>`;
    b += `<text x="230" y="${cy + 5}" font-size="14" fill="${t.mute}">${esc(wrap(r.msg, 14, 520, 1)[0])}</text>`;
    b += `<text class="m" x="${W - 20}" y="${cy + 4}" font-size="12" fill="${t.mute}" text-anchor="end">${esc(r.when)}</text>`;
  });
  b += `<text class="m" x="2" y="${h - 6}" font-size="12" fill="${t.mute}">${esc(stamp)}</text>`;
  return svg(W, h, t, b);
}
