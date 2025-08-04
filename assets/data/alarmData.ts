// assets/data/alarmData.ts
import { CardState } from '../data/areaData';

export interface AlarmData {
  alarmId: string;
  title: string;
  subtitle: string;
  timestamp: string;
  createdAt: Date;
  status: CardState;
  onPress: () => void;
}

export type AlarmCardProps = Omit<AlarmData, 'onPress'>;

export const alarmData: AlarmCardProps[] = [
  {
    alarmId: '7',
    title: '점검 요망',
    subtitle: 'A-1구역\n2층 자동차 부재료 조립구역',
    timestamp: '14분 전',
    createdAt: new Date(Date.now() - 14 * 60 * 1000),
    status: 'warning',
  },
  {
    alarmId: '6',
    title: '점검 요망',
    subtitle: 'A-1구역\n2층 자동차 부재료 조립구역',
    timestamp: '17시간 전',
    createdAt: new Date(Date.now() - 17 * 60 * 60 * 1000),
    status: 'warning',
  },
  {
    alarmId: '5',
    title: '정상 복구',
    subtitle: 'B-2구역\n1층 전장품 검수구역',
    timestamp: '1일 전',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: 'normal',
  },
  {
    alarmId: '4',
    title: '위험 감지',
    subtitle: 'C-3구역\n지하 1층 원자재 보관구역',
    timestamp: '2일 전',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'danger',
  },
  {
    alarmId: '3',
    title: '점검 완료',
    subtitle: 'D-1구역\n3층 완제품 포장구역',
    timestamp: '3일 전',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'normal',
  },
  {
    alarmId: '2',
    title: '점검 완료',
    subtitle: 'D-1구역\n3층 완제품 포장구역',
    timestamp: '5일 전',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'normal',
  },
  {
    alarmId: '1',
    title: '점검 완료',
    subtitle: 'D-1구역\n3층 완제품 포장구역',
    timestamp: '10일 전',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'normal',
  },
];

export default alarmData;