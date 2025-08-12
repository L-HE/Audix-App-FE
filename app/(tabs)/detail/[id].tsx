// app/detail/[id].tsx
import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text } from 'react-native';
import Animated, {
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
// animateOnFirstMount 추가
interface MachineRowProps extends Machine {
  animateOnFirstMount?: boolean;
}

const MachineRow = React.memo<MachineRowProps>((props) => {
  return <MachineCard {...props} animateOnFirstMount={props.animateOnFirstMount} />;
}, (prev, next) => {
  // Machine에서 렌더에 영향 주는 핵심 필드 비교
  return (
    prev.status === next.status &&
    prev.normalScore === next.normalScore &&
    prev.animateOnFirstMount === next.animateOnFirstMount
  );
});

// React Profiler 콜백 함수
const onRenderCallback = (
  id: string,
  phase: 'mount' | 'update' | 'nested-update',
  actualDuration: number,
  baseDuration: number,
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

  // 아이템 높이 측정 상태 추가
  const [measuredItemHeight, setMeasuredItemHeight] = useState<number | null>(null);

  // 1) sortedMachines를 state로 전환
  const [sortedMachines, setSortedMachines] = useState<Machine[]>([]);

  // 기존 statusRank / normScoreVal
  const statusRank = useCallback((s: string) => {
    switch (s) {
      case 'danger':  return 0;
      case 'warning': return 1;
      case 'normal':  return 2;
      case 'repair':  return 3;
      case 'offline': return 4;
      default:        return 999;
    }
  }, []);
  const normScoreVal = useCallback((v: number) => (v <= 1 ? v * 100 : v), []);

  // 2) comparator & binary search insert
  const comparator = useCallback((a: Machine, b: Machine) => {
    const ra = statusRank(a.status) - statusRank(b.status);
    if (ra !== 0) return ra;
    return normScoreVal(a.normalScore) - normScoreVal(b.normalScore);
  }, [statusRank, normScoreVal]);

  const binarySearchInsert = useCallback((arr: Machine[], item: Machine) => {
    let low = 0, high = arr.length;
    while (low < high) {
      const mid = (low + high) >>> 1;
      if (comparator(item, arr[mid]) < 0) high = mid;
      else low = mid + 1;
    }
    return low;
  }, [comparator]);

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

    try {
      console.log('🌐 Detail Screen - Area ID로 기기 데이터 요청 (3초 타임아웃):', id);
      
      // 3초 타임아웃으로 API 호출
      const machineData = await getMachineDataByAreaId(id);

      // 전체 데이터와 첫 페이지 데이터 설정
      setMachines(machineData); // 전체 새 스냅샷 (초기 로딩은 전체 교체 허용)
      setCurrentPage(0);
      setHasNextPage(machineData.length > itemsPerPage);

      // initial sort + slice
      const allSorted = [...machineData].sort(comparator);
      setSortedMachines(allSorted.slice(0, itemsPerPage));

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
        } else {
          console.log('🌐 네트워크 오류, fallback 기기 데이터 사용');
        }
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
  
  // onEndReached 억제용 타임 윈도우 ref (scheduleFlush에서 변경 발생시 갱신)
  const suppressEndReachedUntilRef = useRef(0);
  
  // (선택) 초기 데이터 세팅 직후 과도 호출 차단 시간을 연장하고 싶다면 여기서 재사용
  const EXTENDED_BLOCK_MS = 250;

  // 기존 markDataMutation 확장: 차단 시간 연장
  const markDataMutation = useCallback(() => {
    suppressEndReachedUntilRef.current = Date.now() + EXTENDED_BLOCK_MS;
  }, []);

  const scheduleFlush = useCallback(() => {
    if (flushTimerRef.current) return;
    flushTimerRef.current = setTimeout(() => {
      flushTimerRef.current = null;
      const updates = Array.from(pendingUpdatesRef.current.values());
      if (updates.length === 0) return;
      pendingUpdatesRef.current.clear();

      setMachines(prev => {
        let changed = false;
        const actualChanges = new Set<number>(); // ✅ 실제 변경된 deviceId 추적
        
        const nextArr = prev.map(m => {
          const upd = updates.find(u => u.deviceId === m.deviceId);
          if (!upd) return m; // ✅ 업데이트 없으면 동일 객체 유지
          
          // ✅ 실제 변경 여부 먼저 확인
          const hasStatusChange = upd.status !== undefined && upd.status !== m.status;
          const hasScoreChange = upd.normalScore !== undefined && upd.normalScore !== m.normalScore;
          const hasNameChange = upd.name !== undefined && upd.name !== m.name;
          
          if (!hasStatusChange && !hasScoreChange && !hasNameChange) {
            return m; // ✅ 실제 변경 없으면 원본 객체 유지
          }
          
          // ✅ 실제 변경 있을 때만 새 객체 생성
          changed = true;
          actualChanges.add(m.deviceId);
          return { ...m, ...upd };
        });

        if (changed) {
          console.log(`🔄 [Incremental Update] ${actualChanges.size}개 아이템 실제 변경: [${Array.from(actualChanges).join(', ')}]`);
          
          // ✅ incremental sortedMachines 갱신 (변경된 것만 처리)
          setSortedMachines(prevSorted => {
            if (actualChanges.size === 0) return prevSorted; // ✅ 변경 없으면 동일 배열 유지
            
            // ✅ 변경된 아이템만 fullDataMap에 포함
            const changedMachines = new Map<number, Machine>();
            nextArr.forEach(m => {
              if (actualChanges.has(m.deviceId)) {
                changedMachines.set(m.deviceId, m);
              }
            });
            
            let arr = [...prevSorted]; // 복사 필요 (splice 때문)
            let hasPositionChange = false;
            
            actualChanges.forEach(deviceId => {
              const newMachine = changedMachines.get(deviceId)!;
              const oldIdx = arr.findIndex(x => x.deviceId === deviceId);
              
              if (oldIdx >= 0) {
                const oldMachine = arr[oldIdx];
                
                // ✅ 정렬 순서 변경 여부 확인
                const needsReposition = comparator(oldMachine, newMachine) !== 0;
                
                if (needsReposition) {
                  // 위치 변경 필요: 제거 후 새 위치에 삽입
                  arr.splice(oldIdx, 1);
                  const insertAt = binarySearchInsert(arr, newMachine);
                  arr.splice(insertAt, 0, newMachine);
                  hasPositionChange = true;
                  console.log(`📍 [Sort] deviceId=${deviceId} 위치 변경: ${oldIdx} → ${insertAt}`);
                } else {
                  // 위치 변경 불필요: 제자리에서 객체만 교체
                  arr[oldIdx] = newMachine;
                  console.log(`🔄 [Update] deviceId=${deviceId} 제자리 업데이트`);
                }
              }
            });
            
            // ✅ 페이징 범위 유지
            const result = arr.slice(0, (currentPage + 1) * itemsPerPage);
            
            if (hasPositionChange) {
              console.log(`📊 [Sort] 정렬 순서 변경으로 인한 재배치 완료`);
            }
            
            return result;
          });
          
          return nextArr;
        }
        
        console.log(`⏭️ [Incremental Update] 변경사항 없음 - 기존 배열 유지`);
        return prev; // ✅ 변경 없으면 동일 배열 유지
      });

      // onEndReached 억제
      markDataMutation();
    }, 32);
  }, [
    binarySearchInsert,
    comparator,
    currentPage,
    itemsPerPage,
    markDataMutation
  ]);

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
    if (hasNextPage && !isLoadingMore) {
      return (
        <Text
          onPress={() => {
            console.log('[Footer] Manual loadNextPage click');
            userScrolledRef.current = true;
            handleEndReached();
          }}
          style={{
            textAlign: 'center',
            padding: 14,
            color: '#007AFF',
            fontWeight: '600'
          }}
        >
          더 불러오기 (디버그)
        </Text>
      );
    }
    return null;
  }, [hasNextPage, isLoadingMore, machines.length]);

  // onEndReached 추가 가드용 ref
  const lastEndReachedPageRef = useRef(-1);          // 마지막으로 onEndReached 호출 당시의 currentPage
  const lastEndReachedTimeRef = useRef(0);           // 마지막 호출 시간(ms)
  const userScrolledRef = useRef(false);             // 사용자가 실제 스크롤을 했는지
  const pendingPageRequestRef = useRef(false);       // 중복 호출 방지

  // FlashList onEndReached 디버깅 강화 + 조건 세분화
  const DEBOUNCE_MS = 350;
  
  // onEndReached 강화된 가드
  const handleEndReached = useCallback(() => {
    const now = Date.now();
    const reasons: string[] = [];

    if (now < suppressEndReachedUntilRef.current) reasons.push('suppressWindow');
    if (!userScrolledRef.current) reasons.push('noUserScroll');
    if (isLoadingMore) reasons.push('isLoadingMore');
    if (pendingPageRequestRef.current) reasons.push('pendingRequest');
    if (!hasNextPage) reasons.push('noNextPage');
    if (lastEndReachedPageRef.current === currentPage) reasons.push('duplicatePage');
    if (now - lastEndReachedTimeRef.current < DEBOUNCE_MS) reasons.push(`debounce(${now - lastEndReachedTimeRef.current}ms)`);

    if (reasons.length) {
      console.log('[onEndReached] SKIP', {
        page: currentPage,
        totalItems: machines.length,
        shown: sortedMachines.length,
        reasons
      });
      return;
    }

    console.log('[onEndReached] TRIGGER', {
      page: currentPage,
      totalItems: machines.length,
      shown: sortedMachines.length
    });

    pendingPageRequestRef.current = true;
    lastEndReachedPageRef.current = currentPage;
    lastEndReachedTimeRef.current = now;
    loadNextPage();
  }, [
    currentPage,
    hasNextPage,
    isLoadingMore,
    loadNextPage,
    machines.length,
    sortedMachines.length
  ]);

  // 스크롤 발생 감지 (최초 1회만)
  const handleScroll = useCallback((e: any) => {
    if (userScrolledRef.current) return;
    const offsetY = e?.nativeEvent?.contentOffset?.y ?? 0;
    if (offsetY > 4) { // 32 → 4 로 낮춤 (스크롤 높이 작을 때도 감지)
      userScrolledRef.current = true;
      console.log('[Scroll] userScrolledRef = true (offsetY=', offsetY, ')');
    }
  }, []);

  // 컨텐츠 높이가 화면보다 작아 스크롤 불가한 경우 다음 페이지 자동 시도
  const handleContentSizeChange = useCallback(
    (w: number, h: number) => {
      // 레이아웃 높이 측정이 필요하므로 ref 로 한 번 저장
      if (!layoutHeightRef.current) return;
      if (
        h <= layoutHeightRef.current + 4 &&  // 거의 동일
        hasNextPage &&
        !isLoadingMore &&
        !pendingPageRequestRef.current
      ) {
        console.log('[ContentSize] 콘텐츠가 화면보다 작음 → next page preload');
        // 스크롤이 불가하므로 userScrolled 로 간주
        userScrolledRef.current = true;
        handleEndReached();
      }
    },
    [hasNextPage, isLoadingMore, handleEndReached]
  );

  // 레이아웃 높이 저장
  const layoutHeightRef = useRef(0);
  const onLayoutRoot = useCallback((e: any) => {
    layoutHeightRef.current = e?.nativeEvent?.layout?.height ?? 0;
  }, []);

  // 페이지 변경시 pending 해제
  useEffect(() => {
    pendingPageRequestRef.current = false;
  }, [currentPage]);

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

  // 간단한 수동 페이드용 (Reanimated entering 제거)
  const initialFadeIdsRef = useRef<Set<number>>(new Set());

  const renderMachine = useCallback(
    ({ item, index }: { item: Machine; index: number }) => {
      const onLayoutMeasure = !measuredItemHeight
        ? (e: any) => {
            const h = e.nativeEvent.layout.height;
            if (h > 0 && !measuredItemHeight) {
              setMeasuredItemHeight(h);
              console.log('[Measure] MachineCard height=', h);
            }
          }
        : undefined;

      const shouldFade = index < itemsPerPage && !initialFadeIdsRef.current.has(item.deviceId);
      if (shouldFade) initialFadeIdsRef.current.add(item.deviceId);

      const animateOnFirstMount = index < 2; // 상위 두 개만 초기 0→값 애니

      return (
        <Animated.View
          onLayout={onLayoutMeasure}
          style={shouldFade ? { opacity: 0 } : undefined}
          ref={(ref: any) => {
            if (ref && shouldFade) {
              requestAnimationFrame(() => {
                try {
                  ref.setNativeProps({ style: { opacity: 1, transitionDuration: '180ms' } });
                } catch {}
              });
            }
          }}
        >
          <MachineRow {...item} animateOnFirstMount={animateOnFirstMount} />
        </Animated.View>
      );
    },
    [itemsPerPage, measuredItemHeight]
  );

  const keyExtractor = useCallback((item: Machine) => item.deviceId.toString(), []);

  // FlashList의 아이템 크기 추정 (성능 최적화를 위해 중요)
  const getItemType = useCallback(() => 'machineCard', []);

  // 애니메이션 스타일
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // 2) 초기 pagination 지연: 첫 페이지 UI 안정 뒤 200ms 후 prefetch
  useEffect(() => {
    if (currentPage === 0 && hasNextPage) {
      const t = setTimeout(() => {
        userScrolledRef.current = true;
        handleEndReached();
      }, 200);
      return () => clearTimeout(t);
    }
  }, [currentPage, hasNextPage, handleEndReached]);

  // 페이지 변경 시 표시 목록 확장 (sortedMachines 확장 누락 해결)
  useEffect(() => {
    const end = (currentPage + 1) * itemsPerPage;

    // 이미 충분히 포함돼 있으면 패스
    if (sortedMachines.length >= end) return;

    // 전체를 다시 정렬(빈도 낮음). Incremental 정렬 최적화는 scheduleFlush 에서 유지.
    const fullSorted = [...machines].sort(comparator);
    const nextSlice = fullSorted.slice(0, end);
    if (nextSlice.length !== sortedMachines.length) {
      setSortedMachines(nextSlice);
      // 필요 시: console.log(`[Pagination] slice 확장: ${sortedMachines.length} -> ${nextSlice.length}`);
    }
  }, [currentPage, machines, comparator, itemsPerPage, sortedMachines.length, sortedMachines]);

  return (
    <React.Profiler id="DetailScreen" onRender={onRenderCallback}>
      <Animated.View style={[style.container, animatedStyle]}>
        {/* FlashList로 교체 - Pagination 적용 */}
        <FlashList
          data={sortedMachines}
          renderItem={renderMachine}
          keyExtractor={keyExtractor}
          getItemType={getItemType}
          estimatedItemSize={measuredItemHeight ?? 160}
          drawDistance={600}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.65}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onContentSizeChange={handleContentSizeChange}
          onLayout={onLayoutRoot}
          ListFooterComponent={footerComponent}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 16,
          }}
          removeClippedSubviews
          onBlankArea={(e) => {
            const blankSize = e.offsetEnd - e.offsetStart;
            if (blankSize > (measuredItemHeight ? measuredItemHeight * 2 : 320)) {
              console.warn(`⚠️ Blank area: ${blankSize.toFixed(1)}px (estItem=${measuredItemHeight ?? 160})`);
            }
          }}
        />
      </Animated.View>
    </React.Profiler>
  );
};

export default DetailScreen;