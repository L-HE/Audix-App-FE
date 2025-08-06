// components/screens/alarmCard.tsx
import { AlarmData } from '@/assets/data/alarmData';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTimeStore } from '../../shared/store/timeStore';
import { Colors, getBorderColor } from '../../shared/styles/global';

const AlarmCard: React.FC<AlarmData> = (props) => {
  // props 구조 분해를 안전하게 처리
  const {
    alarmTitle = '',
    regionName = '',
    regionLocation = '',
    machineStatus = 'unknown',
    createdAt,
    onPress,
    ...otherProps
  } = props;

  const borderColor = getBorderColor(machineStatus);
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
      style={[styles.card, { borderColor, borderWidth: 2 }]} 
      onPress={onPress}
    >
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
};

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