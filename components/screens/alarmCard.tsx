// components/screens/alarmCard.tsx
import { AlarmCardProps } from '@/assets/data/alarmData';
import { CardState } from '@/assets/data/areaData';
import { AlarmCardStyles as style } from '@/shared/styles/components';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTimeStore } from '../../shared/store/timeStore';
import { getBorderColor } from '../../shared/styles/colors';

/**
 * AlarmCard
 * - 알람(장비/안전) 정보를 카드 형태로 표시
 * - 상태/지역/시간/클릭 이벤트를 렌더링
 */
const AlarmCard: React.FC<AlarmCardProps> = (props) => {
  // ───────────────────────────────────────────
  // 1) Prop 구조 분해 + 안전한 기본값
  //    - status 기본값은 CardState 집합에 포함되는 'offline'로 정규화
  // ───────────────────────────────────────────
  const {
    regionName = '',
    regionLocation = '',
    status = 'offline', // NOTE: 기존 'mic_issue' → CardState와 일치하는 'offline'으로 보정
    type = 'machine',
    createdAt,
    onPress,
  } = props;

  // ───────────────────────────────────────────
  // 2) 상태 라벨 매핑 (UI 표기용)
  // ───────────────────────────────────────────
  const STATUS_LABELS: Record<CardState, string> = {
    danger: '위험',
    warning: '점검 요망',
    normal: '정상',
    repair: '점검 중',
    offline: '마이크 미연결',
  };

  // ───────────────────────────────────────────
  // 3) 표시용 타이틀 계산
  //    - safety 타입이면 고정 문구
  //    - 그 외엔 상태 라벨 사용
  // ───────────────────────────────────────────
  const displayTitle = React.useMemo(() => {
    if (type === 'safety') return '안전 사고 발생';
    return STATUS_LABELS[status as CardState];
  }, [type, status]);

  // ───────────────────────────────────────────
  // 4) 스타일/보더 색상 계산
  // ───────────────────────────────────────────
  const borderColor = getBorderColor(status as CardState);

  // ───────────────────────────────────────────
  // 5) 상대 시간 계산 (전역 timeStore 활용)
  //    - 실패 시 안전한 폴백 문자열 반환
  // ───────────────────────────────────────────
  const getRelativeTime = useTimeStore((state) => state.getRelativeTime);
  const timestamp = React.useMemo(() => {
    try {
      if (!createdAt) return '시간 정보 없음';
      const result = getRelativeTime(createdAt);
      return String(result);
    } catch {
      return '시간 정보 없음';
    }
  }, [createdAt, getRelativeTime]);

  // ───────────────────────────────────────────
  // 6) 렌더
  //    - 카드 전체를 Touchable로 감싸 onPress 위임
  //    - 접근성 레이블로 카드 내용 요약 제공
  // ───────────────────────────────────────────
  return (
    <TouchableOpacity
      style={[style.card, { borderColor, borderWidth: 2 }]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`${displayTitle}, ${regionName} ${regionLocation}, ${timestamp}`}
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
