#!/usr/bin/env node
/**
 * Usage:
 *   node scripts/set-video-urls.mjs "url1;url2;url3"
 *   node scripts/set-video-urls.mjs "url1,url2,url3"
 *   node scripts/set-video-urls.mjs "url1;url2" --date 2026-06-24
 *
 * Platform is auto-detected from each URL's domain.
 * Updates both vi and en MDX files for today (or --date).
 */

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, "..");

function detectPlatform(url) {
  if (/tiktok\.com/i.test(url)) return "tiktok";
  if (/youtube\.com|youtu\.be/i.test(url)) return "youtube";
  if (/facebook\.com|fb\.com|fb\.watch/i.test(url)) return "facebook";
  if (/instagram\.com/i.test(url)) return "instagram";
  return null;
}

function todayString() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function findFilesForDate(dateStr) {
  const locales = ["vi", "en"];
  const found = [];
  for (const locale of locales) {
    const dir = join(root, "content/videos", locale);
    let files;
    try {
      files = readdirSync(dir);
    } catch {
      continue;
    }
    const match = files.find((f) => f.startsWith(dateStr) && f.endsWith(".mdx"));
    if (match) found.push(join(dir, match));
  }
  return found;
}

function updateVideoUrls(filePath, urls) {
  let content = readFileSync(filePath, "utf8");
  for (const [platform, url] of Object.entries(urls)) {
    content = content.replace(
      new RegExp(`([ \\t]*${platform}:[ \\t]*)""`, "m"),
      `$1"${url}"`
    );
  }
  writeFileSync(filePath, content, "utf8");
}

// --- parse args ---
const args = process.argv.slice(2);
if (!args.length) {
  console.error("Usage: node scripts/set-video-urls.mjs \"url1;url2;url3\" [--date DD-MM-YYYY]");
  process.exit(1);
}

const dateIdx = args.indexOf("--date");
const dateStr = dateIdx !== -1 ? args[dateIdx + 1] : todayString();
const rawLinks = args[0];

const links = rawLinks.split(/[;,]+/).map((l) => l.trim()).filter(Boolean);
const urls = {};
for (const link of links) {
  const platform = detectPlatform(link);
  if (!platform) {
    console.warn(`⚠  Could not detect platform for: ${link}`);
    continue;
  }
  urls[platform] = link;
}

if (!Object.keys(urls).length) {
  console.error("No recognizable URLs found.");
  process.exit(1);
}

const files = findFilesForDate(dateStr);
if (!files.length) {
  console.error(`No MDX files found for date: ${dateStr}`);
  process.exit(1);
}

for (const file of files) {
  updateVideoUrls(file, urls);
  console.log(`✓ Updated ${file.replace(root + "/", "")}`);
}

console.log("\nURLs set:");
for (const [p, u] of Object.entries(urls)) console.log(`  ${p}: ${u}`);
