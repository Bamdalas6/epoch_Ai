import fs from "node:fs/promises";
import { slugify } from "@/lib/slug";
import path from "node:path";

// On Vercel the Python API is optional: it is used only when API_URL is set.
const API = process.env.API_URL || (process.env.VERCEL ? "" : "http://127.0.0.1:8000");
const DIR = path.join(process.cwd(), "content");

async function fromApi(route) {
  if (!API) return null;
  try {
    const res = await fetch(`${API}${route}`, { cache: "no-store", signal: AbortSignal.timeout(1500) });
    if (res.ok) return await res.json();
  } catch {}
  return null;
}

/** Homepage content comes from the Python API; if it is down, fall back to the shared JSON file. */
export async function getContent() {
  return (await fromApi("/api/content")) ?? JSON.parse(await fs.readFile(path.join(DIR, "site.json"), "utf8"));
}

/** Content for an inner page (latest, trends, data, about, …), same API-then-file order. */
export async function getPage(key) {
  const api = await fromApi(`/api/pages/${key}`);
  if (api) return api;
  const all = JSON.parse(await fs.readFile(path.join(DIR, "pages.json"), "utf8"));
  return all[key];
}

/** Topics, datasets, benchmarks, newsletter, podcast, transparency and press content. */
export async function getLibrary() {
  const api = await fromApi("/api/library");
  if (api) return api;
  return JSON.parse(await fs.readFile(path.join(DIR, "library.json"), "utf8"));
}

/** Every publication on the site (reports, data insights, newsletter issues, podcast episodes), newest first. */
export async function getPublications() {
  const [latest, insights, lib] = await Promise.all([getPage("latest"), getPage("insights"), getLibrary()]);
  const all = [
    ...latest.items,
    ...insights.items.map((i) => ({ ...i, type: "Data Insight" })),
    ...insights.featured.map((i) => ({ ...i, type: "Data Insight", topic: i.topic || "Chips", summary: i.summary || "" })),
    ...lib.newsletter.items.map((i) => ({ ...i, type: "Newsletter" })),
    ...lib.podcast.items.map((i) => ({ ...i, type: "Podcast" })),
  ];
  const seen = new Map();
  for (const it of all) {
    const slug = slugify(it.title);
    if (!seen.has(slug)) seen.set(slug, { ...it, slug, href: `/publications/${slug}` });
  }
  return [...seen.values()].sort((a, b) => b.iso.localeCompare(a.iso));
}
