# Publicação em help.sileai.app

A Central de Ajuda é um site estático publicado pelo **GitHub Pages**, com o domínio `help.sileai.app`. O plano da Hostinger não permite subdomínios ativos no `sileai.app`, por isso a hospedagem é o GitHub. O DNS continua na Hostinger.

## Fluxo

1. Push na `main` dispara `.github/workflows/deploy.yml`.
2. O workflow instala, roda `npm run check`, `npm run build` e `npm test`.
3. O `dist/` é publicado no GitHub Pages e, também, como um commit no branch `help-dist` (cópia pronta para qualquer hospedagem estática que puxe por Git).

Nenhum segredo é necessário. Para publicar de novo sem mudar nada: *Actions › Deploy › Run workflow*.

## Configuração (feita uma vez)

- GitHub: *Settings › Pages*: fonte **GitHub Actions**, domínio personalizado `help.sileai.app`, **Enforce HTTPS** ligado depois que o certificado sair.
- Hostinger: em *Domínios › sileai.app › DNS*, um registro **CNAME** com nome `help` apontando para `matheusfdr.github.io`.
- Recomendado: verificar o domínio `sileai.app` em *GitHub › Settings (da conta) › Pages › Add a domain* (um registro TXT no DNS). Isso impede que outra conta do GitHub use subdomínios do `sileai.app`.

## URLs

O GitHub Pages serve `/atendimento/inbox` a partir de `atendimento/inbox.html`, como o site institucional: sem `.html` e sem barra no fim. A página `404.html` é usada para endereços inexistentes. O `public/.htaccess` só vale numa hospedagem Apache (Hostinger), não no GitHub Pages.

## Verificação depois de publicar

- `https://help.sileai.app` abre a página inicial; `/atendimento/assumir-conversa` abre sem `.html`.
- `https://help.sileai.app/sitemap-index.xml`, `/robots.txt` e `/search-index.json` respondem.
- Uma URL inexistente mostra a página 404 da Central.
- `http://` redireciona para `https://`.
