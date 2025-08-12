// app/detail/[id].tsx
import { FlashList } from '@shopify/flash-list';
import { Image as ExpoImage } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
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

// ✅ 1. ExpoImage 캐싱 - 이미지 프리로딩 시스템
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

  // 이미지 프리로딩
  async preloadImages(machines: Machine[]): Promise<void> {
    const imageUrls = new Set<string>();
    
    machines.forEach(machine => {
      // 상태별 이미지 수집
      const statusImages = [
        `status_${machine.status}.png`,
        `machine_${machine.deviceId % 5}.jpg`, // 예시: 기기 이미지
        'machine_default.png'
      ];
      statusImages.forEach(img => imageUrls.add(img));
    });

    const preloadPromises = Array.from(imageUrls).map(async (imageUrl) => {
      if (this.preloadPromises.has(imageUrl)) {
        return this.preloadPromises.get(imageUrl)!;
      }

      const promise = this.preloadSingleImage(imageUrl);
      this.preloadPromises.set(imageUrl, promise);
      return promise;
    });

    try {
      await Promise.allSettled(preloadPromises);
      console.log(`✅ [ImageCache] ${imageUrls.size}개 이미지 프리로딩 완료`);
    } catch (error) {
      console.warn('⚠️ [ImageCache] 일부 이미지 프리로딩 실패:', error);
    }
  }

  private async preloadSingleImage(imageUrl: string): Promise<void> {
    try {
      // ExpoImage.prefetch 사용
      await ExpoImage.prefetch(imageUrl);
      this.cache[imageUrl] = imageUrl;
      console.log(`📸 [ImageCache] 이미지 캐싱 완료: ${imageUrl}`);
    } catch (error) {
      console.warn(`❌ [ImageCache] 이미지 캐싱 실패: ${imageUrl}`, error);
    }
  }

  getCachedImageUri(imageUrl: string): string | null {
    return this.cache[imageUrl] || null;
  }

  clearCache(): void {
    this.cache = {};
    this.preloadPromises.clear();
    console.log('🗑️ [ImageCache] 캐시 클리어 완료');
  }
}

// ✅ 2. API 호출 최적화 - 요청 관리 및 캐싱
class APIOptimizer {
  private static instance: APIOptimizer;
  private cache: Map<string, { data: Machine[]; timestamp: number }> = new Map();
  private pendingRequests: Map<string, Promise<Machine[]>> = new Map();
  private readonly CACHE_TTL = 30000; // 30초 캐시
  private abortControllers: Map<string, AbortController> = new Map();

  static getInstance(): APIOptimizer {
    if (!APIOptimizer.instance) {
      APIOptimizer.instance = new APIOptimizer();
    }
    return APIOptimizer.instance;
  }

  async getMachineData(areaId: string, forceRefresh = false): Promise<Machine[]> {
    const cacheKey = `area_${areaId}`;
    const now = Date.now();

    // ✅ 캐시 확인 (강제 새로고침이 아닌 경우)
    if (!forceRefresh) {
      const cached = this.cache.get(cacheKey);
      if (cached && (now - cached.timestamp) < this.CACHE_TTL) {
        console.log(`⚡ [APICache] 캐시된 데이터 사용: ${areaId} (${((now - cached.timestamp) / 1000).toFixed(1)}초 전)`);
        return cached.data;
      }
    }

    // ✅ 중복 요청 방지
    if (this.pendingRequests.has(cacheKey)) {
      console.log(`🔄 [APICache] 대기 중인 요청 재사용: ${areaId}`);
      return this.pendingRequests.get(cacheKey)!;
    }

    // ✅ 이전 요청 취소
    if (this.abortControllers.has(cacheKey)) {
      this.abortControllers.get(cacheKey)!.abort();
    }

    // ✅ 새 요청 생성
    const abortController = new AbortController();
    this.abortControllers.set(cacheKey, abortController);

    const requestPromise = this.executeRequest(areaId, abortController.signal);
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      const data = await requestPromise;
      
      // ✅ 캐시 저장
      this.cache.set(cacheKey, { data, timestamp: now });
      console.log(`💾 [APICache] 새 데이터 캐싱: ${areaId} (${data.length}개 기기)`);
      
      return data;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log(`🚫 [APICache] 요청 취소됨: ${areaId}`);
      }
      throw error;
    } finally {
      this.pendingRequests.delete(cacheKey);
      this.abortControllers.delete(cacheKey);
    }
  }

  private async executeRequest(areaId: string, signal: AbortSignal): Promise<Machine[]> {
    const startTime = performance.now();
    
    try {
      // 타임아웃과 AbortSignal 결합
      const timeoutPromise = new Promise<never>((_, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Request timeout'));
        }, 5000); // 5초 타임아웃

        signal.addEventListener('abort', () => {
          clearTimeout(timeout);
          reject(new Error('Request aborted'));
        });
      });

      const dataPromise = getMachineDataByAreaId(areaId);
      const data = await Promise.race([dataPromise, timeoutPromise]);
      
      const duration = performance.now() - startTime;
      console.log(`🌐 [APICache] API 요청 성공: ${areaId} (${duration.toFixed(2)}ms)`);
      
      return data;
    } catch (error) {
      const duration = performance.now() - startTime;
      console.error(`❌ [APICache] API 요청 실패: ${areaId} (${duration.toFixed(2)}ms)`, error);
      throw error;
    }
  }

  cancelRequest(areaId: string): void {
    const cacheKey = `area_${areaId}`;
    const controller = this.abortControllers.get(cacheKey);
    if (controller) {
      controller.abort();
      console.log(`🚫 [APICache] 요청 취소: ${areaId}`);
    }
  }

  clearCache(): void {
    this.cache.clear();
    console.log('🗑️ [APICache] 캐시 클리어 완료');
  }
}

// ✅ 3. 배치 업데이트 디바운싱 - 최적화된 업데이트 관리 (100ms 간격)
class BatchUpdateManager {
  private static instance: BatchUpdateManager;
  private pendingUpdates: Map<string, Partial<Machine> & { deviceId: number }> = new Map();
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  private updateCallback: ((updates: (Partial<Machine> & { deviceId: number })[]) => void) | null = null;
  private readonly BATCH_DELAY = 100; // ✅ 100ms로 변경 (안정성 향상)
  private readonly MAX_BATCH_SIZE = 50;

  static getInstance(): BatchUpdateManager {
    if (!BatchUpdateManager.instance) {
      BatchUpdateManager.instance = new BatchUpdateManager();
    }
    return BatchUpdateManager.instance;
  }

  setUpdateCallback(callback: (updates: (Partial<Machine> & { deviceId: number })[]) => void): void {
    this.updateCallback = callback;
  }

  enqueueUpdate(update: Partial<Machine> & { deviceId: number }): void {
    const key = `device_${update.deviceId}`;
    
    // ✅ 기존 업데이트와 병합
    const existing = this.pendingUpdates.get(key);
    if (existing) {
      this.pendingUpdates.set(key, { ...existing, ...update });
    } else {
      this.pendingUpdates.set(key, update);
    }

    this.scheduleFlush();
  }

  enqueueBatchUpdates(updates: (Partial<Machine> & { deviceId: number })[]): void {
    updates.forEach(update => {
      const key = `device_${update.deviceId}`;
      const existing = this.pendingUpdates.get(key);
      if (existing) {
        this.pendingUpdates.set(key, { ...existing, ...update });
      } else {
        this.pendingUpdates.set(key, update);
      }
    });

    this.scheduleFlush();
  }

  private scheduleFlush(): void {
    // ✅ 즉시 플러시 조건 (긴급 업데이트 또는 배치 크기 초과)
    if (this.pendingUpdates.size >= this.MAX_BATCH_SIZE) {
      this.flushUpdates();
      return;
    }

    // ✅ 기존 타이머 취소 후 새 타이머 설정
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
    }

    this.flushTimer = setTimeout(() => {
      this.flushUpdates();
    }, this.BATCH_DELAY);
  }

  private flushUpdates(): void {
    if (this.pendingUpdates.size === 0) return;

    const updates = Array.from(this.pendingUpdates.values());
    this.pendingUpdates.clear();
    
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    console.log(`🔄 [BatchUpdate] ${updates.length}개 업데이트 플러시 (${this.BATCH_DELAY}ms 간격)`);
    
    if (this.updateCallback) {
      this.updateCallback(updates);
    }
  }

  clearPendingUpdates(): void {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    this.pendingUpdates.clear();
    console.log('🗑️ [BatchUpdate] 대기 중인 업데이트 클리어');
  }
}

type Params = { id: string };

// ✅ 개별 Machine 행 컴포넌트 (FlashList row) - 직접 렌더링
interface MachineRowProps extends Machine {
  animateOnFirstMount?: boolean;
}

const MachineRow = React.memo<MachineRowProps>((props) => {
  // ✅ Suspense 제거, 직접 MachineCard 렌더링
  return <MachineCard {...props} animateOnFirstMount={props.animateOnFirstMount} />;
}, (prev, next) => {
  // ✅ 최적화된 비교 - 핵심 필드만 체크
  return (
    prev.status === next.status &&
    prev.normalScore === next.normalScore &&
    prev.deviceId === next.deviceId &&
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
  
  if (actualDuration > baseDuration * 2) {
    console.warn(`⚠️ [React Profiler] DetailScreen 예상보다 느린 렌더링: 실제=${actualDuration.toFixed(2)}ms, 예상=${baseDuration.toFixed(2)}ms`);
  }
};

const DetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<Params>();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isOnlineMode, setIsOnlineMode] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { setLoading } = useLoadingStore();
  const { refreshTrigger } = useRefreshStore();
  
  // Pagination 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const itemsPerPage = 8; // ✅ 지연 로딩 제거로 증가 가능

  // 애니메이션
  const opacity = useSharedValue(0);
  const [measuredItemHeight, setMeasuredItemHeight] = useState<number | null>(null);
  const [sortedMachines, setSortedMachines] = useState<Machine[]>([]);

  // ✅ 최적화 인스턴스들
  const imageCache = useMemo(() => DetailImageCache.getInstance(), []);
  const apiOptimizer = useMemo(() => APIOptimizer.getInstance(), []);
  const batchManager = useMemo(() => BatchUpdateManager.getInstance(), []);

  // 정렬 로직
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

  // ✅ 배치 업데이트 핸들러
  const handleBatchUpdates = useCallback((updates: (Partial<Machine> & { deviceId: number })[]) => {
    setMachines(prev => {
      let changed = false;
      const actualChanges = new Set<number>();
      
      const nextArr = prev.map(m => {
        const upd = updates.find(u => u.deviceId === m.deviceId);
        if (!upd) return m;
        
        // 실제 변경 여부 확인
        const hasStatusChange = upd.status !== undefined && upd.status !== m.status;
        const hasScoreChange = upd.normalScore !== undefined && upd.normalScore !== m.normalScore;
        const hasNameChange = upd.name !== undefined && upd.name !== m.name;
        
        if (!hasStatusChange && !hasScoreChange && !hasNameChange) {
          return m;
        }
        
        changed = true;
        actualChanges.add(m.deviceId);
        return { ...m, ...upd };
      });

      if (changed) {
        console.log(`🔄 [BatchUpdate] ${actualChanges.size}개 기기 업데이트 적용`);
        
        // 정렬된 목록도 업데이트
        setSortedMachines(prevSorted => {
          if (actualChanges.size === 0) return prevSorted;
          
          let arr = [...prevSorted];
          let hasPositionChange = false;
          
          actualChanges.forEach(deviceId => {
            const newMachine = nextArr.find(m => m.deviceId === deviceId);
            if (!newMachine) return;
            
            const oldIdx = arr.findIndex(x => x.deviceId === deviceId);
            if (oldIdx >= 0) {
              const oldMachine = arr[oldIdx];
              const needsReposition = comparator(oldMachine, newMachine) !== 0;
              
              if (needsReposition) {
                arr.splice(oldIdx, 1);
                const insertAt = binarySearchInsert(arr, newMachine);
                arr.splice(insertAt, 0, newMachine);
                hasPositionChange = true;
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
  }, [binarySearchInsert, comparator, currentPage, itemsPerPage]);

  // ✅ API 호출 최적화 - 데이터 로딩
  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!id) return;

    setIsInitialLoading(true);
    if (!forceRefresh) {
      setLoading(true, '기기 데이터를 불러오는 중...');
    }

    try {
      console.log(`🌐 [DetailScreen] 기기 데이터 요청 시작: ${id} (강제새로고침: ${forceRefresh})`);
      
      // ✅ API 최적화 적용
      const machineData = await apiOptimizer.getMachineData(id, forceRefresh);

      // ✅ 이미지 프리로딩 병렬 실행
      const imagePreloadPromise = imageCache.preloadImages(machineData);
      
      // 데이터 설정
      setMachines(machineData);
      setCurrentPage(0);
      setHasNextPage(machineData.length > itemsPerPage);

      // 초기 정렬 및 슬라이싱
      const allSorted = [...machineData].sort(comparator);
      setSortedMachines(allSorted.slice(0, itemsPerPage));

      // 온라인/오프라인 모드 감지
      const isOnline = machineData.length > 2;
      setIsOnlineMode(isOnline);
      
      console.log(`✅ [DetailScreen] 데이터 로딩 완료: ${machineData.length}개 기기 (${isOnline ? '온라인' : '오프라인'})`);

      // 이미지 프리로딩 완료 대기 (비동기)
      imagePreloadPromise.then(() => {
        console.log('🖼️ [DetailScreen] 이미지 프리로딩 완료');
      }).catch(err => {
        console.warn('⚠️ [DetailScreen] 이미지 프리로딩 일부 실패:', err);
      });

    } catch (error) {
      console.error('❌ [DetailScreen] 데이터 로딩 실패:', error);
      setIsOnlineMode(false);
      
      // 에러 처리
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          console.log('⏰ API 요청 타임아웃, 오프라인 모드로 전환');
        } else if (error.message.includes('aborted')) {
          console.log('🚫 API 요청 취소됨');
          return; // 취소된 경우 UI 업데이트 안함
        }
      }
    } finally {
      setIsInitialLoading(false);
      setLoading(false);
    }
  }, [id, apiOptimizer, imageCache, comparator, itemsPerPage, setLoading]);

  // 다음 페이지 로드
  const loadNextPage = useCallback(() => {
    if (isLoadingMore || !hasNextPage) return;
    
    const nextPage = currentPage + 1;
    const totalItems = machines.length;
    
    console.log(`📄 [Pagination] 페이지 로드: ${currentPage} → ${nextPage}`);
    
    setIsLoadingMore(true);
    
    // ✅ 지연 로딩 제거로 더 빠른 페이지 로드
    setTimeout(() => {
      const hasMore = (nextPage + 1) * itemsPerPage < totalItems;
      setCurrentPage(nextPage);
      setHasNextPage(hasMore);
      setIsLoadingMore(false);
      
      console.log(`✅ [Pagination] 페이지 ${nextPage} 로드 완료`);
    }, 150); // 300ms → 150ms로 단축
  }, [currentPage, machines.length, hasNextPage, isLoadingMore, itemsPerPage]);

  // 페이지 변경 시 정렬된 목록 업데이트
  useEffect(() => {
    const end = (currentPage + 1) * itemsPerPage;
    if (sortedMachines.length >= end) return;

    const fullSorted = [...machines].sort(comparator);
    const nextSlice = fullSorted.slice(0, end);
    setSortedMachines(nextSlice);
  }, [currentPage, machines, comparator, itemsPerPage, sortedMachines.length]);

  // ✅ 배치 업데이트 매니저 설정
  useEffect(() => {
    batchManager.setUpdateCallback(handleBatchUpdates);
    
    return () => {
      batchManager.clearPendingUpdates();
    };
  }, [batchManager, handleBatchUpdates]);

  // Pagination 관련 refs 및 함수들
  const suppressEndReachedUntilRef = useRef(0);
  const lastEndReachedPageRef = useRef(-1);
  const lastEndReachedTimeRef = useRef(0);
  const userScrolledRef = useRef(false);
  const pendingPageRequestRef = useRef(false);
  const layoutHeightRef = useRef(0);

  const DEBOUNCE_MS = 350;
  const EXTENDED_BLOCK_MS = 250;

  const handleEndReached = useCallback(() => {
    const now = Date.now();
    const reasons: string[] = [];

    if (now < suppressEndReachedUntilRef.current) reasons.push('suppressWindow');
    if (!userScrolledRef.current) reasons.push('noUserScroll');
    if (isLoadingMore) reasons.push('isLoadingMore');
    if (pendingPageRequestRef.current) reasons.push('pendingRequest');
    if (!hasNextPage) reasons.push('noNextPage');
    if (lastEndReachedPageRef.current === currentPage) reasons.push('duplicatePage');
    if (now - lastEndReachedTimeRef.current < DEBOUNCE_MS) reasons.push(`debounce`);

    if (reasons.length) {
      console.log('[onEndReached] SKIP', { page: currentPage, reasons });
      return;
    }

    console.log('[onEndReached] TRIGGER', { page: currentPage });

    pendingPageRequestRef.current = true;
    lastEndReachedPageRef.current = currentPage;
    lastEndReachedTimeRef.current = now;
    loadNextPage();
  }, [currentPage, hasNextPage, isLoadingMore, loadNextPage]);

  const handleScroll = useCallback((e: any) => {
    if (userScrolledRef.current) return;
    const offsetY = e?.nativeEvent?.contentOffset?.y ?? 0;
    if (offsetY > 4) {
      userScrolledRef.current = true;
      console.log('[Scroll] userScrolledRef = true');
    }
  }, []);

  const handleContentSizeChange = useCallback((w: number, h: number) => {
    if (!layoutHeightRef.current) return;
    if (h <= layoutHeightRef.current + 4 && hasNextPage && !isLoadingMore && !pendingPageRequestRef.current) {
      console.log('[ContentSize] 콘텐츠가 화면보다 작음 → 자동 로드');
      userScrolledRef.current = true;
      handleEndReached();
    }
  }, [hasNextPage, isLoadingMore, handleEndReached]);

  const onLayoutRoot = useCallback((e: any) => {
    layoutHeightRef.current = e?.nativeEvent?.layout?.height ?? 0;
  }, []);

  useEffect(() => {
    pendingPageRequestRef.current = false;
  }, [currentPage]);

  // Footer 컴포넌트
  const footerComponent = useCallback(() => {
    if (!hasNextPage) {
      return (
        <Text style={{ textAlign: 'center', padding: 20, color: '#666', fontSize: 14 }}>
          📄 모든 기기를 불러왔습니다 ({machines.length}개)
        </Text>
      );
    }
    if (isLoadingMore) {
      return (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={{ marginTop: 8, color: '#007AFF', fontSize: 14 }}>
            더 많은 기기를 불러오는 중...
          </Text>
        </View>
      );
    }
    return null;
  }, [hasNextPage, isLoadingMore, machines.length]);

  // 렌더링 함수들
  const renderMachine = useCallback(({ item, index }: { item: Machine; index: number }) => {
    const onLayoutMeasure = !measuredItemHeight
      ? (e: any) => {
          const h = e.nativeEvent.layout.height;
          if (h > 0 && !measuredItemHeight) {
            setMeasuredItemHeight(h);
            console.log('[Measure] MachineCard height=', h);
          }
        }
      : undefined;

    const animateOnFirstMount = index < 2; // 상위 3개만 애니메이션

    return (
      <Animated.View onLayout={onLayoutMeasure}>
        <MachineRow {...item} animateOnFirstMount={animateOnFirstMount} />
      </Animated.View>
    );
  }, [measuredItemHeight]);

  const keyExtractor = useCallback((item: Machine) => item.deviceId.toString(), []);
  const getItemType = useCallback(() => 'machineCard', []);

  // 초기화 및 생명주기
  useEffect(() => {
    fetchData();
    opacity.value = withTiming(1, { duration: 300 });

    // ✅ 컴포넌트 언마운트 시 정리
    return () => {
      if (id) {
        apiOptimizer.cancelRequest(id);
      }
    };
  }, [id, fetchData, apiOptimizer]);

  // 새로고침 처리
  useEffect(() => {
    if (refreshTrigger > 0) {
      if (isOnlineMode) {
        console.log('🔄 [DetailScreen] 웹소켓 새로고침 트리거');
        fetchData(true); // 강제 새로고침
      } else {
        console.log('📱 [DetailScreen] 오프라인 모드 - 새로고침 스킵');
      }
    }
  }, [refreshTrigger, isOnlineMode, fetchData]);

  // ✅ 초기 자동 로딩 최적화 (더 빠른 로딩)
  useEffect(() => {
    if (currentPage === 0 && hasNextPage && !isInitialLoading) {
      const timer = setTimeout(() => {
        userScrolledRef.current = true;
        handleEndReached();
      }, 200); // 500ms → 200ms로 단축
      return () => clearTimeout(timer);
    }
  }, [currentPage, hasNextPage, isInitialLoading, handleEndReached]);

  // 애니메이션 스타일
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // ✅ 전역 함수 노출 (디버깅용)
  useEffect(() => {
    // @ts-ignore
    if (typeof globalThis !== 'undefined') {
      (globalThis as any).enqueueMachineUpdate = (update: Partial<Machine> & { deviceId: number }) => {
        batchManager.enqueueUpdate(update);
      };
    }
  }, [batchManager]);

  return (
    <React.Profiler id="DetailScreen" onRender={onRenderCallback}>
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
          ListFooterComponent={footerComponent}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 16,
          }}
          removeClippedSubviews= {true} // 성능 향상
          extraData={isLoadingMore} // 리렌더링 최적화
          disableAutoLayout={true} // 레이아웃 시프트 방지
          onBlankArea={(e) => {
            const blankSize = e.offsetEnd - e.offsetStart;
            if (blankSize > 400) {
              console.warn(`⚠️ Blank area detected: ${blankSize.toFixed(1)}px`);
            }
          }}
        />
      </Animated.View>
    </React.Profiler>
  );
};

export default DetailScreen;