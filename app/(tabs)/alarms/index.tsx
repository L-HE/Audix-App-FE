// app/(tabs)/alarms/index.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Colors } from '@/shared/styles/global';
import { alarmData } from '../../../assets/data/alarmData';
import AlarmCard from '../../../components/screens/alarmCard';

const AlarmScreen: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {alarmData.map((item, index) => (
          <View key={item.alarmId}>
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
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
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