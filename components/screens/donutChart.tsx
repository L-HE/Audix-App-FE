// DonutChart.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface DonutChartProps {
  percent: number;
  radius?: number;
  strokeWidth?: number;
}

const DonutChart: React.FC<DonutChartProps> = ({
  percent,
  radius = 50,
  strokeWidth = 12,
}) => {
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;
  const color =
    percent >= 75
      ? '#2ecc71'
      : percent >= 50
      ? '#f1c40f'
      : '#e74c3c';

  return (
    <View style={{ width: radius * 2, height: radius * 2 }}>
      <Svg width={radius * 2} height={radius * 2}>
        {/* 배경 원 */}
        <Circle
          stroke="#eee"
          fill="none"
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          strokeWidth={strokeWidth}
        />
        {/* 진행 원 */}
        <Circle
          stroke={color}
          fill="none"
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      {/* 중앙 퍼센트 텍스트 */}
      <View style={[StyleSheet.absoluteFillObject, styles.center]}>
        <Text style={styles.percentText}>{percent}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  center: { justifyContent: 'center', alignItems: 'center' },
  percentText: { fontSize: 16, fontWeight: 'bold' },
});

export default DonutChart;
