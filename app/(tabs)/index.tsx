// app/(tabs)/index.tsx - React Profiler 적용 버전
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import React, { Profiler, useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Area, getAreaData } from '../../assets/data/areaData';
import AreaCard from '../../components/screens/areaCard';
import { useRefreshStore } from '../../shared/store/refreshStore';
import { AreaScreenStyles as style } from '../../shared/styles/screens';
import { webSocketClient } from '../../shared/websocket/client';

export const headerShown = false;

const STATE_ORDER_MAP = { danger: 0, warning: 1, normal: 2, fixing: 3, mic_issue: 4 } as const;

// 🔍 React Profiler 콜백 함수 - 타입 안전 버전
const onRenderCallback = (...args: any[]) => {
  const [id, phase, actualDuration, baseDuration, startTime, commitTime, interactions] = args;
  
  // 성능 임계값 설정 (16ms)
  const isSlowRender = actualDuration > 16;
  const performanceIcon = isSlowRender ? '🐌' : '⚡';
  
  console.log(
    `${performanceIcon} [React Profiler] ${id} (${phase}):`,
    `${actualDuration.toFixed(2)}ms`,
    isSlowRender ? '← SLOW RENDER!' : ''
  );

  // 상세 정보 (필요시)
  if (actualDuration > 50) {
    console.log(`📊 [Performance Details] ${id}:`, {
      phase,
      actualDuration: `${actualDuration.toFixed(2)}ms`,
      baseDuration: `${baseDuration.toFixed(2)}ms`,
      startTime: `${startTime.toFixed(2)}ms`,
      commitTime: `${commitTime.toFixed(2)}ms`,
      interactions: interactions?.size || 0,
    });
  }
};

const AreaScreenContent: React.FC = () => {
  const router = useRouter();
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnlineMode, setIsOnlineMode] = useState(false);
  const { refreshTrigger } = useRefreshStore();

  // 🔧 Area 데이터 로딩 함수
  const loadAreas = useCallback(async () => {
    try {
      console.log('🌐 Area 데이터 로딩 중...');
      setLoading(true);
      
      const data = await getAreaData();
      setAreas(data);
      
      if (data.length > 4) {
        setIsOnlineMode(true);
        console.log('✅ 온라인 모드: API 데이터 사용');
      } else {
        setIsOnlineMode(false);
        console.log('📱 오프라인 모드: Fallback 데이터 사용');
      }
      
    } catch (error) {
      console.error('❌ Area 데이터 로딩 실패:', error);
      setIsOnlineMode(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔧 정렬된 카드 - sortAreas 인라인으로 처리하여 의존성 제거
  const sortedCards = useMemo(() => {
    console.log('🔄 AreaScreen: sortedCards 재계산 중...');
    if (areas.length === 0) return [];
    
    return areas.slice().sort(
      (a, b) =>
        (STATE_ORDER_MAP[a.state as keyof typeof STATE_ORDER_MAP] ?? 99) -
        (STATE_ORDER_MAP[b.state as keyof typeof STATE_ORDER_MAP] ?? 99)
    );
  }, [areas]); // areas만 의존성으로 설정

  // 🔧 FlashList용 렌더 함수
  const renderAreaCard: ListRenderItem<Area> = useCallback(({ item, index }) => {
    const handlePress = () => {
      router.push({ pathname: '/detail/[id]', params: { id: item.id } });
    };

    // 🔧 애니메이션 최적화 - 첫 3개만 애니메이션
    const animationDelay = index < 3 ? index * 15 : 0;
    
    return (
      <Animated.View
        entering={index < 3 ? FadeIn.delay(animationDelay).duration(80) : undefined}
        style={{ marginBottom: 12 }}
      >
        <AreaCard
          {...item}
          onPress={handlePress}
        />
      </Animated.View>
    );
  }, [router]);

  // 🔧 키 추출 함수
  const keyExtractor = useCallback((item: Area) => item.id, []);

  // 🔧 초기화 함수
  const initializeApp = useCallback(async () => {
    await loadAreas();
    
    try {
      const connected = await webSocketClient.connect();
      if (connected) {
        console.log('✅ WebSocket 연결 성공');
      }
    } catch (error) {
      console.log('📱 WebSocket 연결 실패, 오프라인 모드');
    }
  }, []);

  // 🔧 초기 데이터 로드 - 한 번만 실행
  useEffect(() => {
    initializeApp();
    return () => {
      webSocketClient.disconnect();
    };
  }, []);

  // 🔧 WebSocket 새로고침 - 직접 호출로 변경
  useEffect(() => {
    if (refreshTrigger > 0 && isOnlineMode && !loading) {
      console.log('🔄 WebSocket 알림으로 인한 Area 데이터 새로고침');
      loadAreas();
    }
  }, [refreshTrigger]); // refreshTrigger만 의존성

  // 🔧 로딩 컴포넌트
  const LoadingComponent = useMemo(() => {
    if (!loading) return null;
    
    return (
      <View style={style.loadingContainer}>
        <Animated.Text
          entering={FadeIn.duration(200)}
          style={style.loadingText}
        >
          구역 정보를 불러오는 중...
        </Animated.Text>
      </View>
    );
  }, [loading]);

  return (
    <View style={style.container}>
      <FlashList
        data={sortedCards}
        renderItem={renderAreaCard}
        keyExtractor={keyExtractor}
        estimatedItemSize={120}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 16,
        }}
        ListEmptyComponent={LoadingComponent}
        drawDistance={250}
        disableAutoLayout={false}
        scrollEventThrottle={16}
        decelerationRate="fast"
        overrideItemLayout={(layout, item, index) => {
          layout.size = 120;
        }}
        getItemType={() => 'areaCard'}
      />
    </View>
  );
};

// 🔍 React Profiler로 감싸진 메인 컴포넌트
const AreaScreen: React.FC = () => {
  return (
    <Profiler id="AreaScreen" onRender={onRenderCallback}>
      <AreaScreenContent />
    </Profiler>
  );
};

// 🔧 React.memo로 컴포넌트 메모이제이션
export default React.memo(AreaScreen);
