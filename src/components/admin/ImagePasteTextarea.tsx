'use client'

import { useState, useRef, useCallback, type ClipboardEvent } from 'react'

interface ImagePasteTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string
  onChange: (value: string) => void
}

export function ImagePasteTextarea({
  value,
  onChange,
  ...textareaProps
}: ImagePasteTextareaProps) {
  const [uploading, setUploading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handlePaste = useCallback(
    async (e: ClipboardEvent<HTMLTextAreaElement>) => {
      const items = e.clipboardData?.items
      if (!items) return

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault()

          const file = item.getAsFile()
          if (!file) continue

          setUploading(true)
          try {
            const formData = new FormData()
            formData.append('file', file)

            const res = await fetch('/api/admin/upload', {
              method: 'POST',
              body: formData,
            })

            const data = await res.json()

            if (res.ok && data.url) {
              const label = file.name || 'image'
              const markdown = `![${label}](${data.url})`

              const textarea = textareaRef.current
              if (textarea) {
                const start = textarea.selectionStart
                const end = textarea.selectionEnd
                const newValue =
                  value.slice(0, start) + markdown + value.slice(end)
                onChange(newValue)

                // 光标移到插入文本之后
                requestAnimationFrame(() => {
                  textarea.selectionStart = textarea.selectionEnd =
                    start + markdown.length
                  textarea.focus()
                })
              }
            }
          } catch {
            // 上传失败时静默忽略，不干扰正常粘贴
          } finally {
            setUploading(false)
          }
          break
        }
      }
    },
    [value, onChange]
  )

  return (
    <div className="relative">
      {uploading && (
        <div className="absolute top-2 right-2 z-10 text-xs text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md animate-pulse">
          上传中...
        </div>
      )}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onPaste={handlePaste}
        {...textareaProps}
      />
    </div>
  )
}
