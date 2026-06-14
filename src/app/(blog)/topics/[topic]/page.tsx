import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookOpen, ChevronRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { getAllTopics, getTopicBySlug } from '@/lib/topics';
import { SITE } from '@/constants/site';

export const revalidate = 300;

interface PageProps {
  params: { topic: string };
}

export function generateStaticParams() {
  const topics = getAllTopics();
  return topics.map((t) => ({ topic: t.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const topic = getTopicBySlug(params.topic);
  if (!topic) return { title: 'Not Found' };

  return {
    title: topic.meta.title,
    description: `${topic.meta.description} - ${SITE.name}`,
  };
}

export default function TopicPage({ params }: PageProps) {
  const topic = getTopicBySlug(params.topic);
  if (!topic) notFound();

  return (
    <div className="section-padding">
      <Container size="small">
        {/* Back link */}
        <Link
          href="/topics"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary transition-colors mb-8"
        >
          ← 所有专题
        </Link>

        {/* Header */}
        <AnimatedSection>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {topic.meta.title}
              </h1>
              <p className="text-sm text-muted mt-1">
                共 {topic.meta.chapterCount} 篇文章
              </p>
            </div>
          </div>
          <p className="text-muted mb-10">{topic.meta.description}</p>
        </AnimatedSection>

        {/* Chapter list */}
        <div className="space-y-3">
          {topic.chapters.map((chapter, i) => (
            <AnimatedSection key={chapter.slug} delay={i * 0.03}>
              <Link
                href={`/topics/${topic.meta.slug}/${chapter.slug}`}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:shadow-md hover:border-primary/50 transition-all duration-300 group"
              >
                {/* Order badge */}
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-sm font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                  {chapter.frontmatter.order}
                </div>

                {/* Chapter info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium group-hover:text-primary transition-colors">
                    {chapter.frontmatter.title}
                  </h3>
                  <p className="text-sm text-muted line-clamp-1 mt-0.5">
                    {chapter.frontmatter.description}
                  </p>
                </div>

                <ChevronRight className="w-5 h-5 text-muted/40 shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </div>
  );
}
