import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(here, "..");

// The Python API is optional. Locally it runs on port 8000; on Vercel it is used only if API_URL is set.
const API = process.env.API_URL || (process.env.VERCEL ? "" : "http://127.0.0.1:8000");

/** @type {import('next').NextConfig} */
export default {
  // Content lives in ../content (shared with the API and mobile app), so trace files from the repo root
  // and ship the JSON with every server route.
  outputFileTracingRoot: repoRoot,
  outputFileTracingIncludes: { "/**": ["../content/**/*.json"] },
  turbopack: { root: repoRoot },

  // Browser calls to /api/* go to the Python service when there is one;
  // otherwise the built-in route handlers in app/api answer.
  async rewrites() {
    return API ? { beforeFiles: [{ source: "/api/:path*", destination: `${API}/api/:path*` }] } : [];
  },
};
