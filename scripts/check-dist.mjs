// Checks the built site in dist/: every page there, Arabic pages right to left, language twins linked, every local
// link and picture present, numbers isolated from the text around them, and no broken values. Exit 1 with the list.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const site = 'https://basilforge.github.io';
const pages = ['index.html', 'ar/index.html', 'kairos/index.html', 'ar/kairos/index.html'];
const problems = [];

function fileFor(url) {
  const path = decodeURI(url.split('#')[0].split('?')[0]);
  if (!path) return null;
  return join(dist, path.endsWith('/') ? `${path}index.html` : path);
}

for (const page of [...pages, '404.html']) {
  if (!existsSync(join(dist, page))) problems.push(`missing page: ${page}`);
}

for (const page of [...pages, '404.html']) {
  const file = join(dist, page);
  if (!existsSync(file)) continue;
  const html = readFileSync(file, 'utf8');

  if (pages.includes(page)) {
    const arabic = page.startsWith('ar/');
    if (arabic && !/<html lang="ar" dir="rtl"/.test(html)) problems.push(`${page}: not lang="ar" dir="rtl"`);
    if (!arabic && !/<html lang="en" dir="ltr"/.test(html)) problems.push(`${page}: not lang="en" dir="ltr"`);
    for (const lang of ['en', 'ar']) {
      if (!new RegExp(`<link rel="alternate" hreflang="${lang}"`).test(html)) problems.push(`${page}: no hreflang ${lang}`);
    }
  }

  for (const [, attr, value] of html.matchAll(/\s(href|src|srcset|poster)="([^"]*)"/g)) {
    const urls = attr === 'srcset' ? value.split(',').map((part) => part.trim().split(/\s+/)[0]) : [value];
    for (let url of urls) {
      if (url.startsWith(site)) url = url.slice(site.length) || '/';
      if (!url.startsWith('/') || url.startsWith('//')) continue;
      const target = fileFor(url);
      if (target && !existsSync(target)) problems.push(`${page}: ${attr} ${url} has no file`);
    }
  }

  for (const [tag] of html.matchAll(/<span[^>]*data-stat="[^"]*"[^>]*>/g)) {
    // Isolated from the text around it: "ltr" for a bare version, "auto" for a value with words ("112 ميقابايت").
    if (!/dir="(ltr|auto)"/.test(tag)) problems.push(`${page}: number without its own direction: ${tag}`);
  }

  const text = html.replace(/<script[\s\S]*?<\/script>/g, '');
  for (const bad of ['undefined', 'NaN', '[object']) {
    if (text.includes(bad)) problems.push(`${page}: contains "${bad}"`);
  }
}

if (problems.length) {
  console.error(`${problems.length} problem(s):\n${problems.join('\n')}`);
  process.exit(1);
}
console.log(`dist ok: ${pages.length + 1} pages checked`);
