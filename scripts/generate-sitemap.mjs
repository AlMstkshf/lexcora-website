import fs from 'node:fs/promises';
import path from 'node:path';

const SITE_URL = process.env.SITE_URL || 'https://lexcora-mbh.com';

const basePaths = [
  '',
  '/features',
  '/pricing',
  '/case-studies',
  '/about',
  '/free-trial',
  '/contact',
  '/privacy',
  '/insights',
];

const ampPages = ['', 'features', 'pricing', 'case-studies', 'about', 'free-trial', 'contact', 'privacy', 'insights'];

const toAbsoluteUrl = (route) => {
  const normalized = route.startsWith('/') ? route : `/${route}`;
  const cleaned = normalized.replace(/\/{2,}/g, '/');
  const trimmed = cleaned === '/' ? '' : cleaned;
  return `${SITE_URL}${trimmed}`;
};

const loadArticles = async () => {
  const articlesPath = path.join(process.cwd(), 'data', 'articles.json');
  const json = await fs.readFile(articlesPath, 'utf8');
  return JSON.parse(json);
};

const generateSitemap = async () => {
  const articles = await loadArticles();

  const localizedPaths = basePaths.flatMap((slug) => [`/en${slug}`, `/ar${slug}`]);
  const articlePaths = (articles || []).map((article) => `/${article.lang}/insights/${article.slug}`);
  const ampPaths = ampPages.flatMap((slug) => {
    const suffix = slug ? `${slug}/` : '';
    return [`/amp/en/${suffix}`, `/amp/ar/${suffix}`];
  });

  const urls = [...localizedPaths, ...articlePaths, ...ampPaths];
  const uniqueUrls = [...new Set(urls)].map(toAbsoluteUrl);

  const urlset = uniqueUrls
    .map((loc) => `  <url>\n    <loc>${loc}</loc>\n  </url>`)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>\n`;

  const outPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  await fs.writeFile(outPath, xml, 'utf8');
  console.log(`Sitemap generated with ${uniqueUrls.length} URLs at ${outPath}`);
};

generateSitemap().catch((err) => {
  console.error('Failed to generate sitemap:', err);
  process.exitCode = 1;
});
