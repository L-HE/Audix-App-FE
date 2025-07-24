// assets/data/areaData.ts

import { AreaCardProps } from '../../components/screens/areaCard';

export type CardData = Omit<AreaCardProps, 'onPress'>;

export const area: CardData[] = [
  {
    id: '1',
    title: 'A-1구역',
    subtitle: '2층 자동차 부재료 조립구역',
    image: require('../../assets/images/AudixLogoNavy.png'),
    state: 'warning',
  },
  {
    id: '2',
    title: 'B-2구역',
    subtitle: '1층 전장품 검수구역',
    image: require('../../assets/images/AudixLogoNavy.png'),
    state: 'danger',
  },
  {
    id: '3',
    title: 'C-2구역',
    subtitle: '1층 전장품 검수구역',
    image: require('../../assets/images/AudixLogoNavy.png'),
    state: 'normal',
  },
  {
    id: '4',
    title: 'D-2구역',
    subtitle: '1층 전장품 검수구역',
    image: require('../../assets/images/AudixLogoNavy.png'),
    state: 'unknown',
  },
];
