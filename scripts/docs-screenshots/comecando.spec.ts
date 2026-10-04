// Começando: the guided setup walked end to end with the Clínica Aurora data (stage "onboarding"),
// plus the Integrations, Agent and Playground screens of the operating clinic.
// Every step here is also the validation of the tutorials: if a label changes in the product,
// this spec fails before the help center goes out of date.
import { test, expect, type Page } from '@playwright/test';
import { start, go, settle, highlight, clearHighlights, shot } from './helpers';

const DIR = 'comecando';
const stepCard = (page: Page) => page.locator('.ob-main .sl-card');
const hideToasts = (page: Page) => page.addStyleTag({ content: '.toast-dock{display:none!important}' });
const showToasts = (page: Page) => page.addStyleTag({ content: '.toast-dock{display:flex!important}' });

async function stepTitle(page: Page, title: string) {
  await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();
  await settle(page, 400);
}

test('configuração guiada (Clínica Aurora em implantação)', async ({ page }) => {
  await start(page, { stage: 'onboarding' });
  await settle(page);

  // Início: boas-vindas e cartão "Configure o Sile"
  const welcome = page.locator('.sl-empty').filter({ hasText: 'Bem-vindo ao Sile!' });
  await expect(welcome).toBeVisible();
  await highlight(page.getByRole('button', { name: 'Começar configuração' }), 1);
  await highlight(page.locator('.ob-card'), 2);
  await shot(page, `${DIR}/01-boas-vindas`, { clip: { x: 0, y: 0, width: 1440, height: 900 } });
  await clearHighlights(page);

  // Integrações antes de conectar (para o artigo do WhatsApp)
  await go(page, '/integrations');
  await settle(page, 800);
  const waCard = page.locator('.sl-feature').filter({ hasText: 'WhatsApp Business' });
  await highlight(waCard.getByRole('button', { name: 'Conectar' }), 1);
  await shot(page, `${DIR}/conectar-whatsapp-01-integracoes`, { locator: page.locator('.int-grid--core'), pad: 24 });
  await clearHighlights(page);
  await waCard.getByRole('button', { name: 'Conectar' }).click();
  const modal = page.getByRole('dialog', { name: 'Conectar WhatsApp Business' });
  await expect(modal).toBeVisible();
  await page.waitForTimeout(400);
  await shot(page, `${DIR}/conectar-whatsapp-02-modal`, { locator: page.locator('.sl-modal'), pad: 16 });
  await modal.getByRole('button', { name: 'Cancelar' }).click();

  // Configuração guiada
  await go(page, '/onboarding');
  await hideToasts(page);

  // 1. Sua clínica
  await stepTitle(page, 'Sua clínica');
  await page.getByLabel('Telefone').fill('+55 11 90000-0100');
  await page.getByLabel('E-mail de contato').fill('contato@clinicaaurora.example');
  await page.getByLabel('Segmento').selectOption('Odontologia');
  await shot(page, `${DIR}/02-etapas`, { clip: { x: 0, y: 0, width: 1440, height: 900 } });
  await shot(page, `${DIR}/configurar-clinica-01-sua-clinica`, { locator: stepCard(page), pad: 16 });
  await page.getByRole('button', { name: 'Salvar e continuar', exact: true }).click();

  // 2. Unidade
  await stepTitle(page, 'Unidade');
  await page.getByLabel('Nome da unidade').fill('Unidade Centro');
  await page.getByLabel('Endereço').fill('Rua das Flores, 100 — Centro');
  await page.getByLabel('Cidade').fill('São Paulo');
  await page.getByLabel('UF').selectOption('SP');
  await page.getByLabel('Telefone da unidade').fill('+55 11 90000-0100');
  await shot(page, `${DIR}/configurar-clinica-02-unidade`, { locator: stepCard(page), pad: 16 });
  await page.getByRole('button', { name: 'Salvar e continuar', exact: true }).click();

  // 3. Serviços
  await stepTitle(page, 'Serviços');
  const services: [string, string, string, boolean][] = [
    ['Avaliação', '', '30', false], ['Limpeza', '250', '45', false], ['Clareamento', '900', '60', true],
    ['Botox', '700', '45', true], ['Preenchimento', '1200', '60', true], ['Consulta de retorno', '', '30', false],
  ];
  for (const [i, [name, price, minutes, from]] of services.entries()) {
    await page.getByLabel('Serviço', { exact: true }).fill(name);
    await page.getByLabel('Preço (R$)').fill(price);
    await page.getByLabel('Duração').selectOption(minutes);
    const fromBox = page.getByLabel('Preço "a partir de"');
    if ((await fromBox.isChecked()) !== from) await fromBox.click({ force: true });
    if (i === services.length - 1) {
      await highlight(page.getByRole('button', { name: 'Adicionar', exact: true }), 1);
      await shot(page, `${DIR}/configurar-servicos-01-formulario`, { locator: stepCard(page), pad: 16 });
      await clearHighlights(page);
    }
    await page.getByRole('button', { name: 'Adicionar', exact: true }).click();
    await expect(page.locator('.ob-list__row').filter({ hasText: name })).toBeVisible();
  }
  await settle(page, 300);
  await shot(page, `${DIR}/configurar-servicos-02-lista`, { locator: stepCard(page), pad: 16 });
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();

  // 4. Profissionais
  await stepTitle(page, 'Profissionais');
  const pros: [string, string, string[]][] = [
    ['Dra. Camila Rocha', 'Harmonização orofacial', ['Avaliação', 'Botox', 'Preenchimento', 'Consulta de retorno']],
    ['Dr. Rafael Lima', 'Clínica geral', ['Avaliação', 'Limpeza', 'Consulta de retorno']],
    ['Dra. Fernanda Alves', 'Dentística estética', ['Avaliação', 'Limpeza', 'Clareamento', 'Consulta de retorno']],
  ];
  for (const [i, [name, specialty, does]] of pros.entries()) {
    await page.getByLabel('Nome', { exact: true }).fill(name);
    await page.getByLabel('Especialidade').fill(specialty);
    for (const s of does) await page.locator('.chip-row').getByRole('button', { name: s, exact: true }).click();
    if (i === 0) {
      await highlight(page.getByRole('button', { name: 'Adicionar profissional' }), 1);
      await shot(page, `${DIR}/adicionar-profissionais-01-formulario`, { locator: stepCard(page), pad: 16 });
      await clearHighlights(page);
    }
    await page.getByRole('button', { name: 'Adicionar profissional' }).click();
    await expect(page.locator('.ob-list__row').filter({ hasText: name })).toBeVisible();
  }
  await settle(page, 300);
  await shot(page, `${DIR}/adicionar-profissionais-02-lista`, { locator: stepCard(page), pad: 16 });
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();

  // 5. WhatsApp
  await stepTitle(page, 'WhatsApp');
  await highlight(page.getByRole('button', { name: 'Conectar com a Meta' }), 1);
  await shot(page, `${DIR}/conectar-whatsapp-03-etapa`, { locator: stepCard(page), pad: 16 });
  await clearHighlights(page);
  await page.getByRole('button', { name: 'Conectar com a Meta' }).click();
  await expect(page.locator('.ob-connect').getByText('Conectado')).toBeVisible({ timeout: 15_000 });
  await settle(page, 300);
  await shot(page, `${DIR}/conectar-whatsapp-04-conectado`, { locator: stepCard(page), pad: 16 });
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();

  // 6. Agenda (horário de atendimento da clínica)
  await stepTitle(page, 'Agenda');
  await shot(page, `${DIR}/configurar-clinica-03-horario`, { locator: stepCard(page), pad: 16 });
  await page.getByRole('button', { name: 'Salvar e continuar', exact: true }).click();

  // 7. Agente
  await stepTitle(page, 'Agente');
  await page.getByLabel('Objetivo').fill('Tirar dúvidas sobre os tratamentos e conduzir o paciente para uma avaliação.');
  await shot(page, `${DIR}/configurar-agente-01-etapa`, { locator: stepCard(page), pad: 16 });
  await page.getByRole('button', { name: 'Salvar e continuar', exact: true }).click();

  // 8. Teste
  await stepTitle(page, 'Teste');
  const testInput = page.getByRole('textbox', { name: 'Mensagem de teste' });
  for (const msg of ['Oi! Quanto custa o clareamento?', 'Quero agendar uma avaliação']) {
    await testInput.fill(msg);
    await page.getByRole('button', { name: 'Enviar', exact: true }).click();
    await expect(page.getByText(/está digitando/)).toBeHidden({ timeout: 15_000 });
    await page.waitForTimeout(300);
  }
  await expect(page.getByRole('button', { name: 'O Sile respondeu bem' })).toBeEnabled();
  await shot(page, `${DIR}/testar-01-etapa-teste`, { locator: stepCard(page), pad: 16 });
  await page.getByRole('button', { name: 'O Sile respondeu bem' }).click();

  // 9. Ativar
  await stepTitle(page, 'Ativar');
  await expect(page.locator('.ob-checklist .is-ok')).toHaveCount(4);
  await highlight(page.getByRole('button', { name: 'Ativar o Sile' }), 1);
  await shot(page, `${DIR}/ativar-01-checklist`, { locator: stepCard(page), pad: 16 });
  await clearHighlights(page);
  await page.getByRole('button', { name: 'Ativar o Sile' }).click();
  const confirm = page.getByRole('dialog', { name: 'Ativar o Sile agora?' });
  await expect(confirm).toBeVisible();
  await page.waitForTimeout(400);
  await shot(page, `${DIR}/ativar-02-confirmar`, { locator: page.locator('.sl-modal'), pad: 16 });
  await showToasts(page);
  await confirm.getByRole('button', { name: 'Ativar', exact: true }).click();
  await page.waitForURL(/\/dashboard/);
  await expect(page.getByText('O Sile está ativo')).toBeVisible();
});

test('clínica em operação: integrações, agente e playground', async ({ page }) => {
  await start(page);
  await settle(page);

  // Visão geral: o Início da clínica em operação
  await shot(page, `${DIR}/visao-geral-01-inicio`, { clip: { x: 0, y: 0, width: 1440, height: 900 } });

  // Status da conexão do WhatsApp
  await go(page, '/integrations');
  await settle(page, 800);
  const waCard = page.locator('.sl-feature').filter({ hasText: 'WhatsApp Business' });
  await highlight(waCard.getByRole('button', { name: 'Gerenciar' }), 1);
  await shot(page, `${DIR}/conectar-whatsapp-05-status`, { locator: page.locator('.int-grid--core'), pad: 24 });
  await clearHighlights(page);
  await waCard.getByRole('button', { name: 'Gerenciar' }).click();
  await expect(page.getByRole('dialog', { name: 'WhatsApp Business' })).toBeVisible();
  await page.waitForTimeout(500);
  await shot(page, `${DIR}/conectar-whatsapp-06-detalhes`, { locator: page.locator('.sl-drawer'), maxHeight: 420 });
  await page.keyboard.press('Escape');

  // Agente: status
  await go(page, '/agent');
  await settle(page, 800);
  await highlight(page.locator('.agent-status .sl-seg').first(), 1);
  await shot(page, `${DIR}/ativar-04-status-agente`, { locator: page.locator('.agent-status'), pad: 16 });
  await clearHighlights(page);

  // Playground
  await go(page, '/agent/playground');
  await settle(page, 800);
  const pgInput = page.getByRole('textbox', { name: 'Mensagem de teste' });
  for (const msg of ['Oi! Quanto custa o clareamento?', 'Vocês aceitam convênio?', 'Estou com dor depois da limpeza, é normal?']) {
    await pgInput.fill(msg);
    await page.getByRole('button', { name: 'Enviar mensagem de teste' }).click();
    await expect(page.locator('.pg-typing')).toBeHidden({ timeout: 15_000 });
    await page.waitForTimeout(300);
  }
  await page.locator('.pg-ai').last().click();
  await settle(page, 300);
  await shot(page, `${DIR}/testar-02-playground`, { clip: { x: 272, y: 64, width: 1168, height: 836 } });
  await highlight(page.locator('.pg-chat__suggestions'), 1);
  await highlight(page.locator('.pg-diag'), 2);
  await shot(page, `${DIR}/testar-03-diagnostico`, { clip: { x: 272, y: 64, width: 1168, height: 836 } });
  await clearHighlights(page);
});
