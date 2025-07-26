// vDonutChart.tsx
import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { VictoryPie } from 'victory-native';

interface DonutData {
  x: string;
  y: number;
}

interface Props {
  data: DonutData[];
  colors?: string[];        // 색상 배열을 props로 받도록 하면 재사용성이 올라갑니다.
  innerRadius?: number;     // 도넛 구멍 크기
  title?: string;           // 차트 위 제목
}

const DonutChart: React.FC<Props> = ({
  data,
  colors = ['#4caf50', '#ffca28', '#e91e63', '#2196f3'],
  innerRadius = 50,
  title,
}) => {
  const { width } = useWindowDimensions();
  const size = Math.min(width * 0.8, 300);

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <VictoryPie
        animate={{ duration: 800 }}
        events={[{
            target: 'data',
            eventHandlers: {
            onPressIn: () => ({
                mutation: props => ({ innerRadius: props.innerRadius + 10 })
            }),
            onPressOut: () => null
            }
        }]}
        data={data}
        width={size}
        height={size}
        innerRadius={innerRadius}
        padAngle={2}                     // 조각 사이 간격
        colorScale={colors}              // 색상 배열
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    marginBottom: 8,
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
});

export default DonutChart;
