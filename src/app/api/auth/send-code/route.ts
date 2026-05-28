import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { sendSms, generateCode } from '@/lib/auth/sms';
import { checkRateLimit } from '@/lib/auth/rate-limit';
import type { SendCodeRequest, SendCodeResponse } from '@/types/auth';

export async function POST(request: NextRequest) {
  const { phone }: SendCodeRequest = await request.json();

  if (!phone || !/^\+?\d{8,15}$/.test(phone)) {
    return NextResponse.json<SendCodeResponse>(
      { success: false, message: '请输入有效的手机号码' },
      { status: 400 }
    );
  }

  if (!checkRateLimit(`send-code:${phone}`)) {
    return NextResponse.json<SendCodeResponse>(
      { success: false, message: '发送过于频繁，请60秒后再试' },
      { status: 429 }
    );
  }

  const code = generateCode();

  await prisma.smsCode.create({
    data: {
      phone,
      code,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    },
  });

  const sent = await sendSms(phone, code);
  if (!sent) {
    return NextResponse.json<SendCodeResponse>(
      { success: false, message: '短信发送失败，请稍后再试' },
      { status: 500 }
    );
  }

  return NextResponse.json<SendCodeResponse>({
    success: true,
    message: '验证码已发送',
  });
}
