// assets/data/machineData.ts
import { ImageSourcePropType } from 'react-native';

export type Machine = {
  id: string;
  areaId: string;
  image: ImageSourcePropType;
  name: string;
  model: string;
  percent: number;
  location: string;
  owner: string;
  state: 'danger' | 'warning' | 'normal' | 'unknown';
};

const machineData: Machine[] = [
  {
    id: 'm1',
    areaId: '1',
    image: require('../images/AudixLogoNavy.png'),
    name: '로봇팔',
    model: 'SO-ARM101',
    percent: 15,
    location: '2층 자동차 부재료 조립구역',
    owner: '이하은',
    state: 'danger',
  },
  {
    id: 'm2',
    areaId: '1',
    image: require('../images/AudixLogoNavy.png'),
    name: '로봇팔',
    model: 'SO-ARM102',
    percent: 80,
    location: '2층 자동차 부재료 조립구역',
    owner: '김서현',
    state: 'normal',
  },
  {
    id: 'm5',
    areaId: '1',
    image: require('../images/AudixLogoNavy.png'),
    name: '로봇팔',
    model: 'SO-ARM101',
    percent: 65,
    location: '2층 자동차 부재료 조립구역',
    owner: '도종명',
    state: 'warning',
  },
  {
    id: 'm3',
    areaId: '2',
    image: require('../images/AudixLogoNavy.png'),
    name: '로봇팔',
    model: 'SO-ARM101',
    percent: 15,
    location: '2층 자동차 부재료 조립구역',
    owner: '김재걸',
    state: 'danger',
  },
  {
    id: 'm4',
    areaId: '2',
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
