# ToolForge

A browser-based utility toolkit SaaS: 10 client-side tools, a pricing page,
and a blog with a content-automation pipeline.

## Development

```
npm run build        # builds tools pages, blog, and sitemap into public/
npm run serve        # serves public/ locally at http://localhost:4173
npm run content:new  # generates a new blog post, then rebuilds blog + sitemap
```

## Connecting real Stripe payments

`public/pricing.html` currently ships with a placeholder `startCheckout()`
that shows an alert instead of charging anyone. To accept real payments:

1. Create Payment Links in your Stripe Dashboard for the Pro and Team plans.
2. Replace the `startCheckout()` function in `public/pricing.html` with code
   that redirects to the matching Payment Link, e.g.:

   ```js
   function startCheckout(plan) {
     location.href = plan === "team"
       ? "https://buy.stripe.com/REPLACE_WITH_TEAM_LINK"
       : "https://buy.stripe.com/REPLACE_WITH_PRO_LINK";
   }
   ```

No backend, Stripe secret key, or webhook is required for this approach —
Stripe Payment Links handle checkout entirely hosted on Stripe's side.
