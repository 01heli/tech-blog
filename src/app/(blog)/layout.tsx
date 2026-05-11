import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/shared/ScrollToTop';
import { SearchProvider } from '@/components/search/SearchProvider';
import { getAllPosts } from '@/lib/posts';
import { buildSearchIndex } from '@/lib/search';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const posts = getAllPosts();
  const searchIndex = buildSearchIndex(posts);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />
      <ScrollToTop />
      <SearchProvider index={searchIndex} />
    </>
  );
}
