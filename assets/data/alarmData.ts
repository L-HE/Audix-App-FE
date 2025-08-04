// assets/data/alarmData.ts
import { CardState } from '../data/areaData';
export type AlarmType = 'machine' | 'safety' | 'other'; // 장비, 안전사고, 기타

export interface AlarmData {
  alarmId: string;
  machineStatus: CardState;
  alarmTitle: string;
  regionName: string;
  regionLocation: string;
  model: string;
  timestamp: string;
  createdAt: Date;
  message: string;
  type: AlarmType;
  onPress: () => void;
}

export type AlarmCardProps = Omit<AlarmData, 'onPress'>;

export const alarmData: AlarmCardProps[] = [
  {
    alarmId: '7',
    machineStatus: 'warning',
    alarmTitle: '점검 요망',
    regionName: 'A-1구역',
    regionLocation: '2층 자동차 부재료 조립구역',
    model: 'SO-ARM101',
    timestamp: '14분 전',
    createdAt: new Date(Date.now() - 14 * 60 * 1000),
    message: "현재 장비에서 이상음이 감지됩니다. 점검이 필요합니다.",
    type: 'machine',
  },
  {
    alarmId: '6',
    machineStatus: 'warning',
    alarmTitle: '점검 요망',
    regionName: 'A-1구역',
    regionLocation: '2층 자동차 부재료 조립구역',
    model: 'SO-ARM102',
    timestamp: '17시간 전',
    createdAt: new Date(Date.now() - 17 * 60 * 60 * 1000),
    message: "현재 장비에서 이상음이 감지됩니다. 점검이 필요합니다.",
    type: 'machine',
  },
  {
    alarmId: '5',
    machineStatus: 'normal',
    alarmTitle: '정상 복구',
    regionName: 'B-2구역',
    regionLocation: '1층 전장품 검수구역',
    model: 'COMP-202',
    timestamp: '1일 전',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    message: "정상 복구되었습니다",
    type: 'other',
  },
  {
    alarmId: '4',
    machineStatus: 'danger',
    alarmTitle: '위험 감지',
    regionName: 'C-3구역',
    regionLocation: '지하 1층 원자재 보관구역',
    model: 'WELD-303',
    timestamp: '2일 전',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    message: "현재 장비에서 이상음이 감지됩니다. 즉시 중단이 필요합니다",
    type: 'machine',
  },
  {
    alarmId: '3',
    machineStatus: 'normal',
    alarmTitle: '정상 복구',
    regionName: 'D-1구역',
    regionLocation: '3층 완제품 포장구역',
    model: 'WELD-303',
    timestamp: '3일 전',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    message: "정상 복구되었습니다",
    type: 'other',
  },
  {
    alarmId: '2',
    machineStatus: 'normal',
    alarmTitle: '정상 복구',
    regionName: 'D-1구역',
    regionLocation: '3층 완제품 포장구역',
    model: 'CUT-404',
    timestamp: '5일 전',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    message: "정상 복구되었습니다",
    type: 'machine',
  },
  {
    alarmId: '1',
    machineStatus: 'danger',
    alarmTitle: '점검 완료',
    regionName: 'D-1구역',
    regionLocation: '3층 완제품 포장구역',
    model: 'CUT-404',
    timestamp: '10일 전',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    message: "화재가 일어났습니다. 즉시 대피하세요.",
    type: 'safety',
  },
];

export default alarmData;