// assets/data/machineData.ts
import { ImageSourcePropType } from 'react-native';
import { CardState } from './areaData';
import { getDevicesByAreaIdFromRedis } from '../../shared/api/device';
import { BASE_URL } from '../../shared/api/config';

export type Machine = {
  deviceId: number;
  areaId?: number;
  explain: string;
  name: string;
  address: string;
  status: string;
  deviceManager?: string;
  image?: string;
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
    image: '../images/logos/AudixLogoNavy.png',
    normalScore: 15,
  },
  {
    deviceId: 2,
    areaId: 17,
    explain: '자동차 부재료 조립용 로봇팔',
    name: '로봇팔',
    address: '2층 자동차 부재료 조립구역',
    status: 'normal',
    deviceManager: '김서현',
    image: '../images/logos/AudixLogoNavy.png',
    normalScore: 80,
  },
  {
    deviceId: 5,
    areaId: 1,
    explain: '자동차 부재료 조립용 로봇팔',
    name: '로봇팔',
    address: '2층 자동차 부재료 조립구역',
    status: 'warning',
    deviceManager: '도종명',
    image: '../images/logos/AudixLogoNavy.png',
    normalScore: 65,
  },
  {
    deviceId: 3,
    areaId: 2,
    explain: '자동차 부재료 조립용 로봇팔',
    name: '로봇팔',
    address: '2층 자동차 부재료 조립구역',
    status: 'danger',
    deviceManager: '김재걸',
    image: '../images/logos/AudixLogoNavy.png',
    normalScore: 35,
  },
  {
    deviceId: 4,
    areaId: 2,
    explain: '자동차 부재료 조립용 로봇팔',
    name: '로봇팔',
    address: '2층 자동차 부재료 조립구역',
    status: 'warning',
    deviceManager: '김현민',
    image: '../images/logos/AudixLogoNavy.png',
    normalScore: 55,
  },
];

// Redis API에서 데이터를 가져와서 Machine 타입으로 변환하는 함수
const transformDeviceToMachine = (device: any): Machine => {
  // 이미지 URI에서 중복 경로 제거
  let imageUri = null;
  if (device.image) {
    const imagePath = device.image.startsWith('/images/') ? device.image.substring(8) : device.image;
    imageUri = `${BASE_URL}/images/${imagePath}`;
  }

  // normalScore 기반으로 상태 자동 설정 (우선순위)
  const normalScore = device.normalScore || 0;
  let status = 'normal';

  console.log(`🔍 Device "${device.name}" normalScore: ${normalScore}`);

  if (normalScore < 0.3) {
    status = 'danger';
    console.log(`🔴 normalScore ${normalScore} < 0.3 → danger`);
  } else if (normalScore < 0.5) {
    status = 'warning';
    console.log(`🟡 normalScore ${normalScore} < 0.5 → warning`);
  } else {
    status = 'normal';
    console.log(`🟢 normalScore ${normalScore} >= 0.5 → normal`);
  }

  // Redis에서 온 status가 유효한 값이면 normalScore 결과 덮어쓰기
  const validStatuses = ['normal', 'warning', 'danger', 'fixing', 'unknown'];
  if (device.status && validStatuses.includes(device.status)) {
    console.log(`🔄 Redis status "${device.status}" 사용, normalScore 기반 "${status}" 대신`);
    status = device.status;
  } else {
    console.log(`✅ normalScore ${normalScore} 기반 status "${status}" 사용`);
  }

  return {
    deviceId: device.deviceId,
    areaId: device.areaId,
    explain: device.explain || '설명 없음',
    name: device.name || '장비명 없음',
    address: device.address || '주소 정보 없음',
    status: status,
    deviceManager: device.deviceManager || '담당자 없음',
    image: imageUri || undefined,
    normalScore: normalScore,
  };
};

// Area ID로 해당 지역의 기기 데이터를 가져오는 함수
export const getMachineDataByAreaId = async (areaId: string): Promise<Machine[]> => {
  try {
    console.log('📡 API 요청: Area ID', areaId, '의 기기 데이터 조회');
    const numericAreaId = parseInt(areaId, 10);
    const devices = await getDevicesByAreaIdFromRedis(numericAreaId);
    console.log('✅ API 응답:', devices);

    if (!devices || devices.length === 0) {
      console.log('⚠️ 해당 지역에 기기가 없습니다.');
      // 빈 배열 반환 (에러가 아님)
      return [];
    }

    return devices.map(transformDeviceToMachine);
  } catch (error) {
    console.error('❌ API 에러:', error);
    // 네트워크 에러 등 실제 에러 시에만 정적 데이터 fallback
    const fallbackData = machineData.filter(machine => machine.areaId === parseInt(areaId, 10));
    console.log('🔄 Fallback 데이터 사용:', fallbackData);
    return fallbackData;
  }
};

export default machineData;
