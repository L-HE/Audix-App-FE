// components/common/splashScreen.tsx
import { SplashScreenStyles as style } from '@/shared/styles/components';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { Colors } from '../../shared/styles/global';
import { performanceTracker } from '../../shared/utils/performanceTracker';
// Expo Image 캐싱
import { preloadIoniconsFont } from '@/app/(auth)/login';
import { Image as ExpoImage } from 'expo-image';

interface SplashScreenProps {
  onInitializationComplete?: () => void;
}

// 로고 이미지 URI (require 대신 asset URI 사용)
const logoUri = require('../../assets/images/logos/AudixLogoNavy.png');
const leftUri = require('../../assets/images/pictures/landing_left.png');
const rightUri = require('../../assets/images/pictures/landing_right.png');

const SplashScreen: React.FC<SplashScreenProps> = ({ onInitializationComplete }) => {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [backgroundImagesLoaded, setBackgroundImagesLoaded] = useState(0);
  const [isReadyToExit, setIsReadyToExit] = useState(false);
  
  // Expo 이미지 프리로드
  useEffect(() => {
    preloadIoniconsFont();
    ExpoImage.prefetch(logoUri);
    ExpoImage.prefetch(leftUri);
    ExpoImage.prefetch(rightUri);
  }, []);

  // 애니메이션 제거 - 즉시 초기화
  const initializeWithoutAnimation = useCallback(async () => {
    const initStart = performance.now();
    performanceTracker.addEvent('SplashInitStart');
    
    // 최소 표시 시간 (800ms) - 너무 빨리 지나가지 않도록
    const minDisplayTime = new Promise(resolve => {
      setTimeout(() => {
        performanceTracker.addEvent('SplashMinTimeComplete');
        resolve(void 0);
      }, 800);
    });
    
    // 리소스 로딩과 최소 표시 시간을 병렬로 대기
    await Promise.all([
      minDisplayTime,
      // 이미지 로딩은 별도로 추적됨
    ]);
    
    performanceTracker.addDuration('SplashInitialization', initStart);
    setIsReadyToExit(true);
    
  }, []);

  // 종료 조건 체크
  useEffect(() => {
    if (isReadyToExit && logoLoaded && backgroundImagesLoaded >= 2) {
      console.log('[SplashScreen] 모든 조건 완료 - 다음 화면으로 전환');
      performanceTracker.addEvent('SplashReadyToExit');
      
      if (onInitializationComplete) {
        // 부드러운 전환을 위한 짧은 지연
        setTimeout(() => {
          onInitializationComplete();
        }, 100);
      }
    }
  }, [isReadyToExit, logoLoaded, backgroundImagesLoaded, onInitializationComplete]);

  // 강제 종료 타이머 (최대 2초)
  useEffect(() => {
    const forceExitTimer = setTimeout(() => {
      if (!isReadyToExit || !logoLoaded || backgroundImagesLoaded < 2) {
        console.log('⏰ [SplashScreen] 최대 대기 시간 초과 - 강제 전환');
        performanceTracker.addEvent('SplashForceExit');
        
        if (onInitializationComplete) {
          onInitializationComplete();
        }
      }
    }, 2000); // 최대 2초

    return () => clearTimeout(forceExitTimer);
  }, [isReadyToExit, logoLoaded, backgroundImagesLoaded, onInitializationComplete]);

  useEffect(() => {
    // SplashScreen 렌더링 시작
    const splashStart = performance.now();
    performanceTracker.addEvent('SplashScreenStart');

    // 즉시 초기화 시작 (애니메이션 없음)
    initializeWithoutAnimation();

    const splashEnd = performance.now();
    performanceTracker.addDuration('SplashScreenRender', splashStart);

    return () => {
      performanceTracker.addEvent('SplashScreenUnmount');
    };
  }, [initializeWithoutAnimation]);

  // ExpoImage로 로고 캐싱 및 표시
  const handleLogoLoad = useCallback(() => {
    setLogoLoaded(true);
    performanceTracker.addEvent('SplashLogoLoaded');
    console.log('📱 [SplashScreen] 로고 이미지 로딩 완료');
  }, []);

  // 배경 이미지 로딩 최적화
  const handleBackgroundImageLoad = useCallback((imageName: string) => {
    setBackgroundImagesLoaded(prev => {
      const newCount = prev + 1;
      performanceTracker.addEvent(`SplashBackground_${imageName}_Loaded`);
      console.log(`🖼️ [SplashScreen] ${imageName} 배경 이미지 로딩 완료 (${newCount}/2)`);
      return newCount;
    });
  }, []);

  // 에러 핸들링
  const handleImageError = useCallback((imageName: string) => {
    console.warn(`⚠️ [SplashScreen] ${imageName} 이미지 로딩 실패 - 계속 진행`);
    performanceTracker.addEvent(`SplashImage_${imageName}_Error`);
    
    // 이미지 로딩 실패 시에도 카운트 증가 (진행되도록)
    if (imageName.includes('Background')) {
      setBackgroundImagesLoaded(prev => prev + 1);
    } else if (imageName === 'Logo') {
      setLogoLoaded(true);
    }
  }, []);

  // 로딩 완료 여부 계산
  const allResourcesLoaded = logoLoaded && backgroundImagesLoaded >= 2;
  const showLoadingIndicator = !allResourcesLoaded || !isReadyToExit;

  return (
    <View style={style.container}>
      {/* 배경 도형들 */}
      <View style={style.backgroundShapes}>
        <Image
          source={leftUri}
          style={[style.shape, style.topShape]}
          onLoad={() => handleBackgroundImageLoad('Left')}
          onError={() => handleImageError('LeftBackground')}
          resizeMode='cover'
          fadeDuration={0}
        />
        <Image
          source={rightUri}
          style={[style.shape, style.bottomShape]}
          onLoad={() => handleBackgroundImageLoad('Right')}
          onError={() => handleImageError('RightBackground')}
          resizeMode='cover'
          fadeDuration={0}
        />
      </View>

      {/* 정적 콘텐츠 */}
      <View style={style.content}>
        {/* 앱 로고 */}
        <View style={style.logoContainer}>
          <ExpoImage
            source={logoUri}
            style={style.logo}
            contentFit="cover"
            onLoad={handleLogoLoad}
            onError={() => handleLogoLoad()} // 에러 시에도 로딩 완료 처리
            cachePolicy="memory-disk" // 캐싱 정책: 메모리+디스크
            transition={0}
          />
          
          {/* 로고 로딩 중 플레이스홀더 */}
          {!logoLoaded && (
            <View style={[
              style.logo, 
              { position: 'absolute', backgroundColor: '#f0f0f0', borderRadius: 8, opacity: 0.3 }
            ]} />
          )}
        </View>
        
        {/* 로고 하단 문구 */}
        <View style={style.textContainer}>
          <Text style={style.subtitle}>
            {`지능적 공장의 안전을\n소리로 지켜주는 스마트 솔루션`}
          </Text>
        </View>

        {/* 로딩 인디케이터만 애니메이션 */}
        <View style={{ minHeight: 50, justifyContent: 'center' }}>
          {showLoadingIndicator ? (
            <ActivityIndicator 
              size="large" 
              color={Colors.textPrimary}
              // React Native의 기본 애니메이션 사용
            />
          ) : (
            <View style={{ height: 37 }} /> // 완료 시 공간 유지
          )}
        </View>
        
        {/* 상태 표시 (간소화) */}
        {__DEV__ && (
          <Text style={{ 
            position: 'absolute', 
            bottom: 100, 
            fontSize: 12, 
            color: Colors.textSecondary,
            textAlign: 'center'
          }}>
            {allResourcesLoaded ? '리소스 로딩 완료' : '로딩 중...'} | 
            준비: {isReadyToExit ? '✓' : '○'}
          </Text>
        )}
      </View>
    </View>
  );
};

export default SplashScreen;