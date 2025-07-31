// shared/store/authStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';

// JWT 페이로드 타입 정의
interface JwtPayload {
  sub: string;        // 사용자 ID
  email: string;      // 이메일
  name: string;       // 이름
  role: string;       // 역할 (admin, user 등)
  iat: number;        // 발급 시간
  exp: number;        // 만료 시간
}

// 사용자 정보 타입
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

// 인증 응답 타입
interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface AuthState {
  // 상태
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;

  // 액션
  login: (email: string, password: string) => Promise<boolean>;
  loginWithTokens: (authResponse: AuthResponse) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  checkAuth: () => Promise<boolean>;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

// Storage 키 상수
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  USER_DATA: 'auth_user_data',
} as const;

export const useAuthStore = create<AuthState>((set, get) => ({
  // 초기 상태
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,

  // 로딩 상태 설정
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  // 이메일/비밀번호로 로그인
  login: async (email: string, password: string): Promise<boolean> => {
    try {
      set({ isLoading: true });

      // API 호출
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('로그인 실패');
      }

      const authResponse: AuthResponse = await response.json();
      await get().loginWithTokens(authResponse);
      
      return true;
    } catch (error) {
      console.error('로그인 오류:', error);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  // 토큰으로 로그인 (OAuth, 자동 로그인 등에 사용)
  loginWithTokens: async (authResponse: AuthResponse) => {
    try {
      const { accessToken, refreshToken, user } = authResponse;

      // JWT 토큰 유효성 검증
      const decodedToken = jwtDecode<JwtPayload>(accessToken);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        throw new Error('만료된 토큰');
      }

      // AsyncStorage에 저장
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
        AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
        AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user)),
      ]);

      // 상태 업데이트
      set({
        isAuthenticated: true,
        accessToken,
        refreshToken,
        user,
      });

    } catch (error) {
      console.error('토큰 로그인 실패:', error);
      await get().clearAuth();
      throw error;
    }
  },

  // 로그아웃
  logout: async () => {
    try {
      set({ isLoading: true });

      // 서버에 로그아웃 요청 (선택사항)
      const { accessToken } = get();
      if (accessToken) {
        try {
          await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (error) {
          console.warn('서버 로그아웃 실패:', error);
        }
      }

      // 로컬 데이터 정리
      await get().clearAuth();

    } catch (error) {
      console.error('로그아웃 오류:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // 액세스 토큰 갱신
  refreshAccessToken: async (): Promise<boolean> => {
    try {
      const { refreshToken } = get();
      
      if (!refreshToken) {
        throw new Error('리프레시 토큰이 없습니다');
      }

      // 리프레시 토큰 유효성 검증
      const decodedRefreshToken = jwtDecode<JwtPayload>(refreshToken);
      const currentTime = Date.now() / 1000;

      if (decodedRefreshToken.exp < currentTime) {
        throw new Error('리프레시 토큰이 만료되었습니다');
      }

      // 새로운 액세스 토큰 요청
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('토큰 갱신 실패');
      }

      const { accessToken: newAccessToken } = await response.json();

      // 새로운 액세스 토큰 저장
      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
      
      set({ accessToken: newAccessToken });
      
      return true;
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      // 리프레시 토큰도 만료된 경우 로그아웃
      await get().clearAuth();
      return false;
    }
  },

  // 인증 상태 확인 (앱 시작 시)
  checkAuth: async (): Promise<boolean> => {
    try {
      set({ isLoading: true });

      // AsyncStorage에서 데이터 가져오기
      const [accessToken, refreshToken, userData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
      ]);

      if (!accessToken || !refreshToken || !userData) {
        return false;
      }

      const user: User = JSON.parse(userData);

      // JWT 토큰 검증
      const decodedToken = jwtDecode<JwtPayload>(accessToken);
      const currentTime = Date.now() / 1000;

      // 액세스 토큰이 만료되었는지 확인
      if (decodedToken.exp < currentTime) {
        // 리프레시 토큰으로 갱신 시도
        const refreshSuccess = await get().refreshAccessToken();
        if (!refreshSuccess) {
          return false;
        }
      } else {
        // 유효한 토큰이면 상태 복원
        set({
          isAuthenticated: true,
          accessToken,
          refreshToken,
          user,
        });
      }

      return true;
    } catch (error) {
      console.error('인증 확인 실패:', error);
      await get().clearAuth();
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  // 인증 데이터 완전 삭제
  clearAuth: async () => {
    try {
      // AsyncStorage에서 모든 인증 데이터 삭제
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
      ]);

      // 상태 초기화
      set({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
      });
    } catch (error) {
      console.error('인증 데이터 삭제 실패:', error);
    }
  },
}));

// JWT 토큰 만료 체크 유틸리티 함수
export const isTokenExpired = (token: string): boolean => {
  try {
    const decodedToken = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch (error) {
    return true; // 토큰이 유효하지 않으면 만료된 것으로 간주
  }
};

// 토큰에서 사용자 정보 추출 유틸리티 함수
export const getUserFromToken = (token: string): User | null => {
  try {
    const decodedToken = jwtDecode<JwtPayload>(token);
    return {
      id: decodedToken.sub,
      email: decodedToken.email,
      name: decodedToken.name,
      role: decodedToken.role,
    };
  } catch (error) {
    return null;
  }
};

// HTTP 요청에 사용할 Authorization 헤더 생성
export const getAuthHeaders = (): Record<string, string> => {
  const { accessToken } = useAuthStore.getState();
  
  if (!accessToken) {
    return {};
  }

  return {
    'Authorization': `Bearer ${accessToken}`,
  };
};