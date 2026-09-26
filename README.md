# ToolForge

A browser-based utility toolkit: 10 client-side tools (QR generator, password
generator, JSON formatter, and more), a pricing page, and a blog with a
content-automation pipeline.

## Development

```
npm run build         # regenerate tools, blog, and sitemap into public/
npm run content:new   # generate the next queued blog post, then rebuild
npm run serve         # serve public/ locally at http://localhost:4173
```

## Enabling real payments

`public/pricing.html` currently shows a placeholder alert instead of a real
checkout. To accept payments:

1. Create a Stripe account and a Payment Link (or Checkout Session) for each
   plan (Pro, Team).
2. Replace the `startCheckout()` function in `public/pricing.html` with a
   redirect to your Stripe Payment Link URL, or wire up Stripe Checkout via
   your backend if you need server-side session creation.

## Deployment

There is no deployment pipeline configured yet. `npm run build` produces a
static site in `public/`, which can be deployed to any static host (e.g.
Vercel, Netlify, GitHub Pages). Set `SITE_URL` when running the build so
`scripts/build-sitemap.js` emits the real domain instead of the
`toolforge.example.com` placeholder.
