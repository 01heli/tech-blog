import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { CATEGORIES } from '@/constants/categories';
import { getAllPosts, getAllTags } from '@/lib/posts';
import { normalizeCategorySlug } from '@/lib/utils';
import { SITE } from '@/constants/site';

export const metadata: Metadata = {
  title: '分类',
  description: `${SITE.name} 文章分类 - 按技术领域浏览`,
};

export default function CategoriesPage() {
  const posts = getAllPosts();
  const tags = getAllTags();
  const tagEntries = Array.from(tags.entries());

  const categoryCounts = new Map<string, number>();
  CATEGORIES.forEach((cat) => categoryCounts.set(cat.slug, 0));
  posts.forEach((p) => {
    const slug = normalizeCategorySlug(p.frontmatter.category);
    const current = categoryCounts.get(slug);
    if (current !== undefined) categoryCounts.set(slug, current + 1);
  });

  return (
    <div className="section-padding">
      <Container>
        <AnimatedSection>
          <h1 className="text-4xl font-bold tracking-tight mb-2">分类</h1>
          <p className="text-muted mb-12">按技术领域浏览文章</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {CATEGORIES.map((cat, i) => (
            <AnimatedSection key={cat.slug} delay={i * 0.05}>
              <Link
                href={`/categories/${cat.slug}`}
                className="group glass-card p-6 block hover:scale-[1.02]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${cat.color}`}
                  />
                  <h3 className="text-lg font-semibold group-hover:text-blue-500 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs text-muted/40">
                    {categoryCounts.get(cat.slug) || 0} 篇
                  </span>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  {cat.description}
                </p>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        {tagEntries.length > 0 && (
          <>
            <AnimatedSection>
              <h2 className="text-2xl font-semibold tracking-tight mb-6">
                标签
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <div className="flex flex-wrap gap-2">
                {tagEntries.map(([tag, count]) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass text-sm text-muted hover:text-foreground transition-colors cursor-default"
                  >
                    {tag}
                    <span className="text-xs text-muted/40">{count}</span>
                  </span>
                ))}
              </div>
            </AnimatedSection>
          </>
        )}
      </Container>
    </div>
  );
}
