import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { createSession } from '@/lib/auth/session';
import type { VerifyCodeRequest, VerifyCodeResponse } from '@/types/auth';

export async function POST(request: NextRequest) {
  const { phone, code }: VerifyCodeRequest = await request.json();

  if (!phone || !code) {
    return NextResponse.json<VerifyCodeResponse>(
      { success: false, message: '手机号和验证码不能为空' },
      { status: 400 }
    );
  }

  const smsCode = await prisma.smsCode.findFirst({
    where: { phone, code, used: false },
    orderBy: { createdAt: 'desc' },
  });

  if (!smsCode || smsCode.expiresAt < new Date()) {
    return NextResponse.json<VerifyCodeResponse>(
      { success: false, message: '验证码无效或已过期' },
      { status: 400 }
    );
  }

  // Mark code as used
  await prisma.smsCode.update({ where: { id: smsCode.id }, data: { used: true } });

  // Upsert user (auto-register on first login)
  const user = await prisma.user.upsert({
    where: { phone },
    update: {},
    create: { phone, role: 'READER' },
  });

  await createSession({ userId: user.id, phone: user.phone, role: user.role as 'ADMIN' | 'READER' });

  const redirectTo = user.role === 'ADMIN' ? '/admin' : '/';

  return NextResponse.json<VerifyCodeResponse>({
    success: true,
    message: '登录成功',
    redirectTo,
  });
}
