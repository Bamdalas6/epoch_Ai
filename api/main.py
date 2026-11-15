"""Content + newsletter API for the Epoch AI redesign concept.

Run:  uvicorn main:app --reload --port 8000   (from the api/ folder)
The Next.js site and the Flutter app both read from this service.
"""
import json
import re
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

CONTENT_FILE = Path(__file__).resolve().parent.parent / "content" / "site.json"
PAGES_FILE = CONTENT_FILE.with_name("pages.json")
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]{2,}$")

app = FastAPI(title="Epoch AI concept API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten to your real origins before deploying
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


def load_content() -> dict:
    """Read on every request so edits to site.json show up without a restart."""
    return json.loads(CONTENT_FILE.read_text(encoding="utf-8"))


def trend_index(growth_per_year: float, quarters: list[str]) -> list[dict]:
    """Quarterly index for a constant yearly growth rate, first quarter = 1."""
    return [
        {"quarter": q, "index": round(growth_per_year ** (i / 4), 2)}
        for i, q in enumerate(quarters)
    ]


class Subscription(BaseModel):
    email: str


@app.get("/api/health")
def health() -> dict:
    return {"ok": True}


@app.get("/api/content")
def content() -> dict:
    return load_content()


@app.get("/api/pages/{key}")
def page(key: str) -> dict:
    pages = json.loads(PAGES_FILE.read_text(encoding="utf-8"))
    if key not in pages:
        raise HTTPException(status_code=404, detail="Unknown page.")
    return pages[key]


@app.get("/api/stats")
def stats() -> list:
    return load_content()["stats"]


@app.get("/api/latest")
def latest(limit: int = 5) -> list:
    return load_content()["latest"][: max(1, min(limit, 50))]


@app.get("/api/trend")
def trend() -> list:
    snap = load_content()["snapshot"]
    return trend_index(snap["growthPerYear"], snap["quarters"])


@app.post("/api/subscribe")
def subscribe(sub: Subscription) -> dict:
    email = sub.email.strip()
    if not EMAIL_RE.match(email):
        raise HTTPException(status_code=422, detail="Enter a valid email address.")
    # Concept build: the address is validated but not stored or sent anywhere.
    # Connect your mailing-list provider here.
    return {"ok": True, "message": "Thanks. This is a concept build, so nothing was stored."}
