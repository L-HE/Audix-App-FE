// assets/data/machineData.ts
import { ImageSourcePropType } from 'react-native';
import { CardState } from './areaData';

export type Machine = {
  machineId: string;
  id: string;
  image: ImageSourcePropType;
  name: string;
  model: string;
  percent: number;
  location: string;
  owner: string;
  state: CardState;
};

export const machineData: Machine[] = [
  {
    machineId: 'm1',
    id: '1',
    image: require('../images/AudixLogoNavy.png'),
    name: '로봇팔',
    model: 'SO-ARM101',
    percent: 15,
    location: '2층 자동차 부재료 조립구역',
    owner: '이하은',
    state: 'danger',
  },
  {
    machineId: 'm2',
    id: '1',
    image: require('../images/AudixLogoNavy.png'),
    name: '로봇팔',
    model: 'SO-ARM102',
    percent: 80,
    location: '2층 자동차 부재료 조립구역',
    owner: '김서현',
    state: 'normal',
  },
  {
    machineId: 'm5',
    id: '1',
    image: require('../images/AudixLogoNavy.png'),
    name: '로봇팔',
    model: 'SO-ARM101',
    percent: 65,
    location: '2층 자동차 부재료 조립구역',
    owner: '도종명',
    state: 'warning',
  },
  {
    machineId: 'm3',
    id: '2',
    image: require('../images/AudixLogoNavy.png'),
    name: '로봇팔',
    model: 'SO-ARM101',
    percent: 35,
    location: '2층 자동차 부재료 조립구역',
    owner: '김재걸',
    state: 'danger',
  },
  {
    machineId: 'm4',
    id: '2',
    image: require('../images/AudixLogoNavy.png'),
    name: '로봇팔',
    model: 'SO-ARM101',
    percent: 55,
    location: '2층 자동차 부재료 조립구역',
    owner: '김현민',
    state: 'warning',
  },
];

export default machineData;
