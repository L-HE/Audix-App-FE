// assets/data/machineData.ts
import { ImageSourcePropType } from 'react-native';
import { CardState } from './areaData';

export type Machine = {
  machineId: string;
  id: string;
  machineImage: ImageSourcePropType;
  machineName: string;
  model: string;
  percent: number;
  regionLocation: string;
  machineOwner: string;
  machineState: CardState;
};

export const machineData: Machine[] = [
  {
    machineId: 'm1',
    id: '1',
    machineImage: require('../images/logos/AudixLogoNavy.png'),
    machineName: '로봇팔',
    model: 'SO-ARM101',
    percent: 15,
    regionLocation: '2층 자동차 부재료 조립구역',
    machineOwner: '이하은',
    machineState: 'danger',
  },
  {
    machineId: 'm2',
    id: '1',
    machineImage: require('../images/logos/AudixLogoNavy.png'),
    machineName: '로봇팔',
    model: 'SO-ARM102',
    percent: 80,
    regionLocation: '2층 자동차 부재료 조립구역',
    machineOwner: '김서현',
    machineState: 'normal',
  },
  {
    machineId: 'm5',
    id: '1',
    machineImage: require('../images/logos/AudixLogoNavy.png'),
    machineName: '로봇팔',
    model: 'SO-ARM101',
    percent: 65,
    regionLocation: '2층 자동차 부재료 조립구역',
    machineOwner: '도종명',
    machineState: 'warning',
  },
  {
    machineId: 'm3',
    id: '2',
    machineImage: require('../images/logos/AudixLogoNavy.png'),
    machineName: '로봇팔',
    model: 'SO-ARM101',
    percent: 35,
    regionLocation: '2층 자동차 부재료 조립구역',
    machineOwner: '김재걸',
    machineState: 'danger',
  },
  {
    machineId: 'm4',
    id: '2',
    machineImage: require('../images/logos/AudixLogoNavy.png'),
    machineName: '로봇팔',
    model: 'SO-ARM101',
    percent: 55,
    regionLocation: '2층 자동차 부재료 조립구역',
    machineOwner: '김현민',
    machineState: 'warning',
  },
  // 추가 테스트 데이터
  {
    machineId: 'm6',
    id: '3',
    machineImage: require('../images/logos/AudixLogoNavy.png'),
    machineName: '컨베이어 벨트',
    model: 'CONV-001',
    percent: 90,
    regionLocation: '1층 전장품 검수구역',
    machineOwner: '박영희',
    machineState: 'normal',
  },
  {
    machineId: 'm7',
    id: '4',
    machineImage: require('../images/logos/AudixLogoNavy.png'),
    machineName: '압축기',
    model: 'COMP-202',
    percent: 45,
    regionLocation: '지하 1층 동력실',
    machineOwner: '최민수',
    machineState: 'warning',
  },
  {
    machineId: 'm8',
    id: '5',
    machineImage: require('../images/logos/AudixLogoNavy.png'),
    machineName: '용접기',
    model: 'WELD-303',
    percent: 25,
    regionLocation: '2층 용접 작업장',
    machineOwner: '이수진',
    machineState: 'danger',
  },
  {
    machineId: 'm9',
    id: '5',
    machineImage: require('../images/logos/AudixLogoNavy.png'),
    machineName: '절단기',
    model: 'CUT-404',
    percent: 70,
    regionLocation: '2층 용접 작업장',
    machineOwner: '김태호',
    machineState: 'normal',
  },
  {
    machineId: 'm10',
    id: 6,
    image: require('../images/logos/AudixLogoNavy.png'),
    name: '드릴링 머신',
    model: 'DRILL-505',
    percent: 85,
    location: '3층 정밀 가공실',
    owner: '정민지',
    state: 'normal',
  },
  {
    machineId: 'm11',
    id: 7,
    image: require('../images/logos/AudixLogoNavy.png'),
    name: '밀링 머신',
    model: 'MILL-606',
    percent: 30,
    location: '3층 정밀 가공실',
    owner: '오세훈',
    state: 'danger',
  },
  {
    machineId: 'm12',
    id: 8,
    image: require('../images/logos/AudixLogoNavy.png'),
    name: '선반',
    model: 'LATHE-707',
    percent: 65,
    location: '2층 기계 가공실',
    owner: '윤상철',
    state: 'warning',
  },
];

export default machineData;
