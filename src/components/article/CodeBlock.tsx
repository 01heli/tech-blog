'use client';

import { useState, useRef, useCallback } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  className?: string;
  children?: React.ReactNode;
  ['data-language']?: string;
  ['data-theme']?: string;
}

export function CodeBlock({
  className,
  children,
  'data-language': dataLanguage,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const language =
    dataLanguage || className?.replace('language-', '') || 'plaintext';

  const copyCode = useCallback(() => {
    let text = '';
    if (children && typeof children === 'object' && 'props' in children) {
      text = getTextContent(children);
    } else if (typeof children === 'string') {
      text = children;
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    const fallback = () => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    };

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        timerRef.current = setTimeout(() => setCopied(false), 2000);
      }).catch(fallback);
    } else {
      fallback();
    }
  }, [children]);

  return (
    <div className="my-8 rounded-2xl border border-border overflow-hidden group">
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/[0.03] dark:bg-white/[0.03] border-b border-border">
        <span className="text-xs font-medium text-muted/60">{language}</span>
        <button
          onClick={copyCode}
          className="flex items-center gap-1.5 text-xs text-muted/50 hover:text-foreground transition-colors"
          aria-label="复制代码"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-500" />
              <span className="text-green-500">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm leading-relaxed font-mono" {...props}>
          {children}
        </pre>
      </div>
    </div>
  );
}

function getTextContent(node: React.ReactElement): string {
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map((n) => getTextContent(n)).join('');
  if (node && typeof node === 'object' && 'props' in node) {
    const children = (node.props as Record<string, unknown>).children;
    if (!children) return '';
    if (typeof children === 'string') return children;
    if (Array.isArray(children))
      return children
        .map((child) =>
          typeof child === 'string'
            ? child
            : typeof child === 'object' && child && 'props' in child
            ? getTextContent(child)
            : ''
        )
        .join('');
  }
  return '';
}
