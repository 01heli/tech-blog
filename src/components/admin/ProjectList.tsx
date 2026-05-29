'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Plus } from 'lucide-react'
import type { ProjectFrontmatter } from '@/types/project'

interface ProjectItem {
  slug: string
  frontmatter: ProjectFrontmatter
}

const statusStyles: Record<string, string> = {
  '进行中': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  '已完成': 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  '维护中': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  '已暂停': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  '已取消': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export function ProjectList() {
  const router = useRouter()
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/projects')
      if (res.ok) {
        const data = await res.json()
        setProjects(data.projects)
      } else {
        setError('加载失败')
      }
    } catch {
      setError('网络错误')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleDelete = useCallback(
    async (slug: string) => {
      if (!confirm('确定要删除这个项目吗？此操作不可撤销。')) return

      try {
        const res = await fetch(`/api/admin/projects/${slug}`, {
          method: 'DELETE',
        })
        if (res.ok) {
          setProjects((prev) => prev.filter((p) => p.slug !== slug))
          router.refresh()
        } else {
          const data = await res.json()
          alert(data.error || '删除失败')
        }
      } catch {
        alert('网络错误')
      }
    },
    [router]
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-muted">加载中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">项目管理</h1>
          <p className="text-muted text-sm mt-1">共 {projects.length} 个项目</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-4 h-10 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          新建项目
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-24 text-muted">
          <p className="text-lg mb-2">还没有项目</p>
          <p className="text-sm">点击&ldquo;新建项目&rdquo;开始记录</p>
        </div>
      ) : (
        <div className="border border-black/5 dark:border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
                <th className="text-left px-5 py-3 font-medium text-muted">
                  项目名称
                </th>
                <th className="text-left px-5 py-3 font-medium text-muted hidden md:table-cell">
                  状态
                </th>
                <th className="text-left px-5 py-3 font-medium text-muted hidden lg:table-cell">
                  技术栈
                </th>
                <th className="text-left px-5 py-3 font-medium text-muted hidden sm:table-cell">
                  日期
                </th>
                <th className="text-right px-5 py-3 font-medium text-muted">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.slug}
                  className="border-b border-black/5 dark:border-white/10 last:border-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-3">
                    <div className="max-w-md">
                      <p className="font-medium truncate">
                        {project.frontmatter.title}
                      </p>
                      <p className="text-xs text-muted truncate mt-0.5">
                        {project.frontmatter.description}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[project.frontmatter.status] || ''}`}
                    >
                      {project.frontmatter.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {project.frontmatter.techStack?.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="inline-block px-1.5 py-0.5 rounded text-xs bg-black/5 dark:bg-white/5 text-muted"
                        >
                          {tech}
                        </span>
                      ))}
                      {(project.frontmatter.techStack?.length || 0) > 3 && (
                        <span className="text-xs text-muted">
                          +{project.frontmatter.techStack.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted hidden sm:table-cell whitespace-nowrap">
                    {project.frontmatter.date}
                  </td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/projects/${project.slug}/edit`}
                        className="w-8 h-8 inline-flex items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-muted"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(project.slug)}
                        className="w-8 h-8 inline-flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors text-muted hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
