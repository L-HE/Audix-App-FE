// app/detail/[id].tsx
import { FlashList } from '@shopify/flash-list';
import { Image as ExpoImage } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Machine, getMachineDataByAreaId } from '../../../assets/data/machineData';
import MachineCard from '../../../components/screens/machineCard';
import { useLoadingStore } from '../../../shared/store/loadingStore';
import { useRefreshStore } from '../../../shared/store/refreshStore';
import { DetailScreenStyles as style } from '../../../shared/styles/screens';

/* ─────────────────────────────────────────────────────────────
 * 이미지 프리로딩/캐시: ExpoImage.prefetch 기반의 간단 캐시
 * ───────────────────────────────────────────────────────────── */
interface ImageCache {
  [key: string]: string;
}

class DetailImageCache {
  private static instance: DetailImageCache;
  private cache: ImageCache = {};
  private preloadPromises: Map<string, Promise<void>> = new Map();

  static getInstance(): DetailImageCache {
    if (!DetailImageCache.instance) {
      DetailImageCache.instance = new DetailImageCache();
    }
    return DetailImageCache.instance;
  }

  // 주어진 기기 목록에 필요한 이미지들을 미리 프리로딩
  async preloadImages(machines: Machine[]): Promise<void> {
    const imageUrls = new Set<string>();
    machines.forEach((machine) => {
      const statusImages = [
        `status_${machine.status}.png`,
        `machine_${machine.deviceId % 5}.jpg`,
        'machine_default.png',
      ];
      statusImages.forEach((img) => imageUrls.add(img));
    });

    const tasks = Array.from(imageUrls).map((imageUrl) => {
      if (this.preloadPromises.has(imageUrl)) return this.preloadPromises.get(imageUrl)!;
      const promise = this.preloadSingleImage(imageUrl);
      this.preloadPromises.set(imageUrl, promise);
      return promise;
    });

    await Promise.allSettled(tasks);
  }

  // 단일 이미지 프리로딩
  private async preloadSingleImage(imageUrl: string): Promise<void> {
    await ExpoImage.prefetch(imageUrl);
    this.cache[imageUrl] = imageUrl;
  }

  // 캐시된 이미지 URI 조회
  getCachedImageUri(imageUrl: string): string | null {
    return this.cache[imageUrl] || null;
  }

  // 내부 캐시 초기화
  clearCache(): void {
    this.cache = {};
    this.preloadPromises.clear();
  }
}

/* ─────────────────────────────────────────────────────────────
 * API 최적화: 간단 메모리 캐시 + 중복요청 방지 + 타임아웃/취소
 * ───────────────────────────────────────────────────────────── */
class APIOptimizer {
  private static instance: APIOptimizer;
  private cache: Map<string, { data: Machine[]; timestamp: number }> = new Map();
  private pendingRequests: Map<string, Promise<Machine[]>> = new Map();
  private readonly CACHE_TTL = 30000; // 30초
  private abortControllers: Map<string, AbortController> = new Map();

  static getInstance(): APIOptimizer {
    if (!APIOptimizer.instance) {
      APIOptimizer.instance = new APIOptimizer();
    }
    return APIOptimizer.instance;
  }

  // areaId 기준으로 데이터 요청 (캐시/중복요청 처리)
  async getMachineData(areaId: string, forceRefresh = false): Promise<Machine[]> {
    const cacheKey = `area_${areaId}`;
    const now = Date.now();

    if (!forceRefresh) {
      const cached = this.cache.get(cacheKey);
      if (cached && now - cached.timestamp < this.CACHE_TTL) {
        return cached.data;
      }
    }

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)!;
    }

    if (this.abortControllers.has(cacheKey)) {
      this.abortControllers.get(cacheKey)!.abort();
    }

    const abortController = new AbortController();
    this.abortControllers.set(cacheKey, abortController);

    const requestPromise = this.executeRequest(areaId, abortController.signal);
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      const data = await requestPromise;
      this.cache.set(cacheKey, { data, timestamp: now });
      return data;
    } finally {
      this.pendingRequests.delete(cacheKey);
      this.abortControllers.delete(cacheKey);
    }
  }

  // 실제 요청 수행(타임아웃/취소 지원)
  private async executeRequest(areaId: string, signal: AbortSignal): Promise<Machine[]> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      const timeout = setTimeout(() => reject(new Error('Request timeout')), 5000);
      signal.addEventListener('abort', () => {
        clearTimeout(timeout);
        reject(new Error('Request aborted'));
      });
    });

    const dataPromise = getMachineDataByAreaId(areaId);
    return Promise.race([dataPromise, timeoutPromise]);
  }

  // 진행중 요청 취소
  cancelRequest(areaId: string): void {
    const cacheKey = `area_${areaId}`;
    const controller = this.abortControllers.get(cacheKey);
    if (controller) controller.abort();
  }

  // 캐시 초기화
  clearCache(): void {
    this.cache.clear();
  }
}

/* ─────────────────────────────────────────────────────────────
 * 배치 업데이트: 짧은 간격으로 쌓인 업데이트를 병합/적용
 * ───────────────────────────────────────────────────────────── */
class BatchUpdateManager {
  private static instance: BatchUpdateManager;
  private pendingUpdates: Map<string, Partial<Machine> & { deviceId: number }> = new Map();
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  private updateCallback: ((updates: (Partial<Machine> & { deviceId: number })[]) => void) | null = null;
  private readonly BATCH_DELAY = 100;
  private readonly MAX_BATCH_SIZE = 50;

  static getInstance(): BatchUpdateManager {
    if (!BatchUpdateManager.instance) {
      BatchUpdateManager.instance = new BatchUpdateManager();
    }
    return BatchUpdateManager.instance;
  }

  // 업데이트가 준비됐을 때 호출될 콜백 등록
  setUpdateCallback(callback: (updates: (Partial<Machine> & { deviceId: number })[]) => void): void {
    this.updateCallback = callback;
  }

  // 단일 업데이트 큐잉(동일 deviceId는 병합)
  enqueueUpdate(update: Partial<Machine> & { deviceId: number }): void {
    const key = `device_${update.deviceId}`;
    const existing = this.pendingUpdates.get(key);
    this.pendingUpdates.set(key, existing ? { ...existing, ...update } : update);
    this.scheduleFlush();
  }

  // 여러 업데이트 한 번에 큐잉
  enqueueBatchUpdates(updates: (Partial<Machine> & { deviceId: number })[]): void {
    updates.forEach((update) => {
      const key = `device_${update.deviceId}`;
      const existing = this.pendingUpdates.get(key);
      this.pendingUpdates.set(key, existing ? { ...existing, ...update } : update);
    });
    this.scheduleFlush();
  }

  // 플러시 예약(최대치 넘으면 즉시 플러시)
  private scheduleFlush(): void {
    if (this.pendingUpdates.size >= this.MAX_BATCH_SIZE) {
      this.flushUpdates();
      return;
    }
    if (this.flushTimer) clearTimeout(this.flushTimer);
    this.flushTimer = setTimeout(() => this.flushUpdates(), this.BATCH_DELAY);
  }

  // 실제 플러시: 큐에 모인 업데이트를 콜백으로 전달
  private flushUpdates(): void {
    if (this.pendingUpdates.size === 0) return;
    const updates = Array.from(this.pendingUpdates.values());
    this.pendingUpdates.clear();
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    if (this.updateCallback) this.updateCallback(updates);
  }

  // 대기 중인 업데이트/타이머 초기화
  clearPendingUpdates(): void {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    this.pendingUpdates.clear();
  }
}

/* ─────────────────────────────────────────────────────────────
 * 리스트의 각 행: MachineCard를 감싸는 경량 래퍼 (메모)
 * ───────────────────────────────────────────────────────────── */
interface MachineRowProps extends Machine {
  animateOnFirstMount?: boolean;
}

const MachineRow = React.memo<MachineRowProps>(
  (props) => <MachineCard {...props} animateOnFirstMount={props.animateOnFirstMount} />,
  (prev, next) =>
    prev.status === next.status &&
    prev.normalScore === next.normalScore &&
    prev.deviceId === next.deviceId &&
    prev.animateOnFirstMount === next.animateOnFirstMount
);

/* ─────────────────────────────────────────────────────────────
 * 상세 화면: 데이터 로딩/정렬/페이지네이션/애니메이션
 * ───────────────────────────────────────────────────────────── */
type Params = { id: string };

const DetailScreen: React.FC = () => {
  // 파라미터/전역 상태
  const { id } = useLocalSearchParams<Params>();
  const { setLoading } = useLoadingStore();
  const { refreshTrigger } = useRefreshStore();

  // 데이터/상태
  const [machines, setMachines] = useState<Machine[]>([]);
  const [sortedMachines, setSortedMachines] = useState<Machine[]>([]);
  const [isOnlineMode, setIsOnlineMode] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const itemsPerPage = 8;

  // 첫 화면 페이드 인
  const opacity = useSharedValue(0);
  const [measuredItemHeight, setMeasuredItemHeight] = useState<number | null>(null);

  // 단일 인스턴스들
  const imageCache = useMemo(() => DetailImageCache.getInstance(), []);
  const apiOptimizer = useMemo(() => APIOptimizer.getInstance(), []);
  const batchManager = useMemo(() => BatchUpdateManager.getInstance(), []);

  // 정렬 우선순위: status → normalScore
  const statusRank = useCallback((s: string) => {
    switch (s) {
      case 'danger':
        return 0;
      case 'warning':
        return 1;
      case 'normal':
        return 2;
      case 'repair':
        return 3;
      case 'offline':
        return 4;
      default:
        return 999;
    }
  }, []);

  const normScoreVal = useCallback((v: number) => (v <= 1 ? v * 100 : v), []);

  const comparator = useCallback(
    (a: Machine, b: Machine) => {
      const ra = statusRank(a.status) - statusRank(b.status);
      if (ra !== 0) return ra;
      return normScoreVal(a.normalScore) - normScoreVal(b.normalScore);
    },
    [statusRank, normScoreVal]
  );

  // 정렬된 배열 내 삽입 위치 계산(이진탐색)
  const binarySearchInsert = useCallback(
    (arr: Machine[], item: Machine) => {
      let low = 0,
        high = arr.length;
      while (low < high) {
        const mid = (low + high) >>> 1;
        if (comparator(item, arr[mid]) < 0) high = mid;
        else low = mid + 1;
      }
      return low;
    },
    [comparator]
  );

  // 배치 업데이트 적용: 변경분 병합 후 정렬 리스트 갱신
  const handleBatchUpdates = useCallback(
    (updates: (Partial<Machine> & { deviceId: number })[]) => {
      setMachines((prev) => {
        let changed = false;
        const changedIds = new Set<number>();

        const nextArr = prev.map((m) => {
          const upd = updates.find((u) => u.deviceId === m.deviceId);
          if (!upd) return m;

          const hasStatusChange = upd.status !== undefined && upd.status !== m.status;
          const hasScoreChange = upd.normalScore !== undefined && upd.normalScore !== m.normalScore;
          const hasNameChange = upd.name !== undefined && upd.name !== m.name;

          if (!hasStatusChange && !hasScoreChange && !hasNameChange) return m;

          changed = true;
          changedIds.add(m.deviceId);
          return { ...m, ...upd };
        });

        if (changed) {
          setSortedMachines((prevSorted) => {
            if (changedIds.size === 0) return prevSorted;
            let arr = [...prevSorted];

            changedIds.forEach((deviceId) => {
              const newMachine = nextArr.find((m) => m.deviceId === deviceId);
              if (!newMachine) return;

              const oldIdx = arr.findIndex((x) => x.deviceId === deviceId);
              if (oldIdx >= 0) {
                const oldMachine = arr[oldIdx];
                const needsReposition = comparator(oldMachine, newMachine) !== 0;
                if (needsReposition) {
                  arr.splice(oldIdx, 1);
                  const insertAt = binarySearchInsert(arr, newMachine);
                  arr.splice(insertAt, 0, newMachine);
                } else {
                  arr[oldIdx] = newMachine;
                }
              }
            });

            return arr.slice(0, (currentPage + 1) * itemsPerPage);
          });

          return nextArr;
        }

        return prev;
      });
    },
    [binarySearchInsert, comparator, currentPage, itemsPerPage]
  );

  // 데이터 로딩: 캐시/중복요청/타임아웃 처리 + 이미지 프리로딩
  const fetchData = useCallback(
    async (forceRefresh = false) => {
      if (!id) return;

      setIsInitialLoading(true);
      if (!forceRefresh) {
        setLoading(true, '기기 데이터를 불러오는 중...');
      }

      try {
        const machineData = await apiOptimizer.getMachineData(id, forceRefresh);

        // 이미지 프리로딩(비동기)
        void imageCache.preloadImages(machineData);

        // 데이터/페이지 초기화
        setMachines(machineData);
        setCurrentPage(0);
        setHasNextPage(machineData.length > itemsPerPage);

        // 정렬 및 첫 페이지 슬라이스
        const allSorted = [...machineData].sort(comparator);
        setSortedMachines(allSorted.slice(0, itemsPerPage));

        // 간단한 온라인 모드 판단(필요 시 로직 교체 가능)
        setIsOnlineMode(machineData.length > 2);
      } finally {
        setIsInitialLoading(false);
        setLoading(false);
      }
    },
    [id, apiOptimizer, imageCache, comparator, itemsPerPage, setLoading]
  );

  // 다음 페이지 로드(간단 지연 포함)
  const loadNextPage = useCallback(() => {
    if (isLoadingMore || !hasNextPage) return;

    const nextPage = currentPage + 1;
    const totalItems = machines.length;

    setIsLoadingMore(true);
    setTimeout(() => {
      const hasMore = (nextPage + 1) * itemsPerPage < totalItems;
      setCurrentPage(nextPage);
      setHasNextPage(hasMore);
      setIsLoadingMore(false);
    }, 150);
  }, [currentPage, machines.length, hasNextPage, isLoadingMore, itemsPerPage]);

  // 페이지 변경 시 정렬된 목록 슬라이스 확장
  useEffect(() => {
    const end = (currentPage + 1) * itemsPerPage;
    if (sortedMachines.length >= end) return;
    const fullSorted = [...machines].sort(comparator);
    setSortedMachines(fullSorted.slice(0, end));
  }, [currentPage, machines, comparator, itemsPerPage, sortedMachines.length]);

  // 배치 업데이트 콜백 등록/해제
  useEffect(() => {
    batchManager.setUpdateCallback(handleBatchUpdates);
    return () => {
      batchManager.clearPendingUpdates();
    };
  }, [batchManager, handleBatchUpdates]);

  // 페이지네이션 제어용 refs/상수
  const suppressEndReachedUntilRef = useRef(0);
  const lastEndReachedPageRef = useRef(-1);
  const lastEndReachedTimeRef = useRef(0);
  const userScrolledRef = useRef(false);
  const pendingPageRequestRef = useRef(false);
  const layoutHeightRef = useRef(0);

  const DEBOUNCE_MS = 350;

  // 리스트 끝 도달 시 더 불러오기 트리거
  const handleEndReached = useCallback(() => {
    const now = Date.now();
    if (
      now < suppressEndReachedUntilRef.current ||
      !userScrolledRef.current ||
      isLoadingMore ||
      pendingPageRequestRef.current ||
      !hasNextPage ||
      lastEndReachedPageRef.current === currentPage ||
      now - lastEndReachedTimeRef.current < DEBOUNCE_MS
    ) {
      return;
    }

    pendingPageRequestRef.current = true;
    lastEndReachedPageRef.current = currentPage;
    lastEndReachedTimeRef.current = now;
    loadNextPage();
  }, [currentPage, hasNextPage, isLoadingMore, loadNextPage]);

  // 사용자 스크롤 시작 감지(자동 로드 오작동 방지)
  const handleScroll = useCallback((e: any) => {
    if (userScrolledRef.current) return;
    const offsetY = e?.nativeEvent?.contentOffset?.y ?? 0;
    if (offsetY > 4) userScrolledRef.current = true;
  }, []);

  // 콘텐츠 높이가 화면보다 작은 경우 자동으로 다음 페이지 로드
  const handleContentSizeChange = useCallback(
    (w: number, h: number) => {
      if (!layoutHeightRef.current) return;
      if (h <= layoutHeightRef.current + 4 && hasNextPage && !isLoadingMore && !pendingPageRequestRef.current) {
        userScrolledRef.current = true;
        handleEndReached();
      }
    },
    [hasNextPage, isLoadingMore, handleEndReached]
  );

  // 루트 레이아웃 높이 기록
  const onLayoutRoot = useCallback((e: any) => {
    layoutHeightRef.current = e?.nativeEvent?.layout?.height ?? 0;
  }, []);

  // 페이지 로드 완료 시 상태 플래그 초기화
  useEffect(() => {
    pendingPageRequestRef.current = false;
  }, [currentPage]);

  // 개별 아이템 렌더러(상단 일부만 진입 애니메이션)
  const renderMachine = useCallback(
    ({ item, index }: { item: Machine; index: number }) => {
      const onLayoutMeasure =
        !measuredItemHeight
          ? (e: any) => {
              const h = e.nativeEvent.layout.height;
              if (h > 0 && !measuredItemHeight) setMeasuredItemHeight(h);
            }
          : undefined;

      const animateOnFirstMount = index < 2;
      return (
        <Animated.View onLayout={onLayoutMeasure}>
          <MachineRow {...item} animateOnFirstMount={animateOnFirstMount} />
        </Animated.View>
      );
    },
    [measuredItemHeight]
  );

  // 키/타입 제공자
  const keyExtractor = useCallback((item: Machine) => item.deviceId.toString(), []);
  const getItemType = useCallback(() => 'machineCard', []);

  // 초기 로딩 및 페이드 인
  useEffect(() => {
    fetchData();
    opacity.value = withTiming(1, { duration: 300 });

    return () => {
      if (id) apiOptimizer.cancelRequest(id);
    };
  }, [id, fetchData, apiOptimizer, opacity]);

  // 새로고침 트리거 반응(온라인 모드에서만 강제 새로고침)
  useEffect(() => {
    if (refreshTrigger > 0) {
      if (isOnlineMode) {
        fetchData(true);
      }
    }
  }, [refreshTrigger, isOnlineMode, fetchData]);

  // 초기 자동 로딩(첫 페이지 이후 빠르게 이어 받기)
  useEffect(() => {
    if (currentPage === 0 && hasNextPage && !isInitialLoading) {
      const timer = setTimeout(() => {
        userScrolledRef.current = true;
        handleEndReached();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [currentPage, hasNextPage, isInitialLoading, handleEndReached]);

  // 루트 페이드 인 스타일
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  // 렌더
  return (
    <Animated.View style={[style.container, animatedStyle]}>
      <FlashList
        data={sortedMachines}
        renderItem={renderMachine}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        estimatedItemSize={270}
        drawDistance={200}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onContentSizeChange={handleContentSizeChange}
        onLayout={onLayoutRoot}
        ListFooterComponent={
          !hasNextPage ? (
            <Text style={{ textAlign: 'center', padding: 20, color: '#666', fontSize: 14 }}>
              모든 기기를 불러왔습니다 ({machines.length}개)
            </Text>
          ) : isLoadingMore ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={{ marginTop: 8, color: '#007AFF', fontSize: 14 }}>더 많은 기기를 불러오는 중...</Text>
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 }}
        removeClippedSubviews={true}
        extraData={isLoadingMore}
        disableAutoLayout={true}
      />
    </Animated.View>
  );
};

export default DetailScreen;
