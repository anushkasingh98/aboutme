#!/usr/bin/env node
/**
 * add-substack.js
 * Adds a Substack article to the blog listing. Pulls the title, cover image,
 * description and publish date from Substack, writes a small front-matter file
 * to content/blog/<slug>.md, and (unless --no-manifest) rebuilds the manifest.
 *
 * Usage:
 *   node add-substack.js <substack-article-url> --tags ai,legacy,cobol
 *
 * Options:
 *   --tags a,b,c     Your own tags for the card (comma-separated)
 *   --title "..."    Override the title fetched from Substack
 *   --excerpt "..."  Override the description fetched from Substack
 *   --image URL      Override the cover image fetched from Substack
 *   --date YYYY-MM-DD Override the publish date
 *   --no-manifest    Don't run ./generate-manifest.sh afterwards
 *
 * Re-running with the same URL refreshes the metadata; if you don't pass
 * --tags, the tags already in the file are kept.
 * Needs Node 18+ (built-in fetch). No dependencies.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const BLOG_DIR = path.join(__dirname, 'content', 'blog');

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--no-manifest') args.noManifest = true;
    else if (a.startsWith('--')) args[a.slice(2)] = argv[++i];
    else args._.push(a);
  }
  return args;
}

const oneLine = (s) => String(s || '').replace(/\s+/g, ' ').trim();

function decodeEntities(s) {
  return s.replace(/&(#x?[0-9a-f]+|amp|lt|gt|quot|apos|#39);/gi, (m, e) => {
    const map = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", '#39': "'" };
    if (map[e.toLowerCase()]) return map[e.toLowerCase()];
    const code = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
    return Number.isNaN(code) ? m : String.fromCodePoint(code);
  });
}

function metaContent(html, key) {
  const re = new RegExp(
    `<meta[^>]+(?:property|name)=["']${key}["'][^>]*content=["']([^"']*)["']` +
    `|<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${key}["']`, 'i');
  const m = html.match(re);
  return m ? decodeEntities(m[1] || m[2] || '') : '';
}

async function getJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (add-substack.js)' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function fetchMetadata(articleUrl) {
  const u = new URL(articleUrl);
  const m = u.pathname.match(/\/p\/([^/]+)/);
  if (!m) throw new Error('That does not look like a Substack article URL (expected .../p/<slug>).');
  const slug = m[1];

  // 1) Substack's JSON API (works on *.substack.com and custom domains)
  try {
    const p = await getJson(`${u.origin}/api/v1/posts/${slug}`);
    return {
      slug,
      url: p.canonical_url || articleUrl.split('?')[0],
      title: p.title,
      excerpt: p.subtitle || p.description || '',
      image: p.cover_image || '',
      date: (p.post_date || '').slice(0, 10),
    };
  } catch (e) {
    console.warn(`  (API lookup failed: ${e.message}; falling back to page meta tags)`);
  }

  // 2) Fallback: Open Graph tags on the page itself
  const res = await fetch(articleUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (add-substack.js)' } });
  if (!res.ok) throw new Error(`Could not fetch ${articleUrl} (${res.status})`);
  const html = await res.text();
  const ld = html.match(/"datePublished"\s*:\s*"([^"]+)"/);
  return {
    slug,
    url: metaContent(html, 'og:url') || articleUrl.split('?')[0],
    title: metaContent(html, 'og:title'),
    excerpt: metaContent(html, 'og:description'),
    image: metaContent(html, 'og:image'),
    date: (metaContent(html, 'article:published_time') || (ld && ld[1]) || '').slice(0, 10),
  };
}

function existingTags(file) {
  if (!fs.existsSync(file)) return null;
  const m = fs.readFileSync(file, 'utf8').match(/^tags:\s*\[(.*)\]\s*$/m);
  return m ? m[1].split(',').map((t) => t.trim()).filter(Boolean) : null;
}

(async () => {
  const args = parseArgs(process.argv.slice(2));
  const articleUrl = args._[0];
  if (!articleUrl) {
    console.error('Usage: node add-substack.js <substack-article-url> --tags tag1,tag2');
    process.exit(1);
  }

  console.log(`Fetching ${articleUrl} ...`);
  const meta = await fetchMetadata(articleUrl);
  const file = path.join(BLOG_DIR, `${meta.slug}.md`);

  const title = oneLine(args.title || meta.title);
  if (!title) throw new Error('Could not determine a title; pass --title.');
  const date = args.date || meta.date || new Date().toISOString().slice(0, 10);
  const tags = args.tags
    ? args.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : existingTags(file) || [];

  const front = [
    '---',
    `title: ${title}`,
    `slug: ${meta.slug}`,
    `date: ${date}`,
    `tags: [${tags.join(', ')}]`,
    `excerpt: ${oneLine(args.excerpt || meta.excerpt)}`,
    'source: substack',
    `url: ${meta.url}`,
    `image: ${oneLine(args.image || meta.image)}`,
    '---',
    '',
  ].join('\n');

  fs.mkdirSync(BLOG_DIR, { recursive: true });
  fs.writeFileSync(file, front);
  console.log(`Wrote ${path.relative(__dirname, file)}`);
  console.log(`  title:   ${title}\n  date:    ${date}\n  tags:    ${tags.join(', ') || '(none — add with --tags)'}\n  image:   ${args.image || meta.image || '(none)'}`);

  if (!args.noManifest) {
    execFileSync(path.join(__dirname, 'generate-manifest.sh'), { stdio: 'inherit' });
  }
})().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
