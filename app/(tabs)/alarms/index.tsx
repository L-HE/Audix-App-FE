// app/(tabs)/alarms/index.tsx
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native';

import { Colors } from '@/shared/styles/global';
import { AlarmData, alarmData } from '../../../assets/data/alarmData';
import AlarmCard from '../../../components/screens/alarmCard';
import { useModal } from '../../../shared/api/modalContextApi';

const AlarmScreen: React.FC = () => {
  const { setModalVisible, setModalData } = useModal();
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  // 한 번 정렬하고 페이지네이션 적용
  const paginatedData = useMemo(() => {
    // 1. 먼저 정렬
    const sorted = [...alarmData].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // 내림차순 정렬
    });

    // 2. 페이지네이션 적용
    return sorted.slice(0, page * ITEMS_PER_PAGE);
  }, [page]);

  // handleAlarmPress를 useCallback으로 메모이제이션
  const handleAlarmPress = useCallback((item: AlarmData) => {
    setModalData(item);
    setModalVisible(true);
  }, [setModalData, setModalVisible]);

  // renderItem 타입을 AlarmData로 수정
  const renderAlarmCard: ListRenderItem<AlarmData> = useCallback(({ item }) => (
    <AlarmCard
      {...item} // AlarmData의 모든 속성 전달
      onPress={() => handleAlarmPress(item)} // onPress 함수 추가
    />
  ), [handleAlarmPress]);

  // keyExtractor를 useCallback으로 메모이제이션
  const keyExtractor = useCallback((item: AlarmData) => item.alarmId, []);

  // 무한 스크롤 로직
  const loadMore = useCallback(() => {
    const totalItems = alarmData.length;
    const currentItems = paginatedData.length;
    
    if (currentItems < totalItems) {
      setPage(prev => prev + 1);
    }
  }, [paginatedData.length]);

  return (
    <View style={styles.container}>
      {/* FlatList 타입 명시 */}
      <FlatList<AlarmData>
        data={paginatedData}
        renderItem={renderAlarmCard}
        keyExtractor={keyExtractor}
        style={styles.flatList}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={10}
        removeClippedSubviews={true}
        getItemLayout={(data, index) => ({
          length: 120,
          offset: 120 * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  flatList: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 12,
    paddingBottom: 20,
  },
});

export default AlarmScreen;