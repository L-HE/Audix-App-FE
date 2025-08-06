// components/common/splashScreen.tsx
import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../shared/styles/global';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      {/* 배경 도형들 */}
      <View style={styles.backgroundShapes}>
        <Image
            source={require('../../assets/images/pictures/landing_left.png')}
            style={[styles.shape, styles.topShape]}
            resizeMode="cover"
          />
        <Image
            source={require('../../assets/images/pictures/landing_right.png')}
            style={[styles.shape, styles.bottomShape]}
            resizeMode="cover"
          />
      </View>

      <View style={styles.content}>
        {/* 앱 로고 */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logos/AudixLogoNavy.png')}
            style={styles.logo}
            resizeMode="cover"
          />
        </View>
        
        {/* 로고 하단 문구 */}
        <View style={styles.textContainer}>
          <Text style={styles.subtitle}>
            {`지능적 공장의 안전을\n소리로 지켜주는 스마트 솔루션`}
          </Text>
        </View>

        {/* 로딩 인디케이터 */}
        <ActivityIndicator 
          size="large" 
          color={Colors.textPrimary} 
          style={styles.loader} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundShapes: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  shape: {
    position: 'absolute',
  },
  topShape: {
    top: 0,
    left: 0,
  },
  bottomShape: {
    bottom: 0,
    right: 0,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,                // 배경 위에 표시
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 250,  // 더 큰 크기
    height: 80,
  },
  textContainer: {
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
  },
  loader: {
    // ✅ 추가 스타일 불필요 (gap으로 간격 관리)
  },
});

export default SplashScreen;