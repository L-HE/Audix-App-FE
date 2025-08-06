// assets/data/alarmData.ts
import { CardState } from '../data/areaData';

// 알람 타입 정의: 장비, 안전, 기타(복구 중 혹은 복구 완료)
export type AlarmType = 'machine' | 'safety' | 'other';

export interface AlarmData {
  alarmId: string;
  machineStatus: CardState;
  alarmTitle: string;
  regionName: string;
  regionLocation: string;
  model: string;
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
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    message: "정상 복구되었습니다",
    type: 'machine',
  },
  {
    alarmId: '1',
    machineStatus: 'danger',
    alarmTitle: '안전 사고 발생',
    regionName: 'D-1구역',
    regionLocation: '3층 완제품 포장구역',
    model: 'CUT-404',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    message: "화재가 일어났습니다. 즉시 대피하세요.",
    type: 'safety',
  },
];

export default alarmData;