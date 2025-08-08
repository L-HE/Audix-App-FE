// components/common/splashScreen.tsx
import { SplashScreenStyles } from '@/shared/styles/components';
import React from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { Colors } from '../../shared/styles/global';

const SplashScreen = () => {
  return (
    <View style={SplashScreenStyles.container}>
      {/* 배경 도형들 */}
      <View style={SplashScreenStyles.backgroundShapes}>
        <Image
            source={require('../../assets/images/pictures/landing_left.png')}
            style={[SplashScreenStyles.shape, SplashScreenStyles.topShape]}
            resizeMode="cover"
          />
        <Image
            source={require('../../assets/images/pictures/landing_right.png')}
            style={[SplashScreenStyles.shape, SplashScreenStyles.bottomShape]}
            resizeMode="cover"
          />
      </View>

      <View style={SplashScreenStyles.content}>
        {/* 앱 로고 */}
        <View style={SplashScreenStyles.logoContainer}>
          <Image
            source={require('../../assets/images/logos/AudixLogoNavy.png')}
            style={SplashScreenStyles.logo}
            resizeMode="cover"
          />
        </View>
        
        {/* 로고 하단 문구 */}
        <View style={SplashScreenStyles.textContainer}>
          <Text style={SplashScreenStyles.subtitle}>
            {`지능적 공장의 안전을\n소리로 지켜주는 스마트 솔루션`}
          </Text>
        </View>

        {/* 로딩 인디케이터 */}
        <ActivityIndicator 
          size="large" 
          color={Colors.textPrimary}
        />
      </View>
    </View>
  );
};

export default SplashScreen;