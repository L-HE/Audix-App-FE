// shared/styles/global.ts
import { CardState } from '../../assets/data/areaData';

export const Colors = {
  // State Colors
  danger: '#FF2F16', /* 빨강 (위험) */
  warning: '#FFC525', /* 노랑 (점검요망) */
  normal: '#1CAA00', /* 초록 (안전) */
  fixing: '#898989', /* 연한 회색 (수리 중) */
  mic_issue: '#515151', /* 진한 회색 (마이크 미연결) */

  // Background Colors
  background: '#fff',
  backgroundSecondary: '#f2f2f2',
  backgroundInput: '#e0e0e0',
  backgroundSafetyAlarm: 'rgba(255, 255, 255, 0.1)',

  // icon Colors
  menuIcon: '#2c4d6b',

  // Text Colors
  textPrimary: '#000',
  textSecondary: '#666',
  textTertiary: '#777',
  textWhite: '#fff',

  // Button Colors
  buttonPrimary: '#000', // 검정색 버튼
  buttonDisabled: '#999', // 회색 버튼

  // Border Colors
  border: '#656565',
  borderLight: '#BFBFBF',

  // Gray Colors
  gray100: '#F2F2F2',
  gray300: '#808080',

  // Navy Colors
  navy400: '#212E59',
  navy100: '#303957',
  navy500: '#21273E',
  navy900: '#141B32',

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
    case 'fixing':
      return Colors.fixing;
    case 'mic_issue':
      return Colors.mic_issue;
    default:
      return Colors.mic_issue;
  }
};