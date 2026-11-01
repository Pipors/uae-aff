#!/usr/bin/env python3
"""
fetch_products.py — Single-actor Apify pipeline for the NEXUS TECH store.

Uses ONLY junglee/amazon-bestsellers for the Electronics category, fetches
100 best sellers, and maps each item to the website Product shape using only
these source fields:

  title, asin, originalAsin, price, listPrice, brand, stars, starsBreakdown,
  reviewsCount, highResolutionImages, productPageReviews

Output: cleaned JSON array matching the Product interface in src/data/products.ts.

Usage:
  export APIFY_TOKEN=apify_api_xxx        # or add APIFY_TOKEN=... to .env.local
  python3 scripts/fetch_products.py
"""

import argparse
import json
import os
import re
import sys
import time
from pathlib import Path

import requests

API = "https://api.apify.com/v2"
BESTSELLERS_ACTOR = "junglee~amazon-bestsellers"
ELECTRONICS_CATEGORY_URL = (
    "https://www.amazon.com/Best-Sellers-Electronics/zgbs/electronics/"
)
POLL_INTERVAL_SECS = 5

# Ordered from the most specific category to the most generic one.
ELECTRONICS_CATEGORY_KEYWORDS = [
    ("Service Plans", ["service plan", "protection plan", "warranty plan"]),
    ("Video Game Consoles & Accessories", [
        "playstation", "ps5", "ps4", "xbox", "nintendo", "switch",
        "gaming console", "game console", "gaming controller", "controller",
    ]),
    ("Car & Vehicle Electronics", [
        "dash cam", "car charger", "car mount", "jump starter", "obd",
        "vehicle", "car stereo", "car ", "automotive",
    ]),
    ("Security & Surveillance", [
        "security camera", "surveillance", "doorbell", "ring ", "blink",
        "alarm system", "smart lock", "baby monitor",
    ]),
    ("GPS & Navigation", ["gps", "navigation", "garmin", "tomtom"]),
    ("Wearable Technology", [
        "smartwatch", "smart watch", "apple watch", "galaxy watch",
        "fitbit", "fitness tracker", "wearable", "whoop",
    ]),
    ("eBook Readers & Accessories", [
        "kindle", "paperwhite", "ebook", "e-book", "kobo", "ereader", "e-reader",
    ]),
    ("Cell Phones & Accessories", [
        "iphone", "galaxy s", "pixel ", "smartphone", "cell phone",
        "mobile phone", "phone case", "magsafe", "android phone",
    ]),
    ("Computers & Accessories", [
        "laptop", "macbook", "chromebook", "computer", "desktop", "monitor",
        "keyboard", "mouse", "ssd", "hard drive", "ram", "motherboard",
        "graphics card", "router", "webcam", "dock", "docking station",
    ]),
    ("Television & Video", [
        "fire tv", "smart tv", "television", " tv ", "roku", "streaming stick",
        "streaming media", "apple tv", "chromecast", "projector",
    ]),
    ("Headphones", [
        "headphone", "headset", "earbud", "earpods", "airpods", "earphone",
        "beats", "bose", "sony wh", "over-ear", "in-ear",
    ]),
    ("Home Audio", [
        "soundbar", "sound bar", "home audio", "speaker", "subwoofer",
        "receiver", "amplifier", "turntable", "echo ", "alexa", "sonos",
    ]),
    ("Portable Audio & Video", [
        "portable speaker", "boombox", "mp3 player", "portable dvd",
        "portable audio", "portable video",
    ]),
    ("Camera & Photo", [
        "camera", "gopro", "camcorder", "lens", "tripod", "photo",
        "mirrorless", "dslr", "binocular",
    ]),
    ("Office Electronics", [
        "printer", "scanner", "shredder", "label maker", "fax", "office",
        "laminator", "calculator",
    ]),
    ("Accessories & Supplies", [
        "cable", "cord", "zip tie", "adapter", "charger", "charging",
        "power bank", "battery", "batteries", "usb", "hub", "mount",
        "stand", "case", "cover", "screen protector", "ink", "toner",
    ]),
]


# --------------------------------------------------------------------------- #
# Config helpers
# --------------------------------------------------------------------------- #

def load_token(cli_token: str | None, root: Path) -> str:
    if cli_token:
        return cli_token
    if os.environ.get("APIFY_TOKEN"):
        return os.environ["APIFY_TOKEN"]
    env_file = root / ".env.local"
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            if line.startswith("APIFY_TOKEN="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    sys.exit("ERROR: APIFY_TOKEN not found (use --token, env var, or .env.local)")


# --------------------------------------------------------------------------- #
# Apify API
# --------------------------------------------------------------------------- #

def response_json(response: requests.Response, context: str):
    try:
        payload = response.json()
    except ValueError:
        raise RuntimeError(
            f"{context}: Apify returned a non-JSON response "
            f"({response.status_code}): {response.text[:500]}"
        )

    if response.status_code >= 400:
        raise RuntimeError(
            f"{context}: Apify API error ({response.status_code}): "
            f"{json.dumps(payload)[:800]}"
        )
    return payload


def run_actor(session: requests.Session, token: str, actor: str,
              run_input: dict, label: str) -> list[dict]:
    """Start an Actor run, wait for completion, return dataset items."""
    print(f"[{label}] starting {actor} ...")
    session.headers.update({"Authorization": f"Bearer {token}"})

    r = session.post(
        f"{API}/acts/{actor}/runs",
        params={"waitForFinish": 300},
        json=run_input,
        timeout=360,
    )
    data = response_json(r, f"start {actor}")["data"]
    run_id, dataset_id = data["id"], data["defaultDatasetId"]
    status = data.get("status") or (
        "SUCCEEDED" if data.get("finishedAt") else None
    )

    ticks = 0
    missing_status_ticks = 0
    while status != "SUCCEEDED":
        if status in ("FAILED", "ABORTED", "TIMED-OUT"):
            sys.exit(f"ERROR: {actor} run {status}: {data.get('statusMessage')}")

        time.sleep(POLL_INTERVAL_SECS)
        ticks += 1

        st: dict = {}
        for attempt in range(1, 6):
            try:
                resp = session.get(f"{API}/actor-runs/{run_id}", timeout=30)
                st = response_json(resp, f"poll {actor} run {run_id}")["data"]
                break
            except (requests.RequestException, RuntimeError) as exc:
                if attempt == 5:
                    sys.exit(f"ERROR: unable to poll {actor} run {run_id}: {exc}")
                time.sleep(POLL_INTERVAL_SECS)

        status = st.get("status") or (
            "SUCCEEDED" if st.get("finishedAt") else None
        )
        if status:
            missing_status_ticks = 0
        else:
            missing_status_ticks += 1
            if missing_status_ticks >= 3:
                sys.exit(
                    f"ERROR: {actor} run {run_id} returned no status. "
                    f"Last payload: {json.dumps(st)[:1200]}"
                )

        if ticks % 6 == 0:
            print(f"[{label}] still running ({status}) ...")
        if status in ("FAILED", "ABORTED", "TIMED-OUT"):
            sys.exit(f"ERROR: {actor} run {status}: {st.get('statusMessage')}")

    resp = session.get(
        f"{API}/datasets/{dataset_id}/items",
        params={"clean": "true"},
        timeout=180,
    )
    items = response_json(resp, f"fetch dataset {dataset_id}")
    print(f"[{label}] got {len(items)} items")
    return items


# --------------------------------------------------------------------------- #
# Cleaning / mapping  (Actor item -> website Product)
# --------------------------------------------------------------------------- #

def slugify(text: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return s[:60].strip("-")


def clean_text(text) -> str:
    return re.sub(r"\s+", " ", (text or "")).strip()


def map_electronics_category(title: str, brand: str | None = None) -> str:
    text = f" {title} {brand or ''} ".lower()
    for category, keywords in ELECTRONICS_CATEGORY_KEYWORDS:
        if any(keyword in text for keyword in keywords):
            return category
    return "Accessories & Supplies"


def short_desc(text: str | None, limit: int = 160) -> str:
    text = clean_text(text)
    if len(text) <= limit:
        return text
    return text[:limit].rsplit(" ", 1)[0].rstrip(".,;:") + "..."


def clean_product(p: dict) -> dict | None:
    """Map one junglee/amazon-bestsellers item to the website Product shape."""
    title = clean_text(p.get("title"))
    asin = clean_text(str(p.get("asin") or "")).upper()
    if not title or not asin:
        return None

    price = (p.get("price") or {}).get("value")
    if price is None:
        return None  # cannot list a product without a price

    list_price = (p.get("listPrice") or {}).get("value")
    images = [
        url for url in (p.get("highResolutionImages") or [])
        if isinstance(url, str) and url
    ]
    if not images:
        return None  # the UI requires at least one product image

    reviews = []
    for r in (p.get("productPageReviews") or [])[:5]:
        reviews.append({
            "id": r.get("reviewId") or f"rev-{len(reviews) + 1}",
            "author": r.get("username") or "Amazon Customer",
            "rating": r.get("ratingScore") or 5,
            "date": (r.get("date") or "")[:10],
            "comment": clean_text(r.get("reviewDescription")),
            "verified": bool(r.get("isVerified")),
        })

    stars_breakdown = p.get("starsBreakdown")

    product: dict = {
        "id": f"prod-{asin}",
        "slug": slugify(title) or f"product-{asin.lower()}",
        "name": title,
        "brand": clean_text(p.get("brand")) or "Unknown",
        "category": map_electronics_category(title, p.get("brand")),
        "price": price,
        "rating": p.get("stars") or 0,
        "reviewCount": p.get("reviewsCount") or 0,
        "badge": "BEST SELLER",
        "isDealOfDay": False,
        "stockCount": 10,
        "images": images[:4],
        "shortDescription": short_desc(title),
        "fullDescription": title,
        "features": [],
        "specs": [],
        "reviews": reviews,
        "asin": asin,
        "originalAsin": clean_text(str(p.get("originalAsin") or asin)).upper(),
    }

    if list_price and list_price > price:
        product["originalPrice"] = list_price
    if isinstance(stars_breakdown, dict) and stars_breakdown:
        product["starsBreakdown"] = stars_breakdown

    return product


# --------------------------------------------------------------------------- #
# Pipeline
# --------------------------------------------------------------------------- #

def main() -> None:
    ap = argparse.ArgumentParser(description="Apify bestsellers -> products.json")
    ap.add_argument("--category", default=ELECTRONICS_CATEGORY_URL,
                    help="Amazon Best Sellers category URL")
    ap.add_argument("--max-items", type=int, default=100,
                    help="bestsellers to pull from the category (max 100)")
    ap.add_argument("--limit", type=int, default=100,
                    help="products to keep for the website")
    ap.add_argument("--out", default="src/data/products.scraped.json",
                    help="output file (relative to project root)")
    ap.add_argument("--token", help="Apify API token")
    args = ap.parse_args()

    root = Path(__file__).resolve().parent.parent
    token = load_token(args.token, root)
    session = requests.Session()

    category_url = args.category.strip()
    if category_url.lower() == "electronics":
        category_url = ELECTRONICS_CATEGORY_URL
    elif not category_url.startswith(("http://", "https://")):
        sys.exit("ERROR: --category must be an Amazon Best Sellers URL or 'Electronics'")

    items = run_actor(session, token, BESTSELLERS_ACTOR, {
        "categoryUrls": [category_url],
        "maxItemsPerStartUrl": min(args.max_items, 100),
        "depthOfCrawl": 1,
        "detailedInformation": True,
    }, "bestsellers")

    products, skipped, used_slugs = [], [], set()
    for item in items:
        product = clean_product(item)
        if not product:
            skipped.append(item.get("asin") or item.get("url") or "unknown")
            continue

        slug, n = product["slug"], 2
        while slug in used_slugs:
            slug = f"{product['slug']}-{n}"
            n += 1
        product["slug"] = slug
        used_slugs.add(slug)
        products.append(product)

        if len(products) >= args.limit:
            break

    out_path = root / args.out
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(products, indent=2, ensure_ascii=False),
                        encoding="utf-8")

    print("-" * 60)
    print(f"SUMMARY: {len(products)} products written to {out_path}")
    print(f"  skipped/errors : {len(skipped)}"
          + (f" -> {', '.join(skipped)}" if skipped else ""))


if __name__ == "__main__":
    main()
