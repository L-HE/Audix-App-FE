import { BASE_URL } from './config';

// Area 타입 정의
export interface Area {
    id: number;
    name: string;
    address: string;
    explain: string;
    status: string;
    created_at: string;
    updated_at: string;
    image: string | null;
}

// ✅ 타임아웃 포함 fetch 함수
const fetchWithTimeout = async (url: string, timeout = 3000): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
};

// Area 목록 가져오기
export const getAreaList = async (): Promise<Area[]> => {
    try {
        console.log('🌐 Area 목록 요청 중...');

        const response = await fetchWithTimeout(`${BASE_URL}/admin/area/list`, 3000);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Area[] = await response.json();
        console.log('✅ Area 목록 받아오기 성공:', data);

        return data;
    } catch (error) {
        console.error('❌ Area 목록 요청 실패:', error);
        throw error;
    }
};
