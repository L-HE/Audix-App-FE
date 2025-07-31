// app/index.tsx
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Dimensions, ScrollView, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { areaData } from '@/assets/data/areaData';
import AreaCard from '@/components/screens/areaCard';
export const headerShown = false;

type CardState = 'danger' | 'warning' | 'normal' | 'unknown';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AreaScreen: React.FC = () => {
  const router = useRouter();

  // 1) 상태별 우선순위 맵 정의
  const orderMap: Record<CardState, number> = {
    danger: 0,
    warning: 1,
    normal: 2,
    unknown: 3,
  };

  // 2) useMemo 로 정렬된 배열 생성 (매 렌더링마다 불필요한 sort 방지)
  const sortedCards = useMemo(
    () =>
      [...areaData].sort(
        (a, b) => (orderMap[a.state as CardState] ?? 99) - (orderMap[b.state as CardState] ?? 99)
      ),
    []
  );

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeInDown.duration(200)}
    >
      <ScrollView contentContainerStyle={styles.body}>
        {sortedCards.map((item, index) => (
          <Animated.View
            key={item.id}
            entering={index < 8 ? FadeIn.delay(index * 40).duration(300) : FadeIn.duration(200)}
          >
            <AreaCard
              {...item}
              onPress={() =>
                router.push({ pathname: '/detail/[id]', params: { id: item.id } })
              }
            />
          </Animated.View>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

export default AreaScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  body: {
    flexGrow: 1,
    padding: 16,
  },
});
