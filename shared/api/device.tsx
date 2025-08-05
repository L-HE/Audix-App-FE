// shared/api/device.ts
import { BASE_URL } from './config';

// Redis의 DeviceDataInRedis 인터페이스와 동일하게 정의
export interface DeviceDataInRedis {
    deviceId: number;
    areaId?: number;
    explain: string;
    name: string;
    address: string;
    status: string;
    deviceManager?: string;
    image?: string;
    normalScore: number;
}

// areaId로 Redis에서 device 목록 조회
export const getDevicesByAreaIdFromRedis = async (areaId: number): Promise<DeviceDataInRedis[]> => {
    try {
        console.log(`🔍 Fetching devices from Redis for area ${areaId}...`);
        const response = await fetch(`${BASE_URL}/admin/device/redis/area/${areaId}`);

        if (!response.ok) {
            if (response.status === 404) {
                console.log(`⚠️ No devices found for area ${areaId}`);
                return []; // 404는 에러가 아닌 빈 배열 반환
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`✅ Received ${data.length} devices from Redis for area ${areaId}`);
        return data;
    } catch (error) {
        console.error('❌ Error fetching devices from Redis:', error);
        throw error;
    }
};

// Redis에서 모든 device 목록 조회
export const getAllDevicesFromRedis = async (): Promise<DeviceDataInRedis[]> => {
    try {
        console.log('🔍 Fetching all devices from Redis...');
        const response = await fetch(`${BASE_URL}/admin/device/redis/all`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`✅ Received ${data.length} total devices from Redis`);
        return data;
    } catch (error) {
        console.error('❌ Error fetching all devices from Redis:', error);
        throw error;
    }
};

// Redis에서 특정 device 조회
export const getDeviceByIdFromRedis = async (deviceId: number): Promise<DeviceDataInRedis | null> => {
    try {
        console.log(`🔍 Fetching device ${deviceId} from Redis...`);
        const response = await fetch(`${BASE_URL}/admin/device/redis/${deviceId}`);

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`✅ Received device ${deviceId} from Redis`);
        return data;
    } catch (error) {
        console.error(`❌ Error fetching device ${deviceId} from Redis:`, error);
        throw error;
    }
};