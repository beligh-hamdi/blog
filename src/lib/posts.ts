import type { CollectionEntry } from 'astro:content';

export type PostStatus = 'draft' | 'in_review' | 'published' | 'scheduled';

/**
 * Determine whether a post should appear on the public (production) site.
 *
 * Rules:
 * - `published` → always visible.
 * - `scheduled` → visible only if pubDate has passed (treat as published).
 * - `draft` and `in_review` → never visible on the public site.
 */
export function isPublished(post: CollectionEntry<'blog'>, now = new Date()): boolean {
  const { status, pubDate } = post.data;
  if (status === 'published') return true;
  if (status === 'scheduled') return pubDate <= now;
  return false;
}

/**
 * Filter a list of posts to only those visible on the public site.
 */
export function filterPublished(
  posts: CollectionEntry<'blog'>[],
  now = new Date(),
): CollectionEntry<'blog'>[] {
  return posts.filter((p) => isPublished(p, now));
}

/**
 * Group posts by their editorial status.
 */
export function groupByStatus(posts: CollectionEntry<'blog'>[]) {
  const groups: Record<PostStatus, CollectionEntry<'blog'>[]> = {
    draft: [],
    in_review: [],
    published: [],
    scheduled: [],
  };
  for (const post of posts) {
    groups[post.data.status].push(post);
  }
  return groups;
}
