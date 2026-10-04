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

| Serviço | Preço | Duração | Sile pode agendar |
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
| Mariana Souza | +55 11 90000-1001 | Novo lead interessada em Botox. O Sile está atendendo; Ana assume nos tutoriais. |
| Juliana Costa | +55 11 90000-1002 | Indicada por amiga, clareamento confirmado com a Dra. Fernanda. Atendida por Lucas. |
| Camila Oliveira | +55 11 90000-1003 | Perguntou se pode fazer clareamento com sensibilidade. O Sile transferiu (aguardando atendente). |
| Felipe Martins | +55 11 90000-1004 | Paciente de retorno. O Sile agendou a consulta de retorno com o Dr. Rafael. |
| Rafael Gomes | +55 11 90000-1005 | Faltou na avaliação e remarcou o preenchimento. Atendido por Ana. |

E-mails dos pacientes: `nome.sobrenome@email.example`.

Tags usadas: Novo lead, Botox, Avaliação, Retorno, VIP.

## Regras

- E-mails sempre no domínio reservado `.example`; o único e-mail real é o do suporte (suporte@sileai.app).
- Telefones sempre na faixa `+55 11 90000-xxxx`.
- Nenhum nome do ambiente de demonstração interno nem de clientes reais. Os testes de conteúdo verificam isso.
- Registros profissionais fictícios: `CRO-SP 00000`, `00001`, `00002`.

## Onde o dataset vive

O dataset é carregado só no servidor de desenvolvimento do Sile, por opção explícita, e nunca vai para produção. Instruções para rodar em [scripts/docs-screenshots/README.md](../scripts/docs-screenshots/README.md). Ao mudar este documento, mude também o dataset no produto (e vice-versa).

Dois estágios:

- **Em operação** (padrão): serviços, profissionais, contatos, conversas, agenda, agente ativo e WhatsApp conectado.
- **Em implantação**: a clínica recém-criada, vazia, para fotografar a configuração guiada. Os specs preenchem as etapas com os dados acima.
