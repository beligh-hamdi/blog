import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

// The blog content collection. Markdown/MDX files live in src/content/blog/.
// The schema is the editorial contract: every post must carry the metadata the
// site and SEO layer depend on. `draft: true` keeps a post out of the build.
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Editorial workflow: drafts are excluded from production listings/build.
    draft: z.boolean().default(false),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('beligh'),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog };
