// app/index.tsx
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Area, getAreaData } from '../../assets/data/areaData';
import AreaCard from '../../components/screens/areaCard';
export const headerShown = false;

type CardState = 'danger' | 'warning' | 'normal' | 'unknown';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AreaScreen: React.FC = () => {
  const router = useRouter();
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);

  // API 데이터 로드
  useEffect(() => {
    const loadAreas = async () => {
      try {
        console.log('🌐 Area 데이터 로딩 중...');
        const data = await getAreaData();
        setAreas(data);
        console.log('✅ Area 데이터 로딩 완료:', data);
      } catch (error) {
        console.error('❌ Area 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAreas();
  }, []);

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
      [...areas].sort(
        (a, b) => (orderMap[a.state as CardState] ?? 99) - (orderMap[b.state as CardState] ?? 99)
      ),
    [areas]
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.body}>
        {loading ? (
          <Animated.Text
            entering={FadeIn.duration(300)}
            style={{ color: '#fff', textAlign: 'center', marginTop: 50 }}
          >
            구역 정보를 불러오는 중...
          </Animated.Text>
        ) : (
          sortedCards.map((item, index) => (
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
          ))
        )}
      </ScrollView>
    </View>
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
