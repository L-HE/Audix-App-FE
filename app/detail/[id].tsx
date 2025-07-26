// app/detail/[id].tsx
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import DonutChart from '../../components/screens/donutChart'; // 방금 만든 컴포넌트

type Params = { id: string };

type Machine = {
  id: string;
  areaId: string;
  image: any;
  name: string;
  model: string;
  percent: number;
  location: string;
  owner: string;
  state: 'danger' | 'warning' | 'normal' | 'unknown';
};

// 파일 내에 직접 정의
const machineData: Machine[] = [
  {
    id: 'm1',
    areaId: '1',
    image: require('../../assets/images/AudixLogoNavy.png'),
    name: '로봇팔',
    model: 'SO-ARM101',
    percent: 15,
    location: '2층 자동차 부재료 조립구역',
    owner: '이하은',
    state: 'danger',
  },
  {
    id: 'm2',
    areaId: '1',
    image: require('../../assets/images/AudixLogoNavy.png'),
    name: '로봇팔',
    model: 'SO-ARM102',
    percent: 80,
    location: '2층 자동차 부재료 조립구역',
    owner: '김서현',
    state: 'normal',
  },
  {
    id: 'm3',
    areaId: '2',
    image: require('../../assets/images/AudixLogoNavy.png'),
    name: '로봇팔',
    model: 'SO-ARM101',
    percent: 15,
    location: '2층 자동차 부재료 조립구역',
    owner: '김재걸',
    state: 'danger',
  },
  {
    id: 'm4',
    areaId: '2',
    image: require('../../assets/images/AudixLogoNavy.png'),
    name: '로봇팔',
    model: 'SO-ARM101',
    percent: 55,
    location: '2층 자동차 부재료 조립구역',
    owner: '김현민',
    state: 'warning',
  },
  {
    id: 'm5',
    areaId: '1',
    image: require('../../assets/images/AudixLogoNavy.png'),
    name: '로봇팔',
    model: 'SO-ARM101',
    percent: 65,
    location: '2층 자동차 부재료 조립구역',
    owner: '도종명',
    state: 'warning',
  },
];

const DetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<Params>();

  // 상태 우선순위 매핑
  const orderMap: Record<Machine['state'], number> = {
    danger: 0,
    warning: 1,
    normal: 2,
    unknown: 3,
  };

  // areaId === id 이고, 상태 순서대로 정렬
  const sortedMachines = useMemo(() => {
    return machineData
      .filter(m => m.areaId === id)
      .sort((a, b) => (orderMap[a.state] ?? 99) - (orderMap[b.state] ?? 99));
  }, [id]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {sortedMachines.map(machine => (
        <View
          key={machine.id}
          style={[
            styles.card,
            styles[`card_${machine.state}`]
          ]}
        >
          {/* 1번 + 2번 flex를 row */}
          <View style={styles.row}>
            <View style={styles.flex1}>
              <Image
                source={machine.image}
                style={styles.image}
                resizeMode="contain"
              />
              <View>
                <Text style={styles.name}>{machine.name}</Text>
                <Text style={styles.subName}>{machine.model}</Text>
              </View>  
            </View>
            <DonutChart percent={machine.percent} />
          </View>

          {/* 3번 flex: 위치 & 담당자 */}
          <View style={styles.flex3}>
            <Text style={styles.infoText}>
              위치: {machine.location}
            </Text>
            <Text style={styles.infoText}>
              담당자: {machine.owner}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  content: { padding: 16 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
  },
  card_danger: { borderColor: '#e74c3c' },
  card_warning: { borderColor: '#f1c40f' },
  card_normal: { borderColor: '#2ecc71' },
  card_unknown: { borderColor: '#ccc' },

  row: { flexDirection: 'row', alignItems: 'center' },
  column: { flexDirection: 'column', alignItems: 'center' },
  flex1: { flex: 1},
  image: { width: 100, height: 100, marginRight: 12 },
  name: { fontSize: 16, fontWeight: 'bold' },
  subName: { fontSize: 14, color: '#777', marginTop: 4 },

  flex2: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },

  flex3: { marginTop: 12 },
  infoText: { fontSize: 14, color: '#555', marginTop: 2 },
});
