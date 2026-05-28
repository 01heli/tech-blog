import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { PostFrontmatter } from '@/types/post'

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles')

export interface ArticleInput {
  title: string
  description: string
  date: string
  category: string
  tags: string[]
  content: string
  featured?: boolean
}

function ensureDir() {
  if (!fs.existsSync(ARTICLES_DIR)) {
    fs.mkdirSync(ARTICLES_DIR, { recursive: true })
  }
}

function slugFromTitle(title: string): string {
  const date = new Date().toISOString().slice(0, 10)
  const slug = title
    .toLowerCase()
    .replace(/[\s/\\]+/g, '-')
    .replace(/[^\w\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return `${date}-${slug}`
}

function serializeArticle(input: ArticleInput): string {
  const frontmatter: Record<string, unknown> = {
    title: input.title,
    description: input.description,
    date: input.date,
    category: input.category,
    tags: input.tags,
  }
  if (input.featured) frontmatter.featured = true

  const yaml = matter.stringify(input.content.trim(), frontmatter)
  return yaml
}

export function listArticles(): { slug: string; frontmatter: PostFrontmatter }[] {
  ensureDir()
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.mdx'))

  return files
    .map((filename) => {
      const raw = fs.readFileSync(path.join(ARTICLES_DIR, filename), 'utf-8')
      const { data } = matter(raw)
      return {
        slug: filename.replace(/\.mdx$/, ''),
        frontmatter: data as PostFrontmatter,
      }
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    )
}

export function getArticle(slug: string): { slug: string; frontmatter: PostFrontmatter; content: string } | null {
  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    slug,
    frontmatter: data as PostFrontmatter,
    content: content.trim(),
  }
}

export function createArticle(input: ArticleInput): { slug: string } {
  ensureDir()
  const slug = input.date
    ? `${input.date}-${slugFromTitle(input.title).replace(/^\d{4}-\d{2}-\d{2}-/, '')}`
    : slugFromTitle(input.title)

  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`)
  if (fs.existsSync(filePath)) {
    throw new Error(`Article slug "${slug}" already exists`)
  }

  const md = serializeArticle(input)
  fs.writeFileSync(filePath, md, 'utf-8')
  return { slug }
}

export function updateArticle(
  slug: string,
  input: ArticleInput
): { slug: string } {
  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) {
    throw new Error(`Article "${slug}" not found`)
  }

  const newSlug = input.date
    ? `${input.date}-${slugFromTitle(input.title).replace(/^\d{4}-\d{2}-\d{2}-/, '')}`
    : slug

  const md = serializeArticle(input)
  fs.writeFileSync(filePath, md, 'utf-8')

  if (newSlug !== slug) {
    const newPath = path.join(ARTICLES_DIR, `${newSlug}.mdx`)
    if (fs.existsSync(newPath)) {
      throw new Error(`Target slug "${newSlug}" already exists`)
    }
    fs.renameSync(filePath, newPath)
    return { slug: newSlug }
  }

  return { slug }
}

export function deleteArticle(slug: string): void {
  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) {
    throw new Error(`Article "${slug}" not found`)
  }
  fs.unlinkSync(filePath)
}
