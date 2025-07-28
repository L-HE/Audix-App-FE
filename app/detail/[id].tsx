// app/detail/[id].tsx
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import machineData, { Machine } from '../../assets/data/machineData';
import MachineCard from '../../components/screens/machineCard';

type Params = { id: string };

const orderMap: Record<Machine['state'], number> = {
  danger: 0,
  warning: 1,
  normal: 2,
  unknown: 3,
};

const DetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<Params>();

  const sortedMachines = useMemo(() => {
    return machineData
      .filter(m => m.areaId === id)
      .sort((a, b) => orderMap[a.state] - orderMap[b.state]);
  }, [id]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {sortedMachines.map(m => (
        <MachineCard key={m.id} {...m} />
      ))}
    </ScrollView>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  content: { padding: 16 },
});