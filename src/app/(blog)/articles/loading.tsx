import { Container } from '@/components/layout/Container';
import { ArticleCardSkeleton } from '@/components/ui/Skeleton';

export default function ArticlesLoading() {
  return (
    <div className="section-padding">
      <Container>
        <div className="mb-12">
          <div className="h-10 w-32 bg-black/5 dark:bg-white/10 rounded-xl animate-pulse mb-2" />
          <div className="h-5 w-64 bg-black/5 dark:bg-white/10 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      </Container>
    </div>
  );
}
