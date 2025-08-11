// app/detail/[id].tsx
import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Text } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { Machine, getMachineDataByAreaId } from '../../../assets/data/machineData';
import MachineCard from '../../../components/screens/machineCard';
import { useLoadingStore } from '../../../shared/store/loadingStore';
import { useRefreshStore } from '../../../shared/store/refreshStore';
import { DetailScreenStyles as style } from '../../../shared/styles/screens';

type Params = { id: string };

// 개별 Machine 행 컴포넌트 (FlashList row)
// 필요한 필드만 비교하여 불필요한 재렌더 방지
const MachineRow = React.memo<Machine>((props) => {
  return <MachineCard {...props} />;
}, (prev, next) => {
  // Machine에서 렌더에 영향 주는 핵심 필드 비교
  return (
    prev.status === next.status &&
    prev.normalScore === next.normalScore
  );
});

// React Profiler 콜백 함수
const onRenderCallback = (
  id: string,
  phase: 'mount' | 'update' | 'nested-update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) => {
  const threshold = 16; // 60fps 기준 16ms
  
  if (actualDuration > threshold) {
    console.log(`🐌 [React Profiler] DetailScreen (${phase}): ${actualDuration.toFixed(2)}ms ← SLOW RENDER!`);
  } else {
    console.log(`⚡ [React Profiler] DetailScreen (${phase}): ${actualDuration.toFixed(2)}ms`);
  }
  
  // 추가 성능 정보
  if (actualDuration > baseDuration * 2) {
    console.warn(`⚠️ [React Profiler] DetailScreen 예상보다 느린 렌더링: 실제=${actualDuration.toFixed(2)}ms, 예상=${baseDuration.toFixed(2)}ms`);
  }
};

const DetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<Params>();
  const [machines, setMachines] = useState<Machine[]>([]); // 화면에 표시되는 최신 스냅샷
  const [error, setError] = useState<string | null>(null);
  const [isOnlineMode, setIsOnlineMode] = useState(false);
  const { setLoading } = useLoadingStore();
  const { refreshTrigger } = useRefreshStore();
  
  // Pagination 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const itemsPerPage = 3; // 페이지당 아이템 수

  // 단순한 페이드 인 애니메이션만
  const opacity = useSharedValue(0);

  // 정렬된 데이터를 메모이제이션 (pagination 적용)
  const sortedMachines = useMemo(() => {
    // 원본 state 배열을 mutate 하지 않도록 복사본에서 정렬
    const sorted = [...machines].sort((a: Machine, b: Machine) => {
      const scoreA = a.normalScore <= 1 ? a.normalScore * 100 : a.normalScore;
      const scoreB = b.normalScore <= 1 ? b.normalScore * 100 : b.normalScore;
      return scoreA - scoreB;
    });
    
    // 현재 페이지까지의 데이터만 반환 (pagination)
    const endIndex = (currentPage + 1) * itemsPerPage;
    const paginatedData = sorted.slice(0, endIndex);

    return paginatedData;
  }, [machines, currentPage, itemsPerPage]);

  // 전체 데이터 저장 (pagination 계산용)
  const [allMachines, setAllMachines] = useState<Machine[]>([]);

  // 다음 페이지 로드 함수
  const loadNextPage = useCallback(() => {
    if (isLoadingMore || !hasNextPage) {
      console.log(`🚫 [Pagination] 다음 페이지 로드 스킵 - 로딩중: ${isLoadingMore}, 다음페이지 있음: ${hasNextPage}`);
      return;
    }
    
    const nextPage = currentPage + 1;
    const totalItems = machines.length; // allMachines 대신 machines 사용
    console.log(`📄 [Pagination] 다음 페이지 로드 시작: ${currentPage} → ${nextPage}`);
    console.log(`📄 [Pagination] 전체 아이템: ${totalItems}, 페이지당: ${itemsPerPage}`);
    
    setIsLoadingMore(true);
    
    // 시뮬레이션된 로딩 지연
    setTimeout(() => {
      const hasMore = (nextPage + 1) * itemsPerPage < totalItems;
      const currentShowingItems = (nextPage + 1) * itemsPerPage;
      
      setCurrentPage(nextPage);
      setHasNextPage(hasMore);
      setIsLoadingMore(false);
      
      console.log(`✅ [Pagination] 페이지 ${nextPage} 로드 완료`);
      console.log(`📊 [Pagination] 현재 표시 아이템: ${Math.min(currentShowingItems, totalItems)}/${totalItems}`);
      console.log(`🔄 [Pagination] 더 로드할 페이지 있음: ${hasMore}`);
    }, 500);
  }, [currentPage, machines.length, hasNextPage, isLoadingMore, itemsPerPage]);

  // 데이터 로딩 함수 (수정됨)
  const fetchData = async () => {
    if (!id) return;

    setLoading(true, '데이터를 불러오는 중...');
    setError(null);

    try {
      console.log('🌐 Detail Screen - Area ID로 기기 데이터 요청 (3초 타임아웃):', id);
      
      // ✅ 3초 타임아웃으로 API 호출
      const machineData = await getMachineDataByAreaId(id);

      // 전체 데이터와 첫 페이지 데이터 설정
      setAllMachines(machineData);
      setMachines(machineData); // 전체 새 스냅샷 (초기 로딩은 전체 교체 허용)
      setCurrentPage(0);
      setHasNextPage(machineData.length > itemsPerPage);

      // 데이터 소스 확인
      if (machineData.length > 2) { // API 데이터는 보통 더 많을 것
        setIsOnlineMode(true);
        console.log('✅ 온라인 모드: API 기기 데이터 사용');
      } else {
        setIsOnlineMode(false);
        console.log('📱 오프라인 모드: Fallback 기기 데이터 사용');
      }

    } catch (error) {
      console.error('❌ Detail Screen - 데이터 로딩 실패 (3초 타임아웃):', error);
      setIsOnlineMode(false);
      
      // 에러 타입 확인
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.log('⏰ API 요청 타임아웃 (3초), fallback 기기 데이터 사용');
          setError('네트워크 연결이 느립니다. 저장된 데이터를 표시합니다.');
        } else {
          console.log('🌐 네트워크 오류, fallback 기기 데이터 사용');
          setError('네트워크 오류가 발생했습니다. 저장된 데이터를 표시합니다.');
        }
      } else {
        setError('데이터를 불러오는데 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Incremental Update Batching
  // -----------------------------
  // 외부(웹소켓 등)에서 들어오는 개별/다중 머신 변경을 모아서 1 프레임(or interval) 단위로 flush
  type MachinePartial = Partial<Machine> & { deviceId: number };
  const pendingUpdatesRef = useRef<Map<string, MachinePartial>>(new Map());
  const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleFlush = useCallback(() => {
    if (flushTimerRef.current) return; // 이미 스케줄됨
    // 16ms 이내(다음 프레임 수준)로 묶어서 적용
    flushTimerRef.current = setTimeout(() => {
      flushTimerRef.current = null;
      if (pendingUpdatesRef.current.size === 0) return;

      const updates = pendingUpdatesRef.current;
      pendingUpdatesRef.current = new Map();

      setMachines(prev => {
        let changed = false;
        const nextArr = prev.map(m => {
          const upd = updates.get(String(m.deviceId));
          if (!upd) return m; // unchanged
          const merged: Machine = { ...m, ...upd } as Machine;
          if (
            merged.status !== m.status ||
            merged.normalScore !== m.normalScore ||
            merged.name !== m.name ||
            merged.image !== m.image
          ) {
            changed = true;
            return merged;
          }
          return m;
        });
        return changed ? nextArr : prev;
      });
    }, 16); // 약 1 프레임
  }, []);

  // 외부에서 호출할 업데이트 enqueue 함수 (예: websocket message handler에서 사용)
  const enqueueMachineUpdates = useCallback((incoming: MachinePartial | MachinePartial[]) => {
    const arr = Array.isArray(incoming) ? incoming : [incoming];
    let added = false;
    arr.forEach(upd => {
      if (upd.deviceId == null) return;
      const key = String(upd.deviceId);
      const existing = pendingUpdatesRef.current.get(key);
      if (existing) {
        pendingUpdatesRef.current.set(key, { ...existing, ...upd });
      } else {
        pendingUpdatesRef.current.set(key, upd);
      }
      added = true;
    });
    if (added) scheduleFlush();
  }, [scheduleFlush]);

  // (예시) refreshTrigger & 온라인 모드일 때 전체 재패치 대신 일부 필드만 증분 반영 가능
  // 현재는 기존 fetch 전략 유지, 필요 시 아래 로직을 확장하면 됨.
  // useEffect(() => {
  //   if (refreshTrigger > 0 && isOnlineMode) {
  //     websocketClient.on('machineUpdate', payload => enqueueMachineUpdates(payload));
  //   }
  // }, [refreshTrigger, isOnlineMode, enqueueMachineUpdates]);

  // 디버깅 편의를 위해 개발중 window 전역에 부착 (웹 환경 빌드시)
  // @ts-ignore
  if (typeof globalThis !== 'undefined') (globalThis as any).enqueueMachineUpdates = enqueueMachineUpdates;

  // viewabilityConfig / footer / overrideItemLayout / onEndReached 안정화
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 30,
    minimumViewTime: 100
  }).current;

  // FlashList 타입과 동일한 시그니처로 수정
  type OverrideLayoutFn = (
    layout: { size?: number; span?: number },
    item: Machine,
    index: number,
    maxColumns: number,
    extra?: unknown
  ) => void;

  const overrideItemLayout: OverrideLayoutFn = useCallback((layout) => {
    layout.size = 160;
  }, []);

  const footerComponent = useCallback(() => {
    if (!hasNextPage) {
      return (
        <Text style={{
          textAlign: 'center',
          padding: 20,
          color: '#666',
          fontSize: 14
        }}>
          📄 모든 기기를 불러왔습니다 ({machines.length}개)
        </Text>
      );
    }
    if (isLoadingMore) {
      return (
        <Text style={{
          textAlign: 'center',
          padding: 20,
          color: '#007AFF',
          fontSize: 14
        }}>
          🔄 더 많은 기기를 불러오는 중...
        </Text>
      );
    }
    return null;
  }, [hasNextPage, isLoadingMore, machines.length]);

  const handleEndReached = useCallback(() => {
    // ✅ 무한 호출 방지
    if (isLoadingMore || !hasNextPage) {
      return;
    }
    loadNextPage();
  }, [isLoadingMore, hasNextPage, loadNextPage]);

  // 화면 진입 애니메이션
  useEffect(() => {
    fetchData();

    // 간단한 페이드 인 애니메이션
    opacity.value = withTiming(1, { duration: 300 });
  }, [id]);

  // 웹소켓 알림을 받으면 데이터 새로고침 (온라인 모드)
  useEffect(() => {
    if (refreshTrigger > 0 && isOnlineMode) {
      console.log('🔄 웹소켓 알림으로 인한 Machine 데이터 새로고침');
      fetchData();
    } else if (refreshTrigger > 0 && !isOnlineMode) {
      console.log('📱 오프라인 모드이므로 웹소켓 새로고침 스킵');
    }
  }, [refreshTrigger, isOnlineMode]);

  // FlashList 렌더링 최적화
  const renderMachine = useCallback(({ item, index }: { item: Machine; index: number }) => {
    return (
      <Animated.View entering={FadeIn.delay(index * 25).duration(240)}>
        <MachineRow {...item} />
      </Animated.View>
    );
  }, []);

  const keyExtractor = useCallback((item: Machine) => item.deviceId.toString(), []);

  // FlashList의 아이템 크기 추정 (성능 최적화를 위해 중요)
  const getItemType = useCallback(() => 'machineCard', []);

  // 애니메이션 스타일
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <React.Profiler id="DetailScreen" onRender={onRenderCallback}>
      <Animated.View style={[style.container, animatedStyle]}>
        {/* ✅ 에러 메시지 표시 */}
        {error && (
          <Animated.View entering={FadeIn.duration(300)} style={style.errorIndicator}>
            <Text style={style.errorText}>
              ⚠️ {error}
            </Text>
          </Animated.View>
        )}

        {/* FlashList로 교체 - Pagination 적용 */}
        <FlashList
          data={sortedMachines}
          renderItem={renderMachine}
          keyExtractor={keyExtractor}
          getItemType={getItemType}
          estimatedItemSize={160}
          drawDistance={1000}
          overrideItemLayout={overrideItemLayout}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.8}
          onLoad={(info) => {
            console.log('⚡ FlashList 로드 완료:', {
              elapsedTime: info.elapsedTimeInMs,
              totalItems: sortedMachines.length
            });
          }}
          onBlankArea={(e) => {
            const blankSize = e.offsetEnd - e.offsetStart;
            if (blankSize > 50) {
              console.warn(`⚠️ FlashList 빈 영역 크기: ${blankSize}px`);
            }
          }}
          onViewableItemsChanged={({ viewableItems, changed }) => {
            const currentDisplayed = sortedMachines.length;
            const totalAvailable = machines.length;
            console.log(`👁️ [FlashList] 화면에 보이는 아이템: ${viewableItems.length}`);
            console.log(`📊 [Pagination] 현재 로드된 아이템: ${currentDisplayed}/${totalAvailable} (페이지: ${currentPage + 1})`);
            const lastVisibleIndex = viewableItems.length
              ? Math.max(...viewableItems.map(v => v.index ?? 0))
              : -1;
            if (lastVisibleIndex >= currentDisplayed - 2) {
              console.log(`🔚 마지막 아이템 근처 (index ${lastVisibleIndex}/${currentDisplayed - 1})`);
            }
            changed.forEach(ci => {
              if (ci.isViewable) {
                console.log(`👁️ in [${ci.item?.deviceId}] index=${ci.index}`);
              }
            });
          }}
          viewabilityConfig={viewabilityConfig}
          ListFooterComponent={footerComponent}
          removeClippedSubviews={false}
          disableHorizontalListHeightMeasurement
          disableAutoLayout
        />
      </Animated.View>
    </React.Profiler>
  );
};

export default DetailScreen;