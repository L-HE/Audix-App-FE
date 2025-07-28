import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { VictoryPie } from 'victory-native';

// Machine 타입 정의
export type Machine = {
  id: string;
  areaId: string;
  name: string;
  model: string;
  percent: number;
  location: string;
  owner: string;
  state: 'danger' | 'warning' | 'normal' | 'unknown';
};

// 예시 데이터
const machineData: Machine[] = [
  { id: 'm1', areaId: '1', name: '로봇팔', model: 'SO-ARM101', percent: 15,  location: '2층 자동차 부재료 조립구역', owner: '이하은', state: 'danger' },
  { id: 'm2', areaId: '1', name: '로봇팔', model: 'SO-ARM102', percent: 80,  location: '2층 자동차 부재료 조립구역', owner: '김서현', state: 'normal' },
  { id: 'm5', areaId: '1', name: '로봇팔', model: 'SO-ARM101', percent: 65,  location: '2층 자동차 부재료 조립구역', owner: '도종명', state: 'warning' },
  { id: 'm3', areaId: '2', name: '로봇팔', model: 'SO-ARM101', percent: 15,  location: '2층 자동차 부재료 조립구역', owner: '김재걸', state: 'danger' },
  { id: 'm4', areaId: '2', name: '로봇팔', model: 'SO-ARM101', percent: 55,  location: '2층 자동차 부재료 조립구역', owner: '김현민', state: 'warning' },
];

interface Props {
  /** 표시할 머신의 id */
  id: string;
}

const MachineDonutChart: React.FC<Props> = ({ id }) => {
  // 선택한 머신 찾기
  const selected = machineData.find(m => m.id === id);
  if (!selected) {
    return null;
  }

  const used = selected.percent;
  const remaining = 100 - used;
  const chartData = [
    { x: `${selected.name}`, y: used },
    { x: '', y: remaining },
  ];

  // 두 조각에 대한 색상: 첫 번째는 머신 상태에 따라, 두 번째는 회색
  const primaryColor =
    selected.state === 'danger' ? '#e53935' :
    selected.state === 'warning' ? '#fdd835' :
    selected.state === 'normal'  ? '#43a047' :
    '#9e9e9e';
  const colorScale = [primaryColor, '#e0e0e0'];

  return (
    <SafeAreaView style={styles.container}>
      <VictoryPie
        data={chartData}
        innerRadius={60}
        padAngle={2}
        colorScale={colorScale}
        labels={() => null} // 라벨 숨기기
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

export default MachineDonutChart;
