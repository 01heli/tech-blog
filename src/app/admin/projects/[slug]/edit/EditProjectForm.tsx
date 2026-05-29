'use client'

import { ProjectEditor } from '@/components/admin/ProjectEditor'

interface EditProjectFormProps {
  slug: string
  initial: {
    title: string
    description: string
    date: string
    status: string
    techStack: string[]
    github: string
    demo: string
    content: string
    featured: boolean
  }
}

export function EditProjectForm({ slug, initial }: EditProjectFormProps) {
  return <ProjectEditor initial={{ slug, ...initial }} />
}
