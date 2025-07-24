// app/index.tsx
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';

import { area } from '../assets/data/areaData';
import AreaCard from '../components/screens/areaCard';

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
      [...area].sort(
        (a, b) => (orderMap[a.state as CardState] ?? 99) - (orderMap[b.state as CardState] ?? 99)
      ),
    []
  );

  return (
    <View style={styles.container}>

      {/* 정렬된 카드 리스트 */}
      <ScrollView contentContainerStyle={styles.body}>
        {sortedCards.map(item => (
          <AreaCard
            key={item.id}
            {...item}
            onPress={() =>
              router.push({ pathname: '/detail/[id]', params: { id: item.id } })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default AreaScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  body: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
});
