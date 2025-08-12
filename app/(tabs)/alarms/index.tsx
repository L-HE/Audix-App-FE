// app/(tabs)/alarms/index.tsx
import { useFocusEffect } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { Profiler, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, InteractionManager, Text, View } from 'react-native';

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

// 🚀 React.memo로 최적화된 AlarmCard 컴포넌트
const MemoizedAlarmCard = React.memo<{
  item: AlarmData;
  onPress: (item: AlarmData) => void;
}>(({ item, onPress }) => {
  return (
    <AlarmCard
      {...item}
      onPress={() => onPress(item)}
    />
  );
}, (prevProps, nextProps) => {
  // 정확한 비교로 불필요한 리렌더 방지
  return prevProps.item.alarmId === nextProps.item.alarmId &&
         prevProps.item.status === nextProps.item.status &&
         prevProps.item.createdAt === nextProps.item.createdAt;
});

const AlarmScreenContent: React.FC = () => {
  const { setModalVisible, setModalData } = useModal();
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const ITEMS_PER_PAGE = 8;
  const renderStartTime = useRef(performance.now());

  // 🎬 단일 애니메이션 상태 (중복 제거)
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const hasAnimatedRef = useRef(false);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  // 성능 기반 애니메이션 설정
  const [shouldAnimate, setShouldAnimate] = useState(true);

  const shouldAnimateRef = useRef(true);
  useEffect(() => { shouldAnimateRef.current = shouldAnimate; }, [shouldAnimate]);

  // 성능 체크
  useEffect(() => {
    const sub = InteractionManager.runAfterInteractions(() => {
      const start = performance.now();
      for (let i = 0; i < 10000; i++) Math.random();
      const duration = performance.now() - start;
      
      if (duration > 8) {
        setShouldAnimate(false);
        console.log('⚡ [AlarmScreen] 애니메이션 최적화 모드 활성화');
      }
    });

    return () => sub?.cancel?.();
  }, []);

  // 🚀 최적화된 애니메이션 함수
  const runEntranceAnimation = useCallback(() => {
    console.log('🎬 [AlarmScreen] 애니메이션 시작 시도');

    if (animationRef.current) {
      animationRef.current.stop();
      console.log('🛑 [AlarmScreen] 이전 애니메이션 중단');
    }

    if (hasAnimatedRef.current) {
      slideAnim.setValue(0);
      opacityAnim.setValue(1);
      console.log('⚡ [AlarmScreen] 즉시 표시 (이미 애니메이션됨)');
      return;
    }

    if (!shouldAnimateRef.current) {
      slideAnim.setValue(0);
      opacityAnim.setValue(1);
      hasAnimatedRef.current = true;
      console.log('⚡ [AlarmScreen] 즉시 표시 (성능 최적화)');
      return;
    }

    hasAnimatedRef.current = true;
    slideAnim.setValue(-100);
    opacityAnim.setValue(0);

    console.log('🎬 [AlarmScreen] 슬라이드 애니메이션 시작');

    const slideAnimation = Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    });

    const opacityAnimation = Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 200,
      delay: 50,
      useNativeDriver: true,
    });

    animationRef.current = Animated.parallel([slideAnimation, opacityAnimation]);
    animationRef.current.start(({ finished }) => {
      console.log(finished ? '✅ [AlarmScreen] 애니메이션 완료' : '⚠️ [AlarmScreen] 애니메이션 중단됨');
      animationRef.current = null;
    });
    // slideAnim/opacityAnim은 ref.current라 안정적
  }, [slideAnim, opacityAnim]);

  // 최신 함수 참조를 ref로 보관
  const runAnimRef = useRef(runEntranceAnimation);

  useEffect(() => {
    runAnimRef.current = runEntranceAnimation;
  }, [runEntranceAnimation]);
  
  const sortedAlarmDataCache = useRef<AlarmData[] | null>(null);
  const sortedAlarmData = useMemo(() => {
    if (sortedAlarmDataCache.current) {
      console.log(`⚡ [AlarmScreen] 캐시된 정렬 데이터 사용`);
      return sortedAlarmDataCache.current;
    }

    const sortStart = performance.now();
    console.log(`📊 [AlarmScreen] 전체 데이터 정렬 시작: ${alarmData.length}개 아이템`);
    
    const sorted = [...alarmData].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    sortedAlarmDataCache.current = sorted;
    const sortEnd = performance.now();
    console.log(`⚡ [AlarmScreen] 전체 데이터 정렬 완료: ${(sortEnd - sortStart).toFixed(2)}ms`);
    
    return sorted;
  }, []);

  // 페이지네이션된 데이터
  const paginatedData = useMemo(() => {
    renderStartTime.current = performance.now();
    const maxItems = (currentPage + 1) * ITEMS_PER_PAGE;
    const result = sortedAlarmData.slice(0, Math.min(maxItems, sortedAlarmData.length));
    
    console.log(`📄 [AlarmScreen] 페이지네이션: page=${currentPage}, 최대=${maxItems}, 실제표시=${result.length}/${sortedAlarmData.length}`);
    
    return result;
  }, [currentPage, sortedAlarmData]);

  // 다음 페이지 여부
  const hasNextPage = useMemo(() => {
    const maxLoadableItems = (currentPage + 1) * ITEMS_PER_PAGE;
    const hasMore = maxLoadableItems < sortedAlarmData.length;
    console.log(`🔄 [AlarmScreen] 더 로드할 페이지 있음: ${hasMore}`);
    return hasMore;
  }, [currentPage, sortedAlarmData.length]);

  // 포커스 효과: deps 비움(한 번의 포커스 사이클에 1회)
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      // FlashList가 첫 렌더/레이아웃을 끝낸 뒤 실행
      const task = InteractionManager.runAfterInteractions(() => {
          if (!cancelled) {
            runAnimRef.current?.();
          }
      });

      return () => {
        cancelled = true;
        // @ts-ignore: cancel optional
        task?.cancel?.();
      };
    }, [])
  );

  const handleAlarmPress = useCallback((item: AlarmData) => {
    console.log(`🔔 [AlarmScreen] 알람 클릭: ${item.alarmId}`);
    setModalData(item);
    setModalVisible(true);
  }, [setModalData, setModalVisible]);

  // 🎯 최적화된 renderItem 함수
  const renderAlarmCard: ListRenderItem<AlarmData> = useCallback(({ item, index }) => {
    // 첫 번째와 마지막 아이템 렌더링 로그
    if (index === 0 || index === paginatedData.length - 1) {
      console.log(`📋 [AlarmScreen] 카드 렌더링: index=${index}, id=${item.alarmId}`);
    }
    
    return (
      <MemoizedAlarmCard 
        item={item} 
        onPress={handleAlarmPress}
      />
    );
  }, [handleAlarmPress, paginatedData.length]);

  // Context나 글로벌 상태로 페이지 상태 관리
  const pageStateRef = useRef({ currentPage: 0, hasAnimated: false });

  // 페이지 상태 복원
  useEffect(() => {
    if (pageStateRef.current.currentPage > 0) {
      setCurrentPage(pageStateRef.current.currentPage);
      console.log(`🔄 [AlarmScreen] 페이지 상태 복원: ${pageStateRef.current.currentPage}`);
    }
    if (pageStateRef.current.hasAnimated) {
      hasAnimatedRef.current = true;
    }
  }, []);

  const loadNextPage = useCallback(async () => {
    if (isLoadingMore || !hasNextPage) {
      console.log(`⏭️ [AlarmScreen] 페이지 로드 스킵: loading=${isLoadingMore}, hasNext=${hasNextPage}`);
      return;
    }

    console.log(`📄 [AlarmScreen] 다음 페이지 로드 시작: ${currentPage} → ${currentPage + 1}`);
    setIsLoadingMore(true);

    await new Promise(resolve => setTimeout(resolve, 200));

    setCurrentPage(prev => prev + 1);
    pageStateRef.current.currentPage = currentPage + 1; // 상태 저장
    setIsLoadingMore(false);
    
    console.log(`✅ [AlarmScreen] 페이지 ${currentPage + 1} 로드 완료`);
  }, [currentPage, hasNextPage, isLoadingMore]);

  const keyExtractor = useCallback((item: AlarmData) => item.alarmId, []);
  const getItemType = useCallback(() => 'alarmCard', []);

  const onEndReached = useCallback(() => {
    console.log(`🔄 [AlarmScreen] onEndReached 트리거`);
    loadNextPage();
  }, [loadNextPage]);

  // 뷰어블 로그 스팸 방지(측정 잡음 제거)
  const lastRangeRef = useRef<{first:number;last:number} | null>(null);
  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (!viewableItems?.length) return;
    const first = viewableItems[0].index ?? 0;
    const last = viewableItems[viewableItems.length - 1].index ?? first;
    const prev = lastRangeRef.current;
    if (!prev || prev.first !== first || prev.last !== last) {
      lastRangeRef.current = { first, last };
      console.log(`👁️ [AlarmScreen] 화면에 보이는 아이템: ${first}-${last}`);
    }
  }, []);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 100,
  }).current;

  // Footer 컴포넌트
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
        removeClippedSubviews={true}
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