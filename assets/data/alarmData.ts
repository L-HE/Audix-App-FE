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