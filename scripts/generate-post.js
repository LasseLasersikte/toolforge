#!/usr/bin/env node
// Content-marketing automation: generates one SEO blog post per run from
// a rotating topic queue, tied to a ToolForge tool. Intended to run on a
// schedule (cron / CI) so the site keeps publishing without manual work.
// Run: node scripts/generate-post.js
const fs = require("fs");
const path = require("path");

const POSTS_DIR = path.join(__dirname, "..", "content", "posts");
fs.mkdirSync(POSTS_DIR, { recursive: true });

const TOPICS = [
  {
    tool: "qr-generator",
    title: "5 Smart Ways to Use QR Codes for Your Small Business",
    intro: "QR codes went from a novelty to a default. Here's where they actually move the needle for a small business, and how to make one in under a minute.",
    points: [
      "Print them on receipts to drive repeat customers to a loyalty page.",
      "Put one on a storefront window linking straight to your order-ahead menu.",
      "Add one to business cards pointing to a booking link instead of a static page.",
      "Use them on packaging to collect reviews right after a purchase.",
      "Track performance by pairing the QR target URL with UTM parameters.",
    ],
  },
  {
    tool: "password-generator",
    title: "Why Random Passwords Still Beat Password Managers' Suggestions",
    intro: "Most breaches start with a weak or reused password. A quick, no-account password generator removes the excuse.",
    points: [
      "Longer beats complex: 16+ random characters outperforms an 8-character 'clever' password.",
      "Never reuse a password across services, even 'unimportant' ones.",
      "Symbols help, but length does more work against brute-force attacks.",
      "Generate a fresh password per account and store it in a password manager, not your memory.",
      "Rotate credentials immediately after any service reports a breach.",
    ],
  },
  {
    tool: "json-formatter",
    title: "Debugging APIs Faster: A JSON Formatting Workflow",
    intro: "Minified API responses are unreadable. A fast beautify-and-validate loop saves real debugging time.",
    points: [
      "Paste the raw response and beautify it before you start reading.",
      "Validate first — a syntax error often explains the whole bug.",
      "Minify before sending large payloads back into a request body.",
      "Keep formatting client-side so you're never pasting real data into a third-party server.",
      "Bookmark the formatter for repeat use during integration work.",
    ],
  },
  {
    tool: "utm-builder",
    title: "UTM Parameters 101: Tracking Campaigns Without Guesswork",
    intro: "If you can't tell which channel drove a signup, you can't optimize spend. UTM tagging fixes that in minutes.",
    points: [
      "Use utm_source for the platform (newsletter, twitter, google).",
      "Use utm_medium for the channel type (email, cpc, social).",
      "Use utm_campaign for the specific push (fall-launch, black-friday).",
      "Keep naming conventions consistent across your whole team.",
      "Check your analytics tool's UTM report weekly, not just after launches.",
    ],
  },
  {
    tool: "unit-converter",
    title: "The Unit Converter Every Remote Team Needs",
    intro: "Distributed teams mix metric and imperial constantly. A shared, fast converter avoids costly mistakes.",
    points: [
      "Standardize on metric internally, convert only for customer-facing content.",
      "Double-check temperature conversions — they're the most error-prone.",
      "Data size (MB vs MiB) trips up infra teams more than you'd think.",
      "Bookmark a converter instead of trusting quick mental math.",
      "Include units explicitly in specs to avoid ambiguity altogether.",
    ],
  },
];

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function pickNextTopic() {
  const existing = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith(".json"));
  const usedTitles = new Set(existing.map(f => JSON.parse(fs.readFileSync(path.join(POSTS_DIR, f))).title));
  const next = TOPICS.find(t => !usedTitles.has(t.title));
  return next || TOPICS[existing.length % TOPICS.length];
}

const topic = pickNextTopic();
const slug = slugify(topic.title);
const date = new Date().toISOString().slice(0, 10);

const post = {
  slug,
  title: topic.title,
  date,
  tool: topic.tool,
  intro: topic.intro,
  points: topic.points,
};

const outPath = path.join(POSTS_DIR, `${date}-${slug}.json`);
fs.writeFileSync(outPath, JSON.stringify(post, null, 2));
console.log("Generated post:", outPath);
