// app/detail/[id].tsx
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { machineData } from '../../assets/data/machineData';
import MachineCard from '../../components/screens/machineCard';

type CardState = 'danger' | 'warning' | 'normal' | 'unknown';

const DetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  // 1) 우선순위 맵 정의
  const orderMap: Record<CardState, number> = {
    danger: 0,
    warning: 1,
    normal: 2,
    unknown: 3,
  };

  // 2) 필터 후 정렬: useMemo 로 불필요한 재계산 방지
  const sortedCards = useMemo(() => {
    // id 일치하는 항목만
    const filtered = machineData.filter(item => item.id === id);
    // 상태 기준으로 오름차순 정렬
    return [...filtered].sort(
      (a, b) =>
        (orderMap[a.state as CardState] ?? 99) -
        (orderMap[b.state as CardState] ?? 99)
    );
  }, [id]);

  return (
    <View style={styles.container}>
      {/* Body: 정렬된 MachineCard 리스트 */}
      <ScrollView contentContainerStyle={styles.body}>
        {sortedCards.map((item, idx) => (
          <MachineCard key={idx} {...item} />
        ))}
      </ScrollView>
    </View>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  body: { flexGrow: 1, padding: 16, backgroundColor: '#f2f2f2' },
});
