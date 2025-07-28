import React from 'react';
import { Dimensions, SafeAreaView, StyleSheet } from 'react-native';
import { VictoryPie } from 'victory-native';
import machineData from '../../assets/data/machineData';

interface Props {
  /** 표시할 머신의 id */
  id: string;
}

const MachineDonutChart: React.FC<Props> = ({ id }) => {
  const screenWidth = Dimensions.get('window').width;
  const chartSize = screenWidth * 0.4; // 화면 너비의 40%

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
    <SafeAreaView style={[styles.container, { width: chartSize, height: chartSize }]}>
      <VictoryPie
        data={chartData}
        innerRadius={chartSize * 0.3}
        radius={chartSize * 0.5}
        padAngle={2}
        colorScale={colorScale}
        labels={() => null} // 라벨 숨기기
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MachineDonutChart;
