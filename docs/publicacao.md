# Publicação em help.sileai.app

O build é um site estático (`dist/`). O modelo é o mesmo do site institucional: uma hospedagem que serve arquivos e um `.htaccess` para URLs limpas.

## Fluxo preparado

1. Push na `main` dispara `.github/workflows/deploy.yml`.
2. O workflow instala, roda `npm run check`, `npm run build` e `npm test`.
3. O conteúdo de `dist/` é publicado como um commit novo no branch `help-dist` (sem force push).
4. A hospedagem puxa `help-dist` para a pasta do subdomínio.

Nenhum segredo é necessário: o workflow usa o token do próprio GitHub Actions.

## O que falta para ir ao ar

- Criar o subdomínio `help.sileai.app` na hospedagem e apontar o DNS.
- Configurar a implantação por Git da hospedagem para o branch `help-dist` deste repositório.
- Ativar o SSL do subdomínio.
- Opcional: definir as variáveis do repositório (Settings → Secrets and variables → Actions → Variables): `PUBLIC_SITE_URL`, `PUBLIC_APP_URL`, `PUBLIC_MARKETING_URL`, `PUBLIC_SUPPORT_EMAIL` e `PUBLIC_FEEDBACK_ENDPOINT`.

## Verificação depois de publicar

- `https://help.sileai.app` abre a página inicial; `/atendimento/assumir-conversa` abre sem `.html` e sem barra no fim.
- `https://help.sileai.app/sitemap-index.xml` e `/robots.txt` respondem.
- Uma URL inexistente mostra a página 404 da Central.
