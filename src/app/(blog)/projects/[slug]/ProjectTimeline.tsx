import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import type { WorkEntry } from '@/types/project';
import { formatDate } from '@/lib/utils';

async function TimelineEntry({ entry, isLast }: { entry: WorkEntry; isLast: boolean }) {
  const { content } = await compileMDX({
    source: entry.content,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
      },
    },
  });

  return (
    <div className="relative pl-10 pb-10">
      {!isLast && (
        <div className="absolute left-[7px] top-3 bottom-0 w-px bg-border" />
      )}
      <div className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-primary bg-background ring-4 ring-background" />
      <time className="text-sm font-semibold text-primary tracking-wide">
        {formatDate(entry.date)}
      </time>
      <div className="mt-2 article-prose text-sm">
        {content}
      </div>
    </div>
  );
}

interface ProjectTimelineProps {
  timeline: WorkEntry[];
}

export async function ProjectTimeline({ timeline }: ProjectTimelineProps) {
  if (timeline.length === 0) {
    return (
      <div className="py-12 text-center text-muted">
        暂无工作记录。
      </div>
    );
  }

  return (
    <div className="py-4">
      {timeline.map((entry, i) => (
        <TimelineEntry
          key={entry.date}
          entry={entry}
          isLast={i === timeline.length - 1}
        />
      ))}
    </div>
  );
}
