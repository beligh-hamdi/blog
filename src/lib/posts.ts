import type { CollectionEntry } from 'astro:content';
import { STATUS_ORDER, type PostStatus } from './workflow';

export type { PostStatus } from './workflow';

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
 * Group posts by their editorial status. Returns an ordered map (draft →
 * in_review → scheduled → published) for editorial-calendar display.
 */
export function groupByStatus(
  posts: CollectionEntry<'blog'>[],
): Record<PostStatus, CollectionEntry<'blog'>[]> {
  const groups = {
    draft: [],
    in_review: [],
    published: [],
    scheduled: [],
  } as Record<PostStatus, CollectionEntry<'blog'>[]>;
  for (const post of posts) {
    groups[post.data.status].push(post);
  }
  return groups;
}

/**
 * Editorial calendar: every post grouped by status, each group sorted by
 * publish date (soonest-first within `scheduled`, most-recent-first within
 * the other groups). Used by the internal /admin/calendar view.
 */
export function editorialCalendar(
  posts: CollectionEntry<'blog'>[],
): Record<PostStatus, CollectionEntry<'blog'>[]> {
  const groups = groupByStatus(posts);
  for (const status of STATUS_ORDER) {
    groups[status].sort((a, b) => {
      const dir = status === 'scheduled' ? 1 : -1; // upcoming first, else recent first
      return dir * (a.data.pubDate.valueOf() - b.data.pubDate.valueOf());
    });
  }
  return groups;
}
