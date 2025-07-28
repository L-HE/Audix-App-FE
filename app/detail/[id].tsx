// app/detail/[id].tsx
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import machineData from '../../assets/data/machineData';
import VDonutChart from '../../components/screens/vDonutChart';

type Params = { id: string };

const DetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<Params>();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true); // 스크린 렌더링 시 애니메이션 활성화
  }, []);

  // areaId가 id와 일치하는 첫 번째 머신만 선택
  const machine = machineData.find(m => m.areaId === id);

  return (
    <View style={styles.container}>
      {machine && <VDonutChart id={machine.id} />}
    </View>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f2f2f2' },
});
