export interface SessionData {
  userId: string
  phone: string
  role: string
}

export interface SendCodeRequest {
  phone: string
}

export interface VerifyCodeRequest {
  phone: string
  code: string
}

export interface ApiResponse<T = void> {
  success: boolean
  data?: T
  error?: string
}
