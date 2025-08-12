// components/screens/nativeDonutChart.tsx
import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Easing, SafeAreaView, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { CardState } from '../../assets/data/areaData';
import { Colors, getBorderColor } from '../../shared/styles/colors';
import { size, DonutChartStyles as styles } from '../../shared/styles/components';

// ▸ Animated SVG 컴포넌트 (원에 애니메이션 적용)
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// ▸ Props 타입 정의
interface Props {
  deviceId: string;
  normalScore: number;     // 0~1 또는 0~100 형태 점수
  status: string;          // 상태(색상 결정에 사용)
  name: string;            // 기기명
  initialAnimate?: boolean; // 최초 마운트 시 0→값 애니메이션 여부
}

const NativeDonutChart: React.FC<Props> = ({ deviceId, normalScore, status, name, initialAnimate }) => {
  // ===== 마운트 상태 가드 =====
  const isMounted = useRef(true);

  // ===== 진행도 애니메이션 값 (0~100) =====
  const animatedValue = useRef(new Animated.Value(0)).current;

  // ===== 이전 used 값을 저장 (변경 여부 체크) =====
  const prevUsedRef = useRef<number | null>(null);

  // ===== 빠른 연속 업데이트 감지용 타임스탬프 =====
  const lastAnimTimeRef = useRef(0);

  // ===== 입력 normalScore를 0~100 범위로 변환 =====
  const used = normalScore <= 1 ? normalScore * 100 : normalScore;

  // ===== 도넛 차트 기하 계산 =====
  const radius = size * 0.35;
  const strokeWidth = size * 0.1;
  const center = size * 0.5;
  const circumference = 2 * Math.PI * radius;

  // ===== 색상 계산 =====
  const primaryColor = React.useMemo(() => {
    try {
      return getBorderColor(status as CardState);
    } catch {
      return Colors.borderLight;
    }
  }, [status]);

  // ===== 애니메이션 실행 함수 =====
  const startAnimation = useCallback((
    target: number,
    prev: number,
    opts?: { force?: boolean }
  ) => {
    if (!isMounted.current) return; // 마운트 상태 확인

    const now = Date.now();
    const delta = Math.abs(target - prev);

    // ▸ 변화량이 2% 미만이면 애니메이션 생략
    if (!opts?.force && delta < 2) {
      animatedValue.stopAnimation();
      animatedValue.setValue(target);
      return;
    }

    // ▸ 연속 업데이트 시 속도 단축
    const fast = now - lastAnimTimeRef.current < 300;
    lastAnimTimeRef.current = now;

    // ▸ 현재 값에서 이어서 시작
    let startFrom = prev;
    animatedValue.stopAnimation((curr: number) => {
      if (typeof curr === 'number') startFrom = curr;
    });
    animatedValue.setValue(startFrom);

    // ▸ 변화량 기반 지속시간 설정
    const baseDur = Math.min(650, Math.max(180, (delta / 100) * 500));
    const duration = baseDur * (fast ? 0.6 : 1);

    Animated.timing(animatedValue, {
      toValue: target,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [animatedValue]);

  // ===== 값 변경 시 애니메이션 처리 =====
  useEffect(() => {
    if (!isMounted.current) return;

    const prev = prevUsedRef.current;

    // ▸ 최초 마운트 처리
    if (prev === null) {
      prevUsedRef.current = used;
      if (initialAnimate) {
        animatedValue.setValue(0);
        startAnimation(used, 0, { force: true });
      } else {
        animatedValue.setValue(used);
      }
      return;
    }

    // ▸ 값이 변했을 때만 애니메이션 실행
    if (prev !== used) {
      startAnimation(used, prev);
      prevUsedRef.current = used;
    }
  }, [used, initialAnimate, startAnimation, animatedValue]);

  // ===== 언마운트 처리 =====
  useEffect(() => {
    return () => {
      isMounted.current = false;
      prevUsedRef.current = null;
      animatedValue.stopAnimation();
    };
  }, [animatedValue]);

  // ===== 마운트 가드 =====
  if (!isMounted.current) return null;

  // ===== UI 렌더링 =====
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

          {/* 진행도 원 (애니메이션 적용) */}
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

        {/* 중앙 퍼센트 표시 */}
        <View style={styles.centerContent}>
          <Text style={styles.percentText}>
            {Math.round(used)}%
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

// ===== React.memo로 불필요한 리렌더링 방지 =====
export default React.memo(NativeDonutChart, (prev, next) => {
  const shouldUpdate =
    prev.normalScore !== next.normalScore ||
    prev.status !== next.status ||
    prev.name !== next.name;

  return !shouldUpdate;
});
