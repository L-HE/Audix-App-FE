import type { AlarmData } from './alarmData';

type ModalProps = Omit<AlarmData, 'onPress'>;

export const modalData: ModalProps[] = [
  {
    alarmId: '',
    status: 'offline',
    regionName: '',
    regionLocation: '',
    model: '',
    createdAt: new Date(Date.now() - 0 * 60 * 1000),
    message: "",
    type: 'machine',
  },
];