// app/index.tsx
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Area, getAreaData } from '../../assets/data/areaData';
import AreaCard from '../../components/screens/areaCard';
import { useRefreshStore } from '../../shared/store/refreshStore';
import { AreaScreenStyles as style } from '../../shared/styles/screens';
import { webSocketClient } from '../../shared/websocket/client';
export const headerShown = false;

const STATE_ORDER_MAP = { danger: 0, warning: 1, normal: 2, fixing: 3, mic_issue: 4 } as const;

const AreaScreen: React.FC = () => {
  const router = useRouter();
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const { refreshTrigger } = useRefreshStore();

  // Area 데이터 로딩 함수
  const loadAreas = async () => {
    try {
      console.log('🌐 Area 데이터 로딩 중...');
      setLoading(true);
      const data = await getAreaData();
      setAreas(data);
      console.log('✅ Area 데이터 로딩 완료:', data);
    } catch (error) {
      console.error('❌ Area 데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 초기 데이터 로드 및 웹소켓 연결
  useEffect(() => {
    loadAreas();

    // 웹소켓 연결
    webSocketClient.connect();

    return () => {
      webSocketClient.disconnect();
    };
  }, []);

  // 웹소켓 알림을 받으면 데이터 새로고침
  useEffect(() => {
    if (refreshTrigger > 0) {
      console.log('🔄 웹소켓 알림으로 인한 Area 데이터 새로고침');
      loadAreas();
    }
  }, [refreshTrigger]);

  // useMemo 로 정렬된 배열 생성 (매 렌더링마다 불필요한 sort 방지)
  const sortedCards = useMemo(() => {
    if (areas.length === 0) return [];
    return areas.slice().sort(
      (a, b) =>
        (STATE_ORDER_MAP[a.state as keyof typeof STATE_ORDER_MAP] ?? 99) -
        (STATE_ORDER_MAP[b.state as keyof typeof STATE_ORDER_MAP] ?? 99)
    );
  }, [areas]);

  return (
    <View style={style.container}>
      <ScrollView contentContainerStyle={style.body}>
        {loading ? (
          <Animated.Text
            entering={FadeIn.duration(300)}
            style={style.loadingText}
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
