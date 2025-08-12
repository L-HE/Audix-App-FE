// app/(auth)/login.tsx
import { Colors } from '@/shared/styles/global';
import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { router } from 'expo-router';
import React, { Profiler, useCallback, useEffect, useRef, useState } from 'react';
import {
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

// ✅ 3. LoginScreen 마운트 최적화: 컴포넌트 프리로딩
interface PreloadedAssets {
  backgroundImageLeft: any;
  backgroundImageRight: any;
  logoImage: any;
  isReady: boolean;
}

let preloadedAssets: PreloadedAssets = {
  backgroundImageLeft: null,
  backgroundImageRight: null,
  logoImage: null,
  isReady: false
};

// ✅ 에셋 프리로딩 함수 - ExpoImage 캐싱 활용
const preloadLoginAssets = async (): Promise<PreloadedAssets> => {
  if (preloadedAssets.isReady) {
    console.log('✅ [LoginScreen] 에셋 이미 프리로드됨');
    return preloadedAssets;
  }

  const preloadStart = performance.now();
  performanceTracker.addEvent('LoginAssetsPreloadStart');

  try {
    // ExpoImage.prefetch로 이미지 캐싱 (병렬)
    const imageUrls = [
      require('../../assets/images/pictures/login_left.png'),
      require('../../assets/images/pictures/login_right.png'),
      require('../../assets/images/logos/AudixLogoNavy.png'),
      require('../../assets/images/icons/AudixLogoNavySimple.png')
    ];

    // ExpoImage prefetch는 자동 캐싱을 제공
    await Promise.all(imageUrls.map(url => ExpoImage.prefetch(url)));
    preloadedAssets = {
      backgroundImageLeft: require('../../assets/images/pictures/login_left.png'),
      backgroundImageRight: require('../../assets/images/pictures/login_right.png'),
      logoImage: require('../../assets/images/logos/AudixLogoNavy.png'),
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
    return preloadedAssets;
  }
};

// ✅ 조기 프리로딩 (앱 시작 시)
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

const LoginScreenContent: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  
  // ✅ 최적화: 즉시 표시 (프리로딩된 에셋 사용)
  const [coreUIReady, setCoreUIReady] = useState(true); // 즉시 true
  const [backgroundImagesReady, setBackgroundImagesReady] = useState(false);

  // 키보드 리스너 최적화: ref로 포커스 상태 추적
  const focusStateRef = useRef<'none' | 'userId' | 'password'>('none');
  const [userIdFocused, setUserIdFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const passwordInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const renderStartTime = useRef(performance.now());
  
  // ✅ 이미지 로드 추적용 ref들
  const imageLoadedCount = useRef(0);
  const loginScreenMountTime = useRef(performance.now());

  // ✅ 스크롤 성능 최적화 (기존과 동일)
  const scrollToField = useCallback((yOffset: number) => {
    const scrollStart = performance.now();
    
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollTo({ 
        y: yOffset, 
        animated: false
      });
      
      const scrollEnd = performance.now();
      console.log(`📜 [LoginScreen] 즉시 스크롤 완료: ${(scrollEnd - scrollStart).toFixed(2)}ms`);
    });
  }, []);

  // ✅ 최적화된 마운트 프로세스
  useEffect(() => {
    const mountStart = renderStartTime.current;
    
    performanceTracker.addEvent('LoginScreenMountStart');
    
    // ✅ 프리로딩된 에셋 확인 및 즉시 사용
    const initializeWithPreloadedAssets = async () => {
      const assets = await preloadLoginAssets();
      
      if (assets.isReady) {
        // 프리로딩된 에셋이 있으면 즉시 표시
        setBackgroundImagesReady(true);
        performanceTracker.addEvent('LoginUsingPreloadedAssets');
        console.log('⚡ [LoginScreen] 프리로딩된 에셋 사용 - 즉시 표시');
      } else {
        // 프리로딩 실패 시 기존 방식으로 폴백
        setTimeout(() => {
          setBackgroundImagesReady(true);
          performanceTracker.addEvent('LoginFallbackToNormalLoad');
        }, 0);
      }
    };

    // 1단계: 핵심 UI 즉시 표시 (이미 true)
    performanceTracker.addEvent('LoginCoreUIReady');
    console.log(`🚀 [LoginScreen] 핵심 UI 준비 완료: ${(performance.now() - mountStart).toFixed(2)}ms`);
    
    // 2단계: 프리로딩된 배경 이미지 즉시 적용
    initializeWithPreloadedAssets().then(() => {
      const mountEnd = performance.now();
      
      performanceTracker.addEvent('LoginScreenFullyReady');
      performanceTracker.addDuration('LoginScreenMount', mountStart);
      
      // 🏁 최종 성능 리포트 출력
      console.log('\n🎯 [앱 시작 → 로그인 화면] 최종 성능 리포트');
      performanceTracker.getReport();
      
      console.log(`📱 [LoginScreen] 전체 마운트 완료: ${(mountEnd - mountStart).toFixed(2)}ms`);
    });
    
    return () => {
      console.log(`🔄 [LoginScreen] 컴포넌트 언마운트`);
    };
  }, []);

  // ✅ 키보드 리스너 최적화 (기존과 동일, 의존성 제거)
  useEffect(() => {
    console.log(`⌨️ [LoginScreen] 키보드 리스너 등록 (1회만)`);
    
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        console.log(`⌨️ [LoginScreen] 키보드 표시됨 - 현재 포커스: ${focusStateRef.current}`);
        
        switch (focusStateRef.current) {
          case 'userId':
            scrollToField(100);
            break;
          case 'password':
            scrollToField(200);
            break;
          default:
            console.log(`⌨️ [LoginScreen] 포커스된 필드 없음 - 스크롤 스킵`);
        }
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        console.log(`⌨️ [LoginScreen] 키보드 숨겨짐 - 상단으로 스크롤`);
        scrollToField(0);
      }
    );

    return () => {
      console.log(`🔄 [LoginScreen] 키보드 리스너 해제`);
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, [scrollToField]);

  const handleLogin = async () => {
    const loginStart = performance.now();
    console.log(`🔐 [LoginScreen] 로그인 시작`);
    
    setIsLoading(true);
    setShowPasswordError(false);
    
    // 로딩 상태 변경 성능 측정
    setTimeout(() => {
      const navigationStart = performance.now();
      router.replace('/(tabs)');
      const navigationEnd = performance.now();
      
      console.log(`🚀 [LoginScreen] 화면 전환: ${(navigationEnd - navigationStart).toFixed(2)}ms`);
      console.log(`⏱️ [LoginScreen] 전체 로그인 프로세스: ${(navigationEnd - loginStart).toFixed(2)}ms`);
    }, 100);
  };

  // ✅ 포커스 핸들러 최적화: ref 업데이트 포함
  const handleUserIdFocus = useCallback(() => {
    const focusStart = performance.now();
    focusStateRef.current = 'userId'; // ✅ ref 업데이트
    setUserIdFocused(true);
    const focusEnd = performance.now();
    console.log(`👤 [LoginScreen] 사용자ID 필드 포커스: ${(focusEnd - focusStart).toFixed(2)}ms`);
  }, []);

  const handleUserIdBlur = useCallback(() => {
    const blurStart = performance.now();
    focusStateRef.current = 'none'; // ✅ ref 업데이트
    setUserIdFocused(false);
    const blurEnd = performance.now();
    console.log(`👤 [LoginScreen] 사용자ID 필드 블러: ${(blurEnd - blurStart).toFixed(2)}ms`);
  }, []);

  const handlePasswordFocus = useCallback(() => {
    const focusStart = performance.now();
    focusStateRef.current = 'password'; // ✅ ref 업데이트
    setPasswordFocused(true);
    const focusEnd = performance.now();
    console.log(`🔒 [LoginScreen] 비밀번호 필드 포커스: ${(focusEnd - focusStart).toFixed(2)}ms`);
  }, []);

  const handlePasswordBlur = useCallback(() => {
    const blurStart = performance.now();
    focusStateRef.current = 'none'; // ✅ ref 업데이트
    setPasswordFocused(false);
    const blurEnd = performance.now();
    console.log(`🔒 [LoginScreen] 비밀번호 필드 블러: ${(blurEnd - blurStart).toFixed(2)}ms`);
  }, []);

  // ✅ 텍스트 입력 핸들러 최적화
  const handleUserIdChange = useCallback((text: string) => {
    setUserId(text);
    if (text.length % 5 === 0) { // 5자마다 로그 (성능 고려)
      console.log(`📝 [LoginScreen] 사용자ID 입력: ${text.length}자`);
    }
  }, []);

  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
    if (text.length % 3 === 0) { // 3자마다 로그 (성능 고려)
      console.log(`📝 [LoginScreen] 비밀번호 입력: ${text.length}자`);
    }
  }, []);

  const handleSubmitUserId = useCallback(() => {
    console.log(`⏭️ [LoginScreen] 다음 필드로 이동`);
    passwordInputRef.current?.focus();
  }, []);

  // 더 정확한 이미지 로드 추적을 위한 개선
  // ✅ 이미지별 상태 추적
  const imageStates = useRef({
    logo: false,
    leftBackground: false,
    rightBackground: false
  });

  // ✅ 개선된 handleImageLoad
  const handleImageLoad = useCallback((imageName: string) => {
    const loadTime = performance.now();
    
    // 이미지별 상태 업데이트
    switch (imageName) {
      case '로고':
        if (imageStates.current.logo) {
          console.log(`⚠️ [LoginScreen] 로고 이미지 중복 로드 방지`);
          return;
        }
        imageStates.current.logo = true;
        break;
      case '왼쪽 배경':
        if (imageStates.current.leftBackground) {
          console.log(`⚠️ [LoginScreen] 왼쪽 배경 이미지 중복 로드 방지`);
          return;
        }
        imageStates.current.leftBackground = true;
        break;
      case '오른쪽 배경':
        if (imageStates.current.rightBackground) {
          console.log(`⚠️ [LoginScreen] 오른쪽 배경 이미지 중복 로드 방지`);
          return;
        }
        imageStates.current.rightBackground = true;
        break;
      default:
        console.warn(`⚠️ [LoginScreen] 알 수 없는 이미지: ${imageName}`);
        return;
    }
    
    performanceTracker.addEvent(`LoginImage_${imageName}`, 'loaded');
    console.log(`🖼️ [LoginScreen] ${imageName} 이미지 로드 완료 (${loadTime.toFixed(2)}ms 시점)`);
    
    // 모든 이미지 로드 완료 확인
    const allLoaded = imageStates.current.logo && 
                     imageStates.current.leftBackground && 
                     imageStates.current.rightBackground;
    
    if (allLoaded) {
      const totalImageLoadTime = performance.now() - loginScreenMountTime.current;
      performanceTracker.addDuration('LoginImagesComplete', totalImageLoadTime);
      performanceTracker.addEvent('LoginImagesAllLoaded', 'complete');
      console.log(`✅ [LoginScreen] 모든 이미지 캐싱 및 로드 완료 (총 ${totalImageLoadTime.toFixed(2)}ms)`);
    } else {
      const loadedCount = Object.values(imageStates.current).filter(Boolean).length;
      console.log(`📊 [LoginScreen] 이미지 로드 진행: ${loadedCount}/3 완료`);
    }
  }, []);

  if (!coreUIReady) {
    // ✅ 로딩 스켈레톤 (옵션) - 매우 빠른 초기 표시
    return (
      <View style={[style.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: Colors.textSecondary }}>로딩 중...</Text>
      </View>
    );
  }

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
            {/* ✅ 배경 이미지들을 logoContainer 내부로 이동 */}
            {backgroundImagesReady && (
              <>
                <ExpoImage
                  source={preloadedAssets.isReady ? preloadedAssets.backgroundImageLeft : require('../../assets/images/pictures/login_left.png')}
                  style={style.triangleLeft}
                  onLoad={() => handleImageLoad('왼쪽 배경')}
                  cachePolicy="memory-disk"
                  priority="normal"
                />
                <ExpoImage
                  source={preloadedAssets.isReady ? preloadedAssets.backgroundImageRight : require('../../assets/images/pictures/login_right.png')}
                  style={style.triangleRight}
                  onLoad={() => handleImageLoad('오른쪽 배경')}
                  cachePolicy="memory-disk"
                  priority="normal"
                />
              </>
            )}
            
            {/* ✅ 로고 이미지 */}
            <ExpoImage
              source={preloadedAssets.isReady ? preloadedAssets.logoImage : require('../../assets/images/logos/AudixLogoNavy.png')}
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
                  <Ionicons 
                    name="person-circle-outline" 
                    size={35} 
                    color={userIdFocused ? Colors.navy400 : Colors.loginIcon}
                  />
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
              <View style={[
                style.inputDivider,
                { backgroundColor: userIdFocused ? Colors.navy400 : Colors.backgroundInput }
              ]} />
            </View>

            <View style={style.inputContainer}>
              <View style={style.inputWrapper}>
                <View style={style.inputIcon}>
                  <Ionicons 
                    name="lock-closed-outline" 
                    size={35} 
                    color={passwordFocused ? Colors.navy400 : Colors.loginIcon}
                  />
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
              <View style={[
                style.inputDivider,
                { backgroundColor: passwordFocused ? Colors.navy400 : Colors.backgroundInput }
              ]} />
              
              {showPasswordError && (
                <Text style={style.errorText}>
                  아이디 또는 비밀번호를 다시 확인해주세요.
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              style={[style.loginButton, isLoading && style.buttonDisabled]}
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