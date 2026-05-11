import { HeroSection } from '@/components/home/HeroSection';
import { CategoryQuickLinks } from '@/components/home/CategoryQuickLinks';
import { FeaturedArticle } from '@/components/home/FeaturedArticle';
import { ArticleGrid } from '@/components/home/ArticleGrid';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { Container } from '@/components/layout/Container';
import { getAllPosts, getFeaturedPosts } from '@/lib/posts';

export default function Home() {
  const allPosts = getAllPosts();
  const featured = getFeaturedPosts(1);
  const recent = allPosts.slice(featured.length, 7);

  return (
    <>
      <HeroSection />

      <section className="section-padding">
        <Container>
          <AnimatedSection>
            <div className="mb-12">
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
