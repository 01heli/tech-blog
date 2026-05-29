import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { FRIENDS } from '@/constants/friends';

export const metadata: Metadata = {
  title: '友链',
  description: '友情链接',
};

export default function FriendsPage() {
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
          <h1 className="text-4xl font-bold tracking-tight mb-2">友链</h1>
          <p className="text-muted mb-12">
            互换友链请邮件联系
          </p>
        </AnimatedSection>

        {FRIENDS.length === 0 ? (
          <div className="py-12 text-center text-muted">
            暂无友链，敬请期待。
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FRIENDS.map((friend, i) => (
              <AnimatedSection key={friend.url} delay={i * 0.05}>
                <a
                  href={friend.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border border-border bg-card p-5 hover:shadow-lg hover:border-primary/50 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {friend.name}
                      </h3>
                      <p className="text-sm text-muted mt-1 line-clamp-2">
                        {friend.description}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
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
