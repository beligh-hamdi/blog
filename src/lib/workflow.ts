import type { CollectionEntry } from 'astro:content';

export type PostStatus = 'draft' | 'in_review' | 'published' | 'scheduled';

export const STATUS_ORDER: PostStatus[] = ['draft', 'in_review', 'scheduled', 'published'];

/**
 * Allowed editorial state transitions. A post moves forward through review to
 * publication; `scheduled` is a staging slot that flips to `published` once the
 * publish date passes (done by editing the file or via tooling, then rebuilding).
 *
 *   draft -> in_review
 *   in_review -> draft        (send back for revisions)
 *   in_review -> scheduled
 *   in_review -> published
 *   scheduled -> published
 *   published -> in_review   (unpublish / re-open for revision)
 *   published -> draft       (take down)
 *
 * Same-state transitions (no-op) are always allowed.
 */
export const ALLOWED_TRANSITIONS: Record<PostStatus, PostStatus[]> = {
  draft: ['draft', 'in_review'],
  in_review: ['draft', 'in_review', 'scheduled', 'published'],
  scheduled: ['published', 'scheduled'],
  published: ['draft', 'in_review', 'published'],
};

export function canTransition(from: PostStatus, to: PostStatus): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

export type WorkflowViolation = {
  slug: string;
  field: string;
  message: string;
};

/**
 * Machine-checkable editorial invariants for a single post. Mirrors the Zod
 * `superRefine` rules in content.config.ts so the editorial calendar and any
 * tooling can report the same violations without a full build.
 */
export function workflowViolations(
  post: CollectionEntry<'blog'>,
  now = new Date(),
): WorkflowViolation[] {
  const v: WorkflowViolation[] = [];
  const slug = post.data.slug ?? post.id;
  const { status, pubDate } = post.data;

  if (status === 'published' && pubDate > now) {
    v.push({
      slug,
      field: 'status',
      message: "Future-dated post is 'published' — use 'scheduled' until pubDate passes.",
    });
  }
  if (status === 'scheduled' && pubDate <= now) {
    v.push({
      slug,
      field: 'status',
      message: "Past-dated post is still 'scheduled' — move to 'published'.",
    });
  }
  return v;
}

/**
 * Whether a `scheduled` post is now due to be promoted to `published`.
 */
export function isDue(post: CollectionEntry<'blog'>, now = new Date()): boolean {
  return post.data.status === 'scheduled' && post.data.pubDate <= now;
}
