// Search quality: common ways people ask must find the right article.
// Uses the index produced by `npm run build` (dist/search-index.json); skipped before a build.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createEngine, runQuery, normalize, stem } from '../src/scripts/search-engine.ts';

const INDEX = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'search-index.json');

test('normalização ignora acentos e plural', () => {
  assert.equal(normalize('Conexão'), 'conexao');
  assert.equal(stem('conversas'), 'conversa');
  assert.equal(stem('mensagens'), 'mensagem');
  assert.equal(stem('profissionais'), 'profissional');
});

const CASES = [
  ['assumir conversa', '/atendimento/assumir-conversa'],
  ['tirar o robô da conversa', '/atendimento/assumir-conversa'],
  ['devolver para ia', '/atendimento/devolver-para-ia'],
  ['conectar whatsapp', '/comecando/conectar-whatsapp'],
  ['whatsapp desconectado', '/comecando/conectar-whatsapp'],
  ['pausar o sile', '/comecando/ativar-o-sile'],
  ['mandar pdf', '/atendimento/enviar-anexos'],
  ['playground', '/comecando/testar-no-playground'],
  ['horario de funcionamento', '/comecando/configurar-clinica'],
  ['preço a partir de', '/comecando/configurar-servicos'],
  ['notas internas', '/atendimento/informacoes-do-contato'],
  ['configuracao guiada', '/comecando/primeiros-passos'],
  ['material de onboarding', '/comecando/guia-de-implantacao'],
  ['implantação', '/comecando/guia-de-implantacao'],
];

test('buscas comuns encontram o artigo certo entre os 3 primeiros', { skip: !existsSync(INDEX) && 'rode npm run build antes' }, () => {
  const ms = createEngine(JSON.parse(readFileSync(INDEX, 'utf8')));
  for (const [q, url] of CASES) {
    const top = runQuery(ms, q).slice(0, 3).map((r) => r.url);
    assert.ok(top.includes(url), `"${q}" deveria encontrar ${url}; veio ${top.join(', ') || 'nada'}`);
  }
});
