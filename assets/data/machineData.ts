// assets/data/machineData.ts
import { ImageSourcePropType } from 'react-native';
import { BASE_URL } from '../../shared/api/config';
import { getDevicesByAreaIdFromRedis } from '../../shared/api/device';
import { webSocketClient } from '../../shared/websocket/client';

export type Machine = {
  deviceId: number;
  areaId?: number;
  explain: string;
  name: string;
  address: string;
  status: string;
  deviceManager?: string;
  image?: ImageSourcePropType;
  normalScore: number;
};

export const machineData: Machine[] = [
  {
    deviceId: 1,
    areaId: 16,
    explain: '자동차 부재료 조립용 로봇팔',
    name: '로봇팔',
    address: '2층 자동차 부재료 조립구역',
    status: 'danger',
    deviceManager: '이하은',
    image: require('../images/logos/AudixLogoNavy.png'),
    normalScore: 0.15,
  }
];

// 3초 타임아웃을 포함한 Redis API 호출 함수
const getDevicesWithTimeout = async (areaId: number, timeout = 3000): Promise<any[]> => {
  return new Promise(async (resolve, reject) => {
    // 타임아웃 설정
    const timeoutId = setTimeout(() => {
      reject(new Error('AbortError')); // AbortError로 타임아웃 구분
    }, timeout);

    try {
      const devices = await getDevicesByAreaIdFromRedis(areaId);
      clearTimeout(timeoutId);
      resolve(devices);
    } catch (error) {
      clearTimeout(timeoutId);
      reject(error);
    }
  });
};

// 완전히 안전한 이미지 처리 (URI 생성 없이)
const transformDeviceToMachine = (device: any, isOnline: boolean): Machine => {
  // 기본적으로 로컬 이미지 사용
  let imageSource = require('../images/logos/AudixLogoNavy.png');

  // 온라인일 때만 API 이미지 시도
  if (isOnline && device.image) {
    try {
      if (typeof device.image === 'string' && device.image.trim()) {
        // BASE_URL 검증
        if (!BASE_URL || typeof BASE_URL !== 'string') {
          throw new Error('Invalid BASE_URL');
        }

        const imagePath = device.image.startsWith('/images/') 
          ? device.image.substring(8) 
          : device.image;
        
        const cleanImagePath = String(imagePath).trim();
        const cleanBaseUrl = String(BASE_URL).trim();
        const imageUri = `${cleanBaseUrl}/images/${cleanImagePath}`;
        
        // URI 검증
        if (imageUri && typeof imageUri === 'string' && imageUri.startsWith('http')) {
          imageSource = { uri: imageUri };
        } else {
          console.log(`🚨 잘못된 URI 형식: ${imageUri}, 로컬 이미지 사용`);
        }
      }
    } catch (error) {
      console.log('🖼️ API 이미지 로드 실패, 로컬 이미지 사용:', error);
    }
  } else if (!isOnline) {
    console.log('📱 오프라인 모드: 로컬 이미지 사용');
  } else {
    console.log('🖼️ 기본 로컬 이미지 사용 (device.image 없음)');
  }

  // normalScore도 안전하게 처리
  let normalScore = 0;
  if (typeof device.normalScore === 'number' && !isNaN(device.normalScore)) {
    normalScore = device.normalScore;
  } else if (typeof device.normalScore === 'string') {
    const parsed = parseFloat(device.normalScore);
    normalScore = !isNaN(parsed) ? parsed : 0;
  }

  let status = 'normal';

  if (normalScore < 0.3) {
    status = 'danger';
  } else if (normalScore < 0.5) {
    status = 'warning';
  } else {
    status = 'normal';
  }

  // Redis에서 온 status가 유효한 값이면 normalScore 결과 덮어쓰기
  const validStatuses = ['normal', 'warning', 'danger', 'fixing', 'mic_issue'];
  if (device.status && validStatuses.includes(device.status)) {
    status = device.status;
  } else {
  }

  return {
    deviceId: Number(device.deviceId) || 0,
    areaId: Number(device.areaId) || undefined,
    explain: String(device.explain || '설명 없음'),
    name: String(device.name || '장비명 없음'),
    address: String(device.address || '주소 정보 없음'),
    status: String(status),
    deviceManager: String(device.deviceManager || '담당자 없음'),
    image: imageSource, // 처리된 이미지 소스
    normalScore: normalScore,
  };
};

// Area ID로 해당 지역의 기기 데이터를 가져오는 함수
export const getMachineDataByAreaId = async (areaId: string): Promise<Machine[]> => {
  // 1단계: WebSocket 연결 상태 확인
  const isWebSocketConnected = webSocketClient.getConnectionStatus();
  
  // 2단계: WebSocket 연결이 안되어 있으면 오프라인 모드
  if (!isWebSocketConnected) {
    console.log('📱 WebSocket 연결 실패 → 오프라인 모드: 즉시 fallback 데이터 사용');
    const numericAreaId = parseInt(areaId, 10);
    const fallbackData = machineData.filter(machine => machine.areaId === numericAreaId);
    
    if (fallbackData.length === 0) {
      return generateFallbackData(numericAreaId);
    }
    
    return fallbackData;
  }

  // 3단계: WebSocket 연결되어 있으면 온라인 모드 → API 시도
  try {
    const numericAreaId = parseInt(areaId, 10);
    const devices = await getDevicesWithTimeout(numericAreaId, 3000);

    if (!devices || devices.length === 0) {
      const fallbackData = machineData.filter(machine => machine.areaId === numericAreaId);
      
      if (fallbackData.length === 0) {
        return generateFallbackData(numericAreaId);
      }
      
      return fallbackData;
    }

    // API 데이터를 온라인 모드로 변환 (API 이미지 시도)
    const transformedData = devices.map(device => transformDeviceToMachine(device, true));
    
    return transformedData;

  } catch (error) {
    
    // API 실패 시에도 WebSocket이 연결되어 있으면 온라인으로 간주
    // 하지만 이미지는 로컬 이미지 사용
    const numericAreaId = parseInt(areaId, 10);
    const fallbackData = machineData.filter(machine => machine.areaId === numericAreaId);
    
    if (fallbackData.length === 0) {
      return generateFallbackData(numericAreaId);
    }

    return fallbackData;
  }
};

// 동적 fallback 데이터 생성 함수 (로컬 이미지 사용)
const generateFallbackData = (areaId: number): Machine[] => {

  const fallbackDevices: Machine[] = [
    {
      deviceId: areaId * 1000 + 1,
      areaId: areaId,
      explain: '자동차 부재료 조립용 로봇팔',
      name: `로봇팔 AUD-${areaId}-001`,
      address: `${areaId}구역 자동차 부재료 조립구역`,
      status: 'normal',
      deviceManager: '시스템 관리자',
      image: require('../images/logos/AudixLogoNavy.png'),
      normalScore: 85,
    },
    {
      deviceId: areaId * 1000 + 2,
      areaId: areaId,
      explain: '품질 검사용 센서',
      name: `품질센서 AUD-${areaId}-002`,
      address: `${areaId}구역 품질 검사구역`,
      status: 'warning',
      deviceManager: '시스템 관리자',
      image: require('../images/logos/AudixLogoNavy.png'),
      normalScore: 65,
    },
  ];

  return fallbackDevices;
};

export default machineData;
