'use client'

import { ArticleEditor } from '@/components/admin/ArticleEditor'

interface EditArticleFormProps {
  slug: string
  initial: {
    title: string
    description: string
    date: string
    category: string
    tags: string[]
    content: string
    featured: boolean
  }
}

export function EditArticleForm({ slug, initial }: EditArticleFormProps) {
  return <ArticleEditor initial={{ slug, ...initial }} />
}
