// assets/data/machineData.ts
import { ImageSourcePropType } from 'react-native';
import { CardState } from './areaData';

export type Machine = {
  machineId: string;
  id: number;
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
    id: 1,
    image: require('../images/logos/AudixLogoNavy.png'),
    name: '로봇팔',
    model: 'SO-ARM101',
    percent: 15,
    location: '2층 자동차 부재료 조립구역',
    owner: '이하은',
    state: 'danger',
  },
  {
    machineId: 'm2',
    id: 1,
    image: require('../images/logos/AudixLogoNavy.png'),
    name: '로봇팔',
    model: 'SO-ARM102',
    percent: 80,
    location: '2층 자동차 부재료 조립구역',
    owner: '김서현',
    state: 'normal',
  },
  {
    machineId: 'm5',
    id: 1,
    image: require('../images/logos/AudixLogoNavy.png'),
    name: '로봇팔',
    model: 'SO-ARM101',
    percent: 65,
    location: '2층 자동차 부재료 조립구역',
    owner: '도종명',
    state: 'warning',
  },
  {
    machineId: 'm3',
    id: 2,
    image: require('../images/logos/AudixLogoNavy.png'),
    name: '로봇팔',
    model: 'SO-ARM101',
    percent: 35,
    location: '2층 자동차 부재료 조립구역',
    owner: '김재걸',
    state: 'danger',
  },
  {
    machineId: 'm4',
    id: 2,
    image: require('../images/logos/AudixLogoNavy.png'),
    name: '로봇팔',
    model: 'SO-ARM101',
    percent: 55,
    location: '2층 자동차 부재료 조립구역',
    owner: '김현민',
    state: 'warning',
  },
  // 추가 테스트 데이터
  {
    machineId: 'm6',
    id: 3,
    image: require('../images/logos/AudixLogoNavy.png'),
    name: '컨베이어 벨트',
    model: 'CONV-001',
    percent: 90,
    location: '1층 전장품 검수구역',
    owner: '박영희',
    state: 'normal',
  },
  {
    machineId: 'm7',
    id: 4,
    image: require('../images/logos/AudixLogoNavy.png'),
    name: '압축기',
    model: 'COMP-202',
    percent: 45,
    location: '지하 1층 동력실',
    owner: '최민수',
    state: 'warning',
  },
  {
    machineId: 'm8',
    id: 5,
    image: require('../images/logos/AudixLogoNavy.png'),
    name: '용접기',
    model: 'WELD-303',
    percent: 25,
    location: '2층 용접 작업장',
    owner: '이수진',
    state: 'danger',
  },
  {
    machineId: 'm9',
    id: 5,
    image: require('../images/logos/AudixLogoNavy.png'),
    name: '절단기',
    model: 'CUT-404',
    percent: 70,
    location: '2층 용접 작업장',
    owner: '김태호',
    state: 'normal',
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
