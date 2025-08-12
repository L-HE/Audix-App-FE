// assets/data/areaData.ts
import { ImageSourcePropType } from 'react-native';
import { Area as ApiArea, getAreaList } from '../../shared/api/area';
import { BASE_URL } from '../../shared/api/config';

// CardState 타입 정의 (위험 / 점검 요망 / 정상 / 수리 / 마이크 미연결)
export type CardState = 'danger' | 'warning' | 'normal' | 'repair' | 'offline';

export interface AreaCardProps {
  id: string;
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
  state: CardState;
  onPress: () => void;
}

export type Area = Omit<AreaCardProps, 'onPress'>;

// status 값을 CardState로 매핑하는 함수
const mapStatusToState = (status: string): CardState => {
  switch (status.toLowerCase()) {
    case '정상':
    case 'normal':
    case 'ok':
      return 'normal';
    case '경고':
    case 'warning':
    case 'warn':
      return 'warning';
    case '위험':
    case 'danger':
    case 'error':
    case 'critical':
      return 'danger';
    case '고장':
    case 'fixing':
    case 'repair':
      return 'repair';
    case '마이크 미연결':
    case 'mic_issue':
    case 'offline':
      return 'offline';
    default:
      return 'offline';
  }
};

// API 데이터를 areaData 형식으로 변환
const transformApiToAreaData = (apiData: ApiArea[]): Area[] => {
  return apiData.map((item) => ({
    id: item.id.toString(),        // id → id (number → string)
    title: item.name,              // name → title
    subtitle: item.explain,        // explain → subtitle
    image: item.image
      ? { uri: `${BASE_URL}${item.image}` }  // API 이미지 경로 사용
      : require('../images/logos/AudixLogoNavy.png'), // fallback 이미지
    state: mapStatusToState(item.status), // status → state (실제 매핑)
  }));
};

// API에서 데이터 가져오기
export const getAreaData = async (): Promise<Area[]> => {
  try {
    // 타임아웃으로 API 호출
    const apiData = await getAreaList();
    
    if (apiData && apiData.length > 0) {
      return transformApiToAreaData(apiData);
    } else {
      console.log('⚠️ API 응답이 비어있음, fallback 데이터 사용');
      return areaData;
    }
  } catch (error) {
    console.error('❌ API Area 데이터 요청 실패, fallback 데이터 사용:', error);
    
    // 에러 타입 확인
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.log('⏰ API 요청 타임아웃, fallback 데이터 사용');
      } else {
        console.log('🌐 네트워크 오류, fallback 데이터 사용');
      }
    }
    
    return areaData; // fallback 데이터 반환
  }
};

// 기존 정적 데이터 (fallback용)
export const areaData: Area[] = [
  {
    id: '1',
    title: 'A-1구역',
    subtitle: '2층 자동차 부재료 조립구역',
    image: require('../images/logos/AudixLogoNavy.png'),
    state: 'warning',
  }
];
