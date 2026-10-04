# Guia de escrita

Regras para todos os artigos da Central de Ajuda. Elas também valem para quem revisa.

## Escopo

- Documentamos **só o painel da clínica**: Início, Inbox, Contatos, Pipeline, Agenda, Serviços, Profissionais, Automações, Agente, Conhecimento, Modelos, Relatórios, Equipe, Integrações, Configurações, configuração guiada e Minha conta.
- **Nunca** documentamos ferramentas internas da equipe Sile, infraestrutura, fornecedores, credenciais, limites internos ou como o produto é construído. Os testes (`tests/content.test.mjs`) recusam termos desse tipo.
- O produto é a fonte da verdade. Se o produto e o texto divergirem, o texto se adapta e a divergência é registrada para o time de produto (no repositório privado do produto, nunca aqui). Nada de documentar o que ainda não existe.

## Antes de escrever

1. Encontre a funcionalidade no produto e leia a tela.
2. Rode o Sile local com o dataset fictício e faça o passo a passo de verdade.
3. Sempre que possível, transforme o passo a passo em um spec de captura: ele valida os rótulos a cada execução.

## Tipos de artigo

| Tipo | Quando usar | Estrutura |
| --- | --- | --- |
| Conceito (`conceito`) | O que é e como funciona | O que é → para que serve → como se relaciona → conceitos importantes |
| Tutorial (`tutorial`) | Fazer uma tarefa | Descrição → Antes de começar → Como fazer (Steps) → O que acontece depois → Exemplo → Dica/Atenção |
| Referência (`referencia`) | Opções e status | Tabela com cada opção e o que significa |
| Solução de problemas (`solucao`) | Algo não funciona | Sintoma → Possíveis causas → O que verificar → Como resolver → Quando falar com o suporte |

## Frontmatter

```yaml
title: Como assumir um atendimento       # frase, sentence case
description: Saiba como pausar o Sile…    # 20 a 180 caracteres; vira o lead e a meta description
type: tutorial
topic: conversas                         # ids em src/data/navigation.ts; a pasta é a categoria do tópico
order: 2                                 # ordem dentro do tópico
lastUpdated: 2026-10-04                  # data da última validação no produto
related:                                 # 2 a 4 artigos, por URL
  - /atendimento/devolver-para-ia
aliases:                                 # como as pessoas procuram; entram na busca, não aparecem
  - tirar o robô
```

## Linguagem

- Português do Brasil, sentence case, sem emoji, frases curtas.
- O produto se chama **Sile**. A IA também aparece como Sile ("o Sile responde"). Nunca "Sile AI".
- Escreva para a recepção e para o dono da clínica. Termos técnicos só quando aparecem na tela.
- Nomes de botões, abas e campos em **negrito**, exatamente como na tela: clique em **Assumir atendimento**.
- Caminhos de menu com seta: **Atendimento → Inbox**.
- Explique o comportamento, não só o clique: o que muda, para quem e o que continua igual.
- Não repita o que já está em outro artigo. Linke para ele.

## Passo a passo

Ruim: "Vá para a tela. Clique no botão. Pronto."

Bom: "No menu lateral, acesse **Atendimento → Inbox**. Na lista de conversas, selecione o contato. No topo da conversa, clique em **Assumir atendimento**. Confira que o status mudou para **Você está atendendo**."

## Componentes

| Componente | Uso |
| --- | --- |
| `<Steps>` + `<Step title="…">` | Procedimentos numerados |
| `<Screenshot src alt caption? narrow?>` | Captura do produto; `alt` descreve o que a imagem mostra |
| `<Callout title?>`, `<Tip>`, `<Warning>` | Informação, dica e atenção. No máximo dois por artigo |
| `<Tabs>` + `<Tab label="…">` | Variações do mesmo procedimento (por exemplo, dois caminhos) |
| `<Status tone="success">Conectado</Status>` | Status exatamente como aparece no produto |
| `<kbd>Enter</kbd>` | Teclas |

## Imagens

- Só capturas com o dataset fictício (ver [dataset.md](dataset.md)) e só quando ensinam algo.
- Formato `.webp`, nome semântico com prefixo do artigo: `assumir-01-sile-atendendo.webp`.
- Destaques só no padrão das capturas: contorno violeta com número. Nada de setas ou círculos vermelhos.
- O texto do passo cita os números do destaque: "clique em **Assumir atendimento** (1)".

## Exemplos

Use o elenco do dataset e mantenha a história coerente entre artigos (Mariana Souza pergunta sobre Botox, Ana Martins assume, a Dra. Camila Rocha atende a avaliação). Exemplos são fictícios, mas precisam ser possíveis no produto.
