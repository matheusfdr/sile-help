// Renders public/og.png (1200x630), the social preview of the help center, with the official
// fonts and logo. The logo goes in as a data URI (CSS masks need CORS on file://).
// Run: npm run og
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BRAND = join(ROOT, 'src', 'styles', 'brand');
const b64 = (p) => readFileSync(p).toString('base64');
const logo = `data:image/png;base64,${b64(join(BRAND, 'assets', 'logo', 'sile-symbol.png'))}`;
const geist = `data:font/woff2;base64,${b64(join(BRAND, 'fonts', 'Geist-Variable.woff2'))}`;
const serif = `data:font/woff2;base64,${b64(join(BRAND, 'fonts', 'InstrumentSerif-Italic.woff2'))}`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Geist;src:url(${geist}) format('woff2');font-weight:100 900}
@font-face{font-family:'Instrument Serif';font-style:italic;src:url(${serif}) format('woff2')}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;font-family:Geist;color:#111318;background:radial-gradient(70% 90% at 50% 0%,#EEEDFF 0%,rgba(246,245,255,0) 70%),#FFFFFF;display:flex;flex-direction:column;justify-content:space-between;padding:72px 80px}
.brand{display:flex;align-items:center;gap:16px}
.mark{height:48px;aspect-ratio:1016/902;background:#625DF5;-webkit-mask:url(${logo}) center/contain no-repeat;mask:url(${logo}) center/contain no-repeat}
.word{font-weight:600;font-size:40px;letter-spacing:-.035em}
.div{width:1px;height:36px;background:#E4E7EC;margin:0 6px}
.label{font-size:28px;font-weight:500;color:#475467}
h1{font-size:84px;line-height:1.02;font-weight:600;letter-spacing:-.035em}
h1 em{font-family:'Instrument Serif';font-style:italic;font-weight:400;color:#625DF5;font-size:1.08em}
p{font-size:28px;color:#475467;margin-top:20px}
.foot{font-size:24px;color:#667085;display:flex;align-items:center;gap:12px}
.foot b{width:24px;height:3px;border-radius:3px;background:#625DF5;display:inline-block}
</style></head><body>
<div class="brand"><span class="mark"></span><span class="word">Sile</span><span class="div"></span><span class="label">Central de Ajuda</span></div>
<div><h1>Como podemos <em>ajudar?</em></h1><p>Guias passo a passo para usar o Sile no dia a dia da clínica.</p></div>
<div class="foot"><b></b>help.sileai.app</div>
</body></html>`;

const browser = await chromium.launch({ channel: process.env.DOCS_BROWSER_CHANNEL || 'chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: join(ROOT, 'public', 'og.png') });
await browser.close();
console.log('public/og.png gerado');
