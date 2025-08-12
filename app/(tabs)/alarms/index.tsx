// app/(tabs)/alarms/index.tsx
import { useFocusEffect } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, InteractionManager, Text, View } from 'react-native';

import { AlarmsScreenStyles as style } from '@/shared/styles/screens';
import { AlarmData, alarmData } from '../../../assets/data/alarmData';
import AlarmCard from '../../../components/screens/alarmCard';
import { useModal } from '../../../shared/api/modalContextApi';

// ─────────────────────────────────────────────
// 성능 최적화를 위한 메모이제이션된 알람 카드
//  - 동일 item의 주요 필드가 변하지 않으면 리렌더 방지
// ─────────────────────────────────────────────
const MemoizedAlarmCard = React.memo<{
  item: AlarmData;
  onPress: (item: AlarmData) => void;
}>(({ item, onPress }) => {
  return <AlarmCard {...item} onPress={() => onPress(item)} />;
}, (prevProps, nextProps) => {
  return (
    prevProps.item.alarmId === nextProps.item.alarmId &&
    prevProps.item.status === nextProps.item.status &&
    prevProps.item.createdAt === nextProps.item.createdAt
  );
});

// ─────────────────────────────────────────────
// 알람 화면 콘텐츠 컴포넌트
//  - 정렬/페이지네이션/모달 연동/진입 애니메이션
// ─────────────────────────────────────────────
const AlarmScreenContent: React.FC = () => {
  // ───────── 상태: 모달 제어, 페이지네이션 ─────────
  const { setModalVisible, setModalData } = useModal();
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const ITEMS_PER_PAGE = 8;

  // ───────── 애니메이션 상태: 첫 진입 시 슬라이드/페이드 인 ─────────
  const slideAnim = useRef(new Animated.Value(-100)).current; // 좌→우 슬라이드 시작 위치
  const opacityAnim = useRef(new Animated.Value(0)).current;  // 투명 → 불투명
  const hasAnimatedRef = useRef(false);                       // 동일 화면 재진입 시 중복 애니메이션 방지
  const animationRef = useRef<Animated.CompositeAnimation | null>(null); // 진행 중 애니메이션 핸들

  // ───────── 리스트 진입 애니메이션 실행 ─────────
  const runEntranceAnimation = useCallback(() => {
    // 이전 애니메이션이 남아있다면 중단
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }

    // 이미 애니메이션이 끝난 상태라면 최종 상태로 즉시 고정
    if (hasAnimatedRef.current) {
      slideAnim.setValue(0);
      opacityAnim.setValue(1);
      return;
    }

    // 초기값 설정 후 슬라이드/페이드 인 병렬 실행
    hasAnimatedRef.current = true;
    slideAnim.setValue(-100);
    opacityAnim.setValue(0);

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
    animationRef.current.start(() => {
      animationRef.current = null;
    });
  }, [opacityAnim, slideAnim]);

  // 최신 애니메이션 함수를 ref에 보관 (useFocusEffect 내 콜백에서 안정 참조)
  const runAnimRef = useRef(runEntranceAnimation);
  useEffect(() => {
    runAnimRef.current = runEntranceAnimation;
  }, [runEntranceAnimation]);

  // ───────── 알람 데이터 최신순 정렬 + 캐시 ─────────
  const sortedAlarmDataCache = useRef<AlarmData[] | null>(null);
  const sortedAlarmData = useMemo(() => {
    if (sortedAlarmDataCache.current) return sortedAlarmDataCache.current;

    const sorted = [...alarmData].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
    sortedAlarmDataCache.current = sorted;
    return sorted;
  }, []);

  // ───────── 페이지네이션된 데이터 계산 ─────────
  const paginatedData = useMemo(() => {
    const maxItems = (currentPage + 1) * ITEMS_PER_PAGE;
    return sortedAlarmData.slice(0, Math.min(maxItems, sortedAlarmData.length));
  }, [currentPage, sortedAlarmData]);

  // ───────── 다음 페이지 존재 여부 ─────────
  const hasNextPage = useMemo(() => {
    const maxLoadableItems = (currentPage + 1) * ITEMS_PER_PAGE;
    return maxLoadableItems < sortedAlarmData.length;
  }, [currentPage, sortedAlarmData.length]);

  // ───────── 화면 포커스 시 진입 애니메이션 트리거 ─────────
  // FlashList의 초기 레이아웃이 끝난 뒤 애니메이션 실행
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
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

  // ───────── 알람 카드 클릭 시 모달 오픈 ─────────
  const handleAlarmPress = useCallback(
    (item: AlarmData) => {
      setModalData(item);
      setModalVisible(true);
    },
    [setModalData, setModalVisible]
  );

  // ───────── FlashList의 renderItem (메모이제이션) ─────────
  const renderAlarmCard: ListRenderItem<AlarmData> = useCallback(
    ({ item }) => <MemoizedAlarmCard item={item} onPress={handleAlarmPress} />,
    [handleAlarmPress]
  );

  // ───────── 페이지 상태 로컬 보관/복원 ─────────
  const pageStateRef = useRef({ currentPage: 0, hasAnimated: false });

  useEffect(() => {
    if (pageStateRef.current.currentPage > 0) {
      setCurrentPage(pageStateRef.current.currentPage);
    }
    if (pageStateRef.current.hasAnimated) {
      hasAnimatedRef.current = true;
    }
  }, []);

  // ───────── 다음 페이지 로드 ─────────
  const loadNextPage = useCallback(async () => {
    if (isLoadingMore || !hasNextPage) return;

    setIsLoadingMore(true);
    // 실제 API가 있다면 여기에서 fetch/요청 수행
    await new Promise((resolve) => setTimeout(resolve, 200));

    setCurrentPage((prev) => {
      const next = prev + 1;
      pageStateRef.current.currentPage = next; // 복원용 저장
      return next;
    });
    setIsLoadingMore(false);
  }, [hasNextPage, isLoadingMore]);

  // ───────── FlashList 보조 설정 ─────────
  const keyExtractor = useCallback((item: AlarmData) => item.alarmId, []);
  const getItemType = useCallback(() => 'alarmCard', []);
  const onEndReached = useCallback(() => {
    loadNextPage();
  }, [loadNextPage]);

  // ───────── 뷰어빌리티 옵션 (필요시 조정) ─────────
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 100,
  }).current;

  // ───────── 리스트 Footer (로딩/더보기/끝) ─────────
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

  // ───────── 렌더 ─────────
  return (
    <Animated.View
      style={[
        style.container,
        {
          transform: [{ translateX: slideAnim }],
          opacity: opacityAnim,
        },
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
        // onViewableItemsChanged 제거: 디버그 로그 삭제
        viewabilityConfig={viewabilityConfig}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        drawDistance={300}
        contentContainerStyle={style.contentContainer}
        ListFooterComponent={footerComponent}
        // onBlankArea 제거: 디버그 경고 삭제
      />
    </Animated.View>
  );
};

// ─────────────────────────────────────────────
// 메인 스크린 컴포넌트 (Profiler 제거)
// ─────────────────────────────────────────────
const AlarmScreen: React.FC = () => {
  return <AlarmScreenContent />;
};

export default AlarmScreen;
