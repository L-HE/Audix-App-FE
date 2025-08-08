import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { VictoryPie } from 'victory-native';
import { CardState } from '../../assets/data/areaData';
import { size, VDonutChartStyles as styles } from '../../shared/styles/components';
import { Colors, getBorderColor } from '../../shared/styles/global';

interface Props {
  deviceId: string;
  normalScore: number;
  status: string;
  name: string;
}

const VDonutChart: React.FC<Props> = ({ deviceId, normalScore, status, name }) => {
  // normalScore가 0-1 범위면 100을 곱해서 퍼센트로 변환
  const used = normalScore <= 1 ? normalScore * 100 : normalScore;
  const remaining = 100 - used;

  // 최종 데이터를 메모화
  const finalData = React.useMemo(() => [
    { x: name, y: used },
    { x: '', y: remaining },
  ], [name, used, remaining]);

  // 애니메이션용 state
  const [data, setData] = useState([
    { x: name, y: 0 },
    { x: '', y: 100 },
  ]);

  // Reanimated 값들
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  // 차트 애니메이션 함수
  const startChartAnimation = useCallback(() => {
    // 차트 데이터 업데이트
    setData(finalData);
  }, [finalData]);

  const prevNormalScore = useRef(normalScore);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const hasDataChanged = prevNormalScore.current !== normalScore;
    
    if (hasDataChanged) {
      // 데이터 변경 시에만 애니메이션 실행
      console.log(`🎯 Chart 애니메이션 실행`);
      // 애니메이션 로직
      // 1. 차트 애니메이션 시작
      const timer = setTimeout(() => {
        startChartAnimation();
      }, 400);

      // 2. 텍스트 zoomIn 애니메이션 (차트 애니메이션 후 시작)
      const textTimer = setTimeout(() => {
        scale.value = withSpring(1, {
          damping: 15,
          stiffness: 150,
          mass: 1,
        });
        opacity.value = withTiming(1, { duration: 300 });
      }, 440); // 차트 애니메이션 중간쯤에 시작

      return () => {
        clearTimeout(timer);
        clearTimeout(textTimer);
      };
    } else {
      // 데이터 변경이 없으면 애니메이션 없이 업데이트
      setData(finalData);
    }

    prevNormalScore.current = normalScore;
  }, [finalData, normalScore, scale, opacity, startChartAnimation]);

  // 컴포넌트 언마운트 시 애니메이션 정리
  useEffect(() => {
    return () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
    };
  }, [scale, opacity]);

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  // 색상 매핑
  const primaryColor = getBorderColor(status as CardState);
  const colorScale = [primaryColor, Colors.borderLight];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.chartContainer}>
        <VictoryPie
          data={data}
          innerRadius={size * 0.3}
          radius={size * 0.5}
          padAngle={2}
          colorScale={colorScale}
          labels={() => null}
          animate={{
            duration: 1000,
            easing: 'exp'
          }}
        />

        {/* 중심에 퍼센트 표시 - ZoomIn 애니메이션 */}
        <View style={styles.centerContent}>
          <Animated.Text
            style={[
              styles.percentText,
              animatedTextStyle
            ]}
          >
            {Math.round(used)}%
          </Animated.Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VDonutChart;
