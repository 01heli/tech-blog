import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { CATEGORIES } from '@/constants/categories';
import { getAllPosts } from '@/lib/posts';
import { normalizeCategorySlug } from '@/lib/utils';
import { SITE } from '@/constants/site';

export const metadata: Metadata = {
  title: '分类',
  description: `${SITE.name} 文章分类 - 按技术领域浏览`,
};

export default function CategoriesPage() {
  const posts = getAllPosts();

  const categoryCounts = new Map<string, number>();
  CATEGORIES.forEach((cat) => categoryCounts.set(cat.slug, 0));
  posts.forEach((p) => {
    const slug = normalizeCategorySlug(p.frontmatter.category);
    const current = categoryCounts.get(slug);
    if (current !== undefined) categoryCounts.set(slug, current + 1);
  });

  const activeCategories = CATEGORIES.filter(
    (cat) => (categoryCounts.get(cat.slug) || 0) > 0,
  );

  return (
    <div className="section-padding">
      <Container>
        <AnimatedSection>
          <h1 className="text-4xl font-bold tracking-tight mb-2">分类</h1>
          <p className="text-muted mb-12">按技术领域浏览文章</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeCategories.map((cat, i) => (
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
                    {categoryCounts.get(cat.slug)} 篇
                  </span>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  {cat.description}
                </p>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </div>
  );
}
