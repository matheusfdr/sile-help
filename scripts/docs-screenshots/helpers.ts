// Helpers for the help center screenshots.
// Flow: local Sile with the documentation dataset → login with a fictitious account → open the
// route → (optional) highlight what to click → capture → save as .webp in public/images/<category>/.
import { expect, type Locator, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const IMAGES = join(ROOT, 'public', 'images');
const BRAND = '#625DF5';
const ALLOWED_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

/** Fictitious accounts of the documentation dataset (any password with 8+ characters works locally). */
export const ACCOUNTS = {
  owner: 'ana.martins@clinicaaurora.example',
  admin: 'carolina.mendes@clinicaaurora.example',
  attendant: 'lucas.ferreira@clinicaaurora.example',
} as const;

/** Refuses anything that is not a local server: screenshots never touch production or real data. */
export function assertLocal(baseURL: string | undefined) {
  const url = new URL(baseURL || 'http://localhost:5174');
  if (!ALLOWED_HOSTS.has(url.hostname)) {
    throw new Error(`Capturas só rodam contra um Sile local com dados fictícios. Host recusado: ${url.hostname}`);
  }
}

/** Opens the app in a stage of the documentation dataset and logs in. */
export async function start(page: Page, { stage = 'operating', account = 'owner' }: { stage?: 'operating' | 'onboarding'; account?: keyof typeof ACCOUNTS } = {}) {
  assertLocal(process.env.DOCS_APP_URL);
  await page.addInitScript(([s]) => {
    try {
      if (s === 'onboarding') window.localStorage.setItem('sile-docs-stage', 'onboarding');
      else window.localStorage.removeItem('sile-docs-stage');
    } catch { /* ignore */ }
  }, [stage]);
  await page.goto('/login');
  await page.getByLabel('E-mail').fill(ACCOUNTS[account]);
  await page.getByLabel('Senha', { exact: true }).fill('documentacao');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await page.waitForURL(/\/(dashboard|onboarding)/);
  // The dataset must be the fictitious one: refuse to continue otherwise.
  await expect(page.getByText('Clínica Aurora').first()).toBeVisible();
  await page.addStyleTag({ content: '*{caret-color:transparent!important}' });
}

/** Client-side navigation (keeps the in-memory demo data; page.goto would reset it). */
export async function go(page: Page, path: string) {
  await page.evaluate((p) => { window.history.pushState({}, '', p); window.dispatchEvent(new PopStateEvent('popstate')); }, path);
  await page.waitForURL((u) => u.pathname + u.search === path || u.pathname === path.split('?')[0]);
}

/** Waits until skeletons are gone and the simulated latency has settled. */
export async function settle(page: Page, ms = 500) {
  await page.waitForFunction(() => !document.querySelector('.sl-skel'), null, { timeout: 15_000 }).catch(() => {});
  await page.waitForTimeout(ms);
}

/**
 * Violet outline (and optional number) around an element, drawn on top of the page only for the
 * capture. One visual language for every image: brand outline, soft halo, numbered badge.
 */
export async function highlight(target: Locator, n?: number, { pad = 4, radius = 10 } = {}) {
  await target.scrollIntoViewIfNeeded();
  const box = await target.boundingBox();
  if (!box) throw new Error('highlight: elemento sem caixa visível');
  await target.page().evaluate(({ box, n, pad, radius, color }) => {
    const sx = 0; const sy = 0; // fixed to the viewport: correct even inside inner scroll containers
    const ring = document.createElement('div');
    ring.className = '__docs-hl';
    Object.assign(ring.style, {
      position: 'fixed', zIndex: '2147483646', pointerEvents: 'none', boxSizing: 'border-box',
      left: `${box.x + sx - pad}px`, top: `${box.y + sy - pad}px`, width: `${box.width + pad * 2}px`, height: `${box.height + pad * 2}px`,
      border: `2px solid ${color}`, borderRadius: `${radius}px`, boxShadow: '0 0 0 4px rgba(98,93,245,.18)',
    });
    document.body.appendChild(ring);
    if (n != null) {
      const badge = document.createElement('div');
      badge.className = '__docs-hl';
      badge.textContent = String(n);
      Object.assign(badge.style, {
        position: 'fixed', zIndex: '2147483647', pointerEvents: 'none', width: '22px', height: '22px', borderRadius: '50%',
        left: `${box.x + sx - pad - 11}px`, top: `${box.y + sy - pad - 11}px`, background: color, color: '#FFFFFF',
        font: '600 12px/22px Geist, system-ui, sans-serif', textAlign: 'center', boxShadow: '0 0 0 2px #FFFFFF',
      });
      document.body.appendChild(badge);
    }
  }, { box, n, pad, radius, color: BRAND });
}

export async function clearHighlights(page: Page) {
  await page.evaluate(() => document.querySelectorAll('.__docs-hl').forEach((el) => el.remove()));
}

interface ShotOptions {
  /** Capture only this element (plus `pad` CSS pixels around it). */
  locator?: Locator;
  /** Or an explicit region in CSS pixels. */
  clip?: { x: number; y: number; width: number; height: number };
  pad?: number;
  /** Cut the captured region at this height (CSS pixels), e.g. drawers with empty space below. */
  maxHeight?: number;
  /** Max output width in pixels (images are captured at 2x). */
  maxWidth?: number;
}

/** Captures and saves public/images/<file>.webp (file = 'atendimento/03-assumir-atendimento'). */
export async function shot(page: Page, file: string, { locator, clip, pad = 0, maxHeight, maxWidth = 2400 }: ShotOptions = {}) {
  await page.mouse.move(0, 0);
  const vp = page.viewportSize()!;
  let region = clip;
  let grown = false;
  if (locator) {
    // Scrolling after drawing highlights would move the page under them.
    const highlighted = await page.locator('.__docs-hl').count();
    if (!highlighted) await locator.scrollIntoViewIfNeeded();
    let box = await locator.boundingBox();
    if (!box) throw new Error(`shot ${file}: elemento sem caixa visível`);
    if (box.y + box.height + pad > vp.height + 24 && !highlighted) {
      // Taller than the viewport: grow the window for this capture only.
      await page.setViewportSize({ width: vp.width, height: Math.ceil(box.y + box.height + pad + 8) });
      grown = true;
      await page.waitForTimeout(250);
      box = (await locator.boundingBox())!;
    }
    const x = Math.max(0, box.x - pad); const y = Math.max(0, box.y - pad);
    const size = page.viewportSize()!;
    region = { x, y, width: Math.min(size.width - x, box.width + pad * 2), height: Math.min(size.height - y, box.height + pad * 2) };
  }
  if (region && maxHeight) region = { ...region, height: Math.min(region.height, maxHeight) };
  const png = await page.screenshot({ type: 'png', clip: region, animations: 'disabled' });
  if (grown) await page.setViewportSize(vp);
  const out = join(IMAGES, `${file}.webp`);
  mkdirSync(dirname(out), { recursive: true });
  await sharp(png).resize({ width: maxWidth, withoutEnlargement: true }).webp({ quality: 84, effort: 5 }).toFile(out);
  return out;
}
