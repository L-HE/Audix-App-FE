// ============================================
// 📁 shared/api/auth.ts
// app-server의 /auth/login 연결만 구현
// ============================================

import { BASE_URL } from './config';

// 실제 프로젝트에 맞춘 타입 정의
export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
    error?: string;
}

export interface ApiError {
    status: number;
    message: string;
    details?: any;
}

// 간단한 토큰 매니저
class TokenManager {
    private accessToken: string | null = null;
    private refreshToken: string | null = null;

    setTokens(accessToken: string, refreshToken?: string) {
        this.accessToken = accessToken;
        if (refreshToken) {
            this.refreshToken = refreshToken;
        }
    }

    getAccessToken(): string | null {
        return this.accessToken;
    }

    getRefreshToken(): string | null {
        return this.refreshToken;
    }

    clearTokens() {
        this.accessToken = null;
        this.refreshToken = null;
    }

    hasValidToken(): boolean {
        return !!this.accessToken;
    }
}

export const tokenManager = new TokenManager();

// ============================================
// 타입 정의
// ============================================

// 로그인 요청 타입
export interface LoginRequest {
    loginCode: string;
    password: string;
}

// 서버 응답에서 받는 사용자 정보 타입 (실제 응답 구조에 맞춤)
export interface ServerUser {
    id: number;
    team_id: number;
    login_code: string;
    password: string; // 해시된 패스워드 (보안상 클라이언트에서는 사용하지 않음)
    name: string;
    email: string;
    phone: string;
    position: string;
    is_active: boolean;
    refresh_token: string; // 서버에서 함께 제공되는 refresh_token
    created_at: string;
    updated_at: string;
}

// 로그인 응답 타입
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: ServerUser;
}

// ============================================
// Auth API 클래스
// ============================================

class AuthApi {
    private baseURL: string;

    constructor(baseURL: string = BASE_URL) {
        this.baseURL = baseURL;
    }

    /**
     * 로그인 API 호출
     * @param credentials 로그인 정보 (loginCode, password)
     * @returns Promise<ApiResponse<LoginResponse>>
     */
    async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        try {
            const url = `${this.baseURL}/auth/login`;

            console.log('🔐 로그인 API 요청:', {
                url,
                loginCode: credentials.loginCode,
                password: '***' // 패스워드는 로그에 남기지 않음
            });

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            // HTTP 에러 체크
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                const apiError: ApiError = {
                    status: response.status,
                    message: errorData.message || `HTTP error! status: ${response.status}`,
                    details: errorData
                };

                console.error('❌ 로그인 HTTP 에러:', apiError);

                return {
                    success: false,
                    data: null as any,
                    error: apiError.message,
                };
            }

            // 응답 파싱
            const result = await response.json();

            console.log('✅ 로그인 응답 받음:', {
                statusCode: result.statusCode,
                message: result.message,
                hasAccessToken: !!result.data?.accessToken,
                hasRefreshToken: !!result.data?.refreshToken,
                hasUser: !!result.data?.user,
                userId: result.data?.user?.id,
                userName: result.data?.user?.name,
            });

            // 서버 응답 구조 확인 (statusCode가 200-299 범위인지)
            if (result.statusCode >= 200 && result.statusCode < 300) {
                const loginData: LoginResponse = result.data;

                // 토큰 저장
                if (loginData.accessToken) {
                    tokenManager.setTokens(loginData.accessToken, loginData.refreshToken);
                    console.log('🔑 토큰 저장 완료');
                }

                return {
                    success: true,
                    data: loginData,
                    message: result.message || '로그인 성공',
                };
            } else {
                // 서버에서 에러 응답
                console.error('❌ 서버 에러 응답:', result);

                return {
                    success: false,
                    data: null as any,
                    error: result.message || '로그인 실패',
                };
            }

        } catch (error) {
            console.error('❌ 로그인 네트워크 에러:', error);

            // 네트워크 에러 또는 기타 예외
            const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';

            return {
                success: false,
                data: null as any,
                error: errorMessage,
            };
        }
    }
}

// ============================================
// Export
// ============================================

// API 인스턴스 생성
export const authApi = new AuthApi();

// 편의 함수 export (login만)
export const authLogic = {
    /**
     * 로그인
     */
    login: (credentials: LoginRequest) => authApi.login(credentials),
};

// ============================================
// 사용 예시
// ============================================

/*
// 실제 서버 응답 예시:
{
  "statusCode": 200,
  "message": "로그인 성공",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "team_id": 1,
      "login_code": "123456",
      "password": "$2b$10$BAW/fkQmiofuUkES75oirOCIC7/O3Jjyfgg4QBVfrVMoumVjZPZWW",
      "name": "김재걸",
      "email": "KSEB1234@naver.com",
      "phone": "01055921087",
      "position": "팀장",
      "is_active": true,
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "created_at": "2025-08-14T08:01:38.721Z",
      "updated_at": "2025-08-14T08:01:38.721Z"
    }
  }
}

// 사용법:
import { authLogic } from '@/api/auth';

const handleLogin = async () => {
  const result = await authLogic.login({
    loginCode: '123456',
    password: '1234'
  });
  
  if (result.success) {
    console.log('로그인 성공!');
    console.log('사용자 정보:', result.data.user);
    console.log('액세스 토큰:', result.data.accessToken);
  } else {
    console.error('로그인 실패:', result.error);
  }
};
*/