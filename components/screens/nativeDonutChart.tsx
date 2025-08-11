import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Easing, SafeAreaView, Text, View } from 'react-native';
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
  initialAnimate?: boolean;
}

const NativeDonutChart: React.FC<Props> = ({ deviceId, normalScore, status, name, initialAnimate }) => {
  const isMounted = useRef(true);
  const renderStartTime = useRef(performance.now());
  renderStartTime.current = performance.now();

  const animatedValue = useRef(new Animated.Value(0)).current;
  const isAnimatingRef = useRef(false);
  const prevUsedRef = useRef<number | null>(null);

  const used = normalScore <= 1 ? normalScore * 100 : normalScore;

  // SVG 도넛 차트 계산
  const radius = size * 0.35;
  const strokeWidth = size * 0.1;
  const center = size * 0.5;
  const circumference = 2 * Math.PI * radius;

  // 색상 계산
  const primaryColor = React.useMemo(() => {
    try {
      return getBorderColor(status as CardState);
    } catch (error) {
      return Colors.borderLight;
    }
  }, [status]);

  // Δ 2% 미만 변화 스킵 / 빠른 연속 업데이트 디바운스용
  const lastAnimTimeRef = useRef(0);

  // 간단한 애니메이션 시작 함수
  const startAnimation = useCallback((
    target: number,
    prev: number,
    opts?: { force?: boolean }
  ) => {
    if (!isMounted.current) return;

    const now = Date.now();
    const delta = Math.abs(target - prev);

    if (!opts?.force && delta < 2) {
      animatedValue.stopAnimation();
      animatedValue.setValue(target);
      return;
    }

    const fast = now - lastAnimTimeRef.current < 300;
    lastAnimTimeRef.current = now;

    let startFrom = prev;
    animatedValue.stopAnimation((curr: number) => {
      if (typeof curr === 'number') startFrom = curr;
    });
    animatedValue.setValue(startFrom);

    const baseDur = Math.min(650, Math.max(180, (delta / 100) * 500));
    const duration = baseDur * (fast ? 0.6 : 1);

    isAnimatingRef.current = true;
    Animated.timing(animatedValue, {
      toValue: target,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false
    }).start(() => {
      if (!isMounted.current) return;
      isAnimatingRef.current = false;
    });
  }, [animatedValue]);

  // 단일 effect: 최초 + 값 변경 시
  useEffect(() => {
    if (!isMounted.current) return;
    
    const prev = prevUsedRef.current;
    console.log(`🔍 [${deviceId}] mount check: prev=${prev}, used=${used}, initialAnimate=${initialAnimate}`);

    // prevUsedRef 초기화를 더 명확하게
    if (prev === null) {
      prevUsedRef.current = used;
      if (initialAnimate) {
        console.log(`🎬 [${deviceId}] 0→${used} 초기 애니메이션`);
        animatedValue.setValue(0);
        startAnimation(used, 0, { force: true });
      } else {
        console.log(`⚡ [${deviceId}] 즉시 ${used} 설정`);
        animatedValue.setValue(used);
      }
      return;
    }

    if (prev !== used) {
      console.log(`📊 [${deviceId}] 값 변경: ${prev} → ${used}`);
      startAnimation(used, prev);
      prevUsedRef.current = used;
    }
  }, [used, initialAnimate, startAnimation, animatedValue, deviceId]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      console.log(`🧹 [${deviceId}] unmount - prevUsedRef 초기화`);
      prevUsedRef.current = null;
      animatedValue.stopAnimation();
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
