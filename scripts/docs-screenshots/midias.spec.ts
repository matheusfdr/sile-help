// Atendimento: received files and voice messages in the Inbox of the operating Clínica Aurora, logged in as Ana Martins.
// The patients' messages are delivered by the local development simulator of the WhatsApp (the same pipeline as the
// real webhook, with fictitious files and a fictitious transcription). Only the Inbox appears in the captures.
// Validates and captures: a voice message with its transcription answered by Lia, and an image, a document and a
// video received in a conversation attended by Ana.
import { test, expect, type Page } from '@playwright/test';
import { start, go, settle, highlight, clearHighlights, shot } from './helpers';

const DIR = 'atendimento';
const convo = (page: Page, name: string) => page.locator('.sl-convo').filter({ hasText: name });
const chat = (page: Page) => page.locator('.inbox__chat');
const hideToasts = (page: Page) => page.addStyleTag({ content: '.toast-dock{display:none!important}' });

/** The patient sends a file through the local simulator (development only; never captured). */
async function patientSends(page: Page, name: string, type: 'Áudio' | 'Imagem' | 'Documento' | 'Vídeo') {
  await go(page, '/dev/whatsapp');
  await settle(page, 1000);
  const options = await page.getByLabel('Quem envia').locator('option').allTextContents();
  const option = options.find((o) => o.includes(name));
  expect(option, `paciente ${name} no simulador`).toBeTruthy();
  await page.getByLabel('Quem envia').selectOption({ label: option! });
  await page.getByText(type, { exact: true }).click();
  await page.getByRole('button', { name: 'Enviar como paciente' }).click();
  await settle(page, 3000);
}

/** Region from the top of `first` to the bottom of `last`, across the chat's width (page coordinates). */
async function between(page: Page, first: import('@playwright/test').Locator, last: import('@playwright/test').Locator, pad = 12) {
  const a = (await first.boundingBox())!; const b = (await last.boundingBox())!; const c = (await chat(page).boundingBox())!;
  const y = Math.max(0, a.y - pad);
  return { x: c.x, y, width: c.width, height: b.y + b.height + pad - y };
}

async function open(page: Page, name: string) {
  await go(page, '/inbox');
  await settle(page, 800);
  await convo(page, name).click();
  await expect(page.locator('.chat__who b', { hasText: name })).toBeVisible();
  await settle(page, 1500);
}

test('mensagem de voz com transcrição', async ({ page }) => {
  await start(page);
  await hideToasts(page);
  await patientSends(page, 'Felipe Martins', 'Áudio');
  await open(page, 'Felipe Martins');

  const audio = chat(page).locator('.sl-msg').filter({ has: page.locator('.sl-msg__audio') }).last();
  await expect(audio.getByRole('button', { name: 'Ouvir áudio' })).toBeVisible();
  await expect(audio.getByText('Transcrição')).toBeVisible();
  await expect(audio.locator('.sl-msg__transcript-text')).not.toBeEmpty();
  // Lia answers from the transcription, in the same conversation.
  await expect(chat(page).locator('.sl-msg__author', { hasText: 'Lia' }).last()).toBeVisible();
  const reply = chat(page).locator('.sl-msg').filter({ has: page.locator('.sl-msg__author', { hasText: 'Lia' }) }).last();
  await audio.scrollIntoViewIfNeeded();
  const region = await between(page, audio, reply, 20);

  await highlight(audio.locator('.sl-msg__audio'), 1, { pad: 6, radius: 22 });
  await highlight(audio.locator('.sl-msg__transcript'), 2, { pad: 2 });
  await shot(page, `${DIR}/audio-01-transcricao`, { clip: region });
  await clearHighlights(page);
});

test('imagem, documento e vídeo recebidos', async ({ page }) => {
  await start(page);
  await hideToasts(page);
  await patientSends(page, 'Rafael Gomes', 'Imagem');
  await patientSends(page, 'Rafael Gomes', 'Documento');
  await patientSends(page, 'Rafael Gomes', 'Vídeo');
  await open(page, 'Rafael Gomes');

  const image = chat(page).getByRole('link', { name: 'Abrir imagem em outra aba' }).last();
  const download = chat(page).getByRole('button', { name: /^Baixar / }).last();
  const video = chat(page).getByRole('button', { name: 'Carregar vídeo' }).last();
  await expect(image).toBeVisible();
  await expect(download).toBeVisible();
  await expect(video).toBeVisible();
  await video.scrollIntoViewIfNeeded();
  const first = chat(page).locator('.sl-msg').filter({ has: page.getByRole('link', { name: 'Abrir imagem em outra aba' }) }).last();
  const last = chat(page).locator('.sl-msg').filter({ has: page.getByRole('button', { name: 'Carregar vídeo' }) }).last();
  const wide = await between(page, first, last, 20);
  const right = Math.max(...(await Promise.all([first, chat(page).locator('.sl-msg__file').last(), last].map((l) => l.boundingBox()))).map((b) => b!.x + b!.width));
  const region = { ...wide, width: Math.min(wide.width, right - wide.x + 32) };

  await highlight(image, 1, { pad: 4 });
  await highlight(chat(page).locator('.sl-msg__file').last(), 2, { pad: 6 });
  await highlight(last.locator('.sl-msg__media'), 3, { pad: 4 });
  await shot(page, `${DIR}/arquivos-01-recebidos`, { clip: region });
  await clearHighlights(page);
});
