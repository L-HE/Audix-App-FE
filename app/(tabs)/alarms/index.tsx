// app/(tabs)/alarms/index.tsx
import React, { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { useModal } from '@/shared/api/modalContextApi';
import { Colors } from '@/shared/styles/global';
import { AlarmCardProps, alarmData } from '../../../assets/data/alarmData';
import AlarmCard from '../../../components/screens/alarmCard';

const AlarmScreen: React.FC = () => {
  const { showModal } = useModal();

  // 렌더 함수와 핸들러 캐싱
  const renderAlarmItem = useCallback(({ item }: { item: AlarmCardProps }) => (
    <AlarmCard
      {...item}
      onPress={() => showModal(item)}
    />
  ), [showModal]);

  const keyExtractor = useCallback((item: AlarmCardProps) => item.alarmId, []);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 88, // 카드 높이 + 마진 (대략적인 값)
    offset: 88 * index,
    index,
  }), []);

  return (
    <View style={styles.container}>
      <FlatList
        data={alarmData}
        renderItem={renderAlarmItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        maxToRenderPerBatch={15}
        windowSize={10}
        initialNumToRender={10}
        updateCellsBatchingPeriod={50}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 20,
  },
});

export default AlarmScreen;