import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { TOPIC_IDS } from './data/navigation';

// Um arquivo .mdx por artigo em src/content/articles/<categoria>/<slug>.mdx.
// A URL pública é /<categoria>/<slug>. Guia de escrita: docs/guia-de-escrita.md.
const articles = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/articles' }),
  schema: z.object({
    title: z.string().min(8),
    description: z.string().min(20).max(180),
    type: z.enum(['conceito', 'tutorial', 'referencia', 'solucao']),
    topic: z.enum(TOPIC_IDS),
    order: z.number().int(),
    lastUpdated: z.coerce.date(),
    /** Up to four related articles, by URL (/atendimento/assumir-conversa). */
    related: z.array(z.string().startsWith('/')).max(4).default([]),
    /** Other ways people search for this article ("pausar ia", "tirar o robô"). Indexed, never shown. */
    aliases: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
