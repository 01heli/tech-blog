'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { useAuth } from './AuthProvider'
import { cn } from '@/lib/utils'

interface LoginModalProps {
  open: boolean
  onClose: () => void
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  const { login, sendCode } = useAuth()
  const router = useRouter()

  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setPhone('')
      setCode('')
      setCountdown(0)
      setError('')
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000)
    return () => clearInterval(timer)
  }, [countdown])

  const handleSendCode = useCallback(async () => {
    const trimmed = phone.replace(/\s/g, '')
    if (!/^(\+86)?1[3-9]\d{9}$/.test(trimmed)) {
      setError('请输入正确的手机号')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await sendCode(trimmed)
      if (res.success) {
        setCountdown(60)
      } else {
        setError(res.error || '发送失败')
      }
    } catch {
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }, [phone, sendCode])

  const handleSubmit = useCallback(async () => {
    if (code.length !== 6) {
      setError('请输入6位验证码')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await login(phone, code)
      if (res.success) {
        onClose()
        if (res.redirectTo) {
          router.push(res.redirectTo)
        }
      } else {
        setError(res.error || '登录失败')
      }
    } catch {
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }, [phone, code, login, onClose, router])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-black/5 dark:border-white/10 p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-muted"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-lg font-semibold mb-6">登录 / 注册</h2>

        {/* Phone input */}
        <label className="block text-sm font-medium text-muted mb-1.5">
          手机号
        </label>
        <input
          ref={inputRef}
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendCode()}
          placeholder="请输入手机号"
          className="w-full h-11 px-4 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent focus:border-blue-500 focus:bg-transparent outline-none text-sm transition-colors"
        />

        {/* Send code button */}
        <button
          onClick={handleSendCode}
          disabled={countdown > 0 || loading}
          className={cn(
            'mt-3 w-full h-11 rounded-xl text-sm font-medium transition-colors',
            countdown > 0
              ? 'bg-black/5 dark:bg-white/5 text-muted cursor-default'
              : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
          )}
        >
          {loading ? '发送中...' : countdown > 0 ? `${countdown}秒后可重发` : '发送验证码'}
        </button>

        {/* Code input */}
        <label className="block text-sm font-medium text-muted mt-4 mb-1.5">
          验证码
        </label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="请输入6位验证码"
          className="w-full h-11 px-4 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent focus:border-blue-500 focus:bg-transparent outline-none text-sm tracking-[0.25em] text-center transition-colors"
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading || code.length !== 6}
          className="mt-4 w-full h-11 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? '验证中...' : '登录'}
        </button>

        {/* Error */}
        {error && (
          <p className="mt-3 text-sm text-red-500 text-center">{error}</p>
        )}
      </div>
    </div>
  )
}
