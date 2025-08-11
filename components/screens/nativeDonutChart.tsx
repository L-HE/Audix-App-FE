import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, SafeAreaView, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { CardState } from '../../assets/data/areaData';
import { size, DonutChartStyles as styles } from '../../shared/styles/components';
import { Colors, getBorderColor } from '../../shared/styles/global';

// Animated SVG 컴포넌트 생성
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  deviceId: string;
  normalScore: number;
  status: string;
  name: string;
}

const NativeDonutChart: React.FC<Props> = ({ deviceId, normalScore, status, name }) => {
  // 컴포넌트 마운트 상태 추적
  const isMounted = useRef(true);
  const renderStartTime = useRef(performance.now());
  
  // normalScore가 0-1 범위면 100을 곱해서 퍼센트로 변환
  const used = normalScore <= 1 ? normalScore * 100 : normalScore;
  
  // SVG 도넛 차트 계산
  const radius = size * 0.35;
  const strokeWidth = size * 0.1;
  const center = size * 0.5;
  const circumference = 2 * Math.PI * radius;

  const animatedValue = useRef(new Animated.Value(0)).current;

  // 애니메이션 값 - 간단한 방식으로 변경
  // useRef로 setState 대체
  const isAnimatingRef = useRef(false);
  const prevUsedRef = useRef<number | null>(null);

  // 색상 계산
  const primaryColor = React.useMemo(() => {
    try {
      return getBorderColor(status as CardState);
    } catch (error) {
      return Colors.borderLight;
    }
  }, [status]);

  // 간단한 애니메이션 시작 함수
  const startAnimation = useCallback((target: number) => {
    if (!isMounted.current) return;
    if (isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    console.log(`🎬 [${deviceId}] 도넛 차트 애니메이션 시작: ${used}%`);

    // 간단한 애니메이션 - 리스너 없이 바로 목표값으로
    animatedValue.setValue(0);
    
    Animated.timing(animatedValue, {
      toValue: target,
      duration: 600, // 더 빠른 애니메이션
      useNativeDriver: false, // SVG는 네이티브 드라이버 지원 안함
    }).start(() => {
      if (isMounted.current) return;
      isAnimatingRef.current = false;
      console.log(`✅ [${deviceId}] 도넛 차트 애니메이션 완료: ${used}%`);
    });
  }, [animatedValue, deviceId]);

  // 데이터 변경 감지 및 애니메이션 트리거
  const prevNormalScore = useRef(normalScore);
  
  // 단일 effect: 최초 + 값 변경 시
  useEffect(() => {
    if (!isMounted.current) return;

    const renderEnd = performance.now();
    console.log(`🔄 [${deviceId}] 렌더링: ${(renderEnd - renderStartTime.current).toFixed(2)}ms`);

    const prev = prevUsedRef.current;
    if (prev === null || prev !== used) {
      console.log(`📊 [${deviceId}] used 변경: ${prev} → ${used}`);
      prevUsedRef.current = used;
      startAnimation(used);
    } else {
      // 값 동일 → 애니메이션 없이 유지
      animatedValue.setValue(used);
    }
  }, [used, startAnimation, deviceId, animatedValue]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      isMounted.current = false;
      console.log(`🧹 [${deviceId}] 네이티브 도넛 차트 unmount`);
    };
  }, [deviceId]);

  // 안전한 렌더링
  if (!isMounted.current) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.chartContainer}>
        <Svg width={size} height={size} style={styles.svgContainer}>
          {/* 배경 원 */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={Colors.borderLight}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
          
          {/* 진행도 원 - Animated 적용 */}
          <AnimatedCircle
            cx={center}
            cy={center}
            r={radius}
            stroke={primaryColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={animatedValue.interpolate({
              inputRange: [0, 100],
              outputRange: [circumference, 0],
            })}
            transform={`rotate(-90 ${center} ${center})`}
          />
        </Svg>

        {/* 중심에 퍼센트 표시 - 간단한 고정 텍스트 */}
        <View style={styles.centerContent}>
          <Text style={styles.percentText}>
            {Math.round(used)}%
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default React.memo(NativeDonutChart, (prev, next) => {
  try {
    const shouldUpdate = (
      prev.normalScore !== next.normalScore ||
      prev.status !== next.status ||
      prev.name !== next.name
    );

    console.log(`🔍 네이티브 도넛차트 [${prev.deviceId}] 메모 비교:`, {
      normalScore: `${prev.normalScore} → ${next.normalScore}`,
      status: `${prev.status} → ${next.status}`,
      shouldUpdate
    });

    if (shouldUpdate) {
      console.log(`🔍 [${prev.deviceId}] re-render (score/status/name 변화)`);
    }
    
    return !shouldUpdate;
  } catch (error) {
    console.warn('⚠️ 네이티브 도넛차트 메모 비교 실패, 리렌더링 허용:', error);
    return false;
  }
});
