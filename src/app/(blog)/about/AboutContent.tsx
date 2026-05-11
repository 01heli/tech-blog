import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';

interface AboutContentProps {
  content: string;
}

export async function AboutContent({ content }: AboutContentProps) {
  try {
    const { content: mdxContent } = await compileMDX({
      source: content,
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug],
        },
      },
    });

    return (
      <div className="article-prose max-w-none animate-fade-in">
        {mdxContent}
      </div>
    );
  } catch {
    return (
      <div className="text-center py-12 text-muted">
        内容渲染失败，请稍后重试。
      </div>
    );
  }
}
