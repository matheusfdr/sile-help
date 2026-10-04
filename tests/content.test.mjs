// Content QA for the public help center. Runs with `npm test` (node:test, no build needed).
// Checks that every article is complete, links and images resolve, nothing internal leaks and
// every person, e-mail and phone number is part of the fictitious documentation dataset.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { topics, categories } from '../src/data/navigation.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ARTICLES = join(ROOT, 'src', 'content', 'articles');
const IMAGES = join(ROOT, 'public', 'images');

const walk = (dir) => readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? walk(p) : [p]; });

function parse(file) {
  const raw = readFileSync(file, 'utf8');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  assert.ok(m, `${file}: frontmatter ausente`);
  const data = {};
  let list = null;
  for (const line of m[1].split(/\r?\n/)) {
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && list) { data[list].push(item[1].trim()); continue; }
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    if (kv[2] === '') { list = kv[1]; data[list] = []; } else { list = null; data[kv[1]] = kv[2].trim(); }
  }
  const rel = relative(ARTICLES, file).replace(/\\/g, '/').replace(/\.mdx$/, '');
  return { file: rel, url: '/' + rel, data, body: m[2] };
}

const articles = walk(ARTICLES).filter((f) => f.endsWith('.mdx')).map(parse);
const urls = new Set(articles.map((a) => a.url));
const categoryUrls = new Set(categories.map((c) => '/' + c.id));

test('há artigos publicados', () => {
  assert.ok(articles.length >= 10, `esperava pelo menos 10 artigos, encontrei ${articles.length}`);
});

test('metadados completos e coerentes com a navegação', () => {
  for (const a of articles) {
    for (const key of ['title', 'description', 'type', 'topic', 'order', 'lastUpdated']) assert.ok(a.data[key], `${a.file}: falta "${key}"`);
    assert.match(a.data.type, /^(conceito|tutorial|referencia|solucao)$/, `${a.file}: tipo inválido`);
    const topic = topics.find((t) => t.id === a.data.topic);
    assert.ok(topic, `${a.file}: tópico "${a.data.topic}" não existe`);
    assert.equal(a.file.split('/')[0], topic.category, `${a.file}: a pasta deve ser a categoria do tópico (${topic.category})`);
    assert.match(a.data.lastUpdated, /^\d{4}-\d{2}-\d{2}$/, `${a.file}: lastUpdated deve ser AAAA-MM-DD`);
    assert.ok((a.data.related || []).length >= 2, `${a.file}: inclua de 2 a 4 artigos relacionados`);
    assert.ok(!/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(a.data.title + a.body), `${a.file}: sem emoji no texto`);
  }
});

test('títulos e URLs são únicos', () => {
  const titles = articles.map((a) => a.data.title);
  assert.equal(new Set(titles).size, titles.length, 'há títulos repetidos');
});

test('artigos relacionados e links internos existem', () => {
  for (const a of articles) {
    for (const url of a.data.related || []) assert.ok(urls.has(url), `${a.file}: relacionado inexistente ${url}`);
    for (const [, href] of a.body.matchAll(/\]\((\/[^)#\s]*)(#[^)]*)?\)/g)) {
      assert.ok(urls.has(href) || categoryUrls.has(href) || href === '/', `${a.file}: link quebrado ${href}`);
    }
  }
});

test('screenshots existem, têm texto alternativo e nenhuma imagem sobra', () => {
  const used = new Set();
  for (const a of articles) {
    for (const [tag] of a.body.matchAll(/<Screenshot\b[^>]*\/>/g)) {
      const src = tag.match(/src="([^"]+)"/)?.[1];
      const alt = tag.match(/alt="([^"]*)"/)?.[1] || '';
      assert.ok(src, `${a.file}: Screenshot sem src`);
      assert.match(src, /^\/images\/[a-z0-9-]+\/[a-z0-9-]+\.(webp|png)$/, `${a.file}: nome de imagem fora do padrão: ${src}`);
      assert.ok(existsSync(join(ROOT, 'public', src)), `${a.file}: imagem não encontrada ${src}`);
      assert.ok(alt.length >= 30, `${a.file}: alt muito curto em ${src}`);
      used.add(src);
    }
  }
  const files = existsSync(IMAGES) ? walk(IMAGES).map((f) => '/' + relative(join(ROOT, 'public'), f).replace(/\\/g, '/')) : [];
  const orphans = files.filter((f) => !used.has(f));
  assert.deepEqual(orphans, [], 'imagens sem uso em nenhum artigo');
});

// Nothing about the internal Sile Admin, infrastructure or the demo environment.
const FORBIDDEN = [
  /sile admin/i, /\/admin\b/i, /impersonat/i, /feature flag/i, /coolify/i, /postgres/i, /\bredis\b/i, /\bworkers?\b/i,
  /acesso de suporte/i, /suporte sile/i, /prompt interno/i, /\bmock/i, /localhost/i, /mock-server/i, /api[_ ]?key/i, /\btoken\b/i,
  /servidor simulado/i, /llm/i, /openai|anthropic/i,
];
// People named with a title must be the dataset's professionals (docs/dataset.md).
const PROFESSIONALS = new Set(['Dra. Camila Rocha', 'Dr. Rafael Lima', 'Dra. Fernanda Alves']);
const ORGANIZATION = 'Clínica Aurora';

test('nenhuma informação interna ou administrativa', () => {
  for (const a of articles) {
    const text = a.data.title + '\n' + a.data.description + '\n' + a.body;
    for (const re of FORBIDDEN) assert.ok(!re.test(text), `${a.file}: termo proibido ${re}`);
  }
});

test('profissionais e clínica citados são os do dataset', () => {
  for (const a of articles) {
    for (const [name] of a.body.matchAll(/\bDra?\. [A-ZÀ-Ú][a-zà-ú]+ [A-ZÀ-Ú][a-zà-ú]+/g)) {
      assert.ok(PROFESSIONALS.has(name), `${a.file}: profissional fora do dataset: ${name}`);
    }
    for (const [name] of a.body.matchAll(/\bClínica [A-ZÀ-Ú][a-zà-ú]+/g)) {
      assert.equal(name, ORGANIZATION, `${a.file}: clínica fora do dataset: ${name}`);
    }
  }
});

test('e-mails e telefones são fictícios', () => {
  for (const a of articles) {
    for (const [email] of a.body.matchAll(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g)) {
      assert.ok(email.endsWith('.example') || email === 'suporte@sileai.app', `${a.file}: e-mail fora do dataset fictício: ${email}`);
    }
    for (const [phone] of a.body.matchAll(/\+55\s?\d{2}\s?\d{4,5}-?\d{4}/g)) {
      assert.match(phone, /^\+55 11 90000-\d{4}$/, `${a.file}: telefone fora do dataset fictício: ${phone}`);
    }
  }
});
