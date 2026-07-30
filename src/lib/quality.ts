/**
 * Content-quality engine for beligh.
 *
 * Checks every post for defects that hurt SEO, accessibility, or reader
 * trust. Designed to run both at build time (Astro page) and in CI (Node
 * script). All functions are pure — they take data and return reports.
 */

export type IssueType =
  | 'missing_description'
  | 'missing_hero'
  | 'missing_hero_alt'
  | 'thin_content'
  | 'body_image_missing_alt'
  | 'broken_internal_link'
  | 'broken_external_link';

export interface QualityIssue {
  slug: string;
  type: IssueType;
  severity: 'error' | 'warning';
  message: string;
  details?: string;
}

export interface PostReport {
  slug: string;
  title: string;
  status: string;
  wordCount: number;
  issueCount: number;
  errors: number;
  warnings: number;
  issues: QualityIssue[];
}

export interface SiteReport {
  posts: PostReport[];
  summary: {
    totalPosts: number;
    postsWithErrors: number;
    postsWithWarnings: number;
    totalErrors: number;
    totalWarnings: number;
    issueBreakdown: Record<IssueType, number>;
  };
}

/** Minimal post shape so the engine works in Astro pages and CLI alike. */
export interface QualityPost {
  id: string;
  filePath?: string;
  data: {
    title: string;
    description?: string;
    status?: string;
    slug?: string;
    heroImage?: string;
    heroImageAlt?: string;
    tags?: string[];
  };
  body: string;
}

const THIN_CONTENT_THRESHOLD = 300;

/** Count words in raw markdown, stripping formatting noise. */
export function countWords(markdown: string): number {
  let text = markdown;
  // Remove fenced code blocks
  text = text.replace(/```[\s\S]*?```/g, '');
  // Remove inline code
  text = text.replace(/`[^`]+`/g, '');
  // Remove images entirely (alt text doesn't count toward prose)
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '');
  // Replace links with their text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, '');
  // Remove heading/formatting punctuation
  text = text.replace(/[#*_>~|`[\]]/g, '');
  // Remove bare URLs
  text = text.replace(/https?:\/\/\S+/g, '');

  const words = text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
  return words.length;
}

/** Extract every link from raw markdown. */
export function extractLinks(markdown: string): { text: string; href: string }[] {
  const links: { text: string; href: string }[] = [];
  // Standard [text](href) — skip images by checking for leading !
  const linkRe = /(?<!\!)\[([^\]]*)\]\(([^)]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(markdown)) !== null) {
    links.push({ text: m[1], href: m[2] });
  }
  // Autolinks <url>
  const autoRe = /<(https?:\/\/[^>]+)>/g;
  while ((m = autoRe.exec(markdown)) !== null) {
    links.push({ text: m[1], href: m[1] });
  }
  // Bare URLs (common markdown renderers auto-link these)
  const bareRe = /(?:^|\s)(https?:\/\/[^\s<>"{}|\\^`[\]]+)/g;
  while ((m = bareRe.exec(markdown)) !== null) {
    links.push({ text: m[1], href: m[1] });
  }
  return links;
}

/** Build a set of every internal route that Astro generates. */
export function buildKnownRoutes(posts: QualityPost[]): Set<string> {
  const routes = new Set<string>([
    '/',
    '/about/',
    '/blog/',
    '/editorial/',
    '/admin/calendar/',
    '/admin/quality-report/',
    '/rss.xml',
  ]);

  const tagSet = new Set<string>();
  for (const post of posts) {
    routes.add(`/blog/${post.id}/`);
    for (const tag of post.data.tags ?? []) {
      tagSet.add(tag);
    }
  }
  for (const tag of tagSet) {
    routes.add(`/blog/tag/${tag}/`);
  }
  return routes;
}

/** Normalise a link href to an absolute root-relative path. */
function normaliseHref(href: string): string {
  // Strip hash and query for route matching
  let path = href.split('#')[0].split('?')[0];
  // Ensure trailing slash consistency (Astro emits trailing slashes)
  if (!path.endsWith('/') && !path.includes('.')) {
    path = `${path}/`;
  }
  return path;
}

/** Check a single post. */
export function checkPost(post: QualityPost, knownRoutes: Set<string>): QualityIssue[] {
  const slug = post.data.slug ?? post.id;
  const issues: QualityIssue[] = [];

  // --- Metadata checks ---
  if (!post.data.description || post.data.description.trim().length === 0) {
    issues.push({
      slug,
      type: 'missing_description',
      severity: 'error',
      message: 'Missing meta description.',
    });
  }

  if (!post.data.heroImage || post.data.heroImage.trim().length === 0) {
    issues.push({
      slug,
      type: 'missing_hero',
      severity: 'warning',
      message: 'No cover / hero image.',
    });
  } else if (!post.data.heroImageAlt || post.data.heroImageAlt.trim().length === 0) {
    issues.push({
      slug,
      type: 'missing_hero_alt',
      severity: 'error',
      message: 'Cover image is missing alt text.',
    });
  }

  // --- Content checks ---
  const wordCount = countWords(post.body);
  if (wordCount < THIN_CONTENT_THRESHOLD) {
    issues.push({
      slug,
      type: 'thin_content',
      severity: 'warning',
      message: `Thin content (${wordCount} words; threshold is ${THIN_CONTENT_THRESHOLD}).`,
      details: `Word count: ${wordCount}`,
    });
  }

  // Body images missing alt text
  const imgRe = /!\[([^\]]*)\]\([^)]+\)/g;
  let imgMatch: RegExpExecArray | null;
  while ((imgMatch = imgRe.exec(post.body)) !== null) {
    if (imgMatch[1].trim().length === 0) {
      issues.push({
        slug,
        type: 'body_image_missing_alt',
        severity: 'error',
        message: 'Body image is missing alt text.',
      });
    }
  }

  // --- Link checks ---
  const links = extractLinks(post.body);
  for (const link of links) {
    if (link.href.startsWith('http://') || link.href.startsWith('https://')) {
      // External: basic format sanity check; live fetch is done separately
      try {
        // eslint-disable-next-line no-new
        new URL(link.href);
      } catch {
        issues.push({
          slug,
          type: 'broken_external_link',
          severity: 'error',
          message: `Invalid external URL: ${link.href}`,
        });
      }
    } else if (link.href.startsWith('mailto:') || link.href.startsWith('tel:')) {
      // Skip non-HTTP schemes
      continue;
    } else {
      // Internal relative or root-relative
      const normalised = normaliseHref(link.href);
      if (!knownRoutes.has(normalised)) {
        issues.push({
          slug,
          type: 'broken_internal_link',
          severity: 'error',
          message: `Broken internal link: ${link.href}`,
        });
      }
    }
  }

  return issues;
}

/** Generate a full site report from a list of posts. */
export function generateReport(posts: QualityPost[]): SiteReport {
  const knownRoutes = buildKnownRoutes(posts);
  const reports: PostReport[] = [];
  const issueBreakdown: Record<string, number> = {
    missing_description: 0,
    missing_hero: 0,
    missing_hero_alt: 0,
    thin_content: 0,
    body_image_missing_alt: 0,
    broken_internal_link: 0,
    broken_external_link: 0,
  };

  let totalErrors = 0;
  let totalWarnings = 0;
  let postsWithErrors = 0;
  let postsWithWarnings = 0;

  for (const post of posts) {
    const issues = checkPost(post, knownRoutes);
    const errors = issues.filter((i) => i.severity === 'error').length;
    const warnings = issues.filter((i) => i.severity === 'warning').length;
    totalErrors += errors;
    totalWarnings += warnings;
    if (errors > 0) postsWithErrors++;
    if (warnings > 0) postsWithWarnings++;
    for (const issue of issues) {
      issueBreakdown[issue.type] = (issueBreakdown[issue.type] ?? 0) + 1;
    }
    reports.push({
      slug: post.data.slug ?? post.id,
      title: post.data.title,
      status: post.data.status ?? 'draft',
      wordCount: countWords(post.body),
      issueCount: issues.length,
      errors,
      warnings,
      issues,
    });
  }

  // Sort by severity: errors first, then warnings, then clean
  reports.sort((a, b) => {
    const aScore = a.errors * 2 + a.warnings;
    const bScore = b.errors * 2 + b.warnings;
    return bScore - aScore;
  });

  return {
    posts: reports,
    summary: {
      totalPosts: posts.length,
      postsWithErrors,
      postsWithWarnings,
      totalErrors,
      totalWarnings,
      issueBreakdown: issueBreakdown as Record<IssueType, number>,
    },
  };
}

/** Format a report as CLI-friendly Markdown. */
export function formatReport(report: SiteReport): string {
  const lines: string[] = [];
  lines.push('# Content Quality Report\n');
  const s = report.summary;
  lines.push(`**Posts:** ${s.totalPosts}  `);
  lines.push(`**Errors:** ${s.totalErrors}  `);
  lines.push(`**Warnings:** ${s.totalWarnings}  `);
  lines.push(`**Posts with errors:** ${s.postsWithErrors}\n`);

  if (s.totalErrors === 0 && s.totalWarnings === 0) {
    lines.push('✅ All clear.\n');
    return lines.join('\n');
  }

  lines.push('## Breakdown\n');
  for (const [type, count] of Object.entries(s.issueBreakdown).sort((a, b) => b[1] - a[1])) {
    if (count > 0) {
      lines.push(`- ${type.replace(/_/g, ' ')}: ${count}`);
    }
  }
  lines.push('');

  for (const post of report.posts) {
    if (post.issueCount === 0) continue;
    lines.push(`## ${post.title} (${post.slug})`);
    lines.push(`Status: ${post.status} · Words: ${post.wordCount}`);
    for (const issue of post.issues) {
      const icon = issue.severity === 'error' ? '❌' : '⚠️';
      lines.push(`  ${icon} ${issue.message}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
