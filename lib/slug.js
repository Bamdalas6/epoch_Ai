/** URL-safe slug from a title, e.g. "What’s next? AI & chips" -> "whats-next-ai-chips". */
export const slugify = (s) =>
  s.toLowerCase()
    .normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/[’'`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90)
    .replace(/-+$/, "");

export const pubHref = (title) => `/publications/${slugify(title)}`;
