// assets/data/machineData.ts

import { ImageSourcePropType } from 'react-native';
import { MachineCardProps } from '../../components/screens/machineCard';

export const machineData: MachineCardProps[] = [
  {
    id: '1',
    machineId: 'a2',
    image: require('../../assets/images/AudixLogoNavy.png') as ImageSourcePropType,
    state: 'warning',
    location: '1층 B-2 창고',
    owner: '이영희',
    percent: 30,
  },
  {
    id: '1',
    machineId: 'a1',
    image: require('../../assets/images/AudixLogoNavy.png') as ImageSourcePropType,
    state: 'danger',
    location: '2층 A-1 구역',
    owner: '김철수',
    percent: 10,
  },
  {
    id: '1',
    machineId: 'a3',
    image: require('../../assets/images/AudixLogoNavy.png') as ImageSourcePropType,
    state: 'normal',
    location: '3층 C-3 조립 라인',
    owner: '박민수',
    percent: 80,
  },
];
