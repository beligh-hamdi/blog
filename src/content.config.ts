import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

// The blog content collection. Markdown/MDX files live in src/content/blog/.
// The schema is the editorial contract: every post must carry the metadata the
// site, SEO layer, and editorial tooling depend on.
//
// Workflow states (see src/lib/workflow.ts for the transition model):
//   draft -> in_review -> published
//                      -> scheduled (goes live automatically once pubDate passes)
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z
    .object({
      title: z.string(),
      // Short summary used as the meta description AND the listing excerpt.
      description: z.string(),
      // Editorial state. Only `published` (and `scheduled` once due) appear live.
      status: z.enum(['draft', 'in_review', 'published', 'scheduled']).default('draft'),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      author: z.string().default('beligh'),
      // Optional explicit URL slug. Defaults to the file name (post.id).
      slug: z.string().optional(),
      // One primary category; `tags` carries the rest of the taxonomy.
      category: z.string().optional(),
      // Cover/hero image, resolved relative to /public or absolute.
      heroImage: z.string().optional(),
      // Override the generated canonical URL (e.g. for cross-posted content).
      canonicalURL: z.string().url().optional(),
      tags: z.array(z.string()).default([]),
      // Hard block: exclude a post from the public build entirely, independent
      // of the editorial `status`. Defaults to false.
      draft: z.boolean().default(false),
    })
    // Build-time editorial invariants. These enforce the parts of the workflow
    // that are machine-checkable: you cannot `publish` a future-dated post
    // (use `scheduled`), and a `scheduled` post must be dated in the future.
    // The human review gate (draft -> in_review -> published) is enforced via
    // pull-request review; see docs/content-model.md.
    .superRefine((data, ctx) => {
      const now = new Date();
      if (data.status === 'published' && data.pubDate > now) {
        ctx.addIssue({
          code: 'custom',
          message:
            "A 'published' post cannot be dated in the future — use 'scheduled' and move it to 'published' once pubDate passes.",
          path: ['status'],
        });
      }
      if (data.status === 'scheduled' && data.pubDate <= now) {
        ctx.addIssue({
          code: 'custom',
          message:
            "A 'scheduled' post must be dated in the future — move it to 'published' once pubDate has passed.",
          path: ['status'],
        });
      }
    }),
});

export const collections = { blog };
