// assets/data/areaData.ts
import { ImageSourcePropType } from 'react-native';
import { Area as ApiArea, getAreaList } from '../../shared/api/area';

export type CardState = 'danger' | 'warning' | 'normal' | 'fixing' | 'unknown';

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
    default:
      return 'unknown';
  }
};

// API 데이터를 areaData 형식으로 변환
const transformApiToAreaData = (apiData: ApiArea[]): Area[] => {
  return apiData.map((item) => ({
    id: item.id.toString(),        // id → id (number → string)
    title: item.name,              // name → title
    subtitle: item.explain,        // explain → subtitle
    image: require('../images/logos/AudixLogoNavy.png'), // 기본 이미지 사용
    state: mapStatusToState(item.status), // status → state (실제 매핑)
  }));
};

// API에서 데이터 가져오기
export const getAreaData = async (): Promise<Area[]> => {
  try {
    const apiData = await getAreaList();
    return transformApiToAreaData(apiData);
  } catch (error) {
    console.error('Area 데이터 변환 실패:', error);
    // 에러 시 기본 데이터 반환
    return areaData;
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
  },
  {
    id: '2',
    title: 'B-2구역',
    subtitle: '1층 전장품 검수구역',
    image: require('../images/logos/AudixLogoNavy.png'),
    state: 'danger',
  },
  {
    id: '3',
    title: 'C-2구역',
    subtitle: '1층 전장품 검수구역',
    image: require('../images/logos/AudixLogoNavy.png'),
    state: 'normal',
  },
  {
    id: '4',
    title: 'D-2구역',
    subtitle: '1층 전장품 검수구역',
    image: require('../images/logos/AudixLogoNavy.png'),
    state: 'unknown',
  },
];
