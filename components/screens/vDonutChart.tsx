import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet } from 'react-native';
import { VictoryPie } from 'victory-native';
import machineData from '../../assets/data/machineData';

interface Props { id: string; }

const VDonutChart: React.FC<Props> = ({ id }) => {
  const screenWidth = Dimensions.get('window').width;
  const size = screenWidth * 0.4;

  // 머신 필터링
  const selected = machineData.find(m => m.id === id)!;
  const used = selected.percent;
  const remaining = 100 - used;
  const finalData = [
    { x: selected.name, y: used },
    { x: '',            y: remaining },
  ];

  // 애니메이션용 state
  const [data, setData] = useState([
    { x: selected.name, y: 0 },
    { x: '',            y: 100 },
  ]);

  useEffect(() => {
    // 마운트 후 실제 값으로 업데이트 → 데이터 변경 애니메이션 발생
    const tid = setTimeout(() => setData(finalData), 100);
    return () => clearTimeout(tid);
  }, []);

  // 색상 매핑
  const primaryColor =
    selected.state === 'danger'  ? '#e53935' :
    selected.state === 'warning' ? '#fdd835' :
    '#43a047';
  const colorScale = [primaryColor, '#e0e0e0'];

  return (
    <SafeAreaView style={[styles.container, { width: size, height: size }]}>
      <VictoryPie
        data={data}
        innerRadius={size * 0.3}
        radius={size * 0.5}
        padAngle={2}
        colorScale={colorScale}
        labels={() => null}
        animate={{ duration: 1000 }}  // onLoad 대신 데이터 변경 애니메이션
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center' },
});

export default VDonutChart;
