// components/common/skeletonLoader.tsx
import { SkeletonLoaderStyles } from '@/shared/styles/components';
import React from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';


const SkeletonLoader: React.FC = () => {
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 800 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={SkeletonLoaderStyles.container}>
      {[...Array(5)].map((_, index) => (
        <Animated.View
          key={index}
          style={[SkeletonLoaderStyles.skeletonCard, animatedStyle]}
        >
          <View style={SkeletonLoaderStyles.skeletonLine} />
          <View style={SkeletonLoaderStyles.skeletonLineShort} />
        </Animated.View>
      ))}
    </View>
  );
};

export default SkeletonLoader;