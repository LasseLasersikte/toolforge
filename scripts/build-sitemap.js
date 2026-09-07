#!/usr/bin/env node
// Regenerates /public/sitemap.xml from every .html file in /public.
// Run: node scripts/build-sitemap.js  (run after build-tools.js / build-blog.js)
const fs = require("fs");
const path = require("path");

const SITE = process.env.SITE_URL || "https://toolforge.example.com";
const PUBLIC_DIR = path.join(__dirname, "..", "public");

function walk(dir, base = "") {
  let urls = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(base, entry.name);
    if (entry.isDirectory()) {
      urls = urls.concat(walk(path.join(dir, entry.name), rel));
    } else if (entry.name.endsWith(".html")) {
      urls.push("/" + rel.replace(/index\.html$/, "").replace(/\\/g, "/"));
    }
  }
  return urls;
}

const urls = Array.from(new Set(walk(PUBLIC_DIR))).sort();
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${SITE}${u}</loc></url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap.xml"), xml);
console.log(`Wrote sitemap.xml with ${urls.length} URLs.`);
