// app/detail/[id].tsx - Redis API 버전
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { Machine, getMachineDataByAreaId } from '../../../assets/data/machineData';
import MachineCard from '../../../components/screens/machineCard';
import { useLoadingStore } from '../../../shared/store/loadingStore';
import { Colors } from '../../../shared/styles/global';

type Params = { id: string };

// normalScore 기준 정렬을 사용하므로 orderMap은 더 이상 필요하지 않음
// const orderMap: Record<string, number> = {
//   danger: 0,
//   warning: 1,
//   normal: 2,
//   unknown: 3,
//   fixing: 4,
// };

const DetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<Params>();
  const [isAnimating, setIsAnimating] = useState(true);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { setLoading } = useLoadingStore();

  // 단순한 페이드 인 애니메이션만
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  // 데이터 로딩 함수
  const fetchData = async () => {
    if (!id) return;

    setLoading(true, '데이터를 불러오는 중...');
    setError(null);

    try {
      console.log('� Detail Screen - Area ID로 기기 데이터 요청:', id);
      const machineData = await getMachineDataByAreaId(id);
      console.log('✅ Detail Screen - 받은 기기 데이터:', machineData);

      // normalScore 기준으로 정렬 (낮은 점수가 위에 - 위험한 기기 우선)
      const sortedData = machineData.sort((a: Machine, b: Machine) => {
        const scoreA = a.normalScore <= 1 ? a.normalScore * 100 : a.normalScore;
        const scoreB = b.normalScore <= 1 ? b.normalScore * 100 : b.normalScore;
        return scoreA - scoreB; // 오름차순: 낮은 점수(위험) → 높은 점수(안전)
      });
      console.log('📊 normalScore 기준 정렬 완료:', sortedData.map(m => `${m.name}: ${m.normalScore}`));
      setMachines(sortedData);
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
        {machines.length > 0 ? (
          machines.map((machine) => (
            <MachineCard key={machine.deviceId} {...machine} />
          ))
        ) : error ? (
          <Animated.Text style={{ color: '#fff', textAlign: 'center', marginTop: 50 }}>
            {error}
          </Animated.Text>
        ) : (
          <Animated.Text style={{ color: '#fff', textAlign: 'center', marginTop: 50 }}>
            이 지역에는 등록된 기기가 없습니다.{'\n'}
            관리자에게 문의하여 기기를 등록해주세요.
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