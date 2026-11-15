import fs from "node:fs/promises";
import path from "node:path";

// On Vercel the Python API is optional: it is used only when API_URL is set.
const API = process.env.API_URL || (process.env.VERCEL ? "" : "http://127.0.0.1:8000");
const DIR = path.join(process.cwd(), "..", "content");

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
