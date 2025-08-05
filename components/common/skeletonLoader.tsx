// components/common/skeletonLoader.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
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
    <View style={styles.container}>
      {[...Array(5)].map((_, index) => (
        <Animated.View 
          key={index} 
          style={[styles.skeletonCard, animatedStyle]}
        >
          <View style={styles.skeletonLine} />
          <View style={styles.skeletonLineShort} />
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  skeletonCard: {
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    height: 80,
  },
  skeletonLine: {
    height: 16,
    backgroundColor: '#c0c0c0',
    borderRadius: 4,
    marginBottom: 8,
    width: '80%',
  },
  skeletonLineShort: {
    height: 12,
    backgroundColor: '#c0c0c0',
    borderRadius: 4,
    width: '60%',
  },
});

export default SkeletonLoader;