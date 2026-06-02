import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeShiki from '@shikijs/rehype';
import { Callout } from './Callout';
import { CodeBlock } from './CodeBlock';

interface ArticleContentProps {
  content: string;
}

export async function ArticleContent({ content }: ArticleContentProps) {
  try {
    const { content: mdxContent } = await compileMDX({
      source: content,
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [
              rehypeShiki,
              {
                themes: {
                  dark: 'github-dark',
                  light: 'github-light',
                },
                defaultColor: false,
              },
            ],
          ],
        },
      },
      components: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pre: ({ children, ...props }: any) => {
          if (
            children &&
            typeof children === 'object' &&
            'props' in children &&
            children.props
          ) {
            const childProps = children.props as Record<string, unknown>;
            // @shikijs/rehype puts data-language on <pre>, merge it down
            return <CodeBlock {...childProps} data-language={props['data-language'] || childProps['data-language']} />;
          }
          return <pre {...props}>{children}</pre>;
        },
        Callout,
        CodeBlock,
      },
    });

    return (
      <div className="article-prose max-w-none">
        {mdxContent}
      </div>
    );
  } catch {
    return (
      <div className="text-center py-12 text-muted">
        文章内容渲染失败，请稍后重试。
      </div>
    );
  }
}
