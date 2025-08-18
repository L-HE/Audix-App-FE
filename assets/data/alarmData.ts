// assets/data/alarmData.ts
import { CardState } from '../data/areaData';

// 알람 타입 정의: 장비, 안전
export type AlarmType = 'machine' | 'safety';

export interface AlarmData {
  alarmId: string;
  status: CardState;
  regionName: string;
  regionLocation: string;
  model: string;
  createdAt: Date;
  message: string;
  type: AlarmType;
}

export interface AlarmCardProps extends AlarmData {
  onPress: () => void;
}

// 웹소켓 데이터를 AlarmData로 변환하는 헬퍼 함수
export const createAlarmFromWebSocketData = (
  deviceData: {
    deviceId: number;
    name: string;
    address: string;
    status: string;
    model: string;
    message?: string;
    aiText?: string;
  }
): AlarmData => {
  // status 문자열을 CardState로 변환
  const mapStatusToCardState = (status: string): CardState => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'danger':
      case 'critical':
      case 'error':
        return 'danger';
      case 'warning':
      case 'caution':
        return 'warning';
      case 'normal':
      case 'ok':
      case 'good':
        return 'normal';
      case 'repair':
      case 'maintenance':
      case 'fixing':
        return 'repair';
      case 'offline':
      case 'disconnected':
      case 'mic_issue':
        return 'offline';
      default:
        return 'warning'; // 기본값
    }
  };

  // 메시지 내용으로 safety 타입 판별
  const determineAlarmType = (): AlarmType => {
    const combinedMessage = `${deviceData.message || ''} ${deviceData.aiText || ''}`.toLowerCase();

    // safety 타입으로 분류할 키워드들
    const safetyKeywords = [
      '비명',
      '화재',
      '불',
      '연기',
      '폭발',
      '비상',
      '대피',
      '사고',
      '부상',
      '응급',
      '구조',
      '위급'
    ];

    // 키워드가 포함되어 있으면 safety 타입으로 분류
    const isSafety = safetyKeywords.some(keyword => combinedMessage.includes(keyword));

    return isSafety ? 'safety' : 'machine';
  };

  // 최종 메시지 결정 (safety 타입일 경우 특별 처리)
  const getFinalMessage = (): string => {
    const combinedMessage = `${deviceData.message || ''} ${deviceData.aiText || ''}`;

    // "비명" 키워드가 있으면 특별 메시지
    if (combinedMessage.includes('비명')) {
      return '비명 소리가 들립니다.\n즉시 확인이 필요합니다.';
    }

    // 기존 메시지 로직 유지
    return deviceData.message || deviceData.aiText || '디바이스 알림이 발생했습니다.';
  };

  const alarmType = determineAlarmType();

  return {
    alarmId: `alarm-${deviceData.deviceId}-${Date.now()}`,
    regionName: deviceData.name || 'Unknown Device',
    regionLocation: deviceData.address || '위치 정보 없음',
    status: mapStatusToCardState(deviceData.status),
    type: alarmType,  // ← 변경!
    createdAt: new Date(),
    message: getFinalMessage(),  // ← 변경!
    model: deviceData.model || 'Unknown Model',
  };
};

export const alarmData: AlarmData[] = [
  {
    alarmId: '8',
    status: 'warning',
    regionName: 'A-1구역',
    regionLocation: '2층 자동차 부재료 조립구역',
    model: 'SO-ARM101',
    createdAt: new Date(Date.now() - 14 * 60 * 1000),
    message: "현재 장비에서 이상음이 감지됩니다.\n점검이 필요합니다.",
    type: 'machine',
  },
  {
    alarmId: '7',
    status: 'danger',
    regionName: 'A-1구역',
    regionLocation: '2층 자동차 부재료 조립구역',
    model: 'SO-ARM102',
    createdAt: new Date(Date.now() - 17 * 60 * 60 * 1000),
    message: "현재 장비에서 이상음이 감지됩니다.\n즉시 중단이 필요합니다.",
    type: 'machine',
  },
  {
    alarmId: '6',
    status: 'repair',
    regionName: 'B-2구역',
    regionLocation: '1층 전장품 검수구역',
    model: 'COMP-202',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    message: "장비 점검 중입니다.",
    type: 'machine',
  },
  {
    alarmId: '5',
    status: 'offline',
    regionName: 'C-3구역',
    regionLocation: '지하 1층 원자재 보관구역',
    model: 'WELD-303',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    message: "마이크가 연결되지 않았습니다.",
    type: 'machine',
  },
  {
    alarmId: '4',
    status: 'danger',
    regionName: 'D-1구역',
    regionLocation: '3층 완제품 포장구역',
    model: 'CUT-404',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    message: "화재가 일어났습니다.\n즉시 대피하세요.",
    type: 'safety',
  },
  {
    alarmId: '3',
    status: 'normal',
    regionName: 'D-1구역',
    regionLocation: '3층 완제품 포장구역',
    model: 'WELD-303',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    message: "정상 복구되었습니다",
    type: 'machine',
  },
];

export default alarmData;