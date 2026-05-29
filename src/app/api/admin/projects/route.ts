import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/session'
import { listProjects, createProject } from '@/lib/admin/projects'

export async function GET() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const projects = listProjects()
  return NextResponse.json({ projects })
}

export async function POST(request: Request) {
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

    const result = createProject({
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
