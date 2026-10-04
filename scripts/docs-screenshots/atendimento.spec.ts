// Atendimento: Inbox of the operating Clínica Aurora, logged in as Ana Martins (Owner).
// Validates and captures: overview, opening a conversation, taking over, returning to the Sile,
// sending messages, templates, attachments and the contact panel.
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

  // Sile atendendo: botão no topo e aviso no lugar do campo de mensagem
  await highlight(page.locator('.chat__head').getByRole('button', { name: 'Assumir atendimento' }), 1);
  await shot(page, `${DIR}/assumir-01-sile-atendendo`, { locator: chat(page) });
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

  // Conversa transferida pelo Sile (aguardando atendente)
  await open(page, 'Camila Oliveira');
  await shot(page, `${DIR}/assumir-04-aguardando-atendente`, { locator: chat(page) });

  // Devolver para o Sile
  await open(page, 'Mariana Souza');
  await highlight(page.locator('.chat__head').getByRole('button', { name: 'Devolver para IA' }), 1);
  await shot(page, `${DIR}/devolver-01-botao`, { locator: page.locator('.chat__head'), pad: 0 });
  await clearHighlights(page);
  await page.locator('.chat__head').getByRole('button', { name: 'Devolver para IA' }).click();
  const dialog = page.getByRole('dialog', { name: 'Devolver para o Sile?' });
  await expect(dialog).toBeVisible();
  await page.waitForTimeout(400);
  await shot(page, `${DIR}/devolver-02-confirmar`, { locator: page.locator('.sl-modal'), pad: 16 });
  await dialog.getByRole('button', { name: 'Devolver para IA' }).click();
  await expect(chat(page).getByText('Ana Martins devolveu a conversa para o Sile')).toBeVisible();
  await settle(page, 400);
  await shot(page, `${DIR}/devolver-03-sile-de-volta`, { locator: chat(page) });
});

test('enviar mensagens, modelos e anexos', async ({ page }) => {
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
  await box.fill('Oi, Rafael! Vou te mandar as orientações em PDF. Qualquer dúvida, é só chamar por aqui.');
  await highlight(page.locator('.sl-composer').getByRole('button', { name: 'Enviar', exact: true }), 1);
  await shot(page, `${DIR}/enviar-01-texto`, { locator: chat(page) });
  await clearHighlights(page);
  await box.press('Enter');
  await expect(chat(page).getByText('Vou te mandar as orientações em PDF')).toBeVisible();
  await settle(page, 800);

  // Barra de ferramentas do campo de mensagem
  const bar = page.locator('.sl-composer__bar');
  await highlight(bar.getByRole('button', { name: 'Emoji' }), 1, { pad: 2 });
  await highlight(bar.getByRole('button', { name: 'Enviar imagem' }), 2, { pad: 2 });
  await highlight(bar.getByRole('button', { name: 'Enviar documento' }), 3, { pad: 2 });
  await highlight(bar.getByRole('button', { name: 'Gravar áudio' }), 4, { pad: 2 });
  await highlight(bar.getByRole('button', { name: 'Modelos' }), 5, { pad: 2 });
  await shot(page, `${DIR}/anexos-01-ferramentas`, { locator: composer(page), pad: 16 });
  await clearHighlights(page);

  // Documento
  await page.locator('.sl-composer input[type="file"][accept*=".pdf"]').setInputFiles({
    name: 'orientacoes-preenchimento.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(184 * 1024, 32),
  });
  await expect(chat(page).getByText('orientacoes-preenchimento.pdf')).toBeVisible();
  await settle(page, 400);
  await shot(page, `${DIR}/anexos-02-documento-enviado`, { locator: chat(page) });

  // Áudio: gravação em andamento
  await bar.getByRole('button', { name: 'Gravar áudio' }).click();
  await page.waitForTimeout(3200);
  await shot(page, `${DIR}/anexos-03-gravando-audio`, { locator: composer(page), pad: 4 });
  await page.getByRole('button', { name: 'Descartar áudio' }).click();

  // Modelos aprovados
  await page.locator('.sl-composer__bar').getByRole('button', { name: 'Modelos' }).click();
  await expect(page.locator('.sl-composer__templates')).toBeVisible();
  await page.waitForTimeout(300);
  const pop = await page.locator('.sl-composer__templates').boundingBox();
  const comp = await composer(page).boundingBox();
  if (pop && comp) {
    const top = Math.min(pop.y, comp.y) - 16;
    await shot(page, `${DIR}/enviar-02-modelos`, { clip: { x: comp.x - 16, y: top, width: comp.width + 32, height: comp.y + comp.height - top + 12 } });
  }
  await page.keyboard.press('Escape');
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
