# Identidade visual

A Central de Ajuda usa a mesma identidade do produto e do site. Não existe paleta ou estilo próprio.

## Origem

`src/styles/brand/` é uma cópia fiel do pacote de marca do Sile:

- `tokens/*.css`: cores, tipografia, espaçamento, raios, sombras, movimento e logo;
- `fonts/`: Geist, Geist Mono e Instrument Serif (licença OFL);
- `assets/logo/sile-symbol.png`: o símbolo oficial, usado como máscara CSS.

Não edite esses arquivos aqui. Quando a marca mudar, copie de novo do pacote de marca.

## Regras

- Cor da marca `#625DF5` (`--brand-primary`) e texto `#111318` (`--text-primary`).
- Violeta só para o CTA principal ("Ir para o Sile"), item ativo, links, foco e destaques das capturas.
- Verde só para sucesso e conectado.
- Geist para tudo, Geist Mono para rótulos pequenos em caixa alta, Instrument Serif itálico só no título da página inicial.
- Botões em pílula, campos com raio de 10 px, cartões com raio de 20 px, como no produto.
- Os controles de `help.css` (`.h-btn`, `.h-input`, `.h-tag`, `.callout`) reproduzem os do design system do produto. Ao mudar um, mantenha a equivalência.

## Componentes próprios da documentação

DocsHeader, DocsSidebar, DocsSearch, Breadcrumbs, TableOfContents, Steps/Step, Callout/Tip/Warning, Screenshot (com ampliação), Tabs/Tab, Status, RelatedArticles, ArticleFeedback, SupportCta e Footer.

## Acessibilidade

HTML semântico (landmarks, listas ordenadas nos passos, tabelas reais), link "Pular para o conteúdo", foco visível com o anel da marca, busca como combobox com navegação por setas, menu móvel e ampliação de imagem em `<dialog>` nativo (Esc fecha, foco preso), texto alternativo obrigatório nas capturas (o build falha sem ele) e movimento reduzido respeitado.

## Responsividade

- Acima de 1200 px: menu lateral, artigo e "Nesta página".
- De 1025 a 1200 px: menu lateral e artigo; "Nesta página" vira um bloco recolhível acima do texto.
- Até 1024 px: menu em gaveta (botão no cabeçalho).
- Até 768 px: a busca vira um ícone que abre um painel abaixo do cabeçalho; o botão "Ir para o Sile" fica compacto.
- As capturas nunca aparecem maiores que o tamanho real e podem ser ampliadas.
