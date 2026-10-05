# Central de Ajuda do Sile

Código e conteúdo da Central de Ajuda pública do [Sile](https://sileai.app), publicada em **help.sileai.app**.

A Central documenta só o painel usado pelas clínicas e suas equipes. Tudo o que aparece aqui (textos, nomes, telefones, e-mails e capturas de tela) usa um conjunto de dados **fictício**: a Clínica Aurora e seus personagens. Nenhum dado real de clínica ou paciente.

## Stack

- [Astro](https://astro.build) 7, saída estática, MDX para os artigos;
- busca no navegador com [MiniSearch](https://lucaong.github.io/minisearch/), sobre um índice gerado no build (título, descrição, aliases, seções e texto);
- identidade visual do Sile: tokens, fontes e logo copiados do pacote de marca (ver [docs/design.md](docs/design.md));
- capturas de tela com [Playwright](https://playwright.dev), a partir de um Sile local com dados fictícios.

A escolha do framework está explicada em [docs/decisoes.md](docs/decisoes.md).

## Comandos

Node 22.12 ou mais recente.

```sh
npm install
npm run dev          # http://localhost:4400
npm run build        # gera dist/ (HTML estático, sitemap, robots.txt e índice de busca)
npm run preview      # serve dist/ em http://localhost:4400
npm run check        # tipos (astro check)
npm test             # qualidade do conteúdo e da busca (rode depois do build para incluir a busca)
npm run screenshots  # capturas de tela (ver scripts/docs-screenshots/README.md)
npm run og           # gera public/og.png
```

Antes de publicar, `npm run build`, `npm run check` e `npm test` precisam passar sem avisos.

## Estrutura

```
src/
  content/articles/<categoria>/<slug>.mdx   artigos (URL pública: /<categoria>/<slug>)
  data/navigation.ts                       categorias, tópicos e grupos do menu (mesma ordem do produto)
  components/layout/                       cabeçalho, menu lateral, busca, breadcrumbs, índice da página, rodapé
  components/docs/                         Steps, Step, Callout, Tip, Warning, Screenshot, Tabs, Status,
                                           artigos relacionados, feedback e suporte
  pages/                                   início, categoria, artigo, busca, 404, robots.txt e índice de busca
  styles/                                  help.css e os tokens da marca
public/images/<categoria>/                 capturas de tela (.webp)
scripts/docs-screenshots/                  specs do Playwright que validam os tutoriais e geram as capturas
tests/                                     testes de conteúdo e de busca
docs/                                      guia de escrita, dataset, capturas, decisões e divergências
```

## Escrever um artigo

1. Leia o [guia de escrita](docs/guia-de-escrita.md).
2. Confira a funcionalidade no Sile, com o dataset fictício, antes de escrever.
3. Crie `src/content/articles/<categoria>/<slug>.mdx` com o frontmatter completo.
4. Se o artigo precisar de capturas, inclua os passos em um spec de `scripts/docs-screenshots/` e gere as imagens.
5. Rode `npm run build && npm test`.

## Variáveis de ambiente

Veja [.env.example](.env.example). Nenhuma é secreta. `PUBLIC_SITE_URL` define o canonical, o sitemap e o Open Graph. `PUBLIC_FEEDBACK_ENDPOINT` (opcional) recebe as respostas de "Este artigo resolveu sua dúvida?".

## Publicação

O site é publicado pelo GitHub Pages em **help.sileai.app** (DNS na Hostinger, registro CNAME `help`). A cada push na `main`, o workflow `.github/workflows/deploy.yml` verifica, gera e publica o site, e grava a mesma cópia no branch `help-dist`. Veja [docs/publicacao.md](docs/publicacao.md).

## Licença

O conteúdo e a marca Sile pertencem aos seus titulares. Este repositório é público para transparência e colaboração na documentação. Ele não concede licença de uso da marca.
