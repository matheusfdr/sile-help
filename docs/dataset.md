# Dataset fictício da documentação

Todas as capturas e exemplos usam a **Clínica Aurora**, uma clínica fictícia de odontologia e harmonização orofacial em São Paulo. Os mesmos personagens aparecem em vários artigos para a documentação contar uma história coerente.

## Organização

| Campo | Valor |
| --- | --- |
| Nome | Clínica Aurora |
| Segmento | Odontologia |
| Unidade | Unidade Centro, Rua das Flores, 100, Centro, São Paulo, SP |
| Telefone e WhatsApp | +55 11 90000-0100 |
| E-mail | contato@clinicaaurora.example |
| Horário | Segunda a sexta, 8h às 19h; sábado, 9h às 13h |

## Equipe (usuários)

| Nome | Perfil | E-mail |
| --- | --- | --- |
| Ana Martins | Owner (recepção e gestão) | ana.martins@clinicaaurora.example |
| Carolina Mendes | Admin | carolina.mendes@clinicaaurora.example |
| Lucas Ferreira | Atendente | lucas.ferreira@clinicaaurora.example |

## Profissionais

| Nome | Especialidade | Serviços | Disponibilidade |
| --- | --- | --- | --- |
| Dra. Camila Rocha | Harmonização orofacial | Avaliação, Botox, Preenchimento, Consulta de retorno | Seg, qua e sex, 9h–12h e 13h–18h |
| Dr. Rafael Lima | Clínica geral | Avaliação, Limpeza, Consulta de retorno | Seg a sex, 8h–12h e 13h–17h |
| Dra. Fernanda Alves | Dentística estética | Avaliação, Limpeza, Clareamento, Consulta de retorno | Ter e qui, 10h–19h; sáb, 9h–13h |

## Serviços

| Serviço | Preço | Duração | O assistente pode agendar |
| --- | --- | --- | --- |
| Avaliação | Gratuita | 30 min | Sim |
| Limpeza | R$ 250,00 | 45 min | Sim |
| Clareamento | A partir de R$ 900,00 | 60 min | Sim |
| Botox | A partir de R$ 700,00 | 45 min | Sim |
| Preenchimento | A partir de R$ 1.200,00 | 60 min | Não (só a equipe) |
| Consulta de retorno | Gratuita | 30 min | Sim |

## Pacientes e contatos

| Nome | Telefone | Situação na história |
| --- | --- | --- |
| Mariana Souza | +55 11 90000-1001 | Novo lead interessada em Botox. A Lia está atendendo; Ana assume nos tutoriais. |
| Juliana Costa | +55 11 90000-1002 | Indicada por amiga, clareamento confirmado com a Dra. Fernanda. Atendida por Lucas. |
| Camila Oliveira | +55 11 90000-1003 | Perguntou se pode fazer clareamento com sensibilidade. A Lia transferiu (aguardando atendente). |
| Felipe Martins | +55 11 90000-1004 | Paciente de retorno. A Lia agendou a consulta de retorno com o Dr. Rafael. |
| Rafael Gomes | +55 11 90000-1005 | Faltou na avaliação e remarcou o preenchimento. Atendido por Ana. |

E-mails dos pacientes: `nome.sobrenome@email.example`.

Tags usadas: Novo lead, Botox, Avaliação, Retorno, VIP.

### Pacientes das campanhas

As telas de Campanhas precisam de um público maior. Além dos cinco pacientes acima, a Clínica Aurora tem estes pacientes fictícios, todos na faixa reservada de telefones:

| Nome | Telefone | Etiquetas | Observação |
| --- | --- | --- | --- |
| Beatriz Ramos | +55 11 90000-1006 | Retorno, VIP | |
| Gustavo Pereira | +55 11 90000-1007 | Retorno | |
| Larissa Nunes | +55 11 90000-1008 | Retorno | |
| Thiago Carvalho | +55 11 90000-1009 | Retorno | |
| Patrícia Melo | +55 11 90000-1010 | Retorno | |
| Bruno Azevedo | +55 11 90000-1011 | Retorno | |
| Renata Dias | +55 11 90000-1012 | Retorno | |
| Eduardo Barbosa | +55 11 90000-1013 | Retorno | |
| Vanessa Ribeiro | +55 11 90000-1014 | Retorno | Pediu para não receber mensagens ("Não contatar") |
| Rodrigo Teixeira | (sem telefone) | Retorno | Cadastro sem número |
| Aline Moreira | +55 11 90000-1016 | Avaliação | |
| Diego Castro | +55 11 90000-1017 | Avaliação | |
| Priscila Freitas | +55 11 90000-1018 | Avaliação | |
| Marcelo Pinto | +55 11 90000-1019 | Avaliação | Pediu para não receber mensagens ("Não contatar") |
| Tatiane Lopes | +55 11 90000-1020 | VIP | |

Nos pacientes da história, Mariana Souza também tem a etiqueta Avaliação, Juliana Costa e Felipe Martins têm Retorno e VIP, Camila Oliveira tem Avaliação e Rafael Gomes tem VIP.

### Campanhas

| Campanha | Status | Público | Modelo |
| --- | --- | --- | --- |
| Retorno de outubro | Concluída | Etiqueta Retorno: 12 selecionados, 10 elegíveis, 2 excluídos; 9 enviadas, 8 entregues, 5 lidas, 1 falha | Retorno semestral |
| Convite para clareamento | Agendada (daqui a três dias, às 10h) | Etiqueta Avaliação, com o serviço "Clareamento" na mensagem | Convite para um serviço |
| Novidades para pacientes VIP | Rascunho | Etiqueta VIP (5 contatos) | Retorno semestral |

Modelos aprovados: **Retorno semestral** (nome do paciente e da clínica) e **Convite para um serviço** (nome do paciente, da clínica e um serviço escolhido na campanha).

## Assistente da clínica

| Estágio | Nome | Configuração |
| --- | --- | --- |
| Em operação | **Lia** | Papel "Assistente virtual de atendimento da Clínica Aurora"; apresentação "Olá! Sou a Lia, assistente virtual da Clínica Aurora. Como posso te ajudar?"; personalidade Acolhedor com a descrição "Seja acolhedora e calma. Explique de forma simples e objetiva."; mensagens de atendimento com o texto padrão. |
| Em implantação (configuração guiada) | **Assistente** | O nome padrão de uma clínica nova, ainda em Rascunho. |

"Sile" é a plataforma, nunca o nome do assistente.

## Regras

- E-mails sempre no domínio reservado `.example`; o único e-mail real é o do suporte (suporte@sileai.app).
- Telefones sempre na faixa `+55 11 90000-xxxx`.
- Nenhum nome do ambiente de demonstração interno nem de clientes reais. Os testes de conteúdo verificam isso.
- Registros profissionais fictícios: `CRO-SP 00000`, `00001`, `00002`.

## Onde o dataset vive

O dataset é carregado só no servidor de desenvolvimento do Sile, por opção explícita, e nunca vai para produção. Instruções para rodar em [scripts/docs-screenshots/README.md](../scripts/docs-screenshots/README.md). Ao mudar este documento, mude também o dataset no produto (e vice-versa).

Campanhas só existem com o servidor do Sile ligado. Para elas, a mesma Clínica Aurora é preparada no banco de dados local do produto, com o mesmo elenco e a senha `documentacao`, e o app roda conectado a ele (ver [scripts/docs-screenshots/README.md](../scripts/docs-screenshots/README.md), seção "Campanhas").

Dois estágios:

- **Em operação** (padrão): serviços, profissionais, contatos, conversas, agenda, agente ativo e WhatsApp conectado.
- **Em implantação**: a clínica recém-criada, vazia, para fotografar a configuração guiada. Os specs preenchem as etapas com os dados acima.
