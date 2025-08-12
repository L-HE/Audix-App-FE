// app/(auth)/login.tsx
import { Colors } from '@/shared/styles/global';
import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { router } from 'expo-router';
import React, { Profiler, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { LoginScreenStyles as style } from '../../shared/styles/screens';
import { performanceTracker } from '../../shared/utils/performanceTracker';

// ✅ 프리로딩 최적화: 컴포넌트 프리로딩
interface PreloadedAssets {
  backgroundImageLeft: string;
  backgroundImageRight: string;
  logoImage: string;
  isReady: boolean;
}

let preloadedAssets: PreloadedAssets = {
  backgroundImageLeft: '',
  backgroundImageRight: '',
  logoImage: '',
  isReady: false
};

// ✅ 에셋 프리로딩 함수 수정 - Image.resolveAssetSource 사용
const preloadLoginAssets = async (): Promise<PreloadedAssets> => {
  if (preloadedAssets.isReady) {
    console.log('✅ [LoginScreen] 에셋 이미 프리로드됨');
    return preloadedAssets;
  }

  const preloadStart = performance.now();
  performanceTracker.addEvent('LoginAssetsPreloadStart');

  try {
    // ✅ require()를 URI 문자열로 변환
    const imageUrls = [
      Image.resolveAssetSource(require('../../assets/images/pictures/login_left.png')).uri,
      Image.resolveAssetSource(require('../../assets/images/pictures/login_right.png')).uri,
      Image.resolveAssetSource(require('../../assets/images/logos/AudixLogoNavy.png')).uri,
    ];

    // ✅ ExpoImage.prefetch()는 이제 정상 작동
    await Promise.all(imageUrls.map(url => ExpoImage.prefetch(url)));
    
    preloadedAssets = {
      backgroundImageLeft: imageUrls[0],
      backgroundImageRight: imageUrls[1],
      logoImage: imageUrls[2],
      isReady: true
    };

    const preloadDuration = performance.now() - preloadStart;
    performanceTracker.addDuration('LoginAssetsPreload', preloadDuration);
    performanceTracker.addEvent('LoginAssetsPreloadComplete');
    console.log(`✅ [LoginScreen] 에셋 프리로딩 및 캐싱 완료 (${preloadDuration.toFixed(2)}ms)`);
    
    return preloadedAssets;
  } catch (error) {
    console.error('❌ [LoginScreen] 에셋 프리로딩 실패:', error);
    performanceTracker.addEvent('LoginAssetsPreloadError');
    
    // ✅ 실패 시 폴백 처리
    preloadedAssets = {
      backgroundImageLeft: '',
      backgroundImageRight: '',
      logoImage: '',
      isReady: false
    };
    return preloadedAssets;
  }
};

export const initLoginScreenPreload = () => {
  console.log('🚀 [LoginScreen] 조기 프리로딩 시작');
  preloadLoginAssets();
};

const onRenderCallback = (
  id: string,
  phase: 'mount' | 'update' | 'nested-update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) => {
  const isSlowRender = actualDuration > 16;
  const expectedTime = baseDuration * 0.6;
  
  if (isSlowRender) {
    console.log(`🐌 [React Profiler] ${id} (${phase}): ${actualDuration.toFixed(2)}ms ← SLOW RENDER!`);
    
    if (actualDuration > expectedTime) {
      console.warn(`⚠️ [React Profiler] ${id} 예상보다 느린 렌더링: 실제=${actualDuration.toFixed(2)}ms, 예상=${expectedTime.toFixed(2)}ms`);
    }
  } else {
    console.log(`⚡ [React Profiler] ${id} (${phase}): ${actualDuration.toFixed(2)}ms`);
  }
};

// ✅ 메모이제이션된 컴포넌트들
const MemoizedUserIcon = React.memo(({ focused }: { focused: boolean }) => (
  <Ionicons 
    name="person-circle-outline" 
    size={35} 
    color={focused ? Colors.navy400 : Colors.loginIcon}
  />
));

const MemoizedLockIcon = React.memo(({ focused }: { focused: boolean }) => (
  <Ionicons 
    name="lock-closed-outline" 
    size={35} 
    color={focused ? Colors.navy400 : Colors.loginIcon}
  />
));

const LoginScreenContent: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  
  // ✅ 즉시 표시로 변경
  const [backgroundImagesReady, setBackgroundImagesReady] = useState(true);

  // ✅ 포커스 상태 최적화 - 렌더링 최소화
  const focusStateRef = useRef<'none' | 'userId' | 'password'>('none');
  const [userIdFocused, setUserIdFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const passwordInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const renderStartTime = useRef(performance.now());
  
  // ✅ 이미지 로드 추적 최적화
  const imageStates = useRef({
    logo: false,
    leftBackground: false,
    rightBackground: false
  });
  const loginScreenMountTime = useRef(performance.now());

  // ✅ 타이머 ref 최적화
  const keyboardTimeoutRef = useRef<number | null>(null);
  const userIdChangeTimeoutRef = useRef<number | null>(null);
  const passwordChangeTimeoutRef = useRef<number | null>(null);
  
  // ✅ 스크롤 성능 대폭 개선
  const scrollToField = useCallback((yOffset: number) => {
  const scrollStart = performance.now();
  
  // ✅ 즉시 스크롤 - 디바운싱 제거
  if (keyboardTimeoutRef.current) {
    clearTimeout(keyboardTimeoutRef.current);
  }
  
  // ✅ requestAnimationFrame 제거, 즉시 실행
  scrollViewRef.current?.scrollTo({ 
    y: yOffset, 
    animated: true // ✅ 부드러운 스크롤을 위해 animated: true로 변경
  });
  
  const scrollEnd = performance.now();
    console.log(`📜 [LoginScreen] 즉시 스크롤 완료: ${(scrollEnd - scrollStart).toFixed(2)}ms → ${yOffset}px`);
  }, []);

  // ✅ 키보드 이벤트 핸들러 최적화
  const handleKeyboardShow = useCallback(() => {
    const currentFocus = focusStateRef.current;
    console.log(`⌨️ [LoginScreen] 키보드 표시됨 - 현재 포커스: ${currentFocus}`);
    
    switch (currentFocus) {
      case 'userId':
        scrollToField(80);
        break;
      case 'password':
        scrollToField(160);
        break;
    }
  }, [scrollToField]);

  const handleKeyboardHide = useCallback(() => {
    scrollToField(0); // ✅ 원래 위치로 복귀
  }, [scrollToField]);

  // ✅ 마운트 프로세스 최적화
  useEffect(() => {
    const mountStart = renderStartTime.current;
    
    performanceTracker.addEvent('LoginScreenMountStart');
    
    const initializeWithPreloadedAssets = async () => {
      // ✅ 백그라운드에서 프리로딩 (UI 블로킹 없음)
      preloadLoginAssets().then((assets) => {
        if (assets.isReady) {
          performanceTracker.addEvent('LoginUsingPreloadedAssets');
          console.log('⚡ [LoginScreen] 프리로딩된 에셋 사용 - 즉시 표시');
        } else {
          performanceTracker.addEvent('LoginFallbackToNormalLoad');
          console.log('⚠️ [LoginScreen] 프리로딩 실패 - 일반 로딩으로 폴백');
        }
      });
    };

    performanceTracker.addEvent('LoginCoreUIReady');
    console.log(`🚀 [LoginScreen] 핵심 UI 준비 완료: ${(performance.now() - mountStart).toFixed(2)}ms`);
    
    initializeWithPreloadedAssets().then(() => {
      const mountEnd = performance.now();
      
      performanceTracker.addEvent('LoginScreenFullyReady');
      performanceTracker.addDuration('LoginScreenMount', mountStart);
      
      console.log('\n🎯 [앱 시작 → 로그인 화면] 최종 성능 리포트');
      performanceTracker.getReport();
      
      console.log(`📱 [LoginScreen] 전체 마운트 완료: ${(mountEnd - mountStart).toFixed(2)}ms`);
    });
    
    return () => {
      if (keyboardTimeoutRef.current) {
        clearTimeout(keyboardTimeoutRef.current);
      }
      console.log(`🔄 [LoginScreen] 컴포넌트 언마운트`);
    };
  }, []);

  // ✅ 키보드 리스너 최적화 - 1회만 등록
  useEffect(() => {
    console.log(`⌨️ [LoginScreen] 키보드 리스너 등록 (1회만)`);
    
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    return () => {
      console.log(`🔄 [LoginScreen] 키보드 리스너 해제`);
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, [handleKeyboardShow, handleKeyboardHide]);

  // ✅ 로그인 핸들러 최적화
  const handleLogin = useCallback(async () => {
    const loginStart = performance.now();
    console.log(`🔐 [LoginScreen] 로그인 시작`);
    
    setIsLoading(true);
    setShowPasswordError(false);
    
    setTimeout(() => {
      const navigationStart = performance.now();
      router.replace('/(tabs)');
      const navigationEnd = performance.now();
      
      console.log(`🚀 [LoginScreen] 화면 전환: ${(navigationEnd - navigationStart).toFixed(2)}ms`);
      console.log(`⏱️ [LoginScreen] 전체 로그인 프로세스: ${(navigationEnd - loginStart).toFixed(2)}ms`);
    }, 100);
  }, []);

  // ✅ 포커스 핸들러 최적화 - 불필요한 setTimeout 제거
  const handleUserIdFocus = useCallback(() => {
    const focusStart = performance.now();
    focusStateRef.current = 'userId';
    setUserIdFocused(true);
    
    // ✅ 즉시 키보드 이벤트 호출
    handleKeyboardShow();
    
    const focusEnd = performance.now();
    console.log(`👤 [LoginScreen] 사용자ID 필드 포커스: ${(focusEnd - focusStart).toFixed(2)}ms`);
  }, [handleKeyboardShow]);

  const handleUserIdBlur = useCallback(() => {
    const blurStart = performance.now();
    focusStateRef.current = 'none';
    setUserIdFocused(false);
    const blurEnd = performance.now();
    console.log(`👤 [LoginScreen] 사용자ID 필드 블러: ${(blurEnd - blurStart).toFixed(2)}ms`);
  }, []);

  const handlePasswordFocus = useCallback(() => {
    const focusStart = performance.now();
    focusStateRef.current = 'password';
    setPasswordFocused(true);
    
    // ✅ 즉시 키보드 이벤트 호출
    handleKeyboardShow();
    
    const focusEnd = performance.now();
    console.log(`🔒 [LoginScreen] 비밀번호 필드 포커스: ${(focusEnd - focusStart).toFixed(2)}ms`);
  }, [handleKeyboardShow]);

  const handlePasswordBlur = useCallback(() => {
    const blurStart = performance.now();
    focusStateRef.current = 'none';
    setPasswordFocused(false);
    const blurEnd = performance.now();
    console.log(`🔒 [LoginScreen] 비밀번호 필드 블러: ${(blurEnd - blurStart).toFixed(2)}ms`);
  }, []);

  // ✅ 텍스트 입력 핸들러 최적화 - 로깅 간소화
  const handleUserIdChange = useCallback((text: string) => {
    setUserId(text);
    
    // ✅ 성능 로깅 최소화
    if (userIdChangeTimeoutRef.current) {
      clearTimeout(userIdChangeTimeoutRef.current);
    }
    userIdChangeTimeoutRef.current = setTimeout(() => {
      if (text.length % 10 === 0 && text.length > 0) { // 10자마다로 변경
        console.log(`📝 [LoginScreen] 사용자ID 입력: ${text.length}자`);
      }
    }, 500); // 디바운싱 시간 증가
  }, []);

  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
    
    // ✅ 성능 로깅 최소화
    if (passwordChangeTimeoutRef.current) {
      clearTimeout(passwordChangeTimeoutRef.current);
    }
    passwordChangeTimeoutRef.current = setTimeout(() => {
      if (text.length % 5 === 0 && text.length > 0) {
        console.log(`📝 [LoginScreen] 비밀번호 입력: ${text.length}자`);
      }
    }, 500); // 디바운싱 시간 증가
  }, []);

  const handleSubmitUserId = useCallback(() => {
    console.log(`⏭️ [LoginScreen] 다음 필드로 이동`);
    passwordInputRef.current?.focus();
  }, []);

  // ✅ 이미지 로드 핸들러 최적화
  const handleImageLoad = useCallback((imageName: string) => {
    const loadTime = performance.now();
    
    switch (imageName) {
      case '로고':
        if (imageStates.current.logo) return;
        imageStates.current.logo = true;
        break;
      case '왼쪽 배경':
        if (imageStates.current.leftBackground) return;
        imageStates.current.leftBackground = true;
        break;
      case '오른쪽 배경':
        if (imageStates.current.rightBackground) return;
        imageStates.current.rightBackground = true;
        break;
      default:
        console.warn(`⚠️ [LoginScreen] 알 수 없는 이미지: ${imageName}`);
        return;
    }
    
    performanceTracker.addEvent(`LoginImage_${imageName}`, 'loaded');
    console.log(`🖼️ [LoginScreen] ${imageName} 이미지 로드 완료 (${loadTime.toFixed(2)}ms 시점)`);
    
    const allLoaded = imageStates.current.logo && 
                     imageStates.current.leftBackground && 
                     imageStates.current.rightBackground;
    
    if (allLoaded) {
      const totalImageLoadTime = performance.now() - loginScreenMountTime.current;
      performanceTracker.addDuration('LoginImagesComplete', totalImageLoadTime);
      performanceTracker.addEvent('LoginImagesAllLoaded', 'complete');
      console.log(`✅ [LoginScreen] 모든 이미지 로드 완료 (총 ${totalImageLoadTime.toFixed(2)}ms)`);
    } else {
      const loadedCount = Object.values(imageStates.current).filter(Boolean).length;
      console.log(`📊 [LoginScreen] 이미지 로드 진행: ${loadedCount}/3 완료`);
    }
  }, []);

  // ✅ 스타일 메모이제이션
  const userIdDividerStyle = useMemo(() => [
    style.inputDivider,
    { backgroundColor: userIdFocused ? Colors.navy400 : Colors.backgroundInput }
  ], [userIdFocused]);

  const passwordDividerStyle = useMemo(() => [
    style.inputDivider,
    { backgroundColor: passwordFocused ? Colors.navy400 : Colors.backgroundInput }
  ], [passwordFocused]);

  const loginButtonStyle = useMemo(() => [
    style.loginButton,
    isLoading && style.buttonDisabled
  ], [isLoading]);

  // ✅ 정리 함수에서 타이머 클리어
  useEffect(() => {
    return () => {
      if (userIdChangeTimeoutRef.current) {
        clearTimeout(userIdChangeTimeoutRef.current);
      }
      if (passwordChangeTimeoutRef.current) {
        clearTimeout(passwordChangeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <KeyboardAvoidingView 
      style={style.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        ref={scrollViewRef}
        style={style.scrollView}
        contentContainerStyle={style.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
        removeClippedSubviews={true}
        scrollEventThrottle={16}
        decelerationRate="fast"
      >
        <View style={style.content}>
          {/* 로고 영역 - 배경 도형들 포함 */}
          <View style={style.logoContainer}>
            {/* ✅ 배경 이미지들 - 프리로딩된 URI 또는 require() 사용 */}
            {backgroundImagesReady && (
              <>
                <ExpoImage
                  source={preloadedAssets.isReady && preloadedAssets.backgroundImageLeft 
                    ? { uri: preloadedAssets.backgroundImageLeft } 
                    : require('../../assets/images/pictures/login_left.png')}
                  style={style.triangleLeft}
                  onLoad={() => handleImageLoad('왼쪽 배경')}
                  cachePolicy="memory-disk"
                  priority="normal"
                />
                <ExpoImage
                  source={preloadedAssets.isReady && preloadedAssets.backgroundImageRight 
                    ? { uri: preloadedAssets.backgroundImageRight } 
                    : require('../../assets/images/pictures/login_right.png')}
                  style={style.triangleRight}
                  onLoad={() => handleImageLoad('오른쪽 배경')}
                  cachePolicy="memory-disk"
                  priority="normal"
                />
              </>
            )}
            
            {/* ✅ 로고 이미지 */}
            <ExpoImage
              source={preloadedAssets.isReady && preloadedAssets.logoImage 
                ? { uri: preloadedAssets.logoImage } 
                : require('../../assets/images/logos/AudixLogoNavy.png')}
              style={style.logo}
              contentFit="contain"
              onLoad={() => handleImageLoad('로고')}
              cachePolicy="memory-disk"
              priority="high"
            />
          </View>

          {/* 입력 폼 */}
          <View style={style.form}>
            <View style={style.inputContainer}>
              <View style={style.inputWrapper}>
                <View style={style.inputIcon}>
                  <MemoizedUserIcon focused={userIdFocused} />
                </View>
                <TextInput
                  style={style.input}
                  placeholder="사원번호를 입력해주세요."
                  placeholderTextColor={Colors.textFourth}
                  value={userId}
                  onChangeText={handleUserIdChange}
                  keyboardType="default"
                  autoCapitalize="none"
                  returnKeyType="next"
                  autoFocus={true}
                  onFocus={handleUserIdFocus}
                  onBlur={handleUserIdBlur}
                  onSubmitEditing={handleSubmitUserId}
                />
              </View>
              <View style={userIdDividerStyle} />
            </View>

            <View style={style.inputContainer}>
              <View style={style.inputWrapper}>
                <View style={style.inputIcon}>
                  <MemoizedLockIcon focused={passwordFocused} />
                </View>
                <TextInput
                  ref={passwordInputRef}
                  style={style.input}
                  placeholder="비밀번호를 입력해주세요."
                  placeholderTextColor={Colors.textFourth}
                  value={password}
                  onChangeText={handlePasswordChange}
                  secureTextEntry
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  onFocus={handlePasswordFocus}
                  onBlur={handlePasswordBlur}
                />
              </View>
              <View style={passwordDividerStyle} />
              
              {showPasswordError && (
                <Text style={style.errorText}>
                  아이디 또는 비밀번호를 다시 확인해주세요.
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              style={loginButtonStyle}
            >
              <Text style={style.loginButtonText}>
                {isLoading ? '로그인 중...' : 'LOGIN'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => console.log(`🔑 [LoginScreen] 비밀번호 변경 클릭`)}>
              <Text style={style.forgotPassword}>비밀번호 변경</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Profiler로 감싼 메인 컴포넌트
export default function LoginScreen() {
  return (
    <Profiler id="LoginScreen" onRender={onRenderCallback}>
      <LoginScreenContent />
    </Profiler>
  );
}