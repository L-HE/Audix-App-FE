// app/(tabs)/alarms/index.tsx
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';

import { alarmData } from '../../../assets/data/alarmData';
import AlarmCard from '../../../components/screens/alarmCard';

const AlarmScreen: React.FC = () => {
  const router = useRouter();

  // 커스텀 애니메이션
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400 });
    translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    scale.value = withSpring(1, { damping: 15, stiffness: 100 });
  }, []);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { scale: scale.value }
      ],
    };
  });

  return (
    // 외부 래퍼: layout 애니메이션
    <Animated.View
      style={styles.wrapper}
      entering={FadeInDown.duration(300).springify()}
    >
      {/* 내부 컨테이너: 커스텀 애니메이션 */}
      <Animated.View style={[containerAnimatedStyle, styles.container]}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {alarmData.map((item, index) => (
            <Animated.View
              key={item.alarmId}
              entering={FadeInDown.delay(index * 80).duration(400).springify()}
            >
              <AlarmCard
                alarmId={item.alarmId}
                title={item.title}
                subtitle={item.subtitle}
                timestamp={item.timestamp}
                createdAt={item.createdAt}
                status={item.status}
                onPress={() =>
                  console.log(`알람 상세: ${item.title}`)
                }
              />
            </Animated.View>
          ))}
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 20,
  },
});

export default AlarmScreen;