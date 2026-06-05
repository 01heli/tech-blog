import type { Metadata } from 'next';
import Link from 'next/link';
import { Star, ExternalLink } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { REPOS } from '@/constants/repos';

export const metadata: Metadata = {
  title: '仓库',
  description: '收集实用的 GitHub 仓库，优质开源项目推荐',
};

function formatStars(n: number): string {
  if (n >= 1000) {
    return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return String(n);
}

export default function ReposPage() {
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
          <h1 className="text-4xl font-bold tracking-tight mb-2">仓库</h1>
          <p className="text-muted mb-12">
            收集实用的 GitHub 仓库，优质开源项目推荐。
          </p>
        </AnimatedSection>

        {REPOS.length === 0 ? (
          <div className="py-12 text-center text-muted">
            暂无仓库，敬请期待。
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {REPOS.map((repo, i) => (
              <AnimatedSection key={repo.url} delay={i * 0.05}>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border border-border bg-card p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* 仓库名 */}
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors truncate">
                          {repo.fullName}
                        </h3>
                        <ExternalLink className="w-4 h-4 text-muted shrink-0 group-hover:text-primary transition-colors" />
                      </div>

                      {/* 描述 */}
                      <p className="text-sm text-muted leading-relaxed mb-3">
                        {repo.description}
                      </p>

                      {/* 底部信息栏 */}
                      <div className="flex flex-wrap items-center gap-3">
                        {/* Star 数 */}
                        <span className="inline-flex items-center gap-1 text-sm text-muted">
                          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          <span className="font-medium text-foreground">
                            {formatStars(repo.stars)}
                          </span>
                        </span>

                        {/* 语言 */}
                        {repo.language && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            {repo.language}
                          </span>
                        )}

                        {/* 标签 */}
                        {repo.topics?.map((topic) => (
                          <span
                            key={topic}
                            className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </a>
              </AnimatedSection>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
