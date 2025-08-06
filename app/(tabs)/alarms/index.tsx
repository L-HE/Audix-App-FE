// app/(tabs)/alarms/index.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Colors } from '@/shared/styles/global';
import { alarmData } from '../../../assets/data/alarmData';
import AlarmCard from '../../../components/screens/alarmCard';
import { useModal } from '../../../shared/api/modalContextApi';

const AlarmScreen: React.FC = () => {
  const router = useRouter();
  const { setModalVisible, setModalData } = useModal();

  const handleAlarmPress = (item: any) => {
    setModalData({
      alarmId: item.alarmId,
      alarmTitle: item.alarmTitle,
      regionName: item.regionName,
      regionLocation: item.regionLocation,
      machineStatus: item.machineStatus,
      model: item.model,
      createdAt: item.createdAt,
      message: item.message,
      type: item.type,
    });
    
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {alarmData.map((item, index) => (
          <React.Fragment key={item.alarmId}>
            <AlarmCard
              alarmId={item.alarmId}
              machineStatus={item.machineStatus}
              alarmTitle={item.alarmTitle}
              regionName={item.regionName}
              regionLocation={item.regionLocation}
              model={item.model}
              createdAt={item.createdAt}
              message={item.message}
              type={item.type}
              onPress={() => handleAlarmPress(item)}
            />
          </React.Fragment>
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