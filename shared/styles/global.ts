// shared/styles/global.ts
import { CardState } from '../../assets/data/areaData';

export const Colors = {
  // State Colors
  danger: '#FF3116',
  warning: '#FFC525',
  normal: '#1CAA00',
  unknown: '#D7D7D7',
  
  // Background Colors
  background: '#fff',
  backgroundSecondary: '#f2f2f2',
  
  // Text Colors
  textPrimary: '#000',
  textSecondary: '#666',
  textTertiary: '#777',
  
  // Border Colors
  border: '#656565',
  borderLight: '#e0e0e0',

} as const;

// 타입 정의
export type ColorKey = keyof typeof Colors;


export const getBorderColor = (state: CardState): string => {
  switch (state) {
    case 'danger':
      return Colors.danger;
    case 'warning':
      return Colors.warning;
    case 'normal':
      return Colors.normal;
    default:
      return Colors.unknown;
  }
};