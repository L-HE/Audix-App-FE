// components/common/skeletonLoader.tsx
import { SkeletonLoaderStyles as style } from '@/shared/styles/components';
import React from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

/**
 * SkeletonLoader 컴포넌트
 * - 로딩 상태에서 컨텐츠 대신 뼈대 UI(skeleton screen)를 보여줌
 * - reanimated를 사용해 opacity 애니메이션 반복
 */
const SkeletonLoader: React.FC = () => {
  /** 
   * opacity: 0.3 ~ 1.0 사이에서 반복되는 애니메이션 값
   */
  const opacity = useSharedValue(0.3);

  /**
   * 마운트 시 애니메이션 시작
   * - withRepeat: 무한 반복 (-1)
   * - withTiming: 0.3 → 1.0 전환을 800ms에 걸쳐 실행
   * - reverse=true로 왕복 애니메이션
   */
  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 800 }),
      -1, // 무한 반복
      true // 왕복
    );
  }, []);

  /**
   * Animated.View에 적용할 스타일
   * - opacity를 실시간 애니메이션 값으로 업데이트
   */
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  /**
   * 렌더링
   * - 5개의 skeleton card를 렌더
   * - 각 card 안에는 긴 줄(skeletonLine) + 짧은 줄(skeletonLineShort) 구성
   */
  return (
    <View style={style.container}>
      {[...Array(5)].map((_, index) => (
        <Animated.View
          key={index}
          style={[style.skeletonCard, animatedStyle]}
        >
          <View style={style.skeletonLine} />
          <View style={style.skeletonLineShort} />
        </Animated.View>
      ))}
    </View>
  );
};

export default SkeletonLoader;
