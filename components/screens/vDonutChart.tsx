import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
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
  // ✅ 컴포넌트 마운트 상태 추적
  const isMounted = useRef(true);
  const renderStartTime = useRef(performance.now());
  
  // ✅ 안전한 상태 업데이트 함수
  const safeSetState = useCallback((setter: () => void) => {
    if (isMounted.current) {
      try {
        setter();
      } catch (error) {
        console.warn(`⚠️ [${deviceId}] 상태 업데이트 실패:`, error);
      }
    }
  }, [deviceId]);


  // normalScore가 0-1 범위면 100을 곱해서 퍼센트로 변환
  const used = normalScore <= 1 ? normalScore * 100 : normalScore;
  const remaining = 100 - used;

  // ✅ 데이터 계산 성능 측정
  const finalData = React.useMemo(() => {
    const data = [
      { x: name, y: used },
      { x: '', y: remaining },
    ];
    return data;
  }, [name, used, remaining, deviceId]);

  // ✅ 안전한 초기 상태
  const [data, setData] = useState(() => [
    { x: name, y: 0 },
    { x: '', y: 100 },
  ]);

  // ✅ 상태 변경 추적
  const renderCount = useRef(0);
  const dataUpdateCount = useRef(0);
  const animationCount = useRef(0);
  const activeTimers = useRef<Set<number>>(new Set());

  // ✅ 안전한 타이머 관리
  const setSafeTimeout = useCallback((callback: () => void, delay: number) => {
    const timer = setTimeout(() => {
      activeTimers.current.delete(timer);
      if (isMounted.current) {
        callback();
      }
    }, delay);
    
    activeTimers.current.add(timer);
    return timer;
  }, []);

  // ✅ 안전한 차트 애니메이션 함수
  const startChartAnimation = useCallback(() => {
    if (!isMounted.current) return;
    
    animationCount.current++;
    
    // ✅ 안전한 데이터 업데이트
    safeSetState(() => setData(finalData));
    
    setSafeTimeout(() => {
      if (isMounted.current) {
      }
    }, 1000);
  }, [finalData, deviceId, safeSetState, setSafeTimeout]);

  const prevNormalScore = useRef(normalScore);

  // ✅ 메모리 사용량 추적
  const trackMemoryUsage = useCallback(() => {
    if (!isMounted.current) return;
    
    try {
      if (global.gc && typeof global.gc === 'function') {
        const memBefore = (global as any).performance?.memory?.usedJSHeapSize;
        if (memBefore) {
          console.log(`💾 [${deviceId}] 메모리 사용량: ${(memBefore / 1024 / 1024).toFixed(2)}MB`);
        }
      }
    } catch (error) {
      console.warn(`⚠️ [${deviceId}] 메모리 추적 실패:`, error);
    }
  }, [deviceId]);

  // ✅ 안전한 데이터 변경 감지
  useEffect(() => {
    if (!isMounted.current) return;

    renderCount.current++;
    const renderEndTime = performance.now();
    const renderDuration = renderEndTime - renderStartTime.current;
    
    console.log(`🔄 [${deviceId}] 렌더링 완료 #${renderCount.current}: ${renderDuration.toFixed(2)}ms`);
    
    const hasDataChanged = prevNormalScore.current !== normalScore;
    
    if (hasDataChanged) {
      dataUpdateCount.current++;

      // ✅ 안전한 애니메이션 실행
      const timer = setSafeTimeout(() => {
        startChartAnimation();
      }, 400);

      trackMemoryUsage();

      return () => {
        if (activeTimers.current.has(timer)) {
          clearTimeout(timer);
          activeTimers.current.delete(timer);
        }
      };
    } else {
      safeSetState(() => setData(finalData));
    }

    prevNormalScore.current = normalScore;
  }, [finalData, normalScore, startChartAnimation, deviceId, trackMemoryUsage, safeSetState, setSafeTimeout]);

  // ✅ 색상 계산 성능 측정 (안전한 버전)
  const colorCalculation = React.useMemo(() => {
    try {
      const primaryColor = getBorderColor(status as CardState);
      const colorScale = [primaryColor, Colors.borderLight];
      return colorScale;
    } catch (error) {
      return [Colors.borderLight, Colors.borderLight];
    }
  }, [status, deviceId]);

  // ✅ 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      
      // 마운트 상태 변경
      isMounted.current = false;
      
      // 모든 활성 타이머 정리
      activeTimers.current.forEach(timer => {
        clearTimeout(timer);
      });
      activeTimers.current.clear();
    };
  }, [deviceId]);

  // ✅ 렌더링 완료 로그 (안전한 버전)
  useEffect(() => {
    if (!isMounted.current) return;
    
    try {
      const endTime = performance.now();
      const totalTime = endTime - renderStartTime.current;
      console.log(`✅ [${deviceId}] 전체 렌더링 사이클 완료: ${totalTime.toFixed(2)}ms`);
      
      // 성능 레포트
      if (renderCount.current % 10 === 0) {
      }
    } catch (error) {
      console.warn(`⚠️ [${deviceId}] 렌더링 로그 실패:`, error);
    }
  });

  // ✅ 안전한 렌더링
  if (!isMounted.current) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.chartContainer}>
        <VictoryPie
          data={data}
          innerRadius={size * 0.3}
          radius={size * 0.5}
          padAngle={2}
          colorScale={colorCalculation}
          labels={() => null}
          animate={{
            duration: 1000,
            easing: 'exp'
          }}
        />

        {/* 중심에 퍼센트 표시 */}
        <View style={styles.centerContent}>
          <Text style={styles.percentText}>
            {Math.round(used)}%
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default React.memo(VDonutChart, (prevProps, nextProps) => {
  // ✅ 안전한 메모이제이션 비교
  try {
    const shouldUpdate = (
      prevProps.normalScore !== nextProps.normalScore ||
      prevProps.status !== nextProps.status ||
      prevProps.name !== nextProps.name
    );
    
    console.log(`🔍 DonutChart [${prevProps.deviceId}] 메모 비교:`, {
      normalScore: `${prevProps.normalScore} → ${nextProps.normalScore}`,
      status: `${prevProps.status} → ${nextProps.status}`,
      name: `${prevProps.name} → ${nextProps.name}`,
      shouldUpdate
    });
    
    return !shouldUpdate;
  } catch (error) {
    console.warn('⚠️ DonutChart 메모 비교 실패, 리렌더링 허용:', error);
    return false; // 에러 시 리렌더링 허용
  }
});
