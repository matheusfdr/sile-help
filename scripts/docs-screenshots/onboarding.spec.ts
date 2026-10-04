// Guia completo de implantação: first access, the cadastre completed after activation (services,
// professionals, knowledge, agent, templates, automations, team, settings) and the first day
// (first appointment). The guided setup itself is captured by comecando.spec.ts.
import { test, expect, type Page } from '@playwright/test';
import { start, go, settle, highlight, clearHighlights, shot, assertLocal } from './helpers';

const DIR = 'onboarding';
const card = (page: Page, title: string) => page.locator('.sl-card').filter({ has: page.getByRole('heading', { name: title, exact: true }) }).first();
const content = { x: 272, y: 64, width: 1168, height: 836 };

/** Monday of next week, as the agenda URL expects (YYYY-MM-DD, local date). */
function nextMonday() {
  const d = new Date();
  d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7));
  return d.toISOString().slice(0, 10);
}

test('primeiro acesso: login e convite', async ({ page }) => {
  assertLocal(process.env.DOCS_APP_URL);
  await page.addInitScript(() => { try { window.localStorage.setItem('sile-docs-stage', 'onboarding'); } catch { /* ignore */ } });
  // Only the form side: the demo-accounts box and the marketing art are not part of a client's login.
  const hideDemo = () => page.addStyleTag({ content: '.auth__demo{display:none!important}' });
  await page.goto('/login');
  await expect(page.getByRole('button', { name: 'Entrar', exact: true })).toBeVisible();
  await hideDemo();
  await page.waitForTimeout(400);
  await highlight(page.getByRole('link', { name: 'Esqueci minha senha' }), 1);
  await shot(page, `${DIR}/acesso-01-login`, { locator: page.locator('.auth__form-side') });
  await clearHighlights(page);

  await page.goto('/invite/convite-aurora');
  await expect(page.getByText('Você foi convidado para a Clínica Aurora.')).toBeVisible();
  await page.getByLabel('Seu nome').fill('Carolina Mendes');
  await page.getByLabel('Crie sua senha').fill('documentacao');
  await page.getByLabel('Confirme a senha').fill('documentacao');
  await highlight(page.getByRole('button', { name: 'Aceitar convite e entrar' }), 1);
  await shot(page, `${DIR}/acesso-02-convite`, { locator: page.locator('.auth__form-side') });
  await clearHighlights(page);
  await page.getByRole('button', { name: 'Aceitar convite e entrar' }).click();
  await page.waitForURL(/\/dashboard/);
  await expect(page.getByText('Clínica Aurora').first()).toBeVisible();
});

test('depois de ativar: completar o cadastro', async ({ page }) => {
  await start(page);
  await settle(page);
  await page.addStyleTag({ content: '.toast-dock{display:none!important}' });

  // Serviços
  await go(page, '/services');
  await settle(page, 700);
  await shot(page, `${DIR}/cadastro-01-servicos`, { clip: content });
  await page.getByText('Botox', { exact: true }).first().click();
  const drawer = page.locator('.sl-drawer');
  await expect(drawer).toBeVisible();
  await drawer.getByLabel('Descrição').fill('Toxina botulínica para suavizar linhas de expressão do terço superior do rosto. O valor final é definido na avaliação.');
  await page.waitForTimeout(400);
  await shot(page, `${DIR}/cadastro-02-servico-detalhe`, { locator: drawer });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // Profissionais: disponibilidade
  await go(page, '/professionals');
  await settle(page, 700);
  await shot(page, `${DIR}/cadastro-03-profissionais`, { clip: content });
  await go(page, '/professionals/pro_aurora_camila?tab=availability');
  await settle(page, 800);
  await shot(page, `${DIR}/cadastro-04-disponibilidade`, { locator: page.locator('.tab-panel .sl-card').first(), pad: 12 });

  // Conhecimento
  await go(page, '/knowledge');
  await settle(page, 800);
  await shot(page, `${DIR}/cadastro-05-conhecimento`, { clip: content });
  await page.locator('.kb-nav').getByRole('button', { name: /FAQ/ }).click();
  await settle(page, 500);
  await page.getByRole('button', { name: 'Nova pergunta' }).click();
  await page.getByLabel('Pergunta').fill('Vocês atendem aos domingos?');
  await page.getByLabel('Resposta').fill('Não. Atendemos de segunda a sexta, das 8h às 19h, e sábado, das 9h às 13h.');
  await highlight(page.locator('.entry-form').getByRole('button', { name: 'Salvar' }), 1);
  await shot(page, `${DIR}/cadastro-06-nova-pergunta`, { locator: card(page, 'Perguntas frequentes'), maxHeight: 520 });
  await clearHighlights(page);
  await page.locator('.entry-form').getByRole('button', { name: 'Salvar' }).click();
  await expect(page.getByText('Vocês atendem aos domingos?')).toBeVisible();

  // Agente: seções completas
  await go(page, '/agent');
  await settle(page, 800);
  for (const [title, file] of [['Comunicação', 'agente-01-comunicacao'], ['Regras', 'agente-02-regras'], ['Ferramentas', 'agente-03-ferramentas'], ['Transferência para humano', 'agente-04-transferencia']]) {
    const c = card(page, title);
    await c.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    await shot(page, `${DIR}/${file}`, { locator: c, pad: 8 });
  }

  // Modelos
  await go(page, '/templates');
  await settle(page, 700);
  await shot(page, `${DIR}/whatsapp-01-modelos`, { clip: content });

  // Automações: receitas
  await go(page, '/automations');
  await settle(page, 700);
  await page.getByText('Receitas', { exact: true }).click();
  await settle(page, 600);
  await shot(page, `${DIR}/automacoes-02-receitas`, { clip: content });
  await page.locator('.sl-feature').filter({ hasText: 'Confirmação de agendamento' }).getByRole('button', { name: 'Usar receita' }).click();
  await expect(page.locator('.sl-drawer')).toBeVisible();
  await page.waitForTimeout(500);
  await shot(page, `${DIR}/automacoes-03-receita`, { locator: page.locator('.sl-drawer') });
  await page.keyboard.press('Escape');

  // Equipe: convite
  await go(page, '/team');
  await settle(page, 700);
  await page.getByRole('button', { name: 'Convidar membro' }).click();
  const modal = page.locator('.sl-modal');
  await expect(modal).toBeVisible();
  await modal.getByLabel('E-mail').fill('recepcao@clinicaaurora.example');
  await page.waitForTimeout(300);
  await shot(page, `${DIR}/equipe-01-convidar`, { locator: modal, pad: 16 });
  await modal.getByRole('button', { name: 'Cancelar' }).click();
  await shot(page, `${DIR}/equipe-02-perfis`, { clip: content });

  // Configurações: atendimento
  await go(page, '/settings?tab=service');
  await settle(page, 800);
  await shot(page, `${DIR}/config-01-atendimento`, { locator: card(page, 'Regras de atendimento'), pad: 8 });
});

test('primeiro dia: Inbox e primeiro agendamento', async ({ page }) => {
  await start(page);
  await settle(page);
  await page.addStyleTag({ content: '.toast-dock{display:none!important}' });

  await go(page, `/calendar?view=week&date=${nextMonday()}`);
  await settle(page, 900);
  await shot(page, `${DIR}/dia-01-agenda`, { clip: content });

  await go(page, '/inbox');
  await settle(page, 700);
  await page.locator('.sl-convo').filter({ hasText: 'Mariana Souza' }).click();
  await settle(page, 600);
  await page.locator('.cpanel').getByRole('button', { name: 'Agendar' }).click();
  const drawer = page.locator('.sl-drawer');
  await expect(drawer).toBeVisible();
  await settle(page, 700);
  const next = drawer.getByRole('button', { name: /Próximo dia com atendimento/ });
  if (await next.isVisible()) { await next.click(); await settle(page, 600); }
  const time = drawer.getByLabel('Horário');
  await expect(time).toBeEnabled();
  await time.selectOption({ index: 1 });
  await drawer.getByLabel('Observações').fill('Primeira vez com Botox. Prefere horários pela manhã.');
  await highlight(drawer.getByRole('button', { name: 'Agendar', exact: true }), 1);
  await shot(page, `${DIR}/dia-02-agendar`, { locator: drawer });
  await clearHighlights(page);
  await drawer.getByRole('button', { name: 'Agendar', exact: true }).click();
  await expect(drawer).toBeHidden();
});
