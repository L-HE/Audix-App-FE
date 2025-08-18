// app/(tabs)/index.tsx - 웹소켓 중복 연결 제거 버전
import { useFocusEffect } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, View } from 'react-native';

import SkeletonLoader from '../../components/common/skeletonLoader';
import AreaCard from '../../components/screens/areaCard';
import { useRefreshStore } from '../../shared/store/refreshStore';
import { AreaScreenStyles as style } from '../../shared/styles/screens';
import { areaLogic, type AreaItem } from '../../shared/api/area';

export const headerShown = false;

// API 응답 타입을 기존 Area 타입으로 사용
type Area = AreaItem;

// ─────────────────────────────────────────────
// 상태 우선순위 매핑(정렬에 사용)
// ─────────────────────────────────────────────
const STATE_ORDER_MAP = { danger: 0, warning: 1, normal: 2, fixing: 3, mic_issue: 4 } as const;

// ─────────────────────────────────────────────
// 영역 리스트 정렬: 상태 우선순위 기준
// ─────────────────────────────────────────────
const sortAreasByState = (areas: Area[]): Area[] => {
  if (areas.length === 0) return [];
  return areas.slice().sort((a, b) => {
    const aOrder = STATE_ORDER_MAP[a.status as keyof typeof STATE_ORDER_MAP] ?? 99;
    const bOrder = STATE_ORDER_MAP[b.status as keyof typeof STATE_ORDER_MAP] ?? 99;
    return aOrder - bOrder;
  });
};

// ─────────────────────────────────────────────
// 1회만 동작하는 페이드인 래퍼 (상단 일부 카드에 사용)
// ─────────────────────────────────────────────
const MemoizedFadeInOnce = React.memo<{
  delay: number;
  children: React.ReactNode;
}>(({ delay, children }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const playedRef = useRef(false);

  useEffect(() => {
    if (playedRef.current) return;
    playedRef.current = true;
    Animated.timing(opacity, {
      toValue: 1,
      duration: 120,
      delay,
      useNativeDriver: true,
    }).start();
  }, [delay, opacity]);

  return <Animated.View style={{ opacity }}>{children}</Animated.View>;
}, (prev, next) => prev.delay === next.delay);

// ─────────────────────────────────────────────
// AreaCard를 감싸는 경량 래퍼 (불필요 리렌더 방지)
// ─────────────────────────────────────────────
const MemoizedAreaCardWrapper = React.memo<{
  item: Area;
  index: number;
  onPress: (id: string) => void;
}>(({ item, index, onPress }) => {
  const handlePress = useCallback(() => onPress(String(item.id)), [item.id, onPress]);

  const shouldFade = index < 2; // 상위 2개만 페이드인
  const delay = index * 30;

  const card = (
    <View style={{ marginBottom: 12 }}>
      <AreaCard {...item} onPress={handlePress} />
    </View>
  );

  return shouldFade ?
    <MemoizedFadeInOnce delay={delay}>{card}</MemoizedFadeInOnce> : card;
}, (prev, next) => prev.item.id === next.item.id && prev.item.status === next.item.status);

// ─────────────────────────────────────────────
// 메인 화면 콘텐츠 컴포넌트
//  - 데이터 로드/정렬/페이드인/리스트 렌더
// ─────────────────────────────────────────────
const AreaScreenContent: React.FC = () => {
  const router = useRouter();
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnlineMode, setIsOnlineMode] = useState(false);
  const { refreshTrigger } = useRefreshStore();

  // 탭 포커스 시 페이드인 애니메이션
  const opacityAnim = useRef(new Animated.Value(0)).current; // 0→1
  const hasAnimatedRef = useRef(false); // 최초 1회만 동작

  // 렌더/정렬 관련 추적 값 (필요 시 로그용)
  const renderCountRef = useRef(0);
  const lastSortTimeRef = useRef(0);
  const isInitialLoadRef = useRef(true);

  // ───────── 탭 포커스 시 페이드인 (MenuScreen 패턴) ─────────
  useFocusEffect(
    useCallback(() => {
      if (hasAnimatedRef.current) {
        opacityAnim.setValue(1);
        return;
      }
      hasAnimatedRef.current = true;

      opacityAnim.setValue(0);
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        delay: 100,
        useNativeDriver: true,
      }).start();

      return () => { };
    }, [opacityAnim])
  );

  // ───────── 데이터 로딩 (실제 API 호출로 변경) ─────────
  const loadAreas = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);

      console.log('📋 Area 데이터 로딩 시작...');

      const minSkeletonTime = isRefresh ? 0 : 600;

      // 실제 API 호출
      const apiPromise = areaLogic.getList();
      const timePromise = new Promise((resolve) => setTimeout(resolve, minSkeletonTime));

      const [apiResult] = await Promise.all([apiPromise, timePromise]);

      if (apiResult.success) {
        console.log('✅ Area 데이터 로드 성공:', {
          count: apiResult.data.length,
          areas: apiResult.data.map(area => `${area.name} (${area.status})`)
        });

        // API 응답을 그대로 사용 (AreaItem = Area)
        setAreas(apiResult.data);
        setIsOnlineMode(apiResult.data.length > 0); // 데이터가 있으면 온라인 모드
      } else {
        console.error('❌ Area 데이터 로드 실패:', apiResult.error);

        // 실패 시 빈 배열로 설정
        setAreas([]);
        setIsOnlineMode(false);
      }

      if (isInitialLoadRef.current) {
        isInitialLoadRef.current = false;
      }
    } catch (error) {
      console.error('❌ Area 데이터 로딩 중 예외 발생:', error);
      setAreas([]);
      setIsOnlineMode(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // ───────── 정렬된 카드 목록 메모이제이션 ─────────
  const sortedCards = useMemo(() => {
    const sortStart = performance.now();
    renderCountRef.current++;

    if (areas.length === 0) return [];

    const result = sortAreasByState(areas);
    lastSortTimeRef.current = performance.now();
    void sortStart; // (미사용 변수 경고 방지용)

    return result;
  }, [areas]);

  // ───────── 네비게이션 핸들러 ─────────
  const handleAreaPress = useCallback(
    (areaId: string) => {
      router.push({ pathname: '/detail/[id]', params: { id: areaId } });
    },
    [router]
  );

  // ───────── FlashList 렌더 함수 ─────────
  const renderAreaCard: ListRenderItem<Area> = useCallback(
    ({ item, index }) => (
      <MemoizedAreaCardWrapper item={item} index={index} onPress={handleAreaPress} />
    ),
    [handleAreaPress]
  );

  // ───────── 키/타입/레이아웃 최적화: FlashList 힌트 ─────────
  const keyExtractor = useCallback((item: Area) => `area-${item.id}`, []);
  const getItemType = useCallback(() => 'areaCard', []);
  const overrideItemLayout = useCallback((layout: any) => {
    layout.size = 120;
  }, []);

  // ───────── 초기화: 데이터 로드 (웹소켓 연결 제거) ─────────
  const initializeApp = useCallback(async () => {
    await loadAreas(false);
  }, [loadAreas]);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  // ───────── 새로고침(디바운싱) ─────────
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (refreshTrigger > 0 && isOnlineMode && !loading) {
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = setTimeout(() => {
        loadAreas(true);
      }, 200);
    }
    return () => {
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
    };
  }, [refreshTrigger, isOnlineMode, loading, loadAreas]);

  // ───────── 리스트 스타일 메모이제이션 ─────────
  const contentContainerStyle = useMemo(
    () => ({
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 16,
    }),
    []
  );

  // ───────── 렌더링 ─────────
  return (
    <Animated.View style={[style.container, { opacity: opacityAnim }]}>
      {loading ? (
        <SkeletonLoader />
      ) : (
        <FlashList
          data={sortedCards}
          renderItem={renderAreaCard}
          keyExtractor={keyExtractor}
          getItemType={getItemType}
          overrideItemLayout={overrideItemLayout}
          estimatedItemSize={120}
          contentContainerStyle={contentContainerStyle}
          showsVerticalScrollIndicator={false}
          extraData={areas.length}
        />
      )}
    </Animated.View>
  );
};

// ─────────────────────────────────────────────
// 메인 화면 래퍼 (기타 성능 최적화 등)
// ─────────────────────────────────────────────
const AreaScreen: React.FC = () => {
  return <AreaScreenContent />;
};

export default AreaScreen;