// app/(tabs)/alarms/index.tsx
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useModal } from '@/shared/api/modalContextApi';
import { Colors } from '@/shared/styles/global';
import { alarmData } from '../../../assets/data/alarmData';
import AlarmCard from '../../../components/screens/alarmCard';

const AlarmScreen: React.FC = () => {
  const { showModal } = useModal();

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
              machineStatus={item.machineStatus}
              alarmTitle={item.alarmTitle}
              regionName={item.regionName}
              regionLocation={item.regionLocation}
              model={item.model}
              timestamp={item.timestamp}
              createdAt={item.createdAt}
              message={item.message}
              type={item.type}
              onPress={() => showModal(item)}
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