// components/common/splashScreen.tsx
import { SplashScreenStyles as style } from '@/shared/styles/components';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { Colors } from '../../shared/styles/colors';
// Expo Image 캐싱
import { preloadIoniconsFont } from '@/app/(auth)/login';
import { Image as ExpoImage } from 'expo-image';

/* ─────────────────────────────────────────────────────────────
 * Props: 초기화 완료 시 호출되는 선택적 콜백
 * ───────────────────────────────────────────────────────────── */
interface SplashScreenProps {
  onInitializationComplete?: () => void;
}

/* ─────────────────────────────────────────────────────────────
 * 정적 에셋 참조 (require)
 * - 로고/좌우 배경 이미지
 * ───────────────────────────────────────────────────────────── */
const logoUri = require('../../assets/images/logos/AudixLogoNavy.png');
const leftUri = require('../../assets/images/pictures/landing_left.png');
const rightUri = require('../../assets/images/pictures/landing_right.png');

/* ─────────────────────────────────────────────────────────────
 * SplashScreen
 * - 최소 표시 시간 보장(UX)
 * - 로고/배경 이미지 로드 상태를 추적
 * - 준비 완료 시 상위 콜백 호출
 * ───────────────────────────────────────────────────────────── */
const SplashScreen: React.FC<SplashScreenProps> = ({ onInitializationComplete }) => {
  /* 로딩 상태 */
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [backgroundImagesLoaded, setBackgroundImagesLoaded] = useState(0);
  const [isReadyToExit, setIsReadyToExit] = useState(false);

  /* ───────── 초기 프리로드 (폰트/이미지) ─────────
   * - Ionicons 폰트 및 주요 이미지 캐싱 시도
   */
  useEffect(() => {
    preloadIoniconsFont();
    // 참고: ExpoImage.prefetch는 일반적으로 URL 문자열을 받지만
    // require된 에셋도 Metro가 번들링하므로 캐싱 효과를 기대할 수 있음
    ExpoImage.prefetch(logoUri);
    ExpoImage.prefetch(leftUri);
    ExpoImage.prefetch(rightUri);
  }, []);

  /* ───────── 초기화 (애니메이션 없이) ─────────
   * - 스플래시가 너무 빨리 사라지지 않도록 최소 800ms 보장
   * - 이미지 로딩은 별도 핸들러에서 상태 갱신
   */
  const initializeWithoutAnimation = useCallback(async () => {
    const minDisplayTime = new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 800);
    });

    await Promise.all([minDisplayTime]);
    setIsReadyToExit(true);
  }, []);

  /* ───────── 전환 조건 체크 ─────────
   * - 준비 완료 + 로고 로드 + 배경 2장 로드 → 다음 화면으로
   * - 부드러운 전환을 위해 100ms 정도 지연 후 콜백
   */
  useEffect(() => {
    if (isReadyToExit && logoLoaded && backgroundImagesLoaded >= 2) {
      if (onInitializationComplete) {
        const t = setTimeout(() => {
          onInitializationComplete();
        }, 100);
        return () => clearTimeout(t);
      }
    }
  }, [isReadyToExit, logoLoaded, backgroundImagesLoaded, onInitializationComplete]);

  /* ───────── 강제 종료 타이머 (최대 2초) ─────────
   * - 어느 하나라도 오래 걸리면 2초 후 강제 전환
   */
  useEffect(() => {
    const forceExitTimer = setTimeout(() => {
      if (onInitializationComplete) {
        onInitializationComplete();
      }
    }, 2000);
    return () => clearTimeout(forceExitTimer);
  }, [onInitializationComplete]);

  /* ───────── 마운트 시 초기화 시작 ───────── */
  useEffect(() => {
    initializeWithoutAnimation();
  }, [initializeWithoutAnimation]);

  /* ───────── 이미지 로드 핸들러들 ───────── */
  const handleLogoLoad = useCallback(() => {
    setLogoLoaded(true);
  }, []);

  const handleBackgroundImageLoad = useCallback(() => {
    setBackgroundImagesLoaded((prev) => prev + 1);
  }, []);

  /* ───────── 이미지 에러 핸들러 ─────────
   * - 에러여도 사용자 흐름을 막지 않도록 즉시 통과 처리
   */
  const handleImageError = useCallback((kind: 'left' | 'right' | 'logo') => {
    if (kind === 'logo') setLogoLoaded(true);
    else setBackgroundImagesLoaded((prev) => prev + 1);
  }, []);

  /* ───────── UI 표시 판단 ───────── */
  const allResourcesLoaded = logoLoaded && backgroundImagesLoaded >= 2;
  const showLoadingIndicator = !allResourcesLoaded || !isReadyToExit;

  /* ───────── 렌더 ───────── */
  return (
    <View style={style.container}>
      {/* 배경 도형(좌/우) */}
      <View style={style.backgroundShapes}>
        <Image
          source={leftUri}
          style={[style.shape, style.topShape]}
          onLoad={handleBackgroundImageLoad}
          onError={() => handleImageError('left')}
          resizeMode="cover"
          fadeDuration={0}
        />
        <Image
          source={rightUri}
          style={[style.shape, style.bottomShape]}
          onLoad={handleBackgroundImageLoad}
          onError={() => handleImageError('right')}
          resizeMode="cover"
          fadeDuration={0}
        />
      </View>

      {/* 중앙 콘텐츠 영역 */}
      <View style={style.content}>
        {/* 앱 로고 (ExpoImage로 캐싱/표시) */}
        <View style={style.logoContainer}>
          <ExpoImage
            source={logoUri}
            style={style.logo}
            contentFit="cover"
            onLoad={handleLogoLoad}
            onError={() => handleImageError('logo')}
            cachePolicy="memory-disk"
            transition={0}
          />

          {/* 로고 로딩 중 플레이스홀더 */}
          {!logoLoaded && (
            <View
              style={[
                style.logo,
                { position: 'absolute', backgroundColor: '#f0f0f0', borderRadius: 8, opacity: 0.3 },
              ]}
            />
          )}
        </View>

        {/* 로고 하단 카피 문구 */}
        <View style={style.textContainer}>
          <Text style={style.subtitle}>
            {`지능적 공장의 안전을\n소리로 지켜주는 스마트 솔루션`}
          </Text>
        </View>

        {/* 로딩 인디케이터 (시스템 기본 애니메이션) */}
        <View style={{ minHeight: 50, justifyContent: 'center' }}>
          {showLoadingIndicator ? (
            <ActivityIndicator size="large" color={Colors.textPrimary} />
          ) : (
            <View style={{ height: 37 }} />
          )}
        </View>

        {/* 개발 모드: 간단 상태 표시 (성능 계측 아님) */}
        {__DEV__ && (
          <Text
            style={{
              position: 'absolute',
              bottom: 100,
              fontSize: 12,
              color: Colors.textSecondary,
              textAlign: 'center',
            }}
          >
            {allResourcesLoaded ? '리소스 로딩 완료' : '로딩 중...'} | 준비: {isReadyToExit ? '✓' : '○'}
          </Text>
        )}
      </View>
    </View>
  );
};

export default SplashScreen;
