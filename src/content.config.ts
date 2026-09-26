import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Mirrors public/admin/config.yml. Posts are pure front matter so Decap CMS can edit every field.
export const CATEGORIES = ['Guides', 'Explainers', 'Real estate', 'Dashboards', 'Non-profits'] as const;

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(CATEGORIES),
    date: z.coerce.date(),
    updated: z.coerce.date().optional().nullable(),
    read_time: z.string().default('5 min'),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    cover: z.string().optional().nullable(),
    cover_alt: z.string().optional().nullable(),
    short_answer: z.string(),
    sections: z.array(z.object({ heading: z.string(), body: z.string() })).default([]),
    faqs: z.array(z.object({ question: z.string(), answer: z.string() })).optional().nullable(),
    seo_title: z.string().optional().nullable(),
  }),
});

export const collections = { blog };
