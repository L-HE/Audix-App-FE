// app/(tabs)/alarm.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { alarmData } from '../../../assets/data/alarmData';
import AlarmCard from '../../../components/screens/alarmCard';

const AlarmScreen: React.FC = () => {
  const router = useRouter();

  return (
    <ScrollView 
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
    >
      {alarmData.map((item, index) => (
        <Animated.View
          key={item.alarmId}
          entering={index < 8 ? FadeIn.delay(index * 40).duration(300) : FadeIn.duration(200)}
        >
          <AlarmCard
            alarmId={item.alarmId}
            title={item.title}
            subtitle={item.subtitle}
            timestamp={item.timestamp}
            createdAt={item.createdAt}
            status={item.status}
            onPress={() =>
              console.log(`알람 상세:`)
            }
          />
        </Animated.View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
});

export default AlarmScreen;