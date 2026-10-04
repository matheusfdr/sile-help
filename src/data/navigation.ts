// Estrutura da Central de Ajuda.
// - categories: seções da URL (/atendimento/...) e cartões da página inicial;
// - topics: assuntos dentro de cada categoria; cada artigo pertence a um tópico (frontmatter `topic`);
// - sidebar: grupos na mesma ordem e com os mesmos nomes do menu do produto.
// Só aparecem na navegação as categorias e os tópicos que já têm artigos publicados.

export type ArticleType = 'conceito' | 'tutorial' | 'referencia' | 'solucao';

export const ARTICLE_TYPES: Record<ArticleType, { label: string; description: string }> = {
  conceito: { label: 'Conceito', description: 'O que é, para que serve e como se relaciona com o resto do Sile.' },
  tutorial: { label: 'Tutorial', description: 'Passo a passo para realizar uma tarefa.' },
  referencia: { label: 'Referência', description: 'Opções, status e campos explicados um a um.' },
  solucao: { label: 'Solução de problemas', description: 'Sintoma, causas e como resolver.' },
};

export interface Category {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export const categories: Category[] = [
  { id: 'comecando', label: 'Começando', description: 'Configure a clínica, conecte o WhatsApp, teste e ative o Sile.', icon: 'rocket' },
  { id: 'atendimento', label: 'Atendimento', description: 'Inbox, conversas, atendimento humano e devolução para a IA.', icon: 'inbox' },
  { id: 'crm', label: 'Contatos e CRM', description: 'Contatos, tags, histórico e o pipeline de oportunidades.', icon: 'contact' },
  { id: 'agenda', label: 'Agenda', description: 'Agendamentos, status, remarcações e cancelamentos.', icon: 'calendar' },
  { id: 'servicos-e-profissionais', label: 'Serviços e profissionais', description: 'Catálogo de serviços, profissionais e disponibilidade.', icon: 'stethoscope' },
  { id: 'agente', label: 'Inteligência artificial', description: 'Como o agente Sile funciona, regras, conhecimento e testes.', icon: 'bot' },
  { id: 'automacoes', label: 'Automações', description: 'Lembretes, follow-ups e mensagens automáticas.', icon: 'workflow' },
  { id: 'whatsapp', label: 'WhatsApp', description: 'Conexão do número e modelos de mensagem.', icon: 'message-circle' },
  { id: 'relatorios', label: 'Relatórios', description: 'Indicadores de atendimento, comercial, agenda e IA.', icon: 'chart-column' },
  { id: 'configuracoes', label: 'Equipe e configurações', description: 'Membros, perfis de acesso e dados da organização.', icon: 'settings' },
  { id: 'solucao-de-problemas', label: 'Solução de problemas', description: 'O que fazer quando algo não funciona como esperado.', icon: 'life-buoy' },
];

export interface Topic {
  id: string;
  label: string;
  category: string;
}

export const topics: Topic[] = [
  { id: 'comecando', label: 'Começando', category: 'comecando' },
  { id: 'inbox', label: 'Inbox', category: 'atendimento' },
  { id: 'conversas', label: 'Conversas', category: 'atendimento' },
  { id: 'contatos', label: 'Contatos', category: 'crm' },
  { id: 'pipeline', label: 'Pipeline', category: 'crm' },
  { id: 'agenda', label: 'Agenda', category: 'agenda' },
  { id: 'servicos', label: 'Serviços', category: 'servicos-e-profissionais' },
  { id: 'profissionais', label: 'Profissionais', category: 'servicos-e-profissionais' },
  { id: 'automacoes', label: 'Automações', category: 'automacoes' },
  { id: 'agente', label: 'Agente', category: 'agente' },
  { id: 'conhecimento', label: 'Conhecimento', category: 'agente' },
  { id: 'modelos', label: 'Modelos', category: 'whatsapp' },
  { id: 'relatorios', label: 'Relatórios', category: 'relatorios' },
  { id: 'equipe', label: 'Equipe', category: 'configuracoes' },
  { id: 'integracoes', label: 'Integrações', category: 'configuracoes' },
  { id: 'configuracoes', label: 'Configurações', category: 'configuracoes' },
  { id: 'solucao', label: 'Solução de problemas', category: 'solucao-de-problemas' },
];

export const TOPIC_IDS = topics.map((t) => t.id) as [string, ...string[]];

/** Same order and names as the product's sidebar. */
export const sidebar: { label: string; topics: string[] }[] = [
  { label: 'Começando', topics: ['comecando'] },
  { label: 'Atendimento', topics: ['inbox', 'conversas'] },
  { label: 'Relacionamento', topics: ['contatos', 'pipeline'] },
  { label: 'Operação', topics: ['agenda', 'servicos', 'profissionais', 'automacoes'] },
  { label: 'Inteligência', topics: ['agente', 'conhecimento'] },
  { label: 'WhatsApp', topics: ['modelos'] },
  { label: 'Análise', topics: ['relatorios'] },
  { label: 'Administração', topics: ['equipe', 'integracoes', 'configuracoes'] },
  { label: 'Solução de problemas', topics: ['solucao'] },
];

export const topicById = (id: string) => topics.find((t) => t.id === id)!;
export const categoryById = (id: string) => categories.find((c) => c.id === id)!;

/** Articles suggested when the search box is empty (curated, not a popularity ranking). */
export const suggested = [
  '/comecando/guia-de-implantacao',
  '/comecando/primeiros-passos',
  '/atendimento/assumir-conversa',
  '/atendimento/inbox',
  '/comecando/testar-no-playground',
];
