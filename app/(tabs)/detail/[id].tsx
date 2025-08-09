// app/detail/[id].tsx - Redis API 버전
import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  const [machines, setMachines] = useState<Machine[]>([]);
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
    const sorted = machines.sort((a: Machine, b: Machine) => {
      const scoreA = a.normalScore <= 1 ? a.normalScore * 100 : a.normalScore;
      const scoreB = b.normalScore <= 1 ? b.normalScore * 100 : b.normalScore;
      return scoreA - scoreB;
    });
    
    // 현재 페이지까지의 데이터만 반환 (pagination)
    const endIndex = (currentPage + 1) * itemsPerPage;
    const paginatedData = sorted.slice(0, endIndex);
    
    console.log(`📄 [Pagination] 현재 페이지: ${currentPage}, 아이템 수: ${paginatedData.length}/${sorted.length}`);
    console.log(`📄 [Pagination] 페이지당 아이템: ${itemsPerPage}, 종료 인덱스: ${endIndex}`);
    
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
      setMachines(machineData);
      setCurrentPage(0);
      setHasNextPage(machineData.length > itemsPerPage);

      // ✅ 데이터 소스 확인
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
      
      // ✅ 에러 타입 확인
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

  // ✅ FlashList 렌더링 최적화
  const renderMachine = useCallback(({ item, index }: { item: Machine; index: number }) => {
    const renderStart = performance.now();

    return (
      <Animated.View
        entering={FadeIn.delay(index * 50).duration(300)}
        onLayout={() => {
          const renderEnd = performance.now();
          const duration = renderEnd - renderStart;
          console.log(`⚡ FlashList 아이템 [${item.deviceId}] 레이아웃 완료: ${duration.toFixed(2)}ms`);
          
          if (duration > 30) { // FlashList는 더 엄격한 기준
            console.warn(`⚠️ FlashList 아이템 [${item.deviceId}] 렌더링 지연: ${duration.toFixed(2)}ms`);
          }
        }}
      >
        <MachineCard {...item} />
      </Animated.View>
    );
  }, []);

  const keyExtractor = useCallback((item: Machine) => item.deviceId.toString(), []);

  // ✅ FlashList의 아이템 크기 추정 (성능 최적화를 위해 중요)
  const getItemType = useCallback((item: Machine) => {
    // 모든 MachineCard가 동일한 레이아웃이라고 가정
    return 'machineCard';
  }, []);

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
          estimatedListSize={{ height: sortedMachines.length * 160, width: 320 }}
          estimatedItemSize={160}
          // FlashList 성능 최적화 옵션 - 스크롤 시 컴포넌트 유지
          drawDistance={300} // 더 넓은 렌더링 범위
          overrideItemLayout={(layout, item) => {
            layout.size = 160;
          }}
          // Pagination 관련 이벤트
          onEndReached={() => {
            console.log(`🎯 [FlashList] onEndReached 트리거됨 - 페이지 로드 시도`);
            loadNextPage();
          }}
          onEndReachedThreshold={0.8} // 80% 스크롤 시 다음 페이지 로드
          // 스크롤 성능 모니터링
          onLoad={(info) => {
            console.log(`⚡ FlashList 로드 완료:`, {
              elapsedTime: info.elapsedTimeInMs,
              totalItems: sortedMachines.length
            });
          }}
          onBlankArea={(blankAreaEvent) => {
            const blankSize = blankAreaEvent.offsetEnd - blankAreaEvent.offsetStart;
            if (blankSize > 50) {
              console.warn(`⚠️ FlashList 빈 영역 크기: ${blankSize}px`);
            }
          }}
          // 뷰 변경 추적
          onViewableItemsChanged={({ viewableItems, changed }) => {
            const currentDisplayed = sortedMachines.length;
            const totalAvailable = machines.length;
            
            console.log(`👁️ [FlashList] 화면에 보이는 아이템: ${viewableItems.length}`);
            console.log(`📊 [Pagination] 현재 로드된 아이템: ${currentDisplayed}/${totalAvailable} (페이지: ${currentPage + 1})`);
            
            // 마지막 아이템 근처에서 로그
            const lastVisibleIndex = Math.max(...viewableItems.map(item => item.index || 0));
            if (lastVisibleIndex >= currentDisplayed - 2) {
              console.log(`🔚 [Pagination] 마지막 아이템 근처 도달 (인덱스: ${lastVisibleIndex}/${currentDisplayed - 1})`);
            }
            
            changed.forEach(item => {
              if (item.isViewable) {
                console.log(`👁️ 아이템 [${item.item?.deviceId}] 화면에 진입 (인덱스: ${item.index})`);
              } else {
                console.log(`👁️ 아이템 [${item.item?.deviceId}] 화면에서 나감 (인덱스: ${item.index})`);
              }
            });
          }}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 30, // 30%만 보여도 viewable로 간주
            minimumViewTime: 100 // 100ms 이상 보여야 viewable로 간주
          }}
          // ListFooter로 로딩 상태 표시
          ListFooterComponent={() => {
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
          }}
          // 추가 FlashList 최적화 옵션
          removeClippedSubviews={false} // 클리핑 비활성화로 컴포넌트 유지
          disableHorizontalListHeightMeasurement={true}
          disableAutoLayout={true}
        />
      </Animated.View>
    </React.Profiler>
  );
};

export default DetailScreen;