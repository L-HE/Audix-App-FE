// components/screens/alarmCard.tsx
import { AlarmCardProps } from '@/assets/data/alarmData';
import { CardState } from '@/assets/data/areaData';
import { AlarmCardStyles as style } from '@/shared/styles/components';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTimeStore } from '../../shared/store/timeStore';
import { getBorderColor } from '../../shared/styles/global';

const AlarmCard: React.FC<AlarmCardProps> = (props) => {
  // props 구조 분해를 안전하게 처리
  const {
    regionName = '',
    regionLocation = '',
    status = 'mic_issue',
    type = 'machine',
    createdAt,
    onPress,
    ...otherProps
  } = props;

  // STATUS_LABELS 매핑 추가
  const STATUS_LABELS: Record<CardState, string> = {
    danger: '위험',
    warning: '점검 요망',
    normal: '정상',
    repair: '점검 중',
    offline: '마이크 미연결',
  };

  // 동적 alarmTitle 생성
  const displayTitle = React.useMemo(() => {
    // safety 타입이면 항상 '안전 사고 발생'
    if (type === 'safety') {
      return '안전 사고 발생';
    }
    
    return STATUS_LABELS[status as CardState];
  }, [type, status]);

  const borderColor = getBorderColor(status as CardState);
  const getRelativeTime = useTimeStore((state) => state.getRelativeTime);
  
  const timestamp = React.useMemo(() => {
    try {
      if (!createdAt) return '시간 정보 없음';
      const result = getRelativeTime(createdAt);
      return String(result);
    } catch (error) {
      console.error('Timestamp 계산 오류:', error);
      return '시간 정보 없음';
    }
  }, [createdAt, getRelativeTime]);

  return (
    <TouchableOpacity 
      style={[style.card, { borderColor, borderWidth: 2 }]} 
      onPress={onPress}
    >
      <View style={style.content}>
        <View style={style.textContainer}>
          <Text style={style.title}>{displayTitle}</Text>
          <Text style={style.subtitle}>{regionName}</Text>
          <Text style={style.subtitle}>{regionLocation}</Text>
        </View>
        <Text style={style.timestamp}>{timestamp}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default AlarmCard;