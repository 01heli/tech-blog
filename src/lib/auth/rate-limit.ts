const rateLimitMap = new Map<string, number>()

export function checkRateLimit(key: string, windowMs: number): boolean {
  const now = Date.now()
  const last = rateLimitMap.get(key)
  if (last && now - last < windowMs) {
    return false
  }
  rateLimitMap.set(key, now)
  return true
}
