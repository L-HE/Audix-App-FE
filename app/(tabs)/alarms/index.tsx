// app/(tabs)/alarms/index.tsx
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, FlatList, ListRenderItem } from 'react-native';

import { AlarmsScreenStyles as style } from '@/shared/styles/screens';
import { AlarmData, alarmData } from '../../../assets/data/alarmData';
import AlarmCard from '../../../components/screens/alarmCard';
import { useModal } from '../../../shared/api/modalContextApi';

const AlarmScreen: React.FC = () => {
  const { setModalVisible, setModalData } = useModal();
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  // 애니메이션 관련 상태
  const slideAnim = useRef(new Animated.Value(-100)).current; // 초기값: 화면 왼쪽 밖
  const opacityAnim = useRef(new Animated.Value(0)).current;   // 초기값: 투명
  const hasAnimatedRef = useRef(false); // 최초 1회만 애니메이션

  // 탭 포커스 시 슬라이드 애니메이션
  useFocusEffect(
    useCallback(() => {
      // 이미 애니메이션 재생했으면 스킵 (탭 재방문 시 애니메이션 안함)
      if (hasAnimatedRef.current) {
        slideAnim.setValue(0);
        opacityAnim.setValue(1);
        return;
      }

      // 최초 진입 시에만 애니메이션
      hasAnimatedRef.current = true;
      
      // 초기 위치 설정
      slideAnim.setValue(-100);
      opacityAnim.setValue(0);

      // 슬라이드 + 페이드인 애니메이션 (동시 실행)
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          delay: 50,
          useNativeDriver: true,
        }),
      ]).start();

      // cleanup (탭 떠날 때는 애니메이션 없음)
      return () => {
        // 필요 시 cleanup 로직
      };
    }, [slideAnim, opacityAnim])
  );

  // 기존 로직들
  const paginatedData = useMemo(() => {
    const sorted = [...alarmData].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });

      return sorted.slice(0, page * ITEMS_PER_PAGE);
  }, [page]);

  const handleAlarmPress = useCallback((item: AlarmData) => {
    setModalData(item);
    setModalVisible(true);
  }, [setModalData, setModalVisible]);

  const renderAlarmCard: ListRenderItem<AlarmData> = useCallback(({ item }) => (
    <AlarmCard
      {...item}
      onPress={() => handleAlarmPress(item)}
    />
  ), [handleAlarmPress]);

  const keyExtractor = useCallback((item: AlarmData) => item.alarmId, []);

  const loadMore = useCallback(() => {
    const totalItems = alarmData.length;
    const currentItems = paginatedData.length;
    
    if (currentItems < totalItems) {
      setPage(prev => prev + 1);
    }
  }, [paginatedData.length]);

  return (
    <Animated.View 
      style={[
        style.container,
        {
          transform: [{ translateX: slideAnim }],
          opacity: opacityAnim,
        }
      ]}
    >
      <FlatList<AlarmData>
        data={paginatedData}
        renderItem={renderAlarmCard}
        keyExtractor={keyExtractor}
        style={style.flatList}
        contentContainerStyle={style.contentContainer}
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
    </Animated.View>
  );
};

export default AlarmScreen;