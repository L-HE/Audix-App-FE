// app/(tabs)/index.tsx - MenuScreen 스타일 FadeIn 애니메이션 적용
import { useFocusEffect } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import React, { Profiler, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, View } from 'react-native';

import { Area, getAreaData } from '../../assets/data/areaData';
import SkeletonLoader from '../../components/common/skeletonLoader';
import AreaCard from '../../components/screens/areaCard';
import { useRefreshStore } from '../../shared/store/refreshStore';
import { AreaScreenStyles as style } from '../../shared/styles/screens';
import { webSocketClient } from '../../shared/websocket/client';

export const headerShown = false;

const STATE_ORDER_MAP = { danger: 0, warning: 1, normal: 2, fixing: 3, mic_issue: 4 } as const;

// ✅ 1. 성능 최적화된 Profiler 콜백
const onRenderCallback = (
  id: string,
  phase: 'mount' | 'update' | 'nested-update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) => {
  const isSlowRender = actualDuration > 16;
  const performanceIcon = isSlowRender ? '🐌' : '⚡';
  
  // ✅ 로깅 최적화 - 조건부 출력
  if (isSlowRender || actualDuration > 10) {
    console.log(
      `${performanceIcon} [React Profiler] ${id} (${phase}): ${actualDuration.toFixed(2)}ms`,
      isSlowRender ? '← SLOW RENDER!' : ''
    );
  }
};

// ✅ 2. 정렬 로직 최적화 - 메모이제이션 강화
const sortAreasByState = (areas: Area[]): Area[] => {
  if (areas.length === 0) return [];
  
  return areas.slice().sort((a, b) => {
    const aOrder = STATE_ORDER_MAP[a.state as keyof typeof STATE_ORDER_MAP] ?? 99;
    const bOrder = STATE_ORDER_MAP[b.state as keyof typeof STATE_ORDER_MAP] ?? 99;
    return aOrder - bOrder;
  });
};

// ✅ 3. 메모이제이션된 애니메이션 컴포넌트
const MemoizedFadeInOnce = React.memo<{
  delay: number;
  children: React.ReactNode;
}>(({ delay, children }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const playedRef = useRef(false);
  
  useEffect(() => {
    if (playedRef.current) return;
    playedRef.current = true;
    
    // ✅ 애니메이션 최적화 - 더 빠른 실행
    Animated.timing(opacity, {
      toValue: 1,
      duration: 120, // 140ms → 120ms
      delay,
      useNativeDriver: true,
    }).start();
  }, [delay, opacity]);
  
  return <Animated.View style={{ opacity }}>{children}</Animated.View>;
}, (prev, next) => {
  // ✅ 정밀한 비교로 불필요한 리렌더링 방지
  return prev.delay === next.delay;
});

// ✅ 4. 메모이제이션된 AreaCard 래퍼
const MemoizedAreaCardWrapper = React.memo<{
  item: Area;
  index: number;
  onPress: (id: string) => void;
}>(({ item, index, onPress }) => {
  const handlePress = useCallback(() => {
    onPress(item.id);
  }, [item.id, onPress]);

  const shouldFade = index < 2;
  const delay = index * 30; // 40ms → 30ms로 단축

  const card = (
    <View style={{ marginBottom: 12 }}>
      <AreaCard {...item} onPress={handlePress} />
    </View>
  );

  return shouldFade ? (
    <MemoizedFadeInOnce delay={delay}>{card}</MemoizedFadeInOnce>
  ) : card;
}, (prev, next) => {
  // ✅ Area 객체의 핵심 props만 비교
  return (
    prev.item.id === next.item.id &&
    prev.item.state === next.item.state
  );
});

// ✅ 5. 메모이제이션된 SkeletonLoader 컴포넌트
const MemoizedSkeletonLoader = React.memo(() => {
  console.log('🔄 [SkeletonLoader] 스켈레톤 로더 표시');
  
  return (
    <View style={style.container}>
      <SkeletonLoader />
    </View>
  );
});

const AreaScreenContent: React.FC = () => {
  const router = useRouter();
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnlineMode, setIsOnlineMode] = useState(false);
  const { refreshTrigger } = useRefreshStore();
  
  // ✅ 6. MenuScreen 스타일 FadeIn 애니메이션 (탭 포커스 시)
  const opacityAnim = useRef(new Animated.Value(0)).current; // 초기값: 투명
  const hasAnimatedRef = useRef(false); // 최초 1회만 애니메이션

  // ✅ 7. 렌더링 횟수 추적 최적화
  const renderCountRef = useRef(0);
  const lastSortTimeRef = useRef(0);
  const isInitialLoadRef = useRef(true);

  // ✅ 8. 탭 포커스 시 FadeIn 애니메이션 (MenuScreen 패턴)
  useFocusEffect(
    useCallback(() => {
      console.log('📱 [AreaScreen] Tab focused');
      
      // 이미 애니메이션 재생했으면 스킵 (탭 재방문 시 애니메이션 안함)
      if (hasAnimatedRef.current) {
        opacityAnim.setValue(1);
        return;
      }

      // 최초 진입 시에만 애니메이션
      hasAnimatedRef.current = true;
      
      // 초기 투명도 설정
      opacityAnim.setValue(0);

      // FadeIn 애니메이션
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        delay: 100, // 약간의 지연으로 자연스러운 진입
        useNativeDriver: true,
      }).start(() => {
        console.log('✅ [AreaScreen] FadeIn 애니메이션 완료');
      });

      // cleanup (탭 떠날 때는 애니메이션 없음)
      return () => {
        console.log('🔄 [AreaScreen] Tab unfocused');
      };
    }, [opacityAnim])
  );

  // ✅ 9. Area 데이터 로딩 최적화 - 스켈레톤 로더 통합
  const loadAreas = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) {
        console.log('🌐 [AreaScreen] 초기 데이터 로딩 중...');
        setLoading(true);
      } else {
        console.log('🔄 [AreaScreen] 데이터 새로고침...');
      }
      
      // ✅ 초기 로딩 시 최소 스켈레톤 표시 시간 보장
      const minSkeletonTime = isRefresh ? 0 : 600;
      const dataPromise = getAreaData();
      const timePromise = new Promise(resolve => setTimeout(resolve, minSkeletonTime));
      
      const [data] = await Promise.all([dataPromise, timePromise]);
      
      // ✅ 배치 상태 업데이트로 렌더링 최소화
      setAreas(data);
      setIsOnlineMode(data.length > 4);
      
      console.log(data.length > 4 ? '✅ 온라인 모드: API 데이터 사용' : '📱 오프라인 모드: Fallback 데이터 사용');
      
      if (isInitialLoadRef.current) {
        console.log('✅ [AreaScreen] 스켈레톤 → 컨텐츠 전환 완료');
        isInitialLoadRef.current = false;
      }
      
    } catch (error) {
      console.warn('❌ Area 데이터 로딩 실패:', error);
      setIsOnlineMode(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ 10. 정렬된 카드 - 메모이제이션 강화 및 디버깅
  const sortedCards = useMemo(() => {
    const sortStart = performance.now();
    renderCountRef.current++;
    
    // ✅ 불필요한 재계산 방지
    if (areas.length === 0) {
      console.log('🔄 AreaScreen: areas 비어있음 - 정렬 스킵');
      return [];
    }
    
    // ✅ 성능 로깅 최적화 - 조건부 출력
    const timeSinceLastSort = sortStart - lastSortTimeRef.current;
    if (timeSinceLastSort < 100) {
      console.warn(`⚠️ AreaScreen: 너무 빠른 재정렬 (${timeSinceLastSort.toFixed(2)}ms 간격)`);
    }
    
    const result = sortAreasByState(areas);
    const sortEnd = performance.now();
    lastSortTimeRef.current = sortEnd;
    
    // ✅ 성능 임계값 기반 로깅
    const sortDuration = sortEnd - sortStart;
    if (sortDuration > 1 || renderCountRef.current % 10 === 0) {
      console.log(`🔄 AreaScreen: sortedCards 재계산 (${renderCountRef.current}회차, ${sortDuration.toFixed(2)}ms)`);
    }
    
    return result;
  }, [areas]);

  // ✅ 11. 네비게이션 핸들러 최적화
  const handleAreaPress = useCallback((areaId: string) => {
    router.push({ pathname: '/detail/[id]', params: { id: areaId } });
  }, [router]);

  // ✅ 12. FlashList 렌더 함수 최적화
  const renderAreaCard: ListRenderItem<Area> = useCallback(({ item, index }) => (
    <MemoizedAreaCardWrapper
      item={item}
      index={index}
      onPress={handleAreaPress}
    />
  ), [handleAreaPress]);

  // ✅ 13. 키 추출 함수 최적화
  const keyExtractor = useCallback((item: Area) => `area-${item.id}`, []);

  // ✅ 14. 아이템 타입 최적화
  const getItemType = useCallback(() => 'areaCard', []);

  // ✅ 15. 레이아웃 오버라이드 최적화
  const overrideItemLayout = useCallback((layout: any, item: Area, index: number) => {
    layout.size = 120;
  }, []);

  // ✅ 16. 초기화 함수 최적화
  const initializeApp = useCallback(async () => {
    const initStart = performance.now();
    
    await loadAreas(false); // 초기 로딩
    
    try {
      const connected = await webSocketClient.connect();
      console.log(connected ? '✅ WebSocket 연결 성공' : '📱 WebSocket 연결 실패, 오프라인 모드');
    } catch (error) {
      console.log('📱 WebSocket 연결 실패, 오프라인 모드');
    }
    
    const initEnd = performance.now();
    console.log(`⚡ AreaScreen 초기화 완료: ${(initEnd - initStart).toFixed(2)}ms`);
  }, [loadAreas]);

  // ✅ 17. 초기 데이터 로드 최적화
  useEffect(() => {
    initializeApp();
    return () => {
      webSocketClient.disconnect();
      console.log('🔄 AreaScreen: WebSocket 연결 해제');
    };
  }, [initializeApp]);

  // ✅ 18. WebSocket 새로고침 최적화 - 디바운싱 추가
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  useEffect(() => {
    if (refreshTrigger > 0 && isOnlineMode && !loading) {
      // ✅ 디바운싱으로 과도한 새로고침 방지
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      
      refreshTimeoutRef.current = setTimeout(() => {
        console.log('🔄 WebSocket 알림으로 인한 Area 데이터 새로고침');
        loadAreas(true); // 새로고침 (스켈레톤 스킵)
      }, 200); // 200ms 디바운싱
    }
    
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [refreshTrigger, isOnlineMode, loading, loadAreas]);

  // ✅ 19. FlashList 스타일 메모이제이션
  const contentContainerStyle = useMemo(() => ({
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  }), []);

  // ✅ 20. 조건부 렌더링 최적화 - SkeletonLoader 통합
  if (loading) {
    return <MemoizedSkeletonLoader />;
  }

  return (
    // ✅ MenuScreen 스타일 FadeIn 애니메이션 적용
    <Animated.View 
      style={[
        style.container,
        {
          opacity: opacityAnim, // FadeIn 애니메이션
        }
      ]}
    >
      <FlashList
        data={sortedCards}
        renderItem={renderAreaCard}
        keyExtractor={keyExtractor}
        estimatedItemSize={120}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        contentContainerStyle={contentContainerStyle}
        drawDistance={200} // 250 → 200으로 최적화
        disableAutoLayout={true} // false → true로 변경
        scrollEventThrottle={16}
        decelerationRate="fast"
        overrideItemLayout={overrideItemLayout}
        getItemType={getItemType}
      />
    </Animated.View>
  );
};

// ✅ 21. React Profiler로 감싸진 메인 컴포넌트
const AreaScreen: React.FC = () => {
  return (
    <Profiler id="AreaScreen" onRender={onRenderCallback}>
      <AreaScreenContent />
    </Profiler>
  );
};

// ✅ 22. React.memo 최적화 - 정밀한 비교
export default React.memo(AreaScreen, () => {
  // AreaScreen은 props가 없으므로 항상 같은 것으로 처리
  return true;
});
