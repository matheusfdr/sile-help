import { getCollection, type CollectionEntry } from 'astro:content';
import { categories, topics, sidebar, topicById, categoryById, ARTICLE_TYPES } from '../data/navigation';

export type ArticleEntry = CollectionEntry<'articles'>;

export interface Article {
  entry: ArticleEntry;
  id: string;
  url: string;
  slug: string;
  title: string;
  description: string;
  type: keyof typeof ARTICLE_TYPES;
  typeLabel: string;
  order: number;
  lastUpdated: Date;
  topic: { id: string; label: string };
  category: { id: string; label: string; icon: string };
  related: string[];
  aliases: string[];
}

let cache: Article[] | null = null;

/** Published articles, ordered by category, topic and `order`. */
export async function getArticles(): Promise<Article[]> {
  if (cache) return cache;
  const entries = await getCollection('articles', (e) => !e.data.draft);
  const catIndex = (id: string) => categories.findIndex((c) => c.id === id);
  const topicIndex = (id: string) => topics.findIndex((t) => t.id === id);
  cache = entries
    .map((entry) => {
      const [folder, slug] = entry.id.split('/');
      const topic = topicById(entry.data.topic);
      const category = categoryById(topic.category);
      if (folder !== category.id) {
        throw new Error(`O artigo ${entry.id} está na pasta "${folder}", mas o tópico "${topic.id}" pertence à categoria "${category.id}".`);
      }
      return {
        entry,
        id: entry.id,
        url: `/${category.id}/${slug}`,
        slug,
        title: entry.data.title,
        description: entry.data.description,
        type: entry.data.type,
        typeLabel: ARTICLE_TYPES[entry.data.type].label,
        order: entry.data.order,
        lastUpdated: entry.data.lastUpdated,
        topic: { id: topic.id, label: topic.label },
        category: { id: category.id, label: category.label, icon: category.icon },
        related: entry.data.related,
        aliases: entry.data.aliases,
      } satisfies Article;
    })
    .sort((a, b) => catIndex(a.category.id) - catIndex(b.category.id) || topicIndex(a.topic.id) - topicIndex(b.topic.id) || a.order - b.order);
  return cache;
}

export async function getArticleByUrl(url: string) {
  return (await getArticles()).find((a) => a.url === url) || null;
}

/** Sidebar groups with only the topics that have articles. */
export async function getSidebar() {
  const all = await getArticles();
  return sidebar
    .map((group) => ({
      label: group.label,
      topics: group.topics
        .map((id) => ({ ...topicById(id), articles: all.filter((a) => a.topic.id === id) }))
        .filter((t) => t.articles.length),
    }))
    .filter((g) => g.topics.length);
}

/** Categories that have articles, with their topics and articles. */
export async function getCategories() {
  const all = await getArticles();
  return categories
    .map((c) => ({
      ...c,
      url: `/${c.id}`,
      articles: all.filter((a) => a.category.id === c.id),
      topics: topics.filter((t) => t.category === c.id).map((t) => ({ ...t, articles: all.filter((a) => a.topic.id === t.id) })).filter((t) => t.articles.length),
    }))
    .filter((c) => c.articles.length);
}

/** Explicit related articles; when there are fewer than two, completes with siblings of the same topic. */
export async function getRelated(article: Article, max = 4) {
  const all = await getArticles();
  const picked = article.related.map((url) => {
    const found = all.find((a) => a.url === url);
    if (!found) throw new Error(`"${article.id}" aponta para um artigo relacionado que não existe: ${url}`);
    return found;
  });
  if (picked.length < 2) {
    all.filter((a) => a.topic.id === article.topic.id && a.url !== article.url && !picked.includes(a)).slice(0, 2 - picked.length).forEach((a) => picked.push(a));
  }
  return picked.slice(0, max);
}

/** Previous and next article in reading order. */
export async function getNeighbours(article: Article) {
  const list = (await getArticles()).filter((a) => a.category.id === article.category.id);
  const i = list.findIndex((a) => a.url === article.url);
  return { prev: i > 0 ? list[i - 1] : null, next: i < list.length - 1 ? list[i + 1] : null };
}

const dateFormat = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const formatDate = (d: Date) => dateFormat.format(d);
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

/** Rough reading time from the MDX source (200 words per minute, at least 1). */
export function readingMinutes(body = '') {
  const words = plainText(body).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** MDX source → plain text for search and reading time (components, imports and markup removed). */
export function plainText(body = '') {
  return body
    .replace(/^(import|export)\s.*$/gm, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[A-Z][\w.]*\b[^>]*\/>/g, ' ')
    .replace(/<\/?[A-Za-z][\w.]*\b[^>]*>/g, ' ')
    .replace(/\{[^{}]*\}/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`#>|~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
