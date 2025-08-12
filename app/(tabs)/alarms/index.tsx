// app/(tabs)/alarms/index.tsx
import { useFocusEffect } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { Profiler, useCallback, useMemo, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';

import { AlarmsScreenStyles as style } from '@/shared/styles/screens';
import { AlarmData, alarmData } from '../../../assets/data/alarmData';
import AlarmCard from '../../../components/screens/alarmCard';
import { useModal } from '../../../shared/api/modalContextApi';

// React Profiler 콜백 함수
const onRenderCallback = (
  id: string,
  phase: 'mount' | 'update' | 'nested-update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) => {
  const isSlowRender = actualDuration > 16;
  const expectedTime = baseDuration * 0.6;
  
  if (isSlowRender) {
    console.log(`🐌 [React Profiler] ${id} (${phase}): ${actualDuration.toFixed(2)}ms ← SLOW RENDER!`);
    
    if (actualDuration > expectedTime) {
      console.warn(`⚠️ [React Profiler] ${id} 예상보다 느린 렌더링: 실제=${actualDuration.toFixed(2)}ms, 예상=${expectedTime.toFixed(2)}ms`);
    }
  } else {
    console.log(`⚡ [React Profiler] ${id} (${phase}): ${actualDuration.toFixed(2)}ms`);
  }
};

const AlarmScreenContent: React.FC = () => {
  const { setModalVisible, setModalData } = useModal();
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const ITEMS_PER_PAGE = 8;
  const renderStartTime = useRef(performance.now());

  // 애니메이션 관련 상태 (기존과 동일)
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const hasAnimatedRef = useRef(false);

  // 정렬된 전체 데이터 (한 번만 정렬)
  const sortedAlarmData = useMemo(() => {
    const sortStart = performance.now();
    console.log(`📊 [AlarmScreen] 전체 데이터 정렬 시작: ${alarmData.length}개 아이템`);
    
    const sorted = [...alarmData].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // 최신순
    });

    const sortEnd = performance.now();
    console.log(`⚡ [AlarmScreen] 전체 데이터 정렬 완료: ${(sortEnd - sortStart).toFixed(2)}ms`);
    
    return sorted;
  }, []);

  // ✅ 현재 페이지까지의 데이터 (누적 → 최대 표시 개수 제한)
  const paginatedData = useMemo(() => {
    renderStartTime.current = performance.now();
    const maxItems = (currentPage + 1) * ITEMS_PER_PAGE;
    const result = sortedAlarmData.slice(0, Math.min(maxItems, sortedAlarmData.length));
    
    console.log(`📄 [AlarmScreen] 페이지네이션: page=${currentPage}, 최대=${maxItems}, 실제표시=${result.length}/${sortedAlarmData.length}`);
    
    return result;
  }, [currentPage, sortedAlarmData]);

  // ✅ 다음 페이지 여부 (더 정확한 계산)
  const hasNextPage = useMemo(() => {
    const maxLoadableItems = (currentPage + 1) * ITEMS_PER_PAGE;
    const hasMore = maxLoadableItems < sortedAlarmData.length;
    console.log(`🔄 [AlarmScreen] 더 로드할 페이지 있음: ${hasMore} (현재표시=${paginatedData.length}, 최대가능=${maxLoadableItems}, 전체=${sortedAlarmData.length})`);
    return hasMore;
  }, [currentPage, paginatedData.length, sortedAlarmData.length]);

  // 탭 포커스 시 슬라이드 애니메이션
  useFocusEffect(
    useCallback(() => {
      console.log('📱 [AlarmScreen] Tab focused');
      
      if (hasAnimatedRef.current) {
        slideAnim.setValue(0);
        opacityAnim.setValue(1);
        return;
      }

      hasAnimatedRef.current = true;
      slideAnim.setValue(-100);
      opacityAnim.setValue(0);

      console.log('🎬 [AlarmScreen] 슬라이드 애니메이션 시작');
      
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
      ]).start(() => {
        console.log('✅ [AlarmScreen] 슬라이드 애니메이션 완료');
      });

      return () => {
        console.log('🔄 [AlarmScreen] Tab unfocused');
      };
    }, [slideAnim, opacityAnim])
  );

  const handleAlarmPress = useCallback((item: AlarmData) => {
    console.log(`🔔 [AlarmScreen] 알람 클릭: ${item.alarmId}`);
    setModalData(item);
    setModalVisible(true);
  }, [setModalData, setModalVisible]);

  const renderAlarmCard: ListRenderItem<AlarmData> = useCallback(({ item, index }) => {
    // 첫 번째와 마지막 아이템 렌더링 로그
    if (index === 0 || index === paginatedData.length - 1) {
      console.log(`📋 [AlarmScreen] 카드 렌더링: index=${index}, id=${item.alarmId}`);
    }
    
    return (
      <AlarmCard
        {...item}
        onPress={() => handleAlarmPress(item)}
      />
    );
  }, [handleAlarmPress, paginatedData.length]);

  // ✅ 다음 페이지 로드 함수 (로그 개선)
  const loadNextPage = useCallback(async () => {
    if (isLoadingMore || !hasNextPage) {
      console.log(`⏭️ [AlarmScreen] 페이지 로드 스킵: loading=${isLoadingMore}, hasNext=${hasNextPage}`);
      return;
    }

    console.log(`📄 [AlarmScreen] 다음 페이지 로드 시작: ${currentPage} → ${currentPage + 1} (현재 ${paginatedData.length}개 표시 중)`);
    setIsLoadingMore(true);

    // API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 200));

    setCurrentPage(prev => prev + 1);
    setIsLoadingMore(false);
    
    const nextMaxItems = (currentPage + 2) * ITEMS_PER_PAGE; // +2 because currentPage will be +1
    const nextDisplayCount = Math.min(nextMaxItems, sortedAlarmData.length);
    console.log(`✅ [AlarmScreen] 페이지 ${currentPage + 1} 로드 완료 → 다음 표시 예정: ${nextDisplayCount}개`);
  }, [currentPage, hasNextPage, isLoadingMore, paginatedData.length, sortedAlarmData.length]);

  const keyExtractor = useCallback((item: AlarmData) => item.alarmId, []);

  // onEndReached 핸들러
  const onEndReached = useCallback(() => {
    console.log(`🔄 [AlarmScreen] onEndReached 트리거`);
    loadNextPage();
  }, [loadNextPage]);

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const firstVisible = viewableItems[0].index;
      const lastVisible = viewableItems[viewableItems.length - 1].index;
      console.log(`👁️ [AlarmScreen] 화면에 보이는 아이템: ${firstVisible}-${lastVisible} (총 ${viewableItems.length}개)`);
    }
  }, []);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 100,
  }).current;

  const getItemType = useCallback(() => 'alarmCard', []);

  // Footer 컴포넌트 (로딩 인디케이터 또는 더보기 버튼)
  const footerComponent = useCallback(() => {
    if (isLoadingMore) {
      return (
        <View style={{ padding: 16, alignItems: 'center' }}>
          <Text style={{ color: '#666', fontSize: 14 }}>더 불러오는 중...</Text>
        </View>
      );
    }

    if (hasNextPage) {
      return (
        <View style={{ padding: 16, alignItems: 'center' }}>
          <Text 
            onPress={loadNextPage}
            style={{ 
              color: '#007AFF', 
              fontSize: 14, 
              fontWeight: '600',
              textAlign: 'center',
              paddingVertical: 8,
              paddingHorizontal: 16,
            }}
          >
            더 불러오기 ({paginatedData.length}/{sortedAlarmData.length})
          </Text>
        </View>
      );
    }

    if (paginatedData.length > 0) {
      return (
        <View style={{ padding: 16, alignItems: 'center' }}>
          <Text style={{ color: '#999', fontSize: 12 }}>
            모든 알람을 불러왔습니다 ({paginatedData.length}개)
          </Text>
        </View>
      );
    }

    return null;
  }, [hasNextPage, isLoadingMore, loadNextPage, paginatedData.length, sortedAlarmData.length]);

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
      <FlashList<AlarmData>
        data={paginatedData}
        renderItem={renderAlarmCard}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        estimatedItemSize={120}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        drawDistance={300}
        contentContainerStyle={style.contentContainer}
        ListFooterComponent={footerComponent}
        onBlankArea={(info) => {
          const blankSize = info.offsetEnd - info.offsetStart;
          if (blankSize > 240) {
            console.warn(`⚠️ [AlarmScreen] Blank area: ${blankSize.toFixed(1)}px`);
          }
        }}
      />
    </Animated.View>
  );
};

// Profiler로 감싼 메인 컴포넌트
const AlarmScreen: React.FC = () => {
  return (
    <Profiler id="AlarmScreen" onRender={onRenderCallback}>
      <AlarmScreenContent />
    </Profiler>
  );
};

export default AlarmScreen;