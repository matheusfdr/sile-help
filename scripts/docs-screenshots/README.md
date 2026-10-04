# Capturas de tela

Os specs desta pasta fazem dois trabalhos ao mesmo tempo: **validam os tutoriais** no produto (se um botão mudar de nome, o spec falha) e **geram as imagens** em `public/images/<categoria>/`.

## Regras

- Só rodam contra um Sile **local**, em modo de documentação, com dados fictícios. `helpers.ts` recusa qualquer host que não seja `localhost`.
- Nunca use ambiente de produção, dados reais ou sessão de cliente.
- Saída sempre em `.webp`, capturada em 2x (1440×900 de viewport), com nome semântico.

## Como rodar

1. Tenha acesso ao repositório do produto e suba o app em modo de documentação, numa porta separada:

   ```sh
   # na pasta do app web, no repositório do produto
   VITE_DOCS_DATASET=aurora npx vite --port 5174 --strictPort
   ```

   No Windows (PowerShell): `$env:VITE_DOCS_DATASET='aurora'; npx vite --port 5174 --strictPort`.

2. Neste repositório:

   ```sh
   npm run screenshots                         # todos os specs
   npm run screenshots -- atendimento          # só um arquivo
   npm run screenshots -- -g "assumir"         # só um teste
   ```

   No Git Bash do Windows, prefixe com `MSYS_NO_PATHCONV=1` (o Git Bash converte `/rotas` em caminhos).

3. Revise as imagens, rode `npm run build && npm test` e faça o commit.

`DOCS_APP_URL` muda o endereço (padrão `http://localhost:5174`); `DOCS_BROWSER_CHANNEL` muda o navegador (padrão: Chrome instalado; use `chromium` depois de `npx playwright install chromium`).

## Como funciona

```
Sile local (dataset Clínica Aurora)
  → start(): escolhe o estágio (em operação ou em implantação) e entra com uma conta fictícia
  → go(): navega pela SPA (recarregar a página zera os dados de demonstração)
  → highlight(): contorno violeta com número sobre o que clicar
  → shot(): recorta a área relevante e salva public/images/<arquivo>.webp
```

| Spec | Artigos |
| --- | --- |
| `comecando.spec.ts` | Começando: configuração guiada completa (estágio em implantação), Integrações, Agente e Playground |
| `atendimento.spec.ts` | Atendimento: Inbox, abrir, assumir, devolver, enviar mensagens, anexos e dados do contato |

## Padrão visual dos destaques

- Contorno de 2 px na cor da marca (`#625DF5`), com um halo suave.
- Número em círculo violeta no canto superior esquerdo, na ordem em que o texto cita.
- Nada de setas, círculos vermelhos ou várias cores.

## Novo spec

Crie `<categoria>.spec.ts` seguindo os existentes. Para cada imagem, prefira `shot(page, 'categoria/artigo-01-o-que-mostra', { locator })` recortando só a área que ensina algo. Se a tela precisar de dados que o dataset não tem, ajuste o dataset no produto (ver [docs/dataset.md](../../docs/dataset.md)), nunca a tela.
