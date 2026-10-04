// Search index, generated at build time from the articles. Loaded by the browser on the first
// search (src/scripts/search.ts). Indexes title, description, aliases, headings and body text.
import { getArticles, plainText } from '../lib/articles';

export async function GET() {
  const articles = await getArticles();
  const docs = articles.map((a, id) => {
    const body = a.entry.body || '';
    const headings = [...body.matchAll(/^#{2,3}\s+(.+)$/gm)].map((m) => m[1].trim()).join(' · ');
    return {
      id,
      url: a.url,
      title: a.title,
      description: a.description,
      path: a.topic.label === a.category.label ? a.category.label : `${a.category.label} › ${a.topic.label}`,
      type: a.typeLabel,
      aliases: a.aliases.join(' · '),
      headings,
      body: plainText(body),
    };
  });
  return new Response(JSON.stringify(docs), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
