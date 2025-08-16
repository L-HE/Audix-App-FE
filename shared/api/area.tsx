// ============================================
// 📁 shared/api/area.tsx
// app-server의 /area/list 연결
// ============================================

import { BASE_URL } from './config';
import { tokenManager } from './auth';

// ============================================
// 타입 정의
// ============================================

// API 응답 타입
export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
    error?: string;
}

// API 에러 타입
export interface ApiError {
    status: number;
    message: string;
    details?: any;
}

// Area 항목 타입 (서버 응답 구조에 맞춤)
export interface AreaItem {
    id: number;
    name: string;
    address: string;
    explain: string;
    status: 'normal' | 'warning' | 'danger';
    image: string;
    created_at: string;
    updated_at: string;
}

// Area 목록 응답 타입
export type AreaListResponse = AreaItem[];

// ============================================
// Area API 클래스
// ============================================

class AreaApi {
    private baseURL: string;

    constructor(baseURL: string = BASE_URL) {
        this.baseURL = baseURL;
    }

    /**
     * Area 목록 조회 API 호출
     * @returns Promise<ApiResponse<AreaListResponse>>
     */
    async getAreaList(): Promise<ApiResponse<AreaListResponse>> {
        try {
            const url = `${this.baseURL}/area/list`;

            // 인증 토큰 확인
            const accessToken = tokenManager.getAccessToken();
            if (!accessToken) {
                return {
                    success: false,
                    data: [],
                    error: '인증 토큰이 없습니다. 다시 로그인해주세요.',
                };
            }

            console.log('📋 Area 목록 API 요청:', { url });

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            // HTTP 에러 체크
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                const apiError: ApiError = {
                    status: response.status,
                    message: errorData.message || `HTTP error! status: ${response.status}`,
                    details: errorData
                };

                console.error('❌ Area 목록 HTTP 에러:', apiError);

                return {
                    success: false,
                    data: [],
                    error: apiError.message,
                };
            }

            // 응답 파싱
            const result = await response.json();

            console.log('✅ Area 목록 응답 받음:', {
                statusCode: result.statusCode,
                message: result.message,
                dataLength: result.data?.length || 0,
            });

            // 서버 응답 구조 확인 (statusCode가 200-299 범위인지)
            if (result.statusCode >= 200 && result.statusCode < 300) {
                const areaList: AreaListResponse = result.data || [];

                return {
                    success: true,
                    data: areaList,
                    message: result.message || 'Area 목록 조회 성공',
                };
            } else {
                // 서버에서 에러 응답
                console.error('❌ Area 목록 서버 에러:', result);

                return {
                    success: false,
                    data: [],
                    error: result.message || 'Area 목록 조회 실패',
                };
            }

        } catch (error) {
            console.error('❌ Area 목록 네트워크 에러:', error);

            // 네트워크 에러 또는 기타 예외
            const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';

            return {
                success: false,
                data: [],
                error: errorMessage,
            };
        }
    }
}

// ============================================
// Export
// ============================================

// API 인스턴스 생성
export const areaApi = new AreaApi();

// 편의 함수 export
export const areaLogic = {
    /**
     * Area 목록 조회
     */
    getList: () => areaApi.getAreaList(),
};

// ============================================
// 사용 예시
// ============================================

/*
// 실제 서버 응답 예시:
{
  "statusCode": 200,
  "message": "구역 목록 조회 성공",
  "data": [
    {
      "id": 6,
      "name": "3공장 프레스 구역",
      "address": "KSEB 자동차 31 - 1",
      "explain": "KSEB 자동차 31 - 1",
      "status": "normal",
      "image": "/images/213d927d-b697-4b03-b82a-b96621e0469e.png",
      "created_at": "2025-08-16T08:05:18.063Z",
      "updated_at": "2025-08-16T08:05:18.063Z"
    },
    {
      "id": 7,
      "name": "차체 31라인",
      "address": "KSEB 자동차 31 - 2",
      "explain": "KSEB 자동차 31 - 2",
      "status": "normal",
      "image": "/images/1d54d2b6-57ab-4e57-8842-5a14e87a9c96.png",
      "created_at": "2025-08-16T08:06:10.308Z",
      "updated_at": "2025-08-16T08:06:10.308Z"
    },
    {
      "id": 8,
      "name": "도장 31라인",
      "address": "KSEB 자동차 31 - 3",
      "explain": "KSEB 자동차 31 - 3",
      "status": "warning",
      "image": "/images/51cc0102-32c6-48fb-acae-d2d149e63e58.png",
      "created_at": "2025-08-16T08:06:36.894Z",
      "updated_at": "2025-08-16T08:06:36.894Z"
    },
    {
      "id": 9,
      "name": "의장 31라인",
      "address": "KSEB 자동차 31 - 4",
      "explain": "KSEB 자동차 31 - 4",
      "status": "danger",
      "image": "/images/234fb48f-31b0-40f6-afb3-6f5aad8fe43e.png",
      "created_at": "2025-08-16T08:07:04.073Z",
      "updated_at": "2025-08-16T08:07:04.073Z"
    }
  ]
}

// 사용법:
import { areaLogic } from '@/api/area';

const loadAreaList = async () => {
  const result = await areaLogic.getList();
  
  if (result.success) {
    console.log('Area 목록 조회 성공!');
    console.log('Area 데이터:', result.data);
    
    // result.data는 AreaItem[] 타입
    result.data.forEach(area => {
      console.log(`${area.name} (${area.status}): ${area.address}`);
    });
  } else {
    console.error('Area 목록 조회 실패:', result.error);
  }
};
*/