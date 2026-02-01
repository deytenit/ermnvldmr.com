import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  // Load all markdown and MDX files from the content/articles directory
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    // Astro handles date strings in frontmatter, but we use coerce to be safe
    createdDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
  }),
});

export const collections = { articles };
