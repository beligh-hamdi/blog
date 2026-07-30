# Deploying the blog

The site is a **static build** (`npm run build` → `dist/`). Any static host can
serve it. The default target is **GitHub Pages** via CI; two alternatives are
documented below.

> Safety: deploys only publish what's on `main` (after CI passes) or what a
> maintainer triggers manually. There is no way to push unreviewed content live —
> merges go through pull requests, and AI-drafted posts land as `draft: true`.

## Default: GitHub Pages (via CI)

One-time setup (in the GitHub web UI — no engineer required):

1. Push this repo to GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. **Settings → Secrets and variables → Actions → Variables**, add:
   - `SITE_URL` — your public origin, e.g. `https://<owner>.github.io` or a custom domain.
   - `BASE_PATH` — `/<repo>/` for a project site, or `/` for a custom domain / user site.

After that, **every push to `main` deploys automatically** (`.github/workflows/deploy.yml`),
and the live URL appears in the Actions run summary and under **Settings → Pages**.
To deploy on demand, use **Actions → Deploy → Run workflow**.

## Alternative: Cloudflare Pages / Netlify

Connect the repo in the host's dashboard and set:

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Environment variable:** `SITE_URL=https://your-domain` (and leave `BASE_PATH` as `/`)

Both auto-deploy on push and give preview URLs for pull requests.

## Manual / local deploy (any static host)

```bash
SITE_URL=https://your-domain npm run build   # produces dist/
# then upload dist/ to your host, e.g. Cloudflare:
# npx wrangler pages deploy dist
```

## Verifying a deploy

- Home page loads and lists posts.
- `‹site›/sitemap-index.xml`, `‹site›/rss.xml`, `‹site›/robots.txt` resolve.
- A post page contains a canonical link, OpenGraph tags, and Article JSON-LD.
