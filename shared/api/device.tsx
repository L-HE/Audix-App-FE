// ============================================
// 📁 shared/api/device.tsx
// app-server의 /device/list/:areaId 연결
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

// Device Parts 타입
export interface DeviceParts {
    gearbox: number;
    bearing: number;
    fan: number;
    slider: number;
    pump: number;
}

// Device 항목 타입 (서버 응답 구조에 맞춤)
export interface DeviceItem {
    deviceId: number;
    areaId: number;
    name: string;
    model: string;
    address: string;
    deviceManager: string;
    parts: DeviceParts;
    normalScore: number;
    image: string;
    status: 'normal' | 'warning' | 'danger';
    aiText: string;
}

// Device 목록 응답 타입
export type DeviceListResponse = DeviceItem[];

// ============================================
// Device API 클래스
// ============================================

class DeviceApi {
    private baseURL: string;

    constructor(baseURL: string = BASE_URL) {
        this.baseURL = baseURL;
    }

    /**
     * 특정 Area의 Device 목록 조회 API 호출
     * @param areaId Area ID
     * @returns Promise<ApiResponse<DeviceListResponse>>
     */
    async getDevicesByArea(areaId: number): Promise<ApiResponse<DeviceListResponse>> {
        try {
            const url = `${this.baseURL}/device/list/${areaId}`;

            // 인증 토큰 확인
            const accessToken = tokenManager.getAccessToken();
            if (!accessToken) {
                return {
                    success: false,
                    data: [],
                    error: '인증 토큰이 없습니다. 다시 로그인해주세요.',
                };
            }

            console.log('🔧 Device 목록 API 요청:', { url, areaId });

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

                console.error('❌ Device 목록 HTTP 에러:', apiError);

                return {
                    success: false,
                    data: [],
                    error: apiError.message,
                };
            }

            // 응답 파싱
            const result = await response.json();

            console.log('✅ Device 목록 응답 받음:', {
                statusCode: result.statusCode,
                message: result.message,
                dataLength: result.data?.length || 0,
                areaId,
            });

            // 서버 응답 구조 확인 (statusCode가 200-299 범위인지)
            if (result.statusCode >= 200 && result.statusCode < 300) {
                const deviceList: DeviceListResponse = result.data || [];

                return {
                    success: true,
                    data: deviceList,
                    message: result.message || 'Device 목록 조회 성공',
                };
            } else {
                // 서버에서 에러 응답
                console.error('❌ Device 목록 서버 에러:', result);

                return {
                    success: false,
                    data: [],
                    error: result.message || 'Device 목록 조회 실패',
                };
            }

        } catch (error) {
            console.error('❌ Device 목록 네트워크 에러:', error);

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
export const deviceApi = new DeviceApi();

// 편의 함수 export
export const deviceLogic = {
    /**
     * 특정 Area의 Device 목록 조회
     */
    getListByArea: (areaId: number) => deviceApi.getDevicesByArea(areaId),
};

// ============================================
// 사용 예시
// ============================================

/*
// 실제 서버 응답 예시:
{
  "statusCode": 200,
  "message": "디바이스 목록 조회 성공",
  "data": [
    {
      "deviceId": 48,
      "areaId": 6,
      "name": "FAGOR-UCR-2003",
      "model": "코일 언코일러 FAGOR-UCR",
      "address": "3공장 프레스 구역 - 3",
      "deviceManager": "이하은",
      "parts": {
        "gearbox": 0.8,
        "bearing": 0.8,
        "fan": 0.8,
        "slider": 0.8,
        "pump": 0.8
      },
      "normalScore": 0.8,
      "image": "/images/fbcbdf1f-a773-404f-b708-e7255881231b.png",
      "status": "normal",
      "aiText": ""
    },
    // ... 더 많은 장비들
  ]
}

// 사용법:
import { deviceLogic } from '@/api/device';

const loadDeviceList = async (areaId: number) => {
  const result = await deviceLogic.getListByArea(areaId);
  
  if (result.success) {
    console.log('Device 목록 조회 성공!');
    console.log('Device 데이터:', result.data);
    
    // result.data는 DeviceItem[] 타입
    result.data.forEach(device => {
      console.log(`${device.name} (${device.status}): ${device.normalScore}`);
    });
  } else {
    console.error('Device 목록 조회 실패:', result.error);
  }
};

// Area ID 6번의 장비 목록 조회
await loadDeviceList(6);
*/