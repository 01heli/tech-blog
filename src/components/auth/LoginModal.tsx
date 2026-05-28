'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { cn } from '@/lib/utils';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

type Step = 'phone' | 'code';

export function LoginModal({ open, onClose }: LoginModalProps) {
  const { sendCode, login } = useAuth();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setStep('phone');
    setPhone('');
    setCode('');
    setError('');
    setCountdown(0);
    setSending(false);
    setVerifying(false);
  }, []);

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open, step]);

  useEffect(() => {
    if (countdown === 0) return;
    timerRef.current = setInterval(() => {
      setCountdown((n) => {
        if (n <= 1) { clearInterval(timerRef.current); return 0; }
        return n - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [countdown]);

  const handleSendCode = async () => {
    if (!/^1\d{10}$/.test(phone)) {
      setError('请输入有效的11位手机号码');
      return;
    }
    setError('');
    setSending(true);
    const res = await sendCode(phone);
    setSending(false);
    if (res.success) {
      setStep('code');
      setCountdown(60);
    } else {
      setError(res.message);
    }
  };

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      setError('请输入6位验证码');
      return;
    }
    setError('');
    setVerifying(true);
    const res = await login(phone, code);
    setVerifying(false);
    if (res.success) {
      onClose();
      window.location.href = res.redirectTo || '/';
    } else {
      setError(res.message);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (step === 'phone') handleSendCode();
      else handleVerify();
    }
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">
              {step === 'phone' ? '手机号登录' : '输入验证码'}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {step === 'phone' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
                  手机号码
                </label>
                <input
                  ref={inputRef}
                  type="tel"
                  maxLength={11}
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setError(''); }}
                  onKeyDown={handleKeyDown}
                  placeholder="请输入11位手机号码"
                  className="w-full h-11 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                disabled={sending || phone.length !== 11}
                onClick={handleSendCode}
                className={cn(
                  'w-full h-11 rounded-xl text-sm font-medium transition-all',
                  'bg-blue-600 text-white hover:bg-blue-700',
                  'disabled:opacity-40 disabled:cursor-not-allowed'
                )}
              >
                {sending ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> 发送中...
                  </span>
                ) : (
                  '获取验证码'
                )}
              </button>
              <p className="text-xs text-zinc-400 text-center">
                未注册的手机号验证后将自动创建账号
              </p>
            </div>
          )}
          {step === 'code' && (
            <div className="space-y-4">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                验证码已发送至{' '}
                <span className="font-medium text-zinc-800 dark:text-zinc-200">{phone}</span>
              </p>
              <div>
                <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
                  验证码
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setError(''); }}
                  onKeyDown={handleKeyDown}
                  placeholder="请输入6位验证码"
                  className="w-full h-11 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent text-sm tracking-[0.3em] text-center outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                disabled={verifying || code.length !== 6}
                onClick={handleVerify}
                className={cn(
                  'w-full h-11 rounded-xl text-sm font-medium transition-all',
                  'bg-blue-600 text-white hover:bg-blue-700',
                  'disabled:opacity-40 disabled:cursor-not-allowed'
                )}
              >
                {verifying ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> 验证中...
                  </span>
                ) : (
                  '登录'
                )}
              </button>
              <div className="flex items-center justify-between text-sm">
                <button
                  onClick={() => setStep('phone')}
                  className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                >
                  更换手机号
                </button>
                <button
                  disabled={countdown > 0}
                  onClick={handleSendCode}
                  className={cn(
                    'text-blue-600 hover:text-blue-700 transition-colors',
                    'disabled:text-zinc-400 disabled:cursor-not-allowed'
                  )}
                >
                  {countdown > 0 ? `${countdown}s 后重发` : '重新发送'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
