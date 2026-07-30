import fs from "node:fs";
import path from "node:path";
import sitemap from "../app/sitemap";
import { getPlayerAliasEntries, isCanonicalPlayerSlug } from "../data/playerSlugs";

const SITE_URL = "https://watchtennistoday.com";
const root = process.cwd();
const failures: string[] = [];
const warnings: string[] = [];

function fail(message: string) {
  failures.push(message);
}

function walk(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function routeFromPage(file: string) {
  const relative = path.relative(path.join(root, "app"), path.dirname(file)).replaceAll("\\", "/");
  return relative ? `/${relative}` : "/";
}

function redirectSources() {
  const source = fs.readFileSync(path.join(root, "next.config.ts"), "utf8");
  return new Set(Array.from(source.matchAll(/source:\s*"([^"]+)"/g), (match) => match[1]));
}

async function auditGeneratedSitemap() {
  const entries = await sitemap();
  const urls = entries.map((entry) => entry.url);
  const redirects = redirectSources();

  for (const url of urls) {
    const parsed = new URL(url);
    if (parsed.origin !== SITE_URL) fail(`Non-canonical sitemap origin: ${url}`);
    if (parsed.search) fail(`Search parameter URL in sitemap: ${url}`);
    if (/opengraph-image|twitter-image/i.test(parsed.pathname)) fail(`Metadata image URL in sitemap: ${url}`);
    if (redirects.has(parsed.pathname)) fail(`Redirect source in sitemap: ${url}`);

    const playerMatch = parsed.pathname.match(/^\/player\/([^/]+)$/);
    if (playerMatch && !isCanonicalPlayerSlug(playerMatch[1])) {
      fail(`Non-canonical player URL in sitemap: ${url}`);
    }
  }

  for (const duplicate of urls.filter((url, index) => urls.indexOf(url) !== index)) {
    fail(`Duplicate sitemap URL: ${duplicate}`);
  }

  console.log(`Sitemap: ${urls.length} canonical candidates checked.`);
}

function auditAliases() {
  const aliases = getPlayerAliasEntries();
  const targetsByAlias = new Map<string, string>();

  for (const { alias, canonicalSlug } of aliases) {
    const previous = targetsByAlias.get(alias);
    if (previous && previous !== canonicalSlug) {
      fail(`Player alias collision: "${alias}" maps to ${previous} and ${canonicalSlug}`);
    }
    targetsByAlias.set(alias, canonicalSlug);
  }

  console.log(`Players: ${aliases.length} normalized aliases checked.`);
}

function auditPageMetadataSources() {
  const pages = walk(path.join(root, "app")).filter((file) => file.endsWith(`${path.sep}page.tsx`));

  for (const file of pages) {
    const route = routeFromPage(file);
    const source = fs.readFileSync(file, "utf8");
    if (source.includes("SearchAction") || source.includes("search_term_string")) {
      fail(`SearchAction placeholder remains in ${route}`);
    }
    if (route.startsWith("/api/") || route.includes("[")) continue;
    if (/\bredirect\(|\bpermanentRedirect\(/.test(source)) continue;

    const hasMetadata = /export\s+(?:const\s+metadata|async\s+function\s+generateMetadata|function\s+generateMetadata)/.test(source);
    if (!hasMetadata) warnings.push(`No route-owned metadata found: ${route}`);
    if (hasMetadata && !/description\s*:/.test(source)) warnings.push(`No source-level description found: ${route}`);
    if (hasMetadata && !/canonical\s*:/.test(source)) warnings.push(`No source-level canonical found: ${route}`);
  }
}

async function auditLiveBase(baseUrl: string) {
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/sitemap.xml`, { redirect: "manual" });
  if (!response.ok) {
    fail(`Live sitemap returned ${response.status}: ${baseUrl}/sitemap.xml`);
    return;
  }

  const xml = await response.text();
  const urls = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g), (match) => match[1]);
  for (const url of urls) {
    const page = await fetch(url, { redirect: "manual" });
    if (page.status !== 200) {
      fail(`Sitemap URL returned ${page.status}: ${url}`);
      continue;
    }
    const html = await page.text();
    if (/name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)) fail(`Sitemap URL is noindex: ${url}`);
    if (!/rel=["']canonical["']/i.test(html)) fail(`Sitemap URL has no canonical: ${url}`);
    if (!/<title>[^<]+<\/title>/i.test(html)) fail(`Sitemap URL has no title: ${url}`);
    if (!/name=["']description["']/i.test(html)) fail(`Sitemap URL has no description: ${url}`);
  }
}

async function main() {
  await auditGeneratedSitemap();
  auditAliases();
  auditPageMetadataSources();

  const baseArg = process.argv.find((value) => value.startsWith("--base="));
  if (baseArg) {
    await auditLiveBase(baseArg.slice("--base=".length));
  }

  for (const warning of warnings) console.warn(`WARN ${warning}`);
  for (const failure of failures) console.error(`ERROR ${failure}`);

  console.log(`SEO audit complete: ${failures.length} critical, ${warnings.length} warnings.`);
  if (failures.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
