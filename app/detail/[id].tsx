// app/detail/[id].tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View
} from 'react-native';

import { machineData } from '../../assets/data/machineData';
import MachineCard from '../../components/screens/machineCard';

const DetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // id와 일치하는 데이터만 필터링 후 percent 오름차순 정렬
  const cards = machineData.filter(item => item.id === id);

  return (
    <View style={styles.container}>

      {/* Body: MachineCard 리스트 */}
      <ScrollView contentContainerStyle={styles.body}>
        {cards.map((item, idx) => (
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
