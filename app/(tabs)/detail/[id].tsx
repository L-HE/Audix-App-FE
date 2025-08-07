// app/detail/[id].tsx - Redis API 버전
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { Machine, getMachineDataByAreaId } from '../../../assets/data/machineData';
import MachineCard from '../../../components/screens/machineCard';
import { useLoadingStore } from '../../../shared/store/loadingStore';
import { useRefreshStore } from '../../../shared/store/refreshStore';
import { DetailScreenStyles } from '../../../shared/styles/screens';

type Params = { id: string };

const DetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<Params>();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [error, setError] = useState<string | null>(null);
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
      console.log('� Detail Screen - Area ID로 기기 데이터 요청:', id);
      const machineData = await getMachineDataByAreaId(id);
      console.log('✅ Detail Screen - 받은 기기 데이터:', machineData);

      setMachines(machineData);
    } catch (error) {
      console.error('❌ Detail Screen - 데이터 로딩 실패:', error);
      setError('데이터를 불러오는데 실패했습니다.');
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

  // 웹소켓 알림을 받으면 데이터 새로고침
  useEffect(() => {
    if (refreshTrigger > 0) {
      console.log('🔄 웹소켓 알림으로 인한 Machine 데이터 새로고침');
      fetchData();
    }
  }, [refreshTrigger]);

  // FlatList 렌더링 최적화
  const renderMachine = useCallback(({ item }: { item: Machine }) => (
    <MachineCard {...item} />
  ), []);

  const keyExtractor = useCallback((item: Machine) => item.deviceId.toString(), []);

  // 애니메이션 스타일
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[DetailScreenStyles.container, animatedStyle]}>
      <FlatList
        data={sortedMachines}
        renderItem={renderMachine}
        keyExtractor={keyExtractor}
        contentContainerStyle={DetailScreenStyles.content}
        maxToRenderPerBatch={10}
        windowSize={20}
        initialNumToRender={8}
        updateCellsBatchingPeriod={100}
      />
    </Animated.View>
  );
};

export default DetailScreen;