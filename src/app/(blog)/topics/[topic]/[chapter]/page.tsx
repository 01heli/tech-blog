import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllTopics, getTopicBySlug, getChapterBySlug, getAdjacentChapters } from '@/lib/topics';
import { SITE } from '@/constants/site';
import { ArticleContent } from '@/components/article/ArticleContent';
import { ArticleSidebar } from '@/components/article/ArticleSidebar';
import { ReadingProgress } from '@/components/layout/ReadingProgress';
import { Container } from '@/components/layout/Container';

interface PageProps {
  params: { topic: string; chapter: string };
}

export function generateStaticParams() {
  const topics = getAllTopics();
  const params: { topic: string; chapter: string }[] = [];

  for (const topicMeta of topics) {
    const topic = getTopicBySlug(topicMeta.slug);
    if (!topic) continue;
    for (const chapter of topic.chapters) {
      params.push({ topic: topicMeta.slug, chapter: chapter.slug });
    }
  }

  return params;
}

export function generateMetadata({ params }: PageProps): Metadata {
  const chapter = getChapterBySlug(params.topic, params.chapter);
  if (!chapter) return { title: 'Not Found' };

  return {
    title: chapter.frontmatter.title,
    description: chapter.frontmatter.description,
    openGraph: {
      title: chapter.frontmatter.title,
      description: chapter.frontmatter.description,
      type: 'article',
      siteName: SITE.name,
    },
  };
}

export default function ChapterPage({ params }: PageProps) {
  const topic = getTopicBySlug(params.topic);
  if (!topic) notFound();

  const chapter = getChapterBySlug(params.topic, params.chapter);
  if (!chapter) notFound();

  const { prev, next } = getAdjacentChapters(params.topic, params.chapter);

  return (
    <>
      <ReadingProgress />

      {/* Breadcrumb */}
      <div className="section-padding pb-0">
        <Container>
          <div className="flex items-center gap-2 text-sm text-muted mb-2">
            <Link href="/topics" className="hover:text-foreground transition-colors">
              专题
            </Link>
            <span>/</span>
            <Link
              href={`/topics/${params.topic}`}
              className="hover:text-foreground transition-colors"
            >
              {topic.meta.title}
            </Link>
          </div>
        </Container>
      </div>

      {/* Article */}
      <article>
        {/* Chapter header */}
        <div className="section-padding pb-0">
          <Container>
            <div className="mb-8">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-3">
                第 {chapter.frontmatter.order} 章 · 共 {topic.meta.chapterCount} 章
              </span>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                {chapter.frontmatter.title}
              </h1>
              <p className="text-lg text-muted">
                {chapter.frontmatter.description}
              </p>
            </div>
          </Container>
        </div>

        {/* Content + Sidebar */}
        <Container>
          <div className="lg:flex lg:gap-12">
            <ArticleSidebar headings={chapter.headings} />
            <div className="flex-1 min-w-0 max-w-3xl pb-16">
              <ArticleContent content={chapter.content} />
            </div>
          </div>
        </Container>

        {/* Chapter navigation */}
        <Container>
          <div className="border-t border-border pt-8 pb-16">
            <div className="flex items-center justify-between gap-4">
              {prev ? (
                <Link
                  href={`/topics/${params.topic}/${prev.slug}`}
                  className="flex items-start gap-3 rounded-xl border border-border p-4 hover:border-primary/50 hover:shadow-md transition-all group flex-1 max-w-md"
                >
                  <ChevronLeft className="w-5 h-5 text-muted shrink-0 mt-0.5 group-hover:text-primary group-hover:-translate-x-1 transition-all" />
                  <div className="text-left min-w-0">
                    <span className="text-xs text-muted/60">上一章</span>
                    <p className="text-sm font-medium text-muted group-hover:text-foreground transition-colors line-clamp-1">
                      {prev.frontmatter.title}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="flex-1 max-w-md" />
              )}

              {next ? (
                <Link
                  href={`/topics/${params.topic}/${next.slug}`}
                  className="flex items-start gap-3 rounded-xl border border-border p-4 hover:border-primary/50 hover:shadow-md transition-all group flex-1 max-w-md text-right justify-end"
                >
                  <div className="text-right min-w-0">
                    <span className="text-xs text-muted/60">下一章</span>
                    <p className="text-sm font-medium text-muted group-hover:text-foreground transition-colors line-clamp-1">
                      {next.frontmatter.title}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted shrink-0 mt-0.5 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              ) : (
                <div className="flex-1 max-w-md" />
              )}
            </div>

            {/* Back to topic */}
            <div className="text-center mt-6">
              <Link
                href={`/topics/${params.topic}`}
                className="text-sm text-muted hover:text-primary transition-colors"
              >
                ← 返回 {topic.meta.title} 目录
              </Link>
            </div>
          </div>
        </Container>
      </article>
    </>
  );
}
