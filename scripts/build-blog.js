#!/usr/bin/env node
// Renders content/posts/*.json into /public/blog/*.html plus the index.
// Run: node scripts/build-blog.js
const fs = require("fs");
const path = require("path");

const POSTS_DIR = path.join(__dirname, "..", "content", "posts");
const OUT_DIR = path.join(__dirname, "..", "public", "blog");
const SITE = process.env.SITE_URL || "https://toolforge.example.com";
fs.mkdirSync(OUT_DIR, { recursive: true });

function nav() {
  return `<header class="site">
  <div class="wrap nav">
    <a class="brand" href="/"><span class="dot"></span>ToolForge</a>
    <nav class="navlinks">
      <a href="/tools/">Tools</a>
      <a href="/pricing.html">Pricing</a>
      <a href="/blog/">Blog</a>
    </nav>
    <a class="btn btn-primary" href="/pricing.html">Get Pro</a>
  </div>
</header>`;
}

function footer() {
  return `<footer>
  <div class="wrap footer-grid">
    <div><span class="brand"><span class="dot"></span>ToolForge</span></div>
    <div><a href="/tools/">Tools</a></div>
    <div><a href="/pricing.html">Pricing</a></div>
    <div><a href="/blog/">Blog</a></div>
    <div>© 2026 ToolForge</div>
  </div>
</footer>`;
}

function postPage(post) {
  const url = `${SITE}/blog/${post.slug}.html`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${post.title} — ToolForge Blog</title>
<meta name="description" content="${post.intro}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:title" content="${post.title} — ToolForge Blog">
<meta property="og:description" content="${post.intro}">
<meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${post.title} — ToolForge Blog">
<meta name="twitter:description" content="${post.intro}">
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2222%22 fill=%22%237c5cff%22/></svg>">
<link rel="stylesheet" href="/style.css">
</head>
<body>
${nav()}
<section>
  <div class="wrap prose">
    <h1>${post.title}</h1>
    <p class="meta">${post.date}</p>
    <p>${post.intro}</p>
    <ul>
      ${post.points.map(p => `<li>${p}</li>`).join("\n      ")}
    </ul>
    <p>Try it yourself: <a href="/tools/${post.tool}.html">open the ${post.tool.replace(/-/g, " ")} →</a></p>
  </div>
</section>
<section><div class="wrap"><div class="ad-slot">Ad space — reserved for sponsor placements (300×90)</div></div></section>
${footer()}
</body>
</html>
`;
}

function indexPage(posts) {
  const items = posts
    .map(
      p => `<div class="blog-item">
        <div class="meta">${p.date}</div>
        <h3><a href="/blog/${p.slug}.html">${p.title}</a></h3>
        <p>${p.intro}</p>
      </div>`
    )
    .join("\n");
  const url = `${SITE}/blog/`;
  const description = "Tips on productivity, tooling, and getting more done in the browser.";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Blog — ToolForge</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:title" content="Blog — ToolForge">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="Blog — ToolForge">
<meta name="twitter:description" content="${description}">
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2222%22 fill=%22%237c5cff%22/></svg>">
<link rel="stylesheet" href="/style.css">
</head>
<body>
${nav()}
<div class="tool-header wrap"><h1>Blog</h1><p class="sub">Short, practical posts about the tools we build.</p></div>
<section style="padding-top:12px">
  <div class="wrap blog-list">
    ${items || "<p>No posts yet.</p>"}
  </div>
</section>
${footer()}
</body>
</html>
`;
}

const files = fs.existsSync(POSTS_DIR) ? fs.readdirSync(POSTS_DIR).filter(f => f.endsWith(".json")) : [];
const posts = files
  .map(f => JSON.parse(fs.readFileSync(path.join(POSTS_DIR, f))))
  .sort((a, b) => (a.date < b.date ? 1 : -1));

for (const post of posts) {
  fs.writeFileSync(path.join(OUT_DIR, `${post.slug}.html`), postPage(post));
}
fs.writeFileSync(path.join(OUT_DIR, "index.html"), indexPage(posts));
console.log(`Built ${posts.length} post(s) + blog index.`);
