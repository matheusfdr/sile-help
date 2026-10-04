// robots.txt generated from PUBLIC_SITE_URL, so staging and production point at their own sitemap.
import { site } from '../config/site';

export function GET() {
  const body = ['User-agent: *', 'Allow: /', 'Disallow: /busca', '', `Sitemap: ${site.url}/sitemap-index.xml`, ''].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
