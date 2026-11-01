# NEXUS TECH — Amazon Affiliate Tech Store

> This file is read automatically by AI coding agents (opencode). Keep it updated when the project changes.

## 1. What this project is

**NEXUS TECH** is an **Amazon Associates affiliate website** for consumer electronics.
It is a catalog/review storefront: users browse products here, but every purchase
happens on Amazon via affiliate links (`AmazonLink` component → `buildAmazonAffiliateUrl(asin)`
→ `https://www.amazon.com/dp/{ASIN}?tag={NEXT_PUBLIC_AMAZON_TAG}`, default tag `nexustech-20`).

**Critical business rules:**

- **AFFILIATE-ONLY MODE.** The old dual mode (`STORE` / `AFFILIATE`) is permanently locked to
  `AFFILIATE` (see `src/lib/store.ts` — `toggleMode`/`setMode` are no-ops, persist `version: 2`
  with a migration that forces AFFILIATE). Do NOT re-introduce mode switching or native checkout
  flows; products must always redirect to Amazon.
- **Light theme only.** The site is locked to a pure white background (`--cyber-bg: #FFFFFF`;
  a flat white `body` background shows through all `bg-cyber-bg` sections via a transparency
  override in `globals.css`). The only section that keeps its own backdrop is
  `TabletShowcase.tsx` (animated blurred image background). The dark-mode bootstrap in
  `src/app/layout.tsx` actively *removes* any saved dark preference. Do NOT add a theme toggle
  or dark-mode UI back.
- **Hover effects are disabled site-wide** (scale/zoom/brightness/glow) via a global CSS reset at
  the bottom of `src/app/globals.css` (it neutralizes Tailwind's `--tw-scale-*` / `--tw-brightness`
  vars on `:hover` and `.group:hover *`). Do NOT add new hover zoom/glow effects.

## 2. Tech stack

| Layer | Choice |
|---|---|
| Framework | **Next.js 14.2.15** (App Router), React 18, TypeScript |
| Styling | **Tailwind CSS 3.4** + CSS variables (`src/app/globals.css`) |
| State | **zustand** with `persist` middleware (`src/lib/store.ts`, key `nexus-tech-store-storage`) |
| Animation | framer-motion (hero entrance + slide transitions) |
| 3D | three.js + @react-three/fiber + @react-three/drei |
| Icons | lucide-react |
| Data | static JSON (scraped Amazon products) — no database, no backend API |

**Commands:** `npm run dev` (dev), `npm run build && npm start` (production),
`npm run fetch:products` (python scraper that regenerates the now-legacy `products.scraped.json`).
There are **no tests**. Verify changes with `npx tsc --noEmit` + a production build.

## 3. Directory structure

```
src/
├── app/                      # Routes: / (home), /shop, /product/[slug], /wishlist,
│   │                         #   /cart, /checkout, /about, /contact, /privacy-policy,
│   │                         #   /affiliate-disclosure, sitemap.ts, globals.css, layout.tsx
│   ├── shop/ShopClient.tsx   #   Filters (categories come straight from the folder names)
│   └── product/[slug]/       #   Detail page (gallery, tabs, related products, Amazon CTAs)
├── components/
│   ├── layout/               # Navbar.tsx, Footer.tsx (ModeBadge.tsx = dead code, unimported)
│   ├── home/                 # HeroCarousel, FeaturedProducts, DealOfDay, CategoryShowcase,
│   │                         #   Testimonials, Newsletter, PromoBanner, TimelineRail
│   ├── product/              # ProductCard.tsx        = GRID card ({product, priority?}) — used
│   │                         #   by shop/wishlist/featured/related. DO NOT change its interface.
│   │                         # CarouselProductCard.tsx = full-background-image card for carousels
│   │                         #   (props: imageUrl, imageAlt, eyebrow?, title, description, price, href)
│   │                         # ProductCarousel.tsx    = scroll-snap carousel (client, no library)
│   │                         # ProductViewer.tsx      = 3D GLB viewer (R3F Canvas)
│   │                         # AmazonLink.tsx         = affiliate CTA button
│   │                         # ProductTabs.tsx        = description/features/specs/reviews tabs
│   ├── cart/                 # CartDrawer.tsx
│   └── ui/                   # StarRating.tsx, ThemeToggle.tsx (dead code), Toast
├── data/
│   ├── products.ts           # Product interface + PRODUCTS export (category folders + fallbacks)
│   │                         #   + CATEGORY_NAMES export (the 13 category display names)
│   ├── <CATEGORY>/           # 13 capital-lettered category folders (CAMERA_AND_PHOTO,
│   │                         #   HEADPHONES, HOME_IMPROVEMENT, KEYBOARDS, LAPTOPS, MICE,
│   │                         #   MONITORS, OFFICE_PRODUCTS, PHONES, SMART_WATCHES, TABLETS,
│   │                         #   TELEVISIONS, VIDEO_GAMES_AND_CONSOLES), each with one
│   │                         #   best-sellers JSON (raw scraper format, see §4)
│   ├── products.scraped.json # LEGACY/unused — old 49-product catalog, kept on disk only
│   ├── products.json         # LEGACY/unused raw scrape dump
│   └── slides.ts             # HERO_SLIDES: hero carousel content (+ optional modelUrl per slide)
└── lib/
    ├── store.ts              # zustand store: cart, wishlist, toast, mode (locked AFFILIATE)
    └── utils.ts              # buildAmazonAffiliateUrl, formatCurrency
public/
├── models/                   # GLB 3D models (Draco+WebP compressed; *.backup.glb = originals)
├── hdr/                      # studio_small_08_1k.hdr — self-hosted environment map
└── draco/                    # Self-hosted Draco decoder (wasm + js) copied from three.js
```

## 4. Data model (`Product` in `src/data/products.ts`)

The catalog is built from the 13 category folders in `src/data/<CATEGORY>/*.json`
(raw Amazon best-seller scraper format: `name, url, asin, position, price{value,currency},
numberOfOffers, stars, reviewsCount, thumbnailUrl, categoryName, ...`). `products.ts` maps each
item to the `Product` interface at import time:

- `category` ← cleaned-up folder name (e.g. `CAMERA_AND_PHOTO` → `"Camera And Photo"`,
  `VIDEO_GAMES_AND_CONSOLES` → `"Video Games And Consoles"`); the 13 display names are exported
  as `CATEGORY_NAMES` and drive the shop filters, home CategoryShowcase and navbar dropdown.
  The `CATEGORIES` list in `components/home/FeaturedProducts.tsx` must match these strings
  **exactly** (`p.category === category`) — using `&` instead of `And` silently renders
  empty home carousels (this bug once blanked Camera/Video Games on the home page).
- `slug` = slugified name + ASIN (unique), `brand` = first word of name, `images` = `[thumbnailUrl]`,
  `rating` = `stars`, `reviewCount` = `reviewsCount`, `stockCount` = `numberOfOffers ?? 10`,
  `badge` = `"BEST SELLER"` for positions 1–3.
- Items without ASIN, image, or a positive price are filtered out; duplicates by ASIN are dropped.
- `shortDescription`/`fullDescription` duplicate the name; `features`/`specs`/`reviews` are empty.
- FALLBACK_PRODUCTS (hardcoded demo items) are only used if all folder JSONs are empty.

**Adding a category:** drop a new capital-lettered folder with its JSON in `src/data/`, then add
one import + one entry in `CATEGORY_FILES`/`CATEGORY_NAMES` in `products.ts`. Shop filters,
CategoryShowcase, and the navbar "Categories" dropdown pick it up automatically.

`isDealOfDay` → consumed only by `components/home/DealOfDay.tsx` (no folder product has it, so
DealOfDay falls back to `PRODUCTS[0]`).

## 5. Design system / styling conventions

- Theme tokens are **CSS variables** consumed via Tailwind: `bg-cyber-bg`, `bg-cyber-card`,
  `border-cyber-border`, `text-cyber-text`, `text-cyber-muted`, `bg-cyber-glass`.
- Accents: `cyber-cyan` (#DC2626 red), `cyber-violet` (#EA580C orange), `cyber-pink` (#D97706).
  (Names are legacy — they are red/orange, not actual cyan.)
- Headings: `font-heading` (Space Grotesk); body: Inter.
- Cards: `rounded-2xl border border-cyber-border/60 bg-cyber-card`.
- Home `FeaturedProducts` headers are grey timeline bars: `bg-zinc-200` rounded bar, a
  `bg-zinc-400` dot in the left gutter (34px gap between dot and bar), linked by a
  vertical `bg-zinc-300` rail at `left-[18px]`. Rail + dot live in the
  standalone `components/home/TimelineRail.tsx` (rendered as a direct child of each
  `relative` section, NOT inside the header; `showDot={false}` for the `TabletImageGrid`
  interlude). Geometry assumes section `py-10` + header bar `h-16` (dot center = 4.5rem)
  — update both together.
- Product card images: **`object-contain` on white bg** (Amazon images are product-on-white) —
  never `object-cover` on grid cards.
- Amazon CTAs use the amber style in `AmazonLink.tsx` with `rel="sponsored nofollow"`.
- **Content margin:** `main` has a 100px side padding on `lg+` screens (16px on small) defined in
  `globals.css`. The hero section carries the `hero-full-bleed` class to break out of that margin
  and span the full viewport width — keep that class on it if you ever touch the hero.

## 6. The 3D system (hero section)

- `HeroCarousel.tsx`: autoplay **8s**, slides from `HERO_SLIDES`. The layout grid is **static** and
  `ProductViewer` lives **outside** the slide-keyed subtree — the WebGL canvas mounts ONCE and must
  never be remounted per slide (remounting = re-fetch + re-decode + blank flashes; this was a bug,
  do not regress it). Per-slide text transitions via AnimatePresence inside the left column only.
  Entrance animations (one-time, `entrancePlayed` ref): text slides up, 3D flies in from `-100vw`.
- `ProductViewer.tsx`: `modelUrl` prop (default `/models/mac_mini.glb`), `useGLTF` caches per URL,
  `Bounds key={modelUrl}` refits camera on model swap. `<Suspense>` boundary is REQUIRED.
  - Models are **Draco-compressed** (`useGLTF.setDecoderPath("/draco/")` — self-hosted, NOT gstatic).
  - Environment: self-hosted `/hdr/studio_small_08_1k.hdr` (`files=`, NOT `preset=` which fetches a CDN).
  - **Never gate `<Canvas>` behind loading state** — Chrome won't present the WebGL surface
    (canvas stays blank until tab-switch/resize). Mount it immediately.
- **Adding a new 3D product:** drop the GLB in `public/models/`, compress it first:
  `npx @gltf-transform/cli optimize in.glb out.glb --compress draco --texture-compress webp`
  (keep a `*.backup.glb`), then add `modelUrl` to the slide in `src/data/slides.ts` (+ preload line
  in `ProductViewer.tsx`).

## 7. Gotchas / operational notes

- **No git repo** — no version control. Be careful with destructive edits; never overwrite an
  existing file without reading it first (an existing `ProductCard` was once clobbered this way).
- **`npm start` serves the built output**: after ANY code change you must `npm run build` AND
  restart `npm start` — a running production server does not pick up new builds. Dev mode
  (`npm run dev`) hot-reloads.
- If dev mode serves 404s for `/_next/static/chunks/*` (stale build cache), stop the server,
  delete `.next`, restart.
- `next/image` remote hosts are whitelisted in `next.config.mjs` (unsplash, pexels,
  m.media-amazon.com, images-na.ssl-images-amazon.com) — add hosts there for new image sources.
- Footer contains the legally required Amazon Associates disclosure — keep it.
- Dead code: `components/layout/ModeBadge.tsx`, `components/ui/ThemeToggle.tsx` (unimported;
  kept only for reference — safe to delete).

## 8. Owner preferences (from the user)

- Affiliate-first: every product path should funnel to an Amazon link.
- Clean, calm UI: white-gray background, no hover animations, no dark mode.
- Performance-conscious: 3D assets compressed, everything 3D-related self-hosted, production
  builds used for judging speed (`npm run dev` slowness is expected and not a bug).
- Communicates via short direct requests; expects minimal, targeted diffs and honest reporting
  when something goes wrong.
