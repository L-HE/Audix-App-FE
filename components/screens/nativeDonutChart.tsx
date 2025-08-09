import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  
  // 애니메이션 값 - 간단한 방식으로 변경
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [isAnimating, setIsAnimating] = useState(false);
  
  // 안전한 상태 업데이트 함수
  const safeSetState = useCallback((setter: () => void) => {
    if (isMounted.current) {
      try {
        setter();
      } catch (error) {
        console.warn(`⚠️ [${deviceId}] 상태 업데이트 실패:`, error);
      }
    }
  }, [deviceId]);

  // 색상 계산
  const primaryColor = React.useMemo(() => {
    try {
      return getBorderColor(status as CardState);
    } catch (error) {
      return Colors.borderLight;
    }
  }, [status]);

  // 간단한 애니메이션 시작 함수
  const startAnimation = useCallback(() => {
    if (!isMounted.current || isAnimating) return;
    
    console.log(`🎬 [${deviceId}] 도넛 차트 애니메이션 시작: ${used}%`);
    
    setIsAnimating(true);
    
    // 간단한 애니메이션 - 리스너 없이 바로 목표값으로
    animatedValue.setValue(0);
    
    Animated.timing(animatedValue, {
      toValue: used,
      duration: 600, // 더 빠른 애니메이션
      useNativeDriver: false, // SVG는 네이티브 드라이버 지원 안함
    }).start(() => {
      if (isMounted.current) {
        setIsAnimating(false);
        console.log(`✅ [${deviceId}] 도넛 차트 애니메이션 완료: ${used}%`);
      }
    });
  }, [used, deviceId, animatedValue, isAnimating]);

  // 데이터 변경 감지 및 애니메이션 트리거
  const prevNormalScore = useRef(normalScore);
  
  useEffect(() => {
    if (!isMounted.current) return;

    const renderEndTime = performance.now();
    const renderDuration = renderEndTime - renderStartTime.current;
    
    console.log(`🔄 [${deviceId}] 네이티브 도넛 차트 렌더링: ${renderDuration.toFixed(2)}ms`);
    
    const hasDataChanged = prevNormalScore.current !== normalScore;
    
    if (hasDataChanged || prevNormalScore.current === undefined) {
      console.log(`📊 [${deviceId}] 데이터 변경 감지: ${prevNormalScore.current} → ${normalScore}`);
      
      const cleanup = startAnimation();
      prevNormalScore.current = normalScore;
      
      return cleanup;
    }
    
    prevNormalScore.current = normalScore;
  }, [normalScore, deviceId, startAnimation]);

  // 컴포넌트 마운트 시 초기 애니메이션
  useEffect(() => {
    if (!isMounted.current) return;
    
    console.log(`🚀 [${deviceId}] 컴포넌트 마운트: normalScore=${normalScore}`);
    
    // 초기 로드 시에도 애니메이션 실행
    const cleanup = startAnimation();
    
    return cleanup;
  }, [startAnimation]); // startAnimation을 의존성에 추가

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      isMounted.current = false;
      console.log(`🧹 [${deviceId}] 네이티브 도넛 차트 정리 완료`);
    };
  }, [deviceId]);

  // 안전한 렌더링
  if (!isMounted.current) {
    return null;
  }

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

export default React.memo(NativeDonutChart, (prevProps, nextProps) => {
  try {
    const shouldUpdate = (
      prevProps.normalScore !== nextProps.normalScore ||
      prevProps.status !== nextProps.status ||
      prevProps.name !== nextProps.name
    );
    
    console.log(`🔍 네이티브 도넛차트 [${prevProps.deviceId}] 메모 비교:`, {
      normalScore: `${prevProps.normalScore} → ${nextProps.normalScore}`,
      status: `${prevProps.status} → ${nextProps.status}`,
      shouldUpdate
    });
    
    return !shouldUpdate;
  } catch (error) {
    console.warn('⚠️ 네이티브 도넛차트 메모 비교 실패, 리렌더링 허용:', error);
    return false;
  }
});
