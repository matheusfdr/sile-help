// Configuração da Central de Ajuda. Os endereços vêm do ambiente (.env.example), então cada
// deploy aponta para o próprio app e site sem mudar código.
const trim = (url: string) => url.replace(/\/+$/, '');
const env = import.meta.env;

const marketingUrl = trim(env.PUBLIC_MARKETING_URL || 'https://sileai.app');
const supportEmail = env.PUBLIC_SUPPORT_EMAIL || 'suporte@sileai.app';

export const site = {
  name: 'Sile',
  title: 'Central de Ajuda do Sile',
  shortTitle: 'Central de Ajuda',
  url: trim(env.PUBLIC_SITE_URL || 'https://help.sileai.app'),
  appUrl: trim(env.PUBLIC_APP_URL || 'https://app.sileai.app'),
  marketingUrl,
  supportEmail,
  supportHours: 'Respondemos em dias úteis, das 9h às 18h.',
  feedbackEndpoint: env.PUBLIC_FEEDBACK_ENDPOINT || '',
  lang: 'pt-BR',
  locale: 'pt_BR',
  description:
    'Tutoriais, conceitos e respostas para usar o Sile no dia a dia da clínica: configuração, Inbox, contatos, agenda, agente e equipe.',
};

export const links = {
  app: site.appUrl,
  privacy: `${marketingUrl}/privacidade`,
  terms: `${marketingUrl}/termos`,
  support: `mailto:${supportEmail}`,
};
