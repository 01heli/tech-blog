import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { createSession } from '@/lib/auth/session'

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json()

    if (!phone || !code) {
      return NextResponse.json(
        { success: false, error: '手机号和验证码不能为空' },
        { status: 400 }
      )
    }

    const smsCode = await prisma.smsCode.findFirst({
      where: {
        phone,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!smsCode) {
      return NextResponse.json(
        { success: false, error: '验证码错误或已过期' },
        { status: 400 }
      )
    }

    await prisma.smsCode.update({
      where: { id: smsCode.id },
      data: { used: true },
    })

    let user = await prisma.user.findUnique({ where: { phone } })
    if (!user) {
      user = await prisma.user.create({ data: { phone } })
    }

    await createSession({
      userId: user.id,
      phone: user.phone,
      role: user.role,
    })

    const redirectTo = user.role === 'ADMIN' ? '/admin' : '/'

    return NextResponse.json({
      success: true,
      data: { redirectTo, userId: user.id, phone: user.phone, role: user.role },
    })
  } catch (error) {
    console.error('Verify code error:', error)
    return NextResponse.json(
      { success: false, error: '登录失败，请稍后重试' },
      { status: 500 }
    )
  }
}
