import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/db/prisma'
import { sendSmsCode } from '@/lib/auth/sms'
import { checkRateLimit } from '@/lib/auth/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()

    if (!phone || !/^(\+86)?1[3-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { success: false, error: '手机号格式不正确' },
        { status: 400 }
      )
    }

    if (!checkRateLimit(`sms:${phone}`, 60_000)) {
      return NextResponse.json(
        { success: false, error: '发送过于频繁，请稍后再试' },
        { status: 429 }
      )
    }

    const code = crypto.randomInt(100000, 999999).toString()

    await prisma.smsCode.create({
      data: {
        phone,
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    })

    await sendSmsCode(phone, code)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Send code error:', error)
    return NextResponse.json(
      { success: false, error: '验证码发送失败，请稍后重试' },
      { status: 500 }
    )
  }
}
