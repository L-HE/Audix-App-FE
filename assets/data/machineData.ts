// assets/data/machineData.ts

export interface MachineCardData {
  id: string;
  name: string;
  info: string;
  image: any;  // ImageSourcePropType 도 가능
}

export const machineData: MachineCardData[] = [
  {
    id: '1',
    name: '설비 A-1-1',
    info: '온도 이상 감지',
    image: require('../../assets/images/AudixLogoNavy.png'),
  },
  {
    id: '1',
    name: '설비 A-1-2',
    info: '정상 작동 중',
    image: require('../../assets/images/AudixLogoNavy.png'),
  },
  {
    id: '2',
    name: '설비 B-2-1',
    info: '점검 필요',
    image: require('../../assets/images/AudixLogoNavy.png'),
  },
];
