'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { ImagePasteTextarea } from './ImagePasteTextarea'

const STATUSES = ['进行中', '已完成', '维护中', '已暂停', '已取消']

interface ProjectData {
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

interface ProjectEditorProps {
  initial?: ProjectData & { slug?: string }
}

export function ProjectEditor({ initial }: ProjectEditorProps) {
  const router = useRouter()
  const isEditing = !!initial?.slug

  const [title, setTitle] = useState(initial?.title || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [date, setDate] = useState(
    initial?.date || new Date().toISOString().slice(0, 10)
  )
  const [status, setStatus] = useState(initial?.status || '进行中')
  const [techStackInput, setTechStackInput] = useState(
    initial?.techStack?.join(', ') || ''
  )
  const [github, setGithub] = useState(initial?.github || '')
  const [demo, setDemo] = useState(initial?.demo || '')
  const [content, setContent] = useState(initial?.content || '')
  const [featured, setFeatured] = useState(initial?.featured || false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = useCallback(async () => {
    if (!title || !description || !date || !status || !content) {
      setError('请填写所有必填字段')
      return
    }

    setError('')
    setSaving(true)

    const body = {
      title,
      description,
      date,
      status,
      techStack: techStackInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      github: github.trim(),
      demo: demo.trim(),
      content,
      featured,
    }

    try {
      const url = isEditing
        ? `/api/admin/projects/${initial!.slug}`
        : '/api/admin/projects'

      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/admin/projects')
        router.refresh()
      } else {
        setError(data.error || '保存失败')
      }
    } catch {
      setError('网络错误，请稍后重试')
    } finally {
      setSaving(false)
    }
  }, [
    title, description, date, status, techStackInput,
    github, demo, content, featured, isEditing, initial, router,
  ])

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push('/admin/projects')}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-muted"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-2xl font-bold">
          {isEditing ? '编辑项目' : '新建项目'}
        </h1>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              项目名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="项目名称"
              className="w-full h-10 px-3 rounded-lg border border-black/10 dark:border-white/10 bg-transparent text-sm outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              开始日期 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-black/10 dark:border-white/10 bg-transparent text-sm outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              状态 <span className="text-red-500">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-black/10 dark:border-white/10 bg-transparent text-sm outline-none focus:border-blue-500 transition-colors"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">技术栈</label>
            <input
              type="text"
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
              placeholder="用逗号分隔，如: Next.js, TypeScript, Docker"
              className="w-full h-10 px-3 rounded-lg border border-black/10 dark:border-white/10 bg-transparent text-sm outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">GitHub</label>
            <input
              type="url"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="https://github.com/xxx/xxx"
              className="w-full h-10 px-3 rounded-lg border border-black/10 dark:border-white/10 bg-transparent text-sm outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">在线演示</label>
            <input
              type="url"
              value={demo}
              onChange={(e) => setDemo(e.target.value)}
              placeholder="https://xxx.com"
              className="w-full h-10 px-3 rounded-lg border border-black/10 dark:border-white/10 bg-transparent text-sm outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            项目简介 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="简短描述项目的功能和目标"
            className="w-full h-10 px-3 rounded-lg border border-black/10 dark:border-white/10 bg-transparent text-sm outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="rounded"
          />
          在首页精选展示
        </label>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            工作日志 (Markdown) <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-muted mb-2">
            用 ## YYYY-MM-DD 作为每天的标题，记录当天工作内容
          </p>
          <ImagePasteTextarea
            value={content}
            onChange={setContent}
            placeholder={`## 2026-06-03
- 完成的功能
- 修复的 bug
- 耗时：4h

## 2026-06-01
- 项目初始化
`}
            rows={24}
            className="w-full px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-transparent text-sm outline-none focus:border-blue-500 transition-colors font-mono leading-relaxed resize-y"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 h-10 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? '保存中...' : '保存'}
          </button>
          <button
            onClick={() => router.push('/admin/projects')}
            className="px-6 h-10 rounded-lg border border-black/10 dark:border-white/10 text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  )
}
