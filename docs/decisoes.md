# Decisões

## Framework: Astro + MDX + MiniSearch (e não Fumadocs + Next.js)

A preferência inicial era Fumadocs + Next.js. Avaliamos os critérios pedidos:

| Critério | Fumadocs + Next.js | Astro + MDX (escolhido) |
| --- | --- | --- |
| Compatibilidade com a stack | Next.js e React 19 seriam um framework novo para o time | O site sileai.app já é Astro estático; mesma ferramenta, mesmo modelo de deploy |
| Manutenção | Next tem majors frequentes e muitas dependências | Poucas dependências: astro, @astrojs/mdx, @astrojs/sitemap, minisearch |
| Busca | Orama embutido, bom | Índice próprio gerado no build + MiniSearch: título, descrição, aliases, seções e corpo, sem acento, plural e erros de digitação. Funciona também no `npm run dev` |
| MDX | Sim | Sim, com componentes disponíveis sem import |
| SEO | Sim | HTML estático, canonical, Open Graph, JSON-LD, sitemap e robots.txt |
| Customização visual | A UI do Fumadocs (Tailwind) teria de ser sobrescrita quase toda para parecer o Sile | Layout e componentes próprios, escritos direto com os tokens do Sile |
| Hospedagem | Precisa de exportação estática e cuidados com rotas | Estático por padrão, com o mesmo `.htaccess` de URLs limpas do site |

Também consideramos o Starlight (o tema de documentação do Astro). Ele ajudaria no início, mas a identidade pedida (cabeçalho, início, tipos de artigo, feedback, relacionados) exigiria sobrescrever a maior parte dos componentes dele. Para cerca de 40 artigos, um layout próprio sobre Astro é mais simples de manter.

## Design system

Os pacotes de design do Sile não são públicos. Copiamos para cá só o que já é público pelo site: os tokens CSS, as fontes (licença OFL) e o símbolo do logo. Os componentes de documentação são próprios, construídos com os mesmos tokens e reproduzindo botões, campos, tags e alertas do produto. Detalhes em [design.md](design.md).

## URLs

Em português, legíveis e estáveis: `/<categoria>/<slug>` (por exemplo, `/atendimento/assumir-conversa`). A categoria é uma página com a lista de artigos. Sem barra no fim, como no site.

## Um artigo, um lugar

Quando a mesma tarefa aparece em dois contextos (por exemplo, conectar o WhatsApp na configuração guiada e na tela Integrações), há um único artigo com as duas formas, em abas. Outros artigos linkam para ele.

## Feedback

"Este artigo resolveu sua dúvida?" funciona sem servidor: grava a resposta no navegador e dispara o evento `sile-help:feedback`. Quando `PUBLIC_FEEDBACK_ENDPOINT` existir, as respostas passam a ser enviadas por `POST` em JSON (`article`, `helpful`, `comment`, `at`).
