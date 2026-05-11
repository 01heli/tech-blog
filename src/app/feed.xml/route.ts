import { Feed } from 'feed';
import { getAllPosts } from '@/lib/posts';
import { SITE } from '@/constants/site';

export async function GET() {
  const feed = new Feed({
    title: SITE.name,
    description: SITE.description,
    id: SITE.url,
    link: SITE.url,
    language: 'zh-CN',
    favicon: `${SITE.url}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${SITE.author.name}`,
    author: {
      name: SITE.author.name,
      link: SITE.url,
    },
  });

  const posts = getAllPosts();

  posts.forEach((post) => {
    feed.addItem({
      title: post.frontmatter.title,
      id: `${SITE.url}/articles/${post.slug}`,
      link: `${SITE.url}/articles/${post.slug}`,
      description: post.frontmatter.description,
      date: new Date(post.frontmatter.date),
      category: [{ name: post.frontmatter.category }],
    });
  });

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
