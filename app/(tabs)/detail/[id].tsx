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

const DetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<Params>();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isOnlineMode, setIsOnlineMode] = useState(false);
  const { setLoading } = useLoadingStore();
  const { refreshTrigger } = useRefreshStore();

  // 단순한 페이드 인 애니메이션만
  const opacity = useSharedValue(0);

  // 정렬된 데이터를 메모이제이션
  const sortedMachines = useMemo(() => {
    return machines.sort((a: Machine, b: Machine) => {
      const scoreA = a.normalScore <= 1 ? a.normalScore * 100 : a.normalScore;
      const scoreB = b.normalScore <= 1 ? b.normalScore * 100 : b.normalScore;
      return scoreA - scoreB;
    });
  }, [machines]);

  // 데이터 로딩 함수
  const fetchData = async () => {
    if (!id) return;

    setLoading(true, '데이터를 불러오는 중...');
    setError(null);

    try {
      console.log('🌐 Detail Screen - Area ID로 기기 데이터 요청 (3초 타임아웃):', id);
      
      // ✅ 3초 타임아웃으로 API 호출
      const machineData = await getMachineDataByAreaId(id);
      console.log('✅ Detail Screen - 받은 기기 데이터:', machineData);

      setMachines(machineData);

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
    console.log(`⚡ FlashList 아이템 [${item.deviceId}] 렌더링 시작 (인덱스: ${index})`);

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
    <Animated.View style={[style.container, animatedStyle]}>
      {/* ✅ 에러 메시지 표시 */}
      {error && (
        <Animated.View entering={FadeIn.duration(300)} style={style.errorIndicator}>
          <Text style={style.errorText}>
            ⚠️ {error}
          </Text>
        </Animated.View>
      )}

      {/* ✅ FlashList로 교체 */}
      <FlashList
        data={sortedMachines}
        renderItem={renderMachine}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        // ✅ 올바른 FlashList props
        estimatedListSize={{ height: sortedMachines.length * 291, width: 320 }} // 전체 리스트 크기 추정
        estimatedItemSize={291} // 개별 아이템 크기는 여전히 유효할 수 있음
        // ✅ FlashList 성능 최적화 옵션
        drawDistance={200} // 화면 밖 렌더링 거리
        // ✅ 스크롤 성능 모니터링
        onLoad={(info) => {
          console.log(`⚡ FlashList 로드 완료:`, {
            elapsedTime: info.elapsedTimeInMs,
          });
        }}
        onBlankArea={(blankAreaEvent) => {
          console.log(`⚡ FlashList 빈 영역 감지:`, {
            offsetStart: blankAreaEvent.offsetStart,
            offsetEnd: blankAreaEvent.offsetEnd
          });
          
          // 빈 영역이 크면 성능 경고
          const blankSize = blankAreaEvent.offsetEnd - blankAreaEvent.offsetStart;
          if (blankSize > 100) {
            console.warn(`⚠️ FlashList 빈 영역 크기: ${blankSize}px`);
          }
        }}
        // ✅ 뷰 변경 추적
        onViewableItemsChanged={({ viewableItems, changed }) => {
          console.log(`👁️ FlashList 화면에 보이는 아이템 수: ${viewableItems.length}`);
          changed.forEach(item => {
            if (item.isViewable) {
              console.log(`👁️ 아이템 [${item.item?.deviceId}] 화면에 진입`);
            } else {
              console.log(`👁️ 아이템 [${item.item?.deviceId}] 화면에서 나감`);
            }
          });
        }}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50
        }}
        // ✅ 추가 FlashList 최적화 옵션
        removeClippedSubviews={true}
        disableHorizontalListHeightMeasurement={true}
      />
    </Animated.View>
  );
};

export default DetailScreen;