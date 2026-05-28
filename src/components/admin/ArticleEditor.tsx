'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

const CATEGORIES = [
  'MySQL', 'Redis', 'Docker', 'Linux', 'Go', 'Python',
  'Kubernetes', 'System Design', 'DevOps', 'Frontend',
]

interface ArticleData {
  title: string
  description: string
  date: string
  category: string
  tags: string[]
  content: string
  featured: boolean
}

interface ArticleEditorProps {
  initial?: ArticleData & { slug?: string }
}

export function ArticleEditor({ initial }: ArticleEditorProps) {
  const router = useRouter()
  const isEditing = !!initial?.slug

  const [title, setTitle] = useState(initial?.title || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [date, setDate] = useState(
    initial?.date || new Date().toISOString().slice(0, 10)
  )
  const [category, setCategory] = useState(initial?.category || 'MySQL')
  const [tagsInput, setTagsInput] = useState(initial?.tags?.join(', ') || '')
  const [content, setContent] = useState(initial?.content || '')
  const [featured, setFeatured] = useState(initial?.featured || false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = useCallback(async () => {
    if (!title || !description || !date || !category || !content) {
      setError('请填写所有必填字段')
      return
    }

    setError('')
    setSaving(true)

    const body = {
      title,
      description,
      date,
      category,
      tags: tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      content,
      featured,
    }

    try {
      const url = isEditing
        ? `/api/admin/articles/${initial!.slug}`
        : '/api/admin/articles'

      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/admin')
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
    title, description, date, category, tagsInput,
    content, featured, isEditing, initial, router,
  ])

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push('/admin')}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-muted"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-2xl font-bold">
          {isEditing ? '编辑文章' : '新建文章'}
        </h1>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="文章标题"
              className="w-full h-10 px-3 rounded-lg border border-black/10 dark:border-white/10 bg-transparent text-sm outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              日期 <span className="text-red-500">*</span>
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
              分类 <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-black/10 dark:border-white/10 bg-transparent text-sm outline-none focus:border-blue-500 transition-colors"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">标签</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="用逗号分隔，如: mysql, 索引, B+Tree"
              className="w-full h-10 px-3 rounded-lg border border-black/10 dark:border-white/10 bg-transparent text-sm outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            摘要 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="文章简介，用于列表展示和SEO"
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
            正文 (Markdown) <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="使用 Markdown 编写文章内容..."
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
            onClick={() => router.push('/admin')}
            className="px-6 h-10 rounded-lg border border-black/10 dark:border-white/10 text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  )
}
