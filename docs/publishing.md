# Publishing a post (for authors and editors)

This is the step-by-step guide for moving a post from idea to live on the site.
No engineering knowledge is required after the initial repo access is set up.

## The short version

1. **Write** the post as a Markdown file in `src/content/blog/`.
2. **Preview** it locally with `npm run dev`.
3. **Request review** by changing `status` to `in_review` and opening a pull request.
4. **Approve** → merge to `main` → the site deploys automatically.

## Detailed flow

### 1. Create a new post

Copy an existing post in `src/content/blog/` and rename it, or create a new file
like `my-post.md`.

Fill in the front-matter at the top:

```yaml
---
title: 'Your post title'
description: 'One-sentence summary.'
status: 'draft'
pubDate: 2026-08-01
author: 'Your Name'
tags: ['topic']
---
```

The file name becomes the URL slug (`/blog/my-post/`).

### 2. Write the body

Everything below the `---` is the post content. Use Markdown:

```markdown
## A heading

Some text with **bold** and [a link](https://example.com).

- Bullet points
- Are supported

> Blockquotes work too.
```

### 3. Preview locally

```bash
npm run dev
```

Open <http://localhost:4321/blog/my-post/> to preview. The dev server reloads
automatically when you save the file.

### 4. Submit for review

When the post is ready:

1. Change `status: 'draft'` to `status: 'in_review'`.
2. Commit and push to a branch.
3. Open a **pull request** on GitHub.
4. Assign an editor as reviewer.

The post is excluded from the live site while `status` is `in_review`.

### 5. Editorial review

The reviewer checks:

- Title and description are clear and SEO-friendly.
- Headings are semantic (one H1, then H2/H3).
- Images have descriptive alt text.
- Links work.
- The post appears correctly in the preview.

If changes are needed, the reviewer requests them in the PR. The author updates
the file and pushes again.

### 6. Publish

Once approved, the reviewer (or author) updates `status` to `published` and
**merges the pull request to `main`**.

CI builds the site and deploys automatically. The post is live within minutes.

### 7. Schedule for later (optional)

To publish on a future date, use `status: 'scheduled'` and set `pubDate` to the
future date. The post will go live automatically once that date passes and the
site rebuilds.

## Safety rules

- **Never auto-publish.** AI-drafted posts always land as `draft`.
- **Never commit secrets.** API keys stay in environment variables.
- **Drafts never leak.** Only `published` (and past-due `scheduled`) posts appear
  on the live site or in RSS/sitemap.
