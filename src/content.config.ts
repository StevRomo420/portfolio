import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    order: z.number(),
    code: z.string(),
    title: z.string(),
    subtitle: z.string(),
    status: z.string(),
    featured: z.boolean().default(false),
    stack: z.array(z.string()),
    summary: z.string(),
    outcome: z.string().optional(),
  }),
});

export const collections = { projects };
