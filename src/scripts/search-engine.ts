// Search engine shared by the header search, the home search and /busca.
// MiniSearch over title, aliases, headings, description and body, accent-insensitive, with a light
// Portuguese plural stemmer, prefix matching and typo tolerance on longer words.
import MiniSearch from 'minisearch';

export interface SearchDoc {
  id: number;
  url: string;
  title: string;
  description: string;
  path: string;
  type: string;
  aliases: string;
  headings: string;
  body: string;
}
export interface SearchHit { url: string; title: string; description: string; path: string; type: string; terms: string[] }

const STOP = new Set(['a', 'o', 'e', 'as', 'os', 'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'nos', 'nas', 'um', 'uma', 'uns', 'umas', 'para', 'pra', 'por', 'com', 'como', 'que', 'se', 'ao', 'aos', 'eu', 'meu', 'minha', 'e', 'ou', 'sobre', 'quando', 'onde', 'qual', 'quais', 'nao', 'sim', 'faco', 'fazer', 'posso', 'consigo']);

export const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Light plural stemmer, applied to the index and to the query alike. */
export function stem(w: string) {
  if (w.length <= 4) return w;
  if (w.endsWith('oes') || w.endsWith('aes')) return w.slice(0, -3) + 'ao';
  if (w.endsWith('ns')) return w.slice(0, -2) + 'm';
  if (w.endsWith('is') && !w.endsWith('eis')) return w.slice(0, -2) + 'l';
  if (w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
  return w;
}

const processTerm = (term: string) => {
  const t = normalize(term);
  if (!t || STOP.has(t)) return null;
  return stem(t);
};

/** Builds the index (exported for the tests). */
export function createEngine(docs: SearchDoc[]) {
  const ms = new MiniSearch<SearchDoc>({
    fields: ['title', 'aliases', 'headings', 'description', 'body'],
    storeFields: ['url', 'title', 'description', 'path', 'type'],
    processTerm,
    searchOptions: {
      boost: { title: 4, aliases: 3, headings: 2, description: 2, body: 1 },
      prefix: (term) => term.length > 2,
      fuzzy: (term) => (term.length > 5 ? 0.2 : false),
    },
  });
  ms.addAll(docs);
  return ms;
}

/** AND first (all words must match); falls back to OR when nothing matches. */
export function runQuery(ms: MiniSearch<SearchDoc>, q: string) {
  const results = ms.search(q, { combineWith: 'AND' });
  return results.length ? results : ms.search(q, { combineWith: 'OR' });
}

let engine: Promise<MiniSearch<SearchDoc>> | null = null;

export function loadEngine(indexUrl = '/search-index.json') {
  engine ??= fetch(indexUrl)
    .then((r) => {
      if (!r.ok) throw new Error('Índice de busca indisponível');
      return r.json() as Promise<SearchDoc[]>;
    })
    .then((docs) => createEngine(docs))
    .catch((e) => {
      engine = null;
      throw e;
    });
  return engine;
}

export async function search(query: string, limit = 8): Promise<SearchHit[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const ms = await loadEngine();
  const results = runQuery(ms, q);
  const terms = q.split(/\s+/).map(normalize).filter((t) => t.length > 1 && !STOP.has(t));
  return results.slice(0, limit).map((r) => ({ url: r.url, title: r.title, description: r.description, path: r.path, type: r.type, terms }));
}

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** Wraps the beginning of words that match the query terms in <mark>, ignoring accents. Returns safe HTML. */
export function highlight(text: string, terms: string[]) {
  if (!terms.length) return escapeHtml(text);
  const chars = [...text];
  const norm = chars.map((c) => normalize(c).charAt(0) || c).join('');
  const marks = new Array(chars.length).fill(false);
  for (const term of terms) {
    const stemmed = stem(term).slice(0, Math.max(3, stem(term).length));
    let from = 0;
    while (from < norm.length) {
      const i = norm.indexOf(stemmed, from);
      if (i < 0) break;
      const atWordStart = i === 0 || /[^a-z0-9]/.test(norm[i - 1]);
      if (atWordStart) {
        let end = i + stemmed.length;
        while (end < norm.length && /[a-z0-9]/.test(norm[end])) end++;
        for (let k = i; k < Math.min(end, i + term.length + 2); k++) marks[k] = true;
      }
      from = i + 1;
    }
  }
  let out = '';
  let open = false;
  chars.forEach((c, i) => {
    if (marks[i] && !open) { out += '<mark>'; open = true; }
    if (!marks[i] && open) { out += '</mark>'; open = false; }
    out += escapeHtml(c);
  });
  if (open) out += '</mark>';
  return out;
}
