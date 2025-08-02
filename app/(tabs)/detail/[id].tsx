// app/detail/[id].tsx - 안전한 버전
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import machineData, { Machine } from '../../../assets/data/machineData';
import MachineCard from '../../../components/screens/machineCard';
import { useLoadingStore } from '../../../shared/store/loadingStore';
import { Colors } from '../../../shared/styles/global';

type Params = { id: string };

const orderMap: Record<Machine['state'], number> = {
  danger: 0,
  warning: 1,
  normal: 2,
  unknown: 3,
};

const DetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<Params>();
  const [isAnimating, setIsAnimating] = useState(true);
  const { setLoading } = useLoadingStore();

  // 단순한 페이드 인 애니메이션만
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  // 카드 정렬
  const sortedMachines = useMemo(() => {
    console.log('🔍 Detail Screen - 받은 id:', id);
    console.log('📊 Detail Screen - 전체 machineData:', machineData);

    const numericId = parseInt(id || '0', 10);
    const filteredMachines = machineData.filter(m => m.id === numericId);
    console.log('✅ Detail Screen - 숫자 변환된 id:', numericId);
    console.log('✅ Detail Screen - 필터된 machines:', filteredMachines);

    return filteredMachines.sort((a, b) => orderMap[a.state] - orderMap[b.state]);
  }, [id]);

  // 데이터 로딩 함수
  const fetchData = async () => {
    setLoading(true, '데이터를 불러오는 중...');

    try {
      // API 호출 등
      await new Promise(resolve => setTimeout(resolve, 1200));
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 화면 진입 애니메이션
  useEffect(() => {
    fetchData();

    // 간단한 페이드 인 애니메이션
    opacity.value = withTiming(1, { duration: 300 });
    translateY.value = withTiming(0, { duration: 300 });

    const animationTimeout = setTimeout(() => {
      setIsAnimating(false);
    }, 400);

    // 컴포넌트 언마운트 시 모든 애니메이션 정리
    return () => {
      clearTimeout(animationTimeout);
      cancelAnimation(opacity);
      cancelAnimation(translateY);

      // 즉시 초기값으로 리셋
      opacity.value = 0;
      translateY.value = 20;
    };
  }, [id]);

  // 애니메이션 스타일
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View
      style={[styles.container, animatedStyle]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {sortedMachines.length > 0 ? (
          sortedMachines.map((machine) => (
            <MachineCard key={machine.machineId} {...machine} />
          ))
        ) : (
          <Animated.Text style={{ color: '#fff', textAlign: 'center', marginTop: 50 }}>
            ID {id}에 해당하는 머신이 없습니다.{'\n'}
            전체 머신 수: {machineData.length}개{'\n'}
            받은 ID: {id} (타입: {typeof id}){'\n'}
            변환된 ID: {parseInt(id || '0', 10)} (타입: number)
          </Animated.Text>
        )}
      </ScrollView>
    </Animated.View>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  content: {
    padding: 16
  },
});