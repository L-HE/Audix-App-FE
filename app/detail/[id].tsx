// app/detail/[id].tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { machineData } from '../../assets/data/machineData';
import MachineCard from '../../components/screens/machineCard';

const DetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // id와 일치하는 데이터만 필터링
  const cards = machineData.filter(item => item.id === id);

  return (
    <View style={styles.container}>

      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#656565" />
        </TouchableOpacity>
        <TextInput
          placeholder="검색어를 입력하세요"
          style={styles.searchInput}
        />
      </View>

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
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 16,
    marginBottom: 30,
    backgroundColor: '#fff',
  },
  backButton: { marginRight: 12 },
  searchInput: {
    flex: 1,
    height: 36,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#656565',
  },
  body: { flexGrow: 1, padding: 16, backgroundColor: '#f2f2f2' },
});
