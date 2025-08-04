import type { AlarmData } from './alarmData';

type ModalProps = Omit<AlarmData, 'onPress'>;

export const modalData: ModalProps[] = [
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
];