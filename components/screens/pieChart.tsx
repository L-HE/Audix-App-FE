// components/common/pieChart.tsx
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { VictoryPie } from 'victory-native';

export interface PieChartProps {
  /** 
   * 차트 조각 데이터 
   * 예: [{ value: 20, color: '#FF3116' }, { value: 80, color: '#EEE' }]
   */
  series: { value: number; color: string }[];
  /** 차트 가로/세로 크기(px). 기본값은 화면 너비의 60% */
  size?: number;
  /** 도넛 구멍 비율(0~1). 기본값 0.6 */
  innerRadiusRatio?: number;
  /** 조각 사이 간격(도형 각도 단위). 기본값 2 */
  padAngle?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DEFAULT_SIZE = SCREEN_WIDTH * 0.3;

const PieChart: React.FC<PieChartProps> = ({
  series,
  size = DEFAULT_SIZE,
  innerRadiusRatio = 0.6,
  padAngle = 2,
}) => {
  // VictoryPie 에 넘길 데이터와 색상 배열로 변환
  const data = series.map((s, idx) => ({ x: idx, y: s.value }));
  const colorScale = series.map(s => s.color);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <VictoryPie
        width={size}
        height={size}
        data={data}
        colorScale={colorScale}
        innerRadius={size * innerRadiusRatio}
        padAngle={padAngle}
        labels={() => null}        // 숫자 라벨 숨기기
        standalone={true}         // VictoryPie 가 자체 Svg 를 rendering
      />
    </View>
  );
};

export default PieChart;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
