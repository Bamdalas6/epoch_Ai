// The Python service in server/ is optional. Locally it runs on port 8000; on Vercel it is used only if API_URL is set.
const API = process.env.API_URL || (process.env.VERCEL ? "" : "http://127.0.0.1:8000");

/** @type {import('next').NextConfig} */
export default {
  // Ship the shared JSON content with every server route.
  outputFileTracingIncludes: { "/**": ["./content/**/*.json"] },

  // Addresses as they were named on epoch.ai land on the matching page here.
  async redirects() {
    return [
      ["/publications", "/latest"], ["/eci", "/benchmarks/eci"], ["/frontiermath", "/benchmarks/frontiermath"],
      ["/frontiermath/open-problems", "/benchmarks/frontiermath-open-problems"], ["/MirrorCode", "/benchmarks/mirrorcode"],
      ["/gradient-updates", "/newsletter"], ["/epoch-after-hours", "/podcast"], ["/privacy", "/legal/privacy"], ["/cookies", "/legal/cookies"],
    ].map(([source, destination]) => ({ source, destination, permanent: false }));
  },

  // Browser calls to /api/* go to the Python service when there is one;
  // otherwise the built-in route handlers in app/api answer.
  async rewrites() {
    return API ? { beforeFiles: [{ source: "/api/:path*", destination: `${API}/api/:path*` }] } : [];
  },
};
