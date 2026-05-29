import { notFound } from 'next/navigation'
import { getProject } from '@/lib/admin/projects'
import { EditProjectForm } from './EditProjectForm'

interface PageProps {
  params: { slug: string }
}

export default async function EditProjectPage({ params }: PageProps) {
  const project = getProject(params.slug)
  if (!project) notFound()

  return (
    <EditProjectForm
      slug={project.slug}
      initial={{
        title: project.frontmatter.title,
        description: project.frontmatter.description,
        date: project.frontmatter.date,
        status: project.frontmatter.status,
        techStack: project.frontmatter.techStack,
        github: project.frontmatter.github || '',
        demo: project.frontmatter.demo || '',
        content: project.content,
        featured: project.frontmatter.featured || false,
      }}
    />
  )
}
