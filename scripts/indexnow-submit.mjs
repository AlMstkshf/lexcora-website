import fs from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_SITE_URL = 'https://lexcora-mbh.com';
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '3f9a7e5bba8c4efea4d5fa1313dcd89d';
const INDEXNOW_ENDPOINT = process.env.INDEXNOW_ENDPOINT || 'https://api.indexnow.org/indexnow';
const SITE_URL = process.env.SITE_URL || DEFAULT_SITE_URL;

const keyLocation = `${SITE_URL}/${INDEXNOW_KEY}.txt`;

const ensureKeyFile = async () => {
  const keyFilePath = path.join(process.cwd(), 'public', `${INDEXNOW_KEY}.txt`);
  await fs.mkdir(path.dirname(keyFilePath), { recursive: true });
  await fs.writeFile(keyFilePath, INDEXNOW_KEY, 'utf8');
  return keyFilePath;
};

const readSitemapUrls = async () => {
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  const xml = await fs.readFile(sitemapPath, 'utf8');
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)];
  return matches.map((m) => m[1]).filter(Boolean);
};

const submitToIndexNow = async (urlList) => {
  const host = new URL(SITE_URL).host;
  const payload = { host, key: INDEXNOW_KEY, keyLocation, urlList };
  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`IndexNow submission failed: ${res.status} ${res.statusText} ${body}`.trim());
  }
};

const run = async () => {
  const keyFile = await ensureKeyFile();
  console.log(`IndexNow key ensured at ${keyFile}`);

  const urls = await readSitemapUrls();
  if (urls.length === 0) {
    throw new Error('No URLs found in sitemap.xml to submit to IndexNow.');
  }

  console.log(`Submitting ${urls.length} URLs to IndexNow...`);
  await submitToIndexNow(urls);
  console.log('IndexNow submission completed.');
};

run().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
