import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { filterPublished } from '../lib/posts';
import { withBase } from '../lib/path';

// RSS/Atom feed for the blog. `context.site` comes from `site` in the config.
export async function GET(context) {
  const posts = filterPublished(await getCollection('blog')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: withBase(`/${post.id}/`),
    })),
  });
}
