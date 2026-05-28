export interface SessionData {
  userId: string;
  phone: string;
  role: 'READER' | 'ADMIN';
}

export interface SendCodeRequest {
  phone: string;
}

export interface SendCodeResponse {
  success: boolean;
  message: string;
}

export interface VerifyCodeRequest {
  phone: string;
  code: string;
}

export interface VerifyCodeResponse {
  success: boolean;
  message: string;
  redirectTo?: string;
}

export interface MeResponse {
  loggedIn: boolean;
  user?: {
    phone: string;
    role: string;
  };
}
