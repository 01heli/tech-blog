import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/session'
import { listArticles, createArticle } from '@/lib/admin/articles'

export async function GET() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const articles = listArticles()
  return NextResponse.json({ articles })
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { title, description, date, category, tags, content, featured } = body

    if (!title || !description || !date || !category || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const result = createArticle({
      title,
      description,
      date,
      category,
      tags: tags || [],
      content,
      featured: featured || false,
    })

    return NextResponse.json({ success: true, ...result })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 }
    )
  }
}
