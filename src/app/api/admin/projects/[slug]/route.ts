import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/session'
import { getProject, updateProject, deleteProject } from '@/lib/admin/projects'

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const project = getProject(params.slug)
  if (!project) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ project })
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { title, description, date, status, techStack, github, demo, content, featured } = body

    if (!title || !description || !date || !status || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const result = updateProject(params.slug, {
      title,
      description,
      date,
      status,
      techStack: techStack || [],
      github: github || '',
      demo: demo || '',
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

export async function DELETE(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    deleteProject(params.slug)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 }
    )
  }
}
