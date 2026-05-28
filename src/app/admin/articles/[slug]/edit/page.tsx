import { notFound } from 'next/navigation'
import { getArticle } from '@/lib/admin/articles'
import { EditArticleForm } from './EditArticleForm'

interface PageProps {
  params: { slug: string }
}

export default async function EditArticlePage({ params }: PageProps) {
  const article = getArticle(params.slug)
  if (!article) notFound()

  return (
    <EditArticleForm
      slug={article.slug}
      initial={{
        title: article.frontmatter.title,
        description: article.frontmatter.description,
        date: article.frontmatter.date,
        category: article.frontmatter.category,
        tags: article.frontmatter.tags,
        content: article.content,
        featured: article.frontmatter.featured || false,
      }}
    />
  )
}
