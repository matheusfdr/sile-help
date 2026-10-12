// Campanhas: the Clínica Aurora with campaigns, logged in as Ana Martins (Owner).
// Campanhas exist only with the Sile server, so this spec runs against the app connected to it (see README.md, "Campanhas").
// Validates and captures: the list, the five steps of a new campaign, the audience and its exclusions, scheduling, the
// confirmation, the results of a completed campaign and "Criar campanha" from Contatos. Nothing is confirmed or saved:
// the draft "Novidades para pacientes VIP" is only edited on screen, so the spec can run again on the same data.
import { test, expect, type Page } from '@playwright/test';
import { start, go, settle, highlight, clearHighlights, shot } from './helpers';

const DIR = 'whatsapp';
const MAIN = { x: 272, y: 64, width: 1168, height: 836 };
const card = (page: Page, title: string) => page.locator('.sl-card').filter({ has: page.locator('.sl-card__title', { hasText: title }) }).first();
const aside = (page: Page) => page.locator('.agent-preview');
const hideToasts = (page: Page) => page.addStyleTag({ content: '.toast-dock{display:none!important}' });
/** Tomorrow in the clinic's time zone (São Paulo), "yyyy-mm-dd". */
const tomorrow = () => new Date(Date.now() + 86_400_000).toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });

async function counts(page: Page, eligible: number) {
  await expect(aside(page).getByText('Encontrados')).toBeVisible();
  await expect(aside(page).locator('.camp-counts__main')).toHaveText(String(eligible));
  await settle(page, 600);
}

test('lista de campanhas e nova campanha', async ({ page }) => {
  await start(page);
  await hideToasts(page);
  await go(page, '/campaigns');
  await settle(page, 700);
  await expect(page.getByText('Retorno de outubro')).toBeVisible();
  await expect(page.getByText('Convite para clareamento')).toBeVisible();
  await expect(page.getByText('Novidades para pacientes VIP')).toBeVisible();

  await highlight(page.getByRole('button', { name: 'Nova campanha' }), 1);
  await shot(page, `${DIR}/campanhas-01-lista`, { clip: { ...MAIN, height: 520 } });
  await clearHighlights(page);

  await page.getByRole('button', { name: 'Nova campanha' }).click();
  await expect(page.getByRole('heading', { name: 'Nova campanha' })).toBeVisible();
  await page.getByLabel('Nome').fill('Retorno de novembro');
  await settle(page, 400);
  await highlight(page.getByLabel('Nome'), 1);
  await shot(page, `${DIR}/criar-campanha-01-dados`, { clip: { ...MAIN, height: 640 } });
  await clearHighlights(page);
});

test('etapas do rascunho: público, mensagem, envio, revisão e confirmação', async ({ page }) => {
  await start(page);
  await hideToasts(page);

  // Público: filtro por etiqueta e a contagem ao lado
  await go(page, '/campaigns/camp_aurora_vip/edit?step=2');
  await counts(page, 5);
  await highlight(page.locator('.camp-filter').filter({ hasText: 'Etiquetas' }), 1, { pad: 6 });
  await highlight(card(page, 'Público').last(), 2, { pad: -4, radius: 16 });
  await shot(page, `${DIR}/criar-campanha-02-publico`, { clip: MAIN });
  await clearHighlights(page);

  // Exclusões: mais uma etiqueta (sem salvar) mostra quem fica de fora e por quê
  await page.getByLabel('Etiquetas (qualquer uma)').click();
  await page.getByRole('option', { name: 'Retorno' }).click();
  await counts(page, 12);
  await expect(aside(page).getByText('Pediu para não receber mensagens')).toBeVisible();
  await expect(aside(page).getByText('Sem número de WhatsApp')).toBeVisible();
  await highlight(aside(page).locator('.camp-reasons'), 1, { pad: 6 });
  await shot(page, `${DIR}/publico-02-exclusoes`, { locator: aside(page).locator('.sl-card').first(), pad: 16 });
  await clearHighlights(page);

  // Mensagem: modelo aprovado, variáveis e prévia (recarrega o rascunho salvo, sem a etiqueta extra)
  await page.goto('/campaigns/camp_aurora_vip/edit?step=3');
  await expect(page.getByText('Variáveis do modelo')).toBeVisible();
  await expect(aside(page).getByText('Prévia da mensagem')).toBeVisible();
  await settle(page, 700);
  await highlight(page.getByLabel('Modelo'), 1);
  await highlight(page.locator('.camp-vars'), 2, { pad: 4 });
  await highlight(aside(page).locator('.sl-card').filter({ hasText: 'Prévia da mensagem' }), 3, { pad: -4, radius: 16 });
  await shot(page, `${DIR}/criar-campanha-03-mensagem`, { clip: MAIN });
  await clearHighlights(page);

  // Envio: agendar para amanhã às 10h, com o horário de silêncio da campanha
  await page.locator('.sl-step', { hasText: 'Envio' }).click();
  await expect(page.getByText('Horário de silêncio desta campanha')).toBeVisible();
  await page.locator('.sl-choice', { hasText: 'Agendar' }).click();
  await page.locator('input[type="date"]').fill(tomorrow());
  await page.locator('input[type="time"]').fill('10:00');
  await page.locator('input[type="time"]').blur();
  await settle(page, 400);
  await highlight(page.locator('.sl-choice', { hasText: 'Agendar' }), 1);
  await highlight(page.locator('.form-grid').first(), 2, { pad: 6 });
  await highlight(page.locator('.camp-quiet'), 3, { pad: 6 });
  await shot(page, `${DIR}/enviar-agendar-01-quando`, { clip: { ...MAIN, height: 760 } });
  await clearHighlights(page);

  // Revisão e confirmação (sem confirmar)
  await page.locator('.sl-step', { hasText: 'Revisão' }).click();
  const confirm = page.getByRole('button', { name: 'Confirmar agendamento' });
  await expect(confirm).toBeEnabled();
  await settle(page, 700);
  await highlight(confirm, 1);
  await shot(page, `${DIR}/criar-campanha-04-revisao`, { clip: MAIN });
  await clearHighlights(page);
  await confirm.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByText('Agendar para 5 contatos?')).toBeVisible();
  await settle(page, 300);
  await shot(page, `${DIR}/enviar-agendar-02-confirmar`, { locator: dialog, pad: 12 });
  await dialog.getByRole('button', { name: 'Voltar' }).click();
});

test('resultados de uma campanha concluída e campanha agendada', async ({ page }) => {
  await start(page);
  await go(page, '/campaigns/camp_aurora_retorno');
  await expect(page.getByText('Quem não recebeu')).toBeVisible();
  await settle(page, 800);
  await highlight(page.locator('.camp-kpis'), 1, { pad: 6, radius: 14 });
  await shot(page, `${DIR}/resultados-01-metricas`, { clip: { ...MAIN, height: 272 } });
  await clearHighlights(page);
  await shot(page, `${DIR}/resultados-02-destinatarios`, { locator: card(page, 'Destinatários'), pad: 8, maxHeight: 620 });
  await shot(page, `${DIR}/resultados-03-motivos`, { locator: card(page, 'Quem não recebeu'), pad: 8 });

  await go(page, '/campaigns/camp_aurora_clareamento');
  await expect(page.getByText(/Agendada para/).first()).toBeVisible();
  await settle(page, 700);
  await highlight(page.getByRole('button', { name: 'Cancelar envio' }), 1);
  await shot(page, `${DIR}/enviar-agendar-03-agendada`, { clip: { ...MAIN, height: 104 } });
  await clearHighlights(page);
});

test('criar campanha a partir de Contatos', async ({ page }) => {
  await start(page);
  await go(page, '/contacts');
  await settle(page, 800);
  const boxes = page.locator('tbody input[type="checkbox"]');
  await boxes.nth(0).check({ force: true });
  await boxes.nth(1).check({ force: true });
  const create = page.getByRole('button', { name: 'Criar campanha' });
  await expect(create).toBeVisible();
  await settle(page, 300);
  await highlight(create, 1);
  await shot(page, `${DIR}/publico-01-criar-de-contatos`, { clip: { ...MAIN, height: 420 } });
  await clearHighlights(page);
});
