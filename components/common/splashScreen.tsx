// components/common/splashScreen.tsx
import { SplashScreenStyles as style } from '@/shared/styles/components';
import React from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { Colors } from '../../shared/styles/global';

const SplashScreen = () => {
  return (
    <View style={style.container}>
      {/* 배경 도형들 */}
      <View style={style.backgroundShapes}>
        <Image
            source={require('../../assets/images/pictures/landing_left.png')}
            style={[style.shape, style.topShape]}
            resizeMode="cover"
          />
        <Image
            source={require('../../assets/images/pictures/landing_right.png')}
            style={[style.shape, style.bottomShape]}
            resizeMode="cover"
          />
      </View>

      <View style={style.content}>
        {/* 앱 로고 */}
        <View style={style.logoContainer}>
          <Image
            source={require('../../assets/images/logos/AudixLogoNavy.png')}
            style={style.logo}
            resizeMode="cover"
          />
        </View>
        
        {/* 로고 하단 문구 */}
        <View style={style.textContainer}>
          <Text style={style.subtitle}>
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