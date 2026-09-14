# ToolForge

A static, browser-only toolkit SaaS: 10 client-side utilities, a pricing page,
and a blog with a small content-automation pipeline. Everything in `public/`
is plain HTML/CSS/JS — no server, no build step required to run it, but the
tool pages and blog are generated from templates in `scripts/`.

## Local development

```
npm run serve   # serves public/ at http://localhost:4173
npm run build   # regenerates public/tools/*.html, public/blog/*.html, sitemap.xml
```

Run `npm run build` after editing anything in `scripts/build-tools.js`,
`scripts/build-blog.js`, or `content/posts/*.json` — the generated files in
`public/` are committed, so CI (`.github/workflows/build.yml`) fails the
build if it produces a diff, to catch a template edited without a rebuild.

## Content automation

```
npm run content:new   # generates one new blog post + rebuilds blog + sitemap
```

`scripts/generate-post.js` picks the next unused topic from a fixed `TOPICS`
list (one per tool) and writes it to `content/posts/`. Once every topic has
been used, it exits without writing anything rather than repeating a post —
add more entries to `TOPICS` to keep the pipeline going.

## What's real vs. placeholder

- **Payments**: `startCheckout()` in `public/pricing.html` is a placeholder
  `alert()`. To accept real payments, connect a Stripe account and either
  swap in a Stripe Payment Link URL for each plan button, or wire up
  Stripe Checkout with your publishable key and price IDs.
- **Ads**: the `.ad-slot` divs across the site are static placeholders. No
  ad network script is included; drop in your network's snippet (e.g.
  AdSense) where `.ad-slot` appears in `scripts/build-tools.js`,
  `scripts/build-blog.js`, `public/index.html`, and `public/pricing.html`.
- **Analytics**: none is wired up anywhere in the site.
- **Domain**: `sitemap.xml` and the Open Graph/canonical tags default to the
  placeholder `https://toolforge.example.com`. Set the `SITE_URL` env var
  before running `npm run build` once a real domain is live, e.g.
  `SITE_URL=https://example.com npm run build`, and update the hardcoded
  URLs in `public/index.html`, `public/pricing.html`, and
  `public/tools/index.html` (the only hand-authored pages) to match.
- **Deployment**: no deploy target is configured. `public/` is a static
  site — point any static host (Vercel, Netlify, GitHub Pages, S3 + CDN,
  etc.) at it once a domain and hosting choice are made.
