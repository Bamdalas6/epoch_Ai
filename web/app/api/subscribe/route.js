// Fallback for deployments without the Python API (e.g. Vercel).
// Mirrors api/main.py: validates the address but does not store or send it.
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

export async function POST(request) {
  let email = "";
  try {
    email = String((await request.json())?.email ?? "").trim();
  } catch {}
  if (!EMAIL_RE.test(email)) {
    return Response.json({ detail: "Enter a valid email address." }, { status: 422 });
  }
  return Response.json({ ok: true, message: "Thanks. This is a concept build, so nothing was stored." });
}
