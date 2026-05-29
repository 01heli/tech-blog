import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { ProjectFrontmatter } from '@/types/project'

const PROJECTS_DIR = path.join(process.cwd(), 'content', 'projects')

export interface ProjectInput {
  title: string
  description: string
  date: string
  status: string
  techStack: string[]
  github?: string
  demo?: string
  content: string
  featured?: boolean
}

function ensureDir() {
  if (!fs.existsSync(PROJECTS_DIR)) {
    fs.mkdirSync(PROJECTS_DIR, { recursive: true })
  }
}

function slugFromTitle(title: string, date: string): string {
  const base = title
    .toLowerCase()
    .replace(/[\s/\\]+/g, '-')
    .replace(/[^\w\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return `${date}-${base}`.replace(/-$/, '')
}

function serializeProject(input: ProjectInput): string {
  const frontmatter: Record<string, unknown> = {
    title: input.title,
    description: input.description,
    date: input.date,
    status: input.status,
    techStack: input.techStack,
  }
  if (input.github) frontmatter.github = input.github
  if (input.demo) frontmatter.demo = input.demo
  if (input.featured) frontmatter.featured = true

  return matter.stringify(input.content.trim(), frontmatter)
}

export function listProjects(): { slug: string; frontmatter: ProjectFrontmatter }[] {
  ensureDir()
  const files = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith('.mdx'))

  return files
    .map((filename) => {
      const raw = fs.readFileSync(path.join(PROJECTS_DIR, filename), 'utf-8')
      const { data } = matter(raw)
      return {
        slug: filename.replace(/\.mdx$/, ''),
        frontmatter: data as ProjectFrontmatter,
      }
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    )
}

export function getProject(slug: string): { slug: string; frontmatter: ProjectFrontmatter; content: string } | null {
  const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    slug,
    frontmatter: data as ProjectFrontmatter,
    content: content.trim(),
  }
}

export function createProject(input: ProjectInput): { slug: string } {
  ensureDir()
  const slug = slugFromTitle(input.title, input.date)
  if (!slug) throw new Error('项目名称无效，请使用至少一个英文字母或数字')

  const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`)
  if (fs.existsSync(filePath)) {
    throw new Error(`项目 "${slug}" 已存在`)
  }

  const md = serializeProject(input)
  fs.writeFileSync(filePath, md, 'utf-8')
  return { slug }
}

export function updateProject(
  slug: string,
  input: ProjectInput
): { slug: string } {
  const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) {
    throw new Error(`项目 "${slug}" 不存在`)
  }

  const newSlug = slugFromTitle(input.title, input.date)
  if (!newSlug) throw new Error('项目名称无效，请使用至少一个英文字母或数字')

  const md = serializeProject(input)
  fs.writeFileSync(filePath, md, 'utf-8')

  if (newSlug !== slug) {
    const newPath = path.join(PROJECTS_DIR, `${newSlug}.mdx`)
    if (fs.existsSync(newPath)) {
      throw new Error(`目标标识 "${newSlug}" 已存在`)
    }
    fs.renameSync(filePath, newPath)
    return { slug: newSlug }
  }

  return { slug }
}

export function deleteProject(slug: string): void {
  const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) {
    throw new Error(`项目 "${slug}" 不存在`)
  }
  fs.unlinkSync(filePath)
}
