// Regenerates the "currently building" card from recent public repo activity.
// Run: node scripts/building.mjs   (uses GITHUB_TOKEN if set; works unauthenticated too, rate-limited)
import { writeFileSync } from "node:fs";
import { THEMES, renderBuilding } from "./lib.mjs";

const USER = process.env.GH_USER || "Ssizyyy";
const headers = { "User-Agent": "profile-readme", Accept: "application/vnd.github+json" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
const api = async (p) => {
  const r = await fetch(`https://api.github.com${p}`, { headers });
  if (!r.ok) throw new Error(`${p} -> ${r.status}`);
  return r.json();
};

const ago = (iso) => {
  const h = (Date.now() - new Date(iso)) / 36e5;
  if (h < 1) return "just now";
  if (h < 24) return `${Math.floor(h)}h ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return "yesterday";
  if (d < 14) return `${d} days ago`;
  if (d < 60) return `${Math.floor(d / 7)} weeks ago`;
  return `${Math.floor(d / 30)} months ago`;
};

const repos = (await api(`/users/${USER}/repos?type=owner&sort=pushed&per_page=12`))
  .filter((r) => !r.fork && !r.archived && r.name.toLowerCase() !== USER.toLowerCase())
  .slice(0, 3);

const rows = [];
for (const r of repos) {
  let msg = r.description || "Recent activity";
  try { msg = (await api(`/repos/${USER}/${r.name}/commits?per_page=1`))[0].commit.message.split("\n")[0]; } catch {}
  rows.push({ repo: r.name, msg, when: ago(r.pushed_at) });
}

const stamp = `Refreshed by a scheduled Action · ${new Date().toISOString().slice(0, 10)}`;
for (const [theme, t] of Object.entries(THEMES))
  writeFileSync(new URL(`../assets/building-${theme}.svg`, import.meta.url), renderBuilding(t, rows, stamp));
console.log(rows);
