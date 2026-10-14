// Inteligência artificial: identity and behavior of the assistant (Conhecimento › Identidade e comportamento and the
// Agente screen edit the same configuration), the "Exemplo" preview and the Playground testing unsaved changes.
// Nothing is saved here: the edits are discarded at the end, so the spec can run again on the same data.
import { test, expect } from '@playwright/test';
import { start, go, settle, highlight, clearHighlights, shot } from './helpers';

const DIR = 'agente';
const content = { x: 272, y: 64, width: 1168, height: 836 };

test('identidade e comportamento, conhecimento e playground com alterações não salvas', async ({ page }) => {
  await start(page);
  await settle(page);

  // Conhecimento: the two groups of the menu and the identity section
  await go(page, '/knowledge');
  await settle(page, 700);
  const nav = page.locator('.kb-nav');
  await expect(nav.getByText('O que o assistente sabe')).toBeVisible();
  await expect(nav.getByText('Como o assistente age')).toBeVisible();
  await highlight(nav.getByRole('button', { name: 'Identidade e comportamento' }), 1);
  await shot(page, `${DIR}/conhecimento-01-secoes`, { locator: nav, pad: 16 });
  await clearHighlights(page);

  await nav.getByRole('button', { name: 'Identidade e comportamento' }).click();
  await expect(page.getByText('Conhecimento é o que o assistente sabe.')).toBeVisible();
  await settle(page, 600);
  await expect(page.getByLabel('Nome do assistente')).toHaveValue('Lia');
  await shot(page, `${DIR}/identidade-01-conhecimento`, { clip: content });
  const identity = page.locator('.sl-card').filter({ has: page.getByRole('heading', { name: 'Identidade', exact: true }) });
  await shot(page, `${DIR}/identidade-02-campos`, { locator: identity, pad: 8 });
  const messages = page.locator('.sl-card').filter({ has: page.getByRole('heading', { name: 'Mensagens de atendimento' }) });
  await shot(page, `${DIR}/identidade-03-mensagens`, { locator: messages, pad: 8 });

  // Agente: the same values; the "Exemplo" preview
  await go(page, '/agent');
  await settle(page, 800);
  await expect(page.getByLabel('Nome do assistente')).toHaveValue('Lia');
  const example = page.locator('.agent-preview .sl-card').first();
  await expect(example.getByText('Exemplo', { exact: true })).toBeVisible();
  await shot(page, `${DIR}/identidade-04-exemplo`, { locator: example, pad: 8 });
  const handoff = page.locator('.sl-card').filter({ has: page.getByRole('heading', { name: 'Transferência para humano' }) });
  await shot(page, `${DIR}/identidade-05-transferencia`, { locator: handoff, pad: 8 });

  // An unsaved change → "Testar sem salvar" → the Playground says "Configuração não salva"
  await page.getByLabel('Como o assistente deve se comportar (opcional)').fill('Seja acolhedora e calma. Use frases curtas e explique de forma simples.');
  const bar = page.getByRole('region', { name: 'Alterações não salvas' });
  await expect(bar).toBeVisible();
  await highlight(bar.getByRole('button', { name: 'Testar sem salvar' }), 1);
  await shot(page, `${DIR}/identidade-06-testar-sem-salvar`, { locator: bar, pad: 24 });
  await clearHighlights(page);
  await bar.getByRole('button', { name: 'Testar sem salvar' }).click();
  await expect(page.getByText('Configuração não salva', { exact: true })).toBeVisible();
  const input = page.getByRole('textbox', { name: 'Mensagem de teste' });
  await input.fill('Oi, tudo bem?');
  await page.getByRole('button', { name: 'Enviar mensagem de teste' }).click();
  await expect(page.locator('.pg-typing')).toBeHidden({ timeout: 15_000 });
  await settle(page, 400);
  await expect(page.locator('.pg-ai').first()).toContainText('Olá! Sou a Lia, assistente virtual da Clínica Aurora.');
  await page.evaluate(() => document.querySelectorAll('main, #sl-content, .shell__main').forEach((e) => { e.scrollTop = 0; }));
  await page.evaluate(() => window.scrollTo(0, 0));
  await highlight(page.locator('.pg-alert').first(), 1);
  await shot(page, `${DIR}/playground-01-nao-salvo`, { clip: content });
  await clearHighlights(page);

  // Back to editing (the change is still there), then discard: nothing was saved
  await page.locator('.pg-alert').first().getByRole('button', { name: 'Voltar para a edição' }).click();
  await expect(page.getByRole('region', { name: 'Alterações não salvas' })).toBeVisible();
  await page.getByRole('region', { name: 'Alterações não salvas' }).getByRole('button', { name: 'Descartar' }).click();
  await expect(page.getByLabel('Como o assistente deve se comportar (opcional)')).toHaveValue('Seja acolhedora e calma. Explique de forma simples e objetiva.');
});
