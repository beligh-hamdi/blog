// Base-path-aware link helper.
//
// Astro serves the site under the configured `base` (e.g. `/blog/` for a
// GitHub Pages project site, or `/` for a custom/root domain). Hardcoded
// absolute links like `/about` are *not* auto-prefixed with the base, so on a
// project site they 404. Build every internal link through `withBase` so the
// same source works regardless of the deploy target.
//
// Pass the route path as if `base` were `/` (the "logical" path):
//   withBase('/about')            -> '/blog/about'
//   withBase('/')                 -> '/blog/'
//   withBase('/hello-world/')     -> '/blog/hello-world/'
//   withBase('/rss.xml')          -> '/blog/rss.xml'
const BASE = import.meta.env.BASE_URL; // e.g. '/blog/' (Astro guarantees trailing slash)

export function withBase(path = '/'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  // BASE ends with '/'; strip it, then re-add the requested path (which keeps
  // its own trailing slash). Special-case the root so it stays '/' not ''.
  const root = BASE.replace(/\/$/, '');
  return root + (normalized === '/' ? '/' : normalized);
}
