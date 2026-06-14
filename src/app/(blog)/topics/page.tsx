import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Server,
  Database,
  Container as ContainerIcon,
  Globe,
  Code2,
  Cpu,
  Braces,
  Shield,
  type LucideIcon,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { getAllTopics } from '@/lib/topics';

export const metadata: Metadata = {
  title: '专题',
  description: '系统性学习路径，从零开始掌握一门技术',
};

// Map icon name strings from meta.json to lucide-react components
const ICON_MAP: Record<string, LucideIcon> = {
  server: Server,
  database: Database,
  container: ContainerIcon,
  globe: Globe,
  code: Code2,
  cpu: Cpu,
  braces: Braces,
  shield: Shield,
};

function TopicIcon({ icon, className }: { icon: string; className?: string }) {
  const IconComponent = ICON_MAP[icon] || Server;
  return <IconComponent className={className} />;
}

export default function TopicsPage() {
  const topics = getAllTopics();

  return (
    <div className="section-padding">
      <Container size="small">
        <AnimatedSection>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors mb-8"
          >
            ← 返回首页
          </Link>
          <h1 className="text-4xl font-bold tracking-tight mb-2">专题</h1>
          <p className="text-muted mb-12">
            系统性学习路径，每个专题都是一条从入门到生产的完整路线。
          </p>
        </AnimatedSection>

        {topics.length === 0 ? (
          <div className="py-12 text-center text-muted">暂无专题，敬请期待。</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map((topic, i) => (
              <AnimatedSection key={topic.slug} delay={i * 0.05}>
                <Link
                  href={`/topics/${topic.slug}`}
                  className="block rounded-xl border border-border bg-card p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300 group h-full"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <TopicIcon
                        icon={topic.icon}
                        className="w-6 h-6 text-primary"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors mb-1">
                        {topic.title}
                      </h3>
                      <p className="text-sm text-muted line-clamp-2 mb-3">
                        {topic.description}
                      </p>
                      <span className="text-xs text-muted/60">
                        {topic.chapterCount} 篇文章
                      </span>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
