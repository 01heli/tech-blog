import { HeroSection } from '@/components/home/HeroSection';
import { QuickNav } from '@/components/home/QuickNav';
import { SiteStats } from '@/components/home/SiteStats';
import { CategoryQuickLinks } from '@/components/home/CategoryQuickLinks';
import { FeaturedArticle } from '@/components/home/FeaturedArticle';
import { ArticleGrid } from '@/components/home/ArticleGrid';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { Container } from '@/components/layout/Container';
import { getAllPosts } from '@/lib/posts';
import { withViewCounts } from '@/lib/views';

export const revalidate = 300; // ISR: home page view counts refresh every 5 min

export default async function Home() {
  const allPosts = await withViewCounts(getAllPosts());
  const featured = allPosts.filter((p) => p.frontmatter.featured).slice(0, 1);
  const recent = allPosts.slice(featured.length ? 1 : 0, 7);

  return (
    <>
      <HeroSection />

      {/* Quick Navigation Grid */}
      <section className="section-padding pb-0">
        <Container>
          <AnimatedSection>
            <p className="text-xs font-medium tracking-widest uppercase text-muted/60 mb-6">
              快速导航
            </p>
          </AnimatedSection>
          <QuickNav />
        </Container>
      </section>

      {/* Stats + Categories */}
      <section className="section-padding">
        <Container>
          <AnimatedSection>
            <SiteStats />
          </AnimatedSection>

          <AnimatedSection>
            <div className="mb-12 mt-16">
              <p className="text-xs font-medium tracking-widest uppercase text-muted/60 mb-3">
                探索分类
              </p>
              <CategoryQuickLinks />
            </div>
          </AnimatedSection>

          {featured[0] && (
            <AnimatedSection delay={0.1}>
              <div className="mb-16">
                <FeaturedArticle post={featured[0]} />
              </div>
            </AnimatedSection>
          )}

          <AnimatedSection delay={0.15}>
            <h2 className="text-xl font-semibold tracking-tight mb-8">
              最新文章
            </h2>
          </AnimatedSection>

          <ArticleGrid posts={recent} />
        </Container>
      </section>
    </>
  );
}
