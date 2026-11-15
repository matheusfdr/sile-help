// Atendimento: Inbox of the operating Clínica Aurora, logged in as Ana Martins (Owner).
// Validates and captures: overview, opening a conversation, taking over, returning to the assistant ("Lia" in the dataset),
// sending messages and templates, and the contact panel. Received files and voice messages: midias.spec.ts.
import { test, expect, type Page } from '@playwright/test';
import { start, go, settle, highlight, clearHighlights, shot } from './helpers';

const DIR = 'atendimento';
const convo = (page: Page, name: string) => page.locator('.sl-convo').filter({ hasText: name });
const chat = (page: Page) => page.locator('.inbox__chat');
const composer = (page: Page) => page.locator('.chat__composer');
const hideToasts = (page: Page) => page.addStyleTag({ content: '.toast-dock{display:none!important}' });

async function open(page: Page, name: string) {
  await convo(page, name).click();
  await expect(page.locator('.chat__who b', { hasText: name })).toBeVisible();
  await settle(page, 500);
}

test('visão geral e abrir uma conversa', async ({ page }) => {
  await start(page);
  await go(page, '/inbox');
  await settle(page, 700);

  // Abrir: lista sem conversa selecionada
  await highlight(convo(page, 'Mariana Souza'), 1, { pad: -2, radius: 8 });
  await shot(page, `${DIR}/abrir-conversa-01-lista`, { clip: { x: 0, y: 0, width: 1440, height: 760 } });
  await clearHighlights(page);

  // Busca por nome
  await page.getByLabel('Buscar conversas').fill('Rafael');
  await settle(page, 600);
  await shot(page, `${DIR}/abrir-conversa-02-busca`, { locator: page.locator('.inbox__list'), maxHeight: 360 });
  await page.getByLabel('Buscar conversas').fill('');
  await settle(page, 600);

  // Filtros
  await highlight(page.locator('.inbox__filters'), 1, { pad: 6 });
  await shot(page, `${DIR}/inbox-02-filtros`, { locator: page.locator('.inbox__list-head'), pad: 8 });
  await clearHighlights(page);

  // Conversa aberta: visão geral das três colunas
  await open(page, 'Mariana Souza');
  await shot(page, `${DIR}/inbox-01-visao-geral`, { clip: { x: 0, y: 0, width: 1440, height: 900 } });
  await highlight(page.locator('.inbox__list'), 1, { pad: -6, radius: 12 });
  await highlight(chat(page), 2, { pad: -6, radius: 12 });
  await highlight(page.locator('.cpanel'), 3, { pad: -6, radius: 12 });
  await shot(page, `${DIR}/inbox-03-areas`, { clip: { x: 272, y: 64, width: 1168, height: 836 } });
  await clearHighlights(page);
});

test('assumir e devolver um atendimento', async ({ page }) => {
  await start(page);
  await go(page, '/inbox');
  await settle(page, 700);
  await open(page, 'Mariana Souza');

  // Lia (o assistente da Clínica Aurora) atendendo: botão no topo e aviso no lugar do campo de mensagem
  await expect(page.locator('.chat__line').getByText('Lia está atendendo')).toBeVisible();
  await highlight(page.locator('.chat__head').getByRole('button', { name: 'Assumir atendimento' }), 1);
  await shot(page, `${DIR}/assumir-01-ia-atendendo`, { locator: chat(page) });
  await clearHighlights(page);

  // Assumir
  await hideToasts(page);
  await page.locator('.chat__head').getByRole('button', { name: 'Assumir atendimento' }).click();
  await expect(chat(page).getByText('Ana Martins assumiu o atendimento')).toBeVisible();
  await expect(page.locator('.sl-composer textarea')).toBeVisible();
  await settle(page, 400);
  await highlight(page.locator('.chat__line').getByText('Você está atendendo'), 1, { pad: 4 });
  await highlight(chat(page).getByText('Ana Martins assumiu o atendimento'), 2, { pad: 6 });
  await shot(page, `${DIR}/assumir-03-voce-atendendo`, { locator: chat(page) });
  await clearHighlights(page);

  // Conversa transferida pelo assistente (aguardando atendente)
  await open(page, 'Camila Oliveira');
  await shot(page, `${DIR}/assumir-04-aguardando-atendente`, { locator: chat(page) });

  // Devolver para o assistente
  await open(page, 'Mariana Souza');
  await highlight(page.locator('.chat__head').getByRole('button', { name: 'Devolver para IA' }), 1);
  await shot(page, `${DIR}/devolver-01-botao`, { locator: page.locator('.chat__head'), pad: 0 });
  await clearHighlights(page);
  await page.locator('.chat__head').getByRole('button', { name: 'Devolver para IA' }).click();
  const dialog = page.getByRole('dialog', { name: 'Devolver para Lia (IA)?' });
  await expect(dialog).toBeVisible();
  await page.waitForTimeout(400);
  await shot(page, `${DIR}/devolver-02-confirmar`, { locator: page.locator('.sl-modal'), pad: 16 });
  await dialog.getByRole('button', { name: 'Devolver para IA' }).click();
  await expect(chat(page).getByText('Ana Martins devolveu a conversa para Lia (IA)')).toBeVisible();
  await settle(page, 400);
  await shot(page, `${DIR}/devolver-03-ia-de-volta`, { locator: chat(page) });
});

test('enviar mensagens e modelos', async ({ page }) => {
  await start(page);
  await go(page, '/inbox');
  await settle(page, 700);
  await hideToasts(page);

  // Conversa de outra pessoa: só leitura até assumir
  await open(page, 'Juliana Costa');
  await shot(page, `${DIR}/enviar-04-outra-pessoa`, { locator: composer(page), pad: 4 });

  // Conversa da Ana: texto
  await open(page, 'Rafael Gomes');
  const box = page.getByRole('textbox', { name: 'Mensagem' });
  await box.fill('Oi, Rafael! A Dra. Camila Rocha vai te passar as orientações na consulta. Qualquer dúvida antes disso, é só chamar por aqui.');
  await highlight(page.locator('.sl-composer').getByRole('button', { name: 'Enviar', exact: true }), 1);
  await shot(page, `${DIR}/enviar-01-texto`, { locator: chat(page) });
  await clearHighlights(page);
  await box.press('Enter');
  await expect(chat(page).getByText('vai te passar as orientações na consulta')).toBeVisible();
  await settle(page, 800);
});

test('informações do contato', async ({ page }) => {
  await start(page);
  await go(page, '/inbox');
  await settle(page, 700);
  await open(page, 'Mariana Souza');

  await highlight(page.locator('.chat__head').getByRole('button', { name: 'Ocultar dados do contato' }), 1);
  await shot(page, `${DIR}/contato-01-botao-painel`, { locator: page.locator('.chat__head'), pad: 0 });
  await clearHighlights(page);
  await shot(page, `${DIR}/contato-02-painel`, { locator: page.locator('.cpanel') });

  await page.locator('.cpanel').getByRole('button', { name: 'Ver perfil completo' }).click();
  await page.waitForURL(/\/contacts\//);
  await settle(page, 800);
  await shot(page, `${DIR}/contato-03-perfil-completo`, { clip: { x: 272, y: 64, width: 1168, height: 836 } });
});
