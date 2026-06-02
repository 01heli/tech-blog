import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/session'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: '未提供文件' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: '仅支持图片格式' }, { status: 400 })
    }

    const MAX_SIZE = 10 * 1024 * 1024 // 10MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: '图片大小不能超过 10MB' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'png'
    const name = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`

    const uploadsDir = path.join(process.cwd(), 'public', 'images')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    fs.writeFileSync(path.join(uploadsDir, name), buffer)

    const url = `/images/${name}`
    return NextResponse.json({ url, name })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '上传失败' },
      { status: 500 }
    )
  }
}
