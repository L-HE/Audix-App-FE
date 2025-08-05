// components/screens/alarmCard.tsx
import { AlarmData } from '@/assets/data/alarmData';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, getBorderColor } from '../../shared/styles/global';

const AlarmCard: React.FC<AlarmData> = React.memo(({ 
  alarmTitle, 
  regionName, 
  regionLocation, 
  machineStatus, 
  timestamp, 
  onPress 
}) => {
  // 무거운 계산 캐싱
  const borderColor = React.useMemo(() => getBorderColor(machineStatus), [machineStatus]);
  
  // 동적 스타일 캐싱
  const cardStyle = React.useMemo(() => [
    styles.card, 
    { borderColor, borderWidth: 2 }
  ], [borderColor]);

  return (
    <TouchableOpacity style={cardStyle} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{alarmTitle}</Text>
          <Text style={styles.subtitle}>{regionName}</Text>
          <Text style={styles.subtitle}>{regionLocation}</Text>
        </View>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // 커스텀 비교 함수 - 핵심 데이터만 비교
  return (
    prevProps.machineStatus === nextProps.machineStatus &&
    prevProps.timestamp === nextProps.timestamp &&
    prevProps.alarmTitle === nextProps.alarmTitle
  );
});

AlarmCard.displayName = 'AlarmCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
});

export default AlarmCard;