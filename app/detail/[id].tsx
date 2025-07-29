// app/detail/[id].tsx - 안전한 버전
import { Colors } from '@/shared/styles/global';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import machineData, { Machine } from '../../assets/data/machineData';
import MachineCard from '../../components/screens/machineCard';

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

  // 단순한 페이드 인 애니메이션만
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  const sortedMachines = useMemo(() => {
    return machineData
      .filter(m => m.id === id)
      .sort((a, b) => orderMap[a.state] - orderMap[b.state]);
  }, [id]);

  // 화면 진입 애니메이션
  useEffect(() => {
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
        {sortedMachines.map((machine) => (
          <MachineCard key={machine.machineId} {...machine} />
        ))}
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