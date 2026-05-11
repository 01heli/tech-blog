import type { MDXComponents } from 'mdx/types'
import { CodeBlock } from '@/components/article/CodeBlock'
import { Callout } from '@/components/article/Callout'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    pre: ({ children, ...props }) => {
      if (
        children &&
        typeof children === 'object' &&
        'props' in children &&
        children.props
      ) {
        const childProps = children.props as Record<string, unknown>
        return <CodeBlock {...childProps} />
      }
      return <pre {...props}>{children}</pre>
    },
    blockquote: ({ children, ...props }) => {
      const text = typeof children === 'string' ? children : ''
      if (text?.startsWith('⚠️')) {
        return <Callout type="warning">{text.replace('⚠️', '').trim()}</Callout>
      }
      if (text?.startsWith('💡')) {
        return <Callout type="tip">{text.replace('💡', '').trim()}</Callout>
      }
      if (text?.startsWith('ℹ️')) {
        return <Callout type="info">{text.replace('ℹ️', '').trim()}</Callout>
      }
      return <Callout type="tip">{children}</Callout>
    },
    table: ({ children, ...props }) => (
      <div className="overflow-x-auto my-8 rounded-2xl border border-border">
        <table className="w-full" {...props}>
          {children}
        </table>
      </div>
    ),
    ...components,
  }
}
