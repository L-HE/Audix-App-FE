// app/(auth)/login.tsx
import { Colors } from '@/shared/styles/colors';
import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { Image as ExpoImage } from 'expo-image';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { authLogic } from '@/shared/api/auth';

// ─────────────────────────────────────────────
// 프리로딩 상태 타입 및 모듈 스코프 캐시
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// 로그인 화면 이미지 에셋 프리로딩
//  - require → uri 변환 후 ExpoImage.prefetch 사용
//  - 실패 시 폴백 가능 상태로 isReady=false 유지
// ─────────────────────────────────────────────
export const preloadLoginAssets = async (): Promise<PreloadedAssets> => {
  if (preloadedAssets.isReady) {
    return preloadedAssets;
  }
  try {
    const imageUrls = [
      Image.resolveAssetSource(require('../../assets/images/pictures/login_left.png')).uri,
      Image.resolveAssetSource(require('../../assets/images/pictures/login_right.png')).uri,
      Image.resolveAssetSource(require('../../assets/images/logos/AudixLogoNavy.png')).uri,
    ];
    await Promise.all(imageUrls.map((url) => ExpoImage.prefetch(url)));

    preloadedAssets = {
      backgroundImageLeft: imageUrls[0],
      backgroundImageRight: imageUrls[1],
      logoImage: imageUrls[2],
      isReady: true,
    };
    return preloadedAssets;
  } catch {
    preloadedAssets = {
      backgroundImageLeft: '',
      backgroundImageRight: '',
      logoImage: '',
      isReady: false,
    };
    return preloadedAssets;
  }
};

// ─────────────────────────────────────────────
// Ionicons 폰트 프리로딩 (선택 사용)
// ─────────────────────────────────────────────
export const preloadIoniconsFont = async () => {
  await Font.loadAsync(Ionicons.font);
};

// ─────────────────────────────────────────────
// 메모이제이션된 아이콘 컴포넌트
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// 로그인 화면 핵심 UI 컴포넌트
// ─────────────────────────────────────────────
const LoginScreenContent: React.FC = () => {
  // 입력 및 UI 상태
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [backgroundImagesReady] = useState(true); // 항상 즉시 표시

  // 포커스/스크롤 관련 ref
  const focusStateRef = useRef<'none' | 'userId' | 'password'>('none');
  const [userIdFocused, setUserIdFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const passwordInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // 디바운싱 타이머 ref
  const keyboardTimeoutRef = useRef<number | null>(null);
  const userIdChangeTimeoutRef = useRef<number | null>(null);
  const passwordChangeTimeoutRef = useRef<number | null>(null);

  // 이미지 로드 상태 ref (중복 onLoad 방지)
  const imageStates = useRef({
    logo: false,
    leftBackground: false,
    rightBackground: false,
  });

  // ───────────────────────────────────────────
  // 특정 y 오프셋으로 스크롤 (키보드 대응)
  // ───────────────────────────────────────────
  const scrollToField = useCallback((yOffset: number) => {
    if (keyboardTimeoutRef.current) {
      clearTimeout(keyboardTimeoutRef.current);
    }
    scrollViewRef.current?.scrollTo({
      y: yOffset,
      animated: true,
    });
  }, []);

  // ───────────────────────────────────────────
  // 키보드 표시/숨김 핸들러
  // ───────────────────────────────────────────
  const handleKeyboardShow = useCallback(() => {
    const currentFocus = focusStateRef.current;
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
    scrollToField(0);
  }, [scrollToField]);

  // ───────────────────────────────────────────
  // 마운트 시: 에셋 프리로딩 트리거 & 타이머 클린업
  // ───────────────────────────────────────────
  useEffect(() => {
    // 백그라운드 프리로딩 (UI 블록 없음)
    preloadLoginAssets();

    return () => {
      if (keyboardTimeoutRef.current) clearTimeout(keyboardTimeoutRef.current);
      if (userIdChangeTimeoutRef.current) clearTimeout(userIdChangeTimeoutRef.current);
      if (passwordChangeTimeoutRef.current) clearTimeout(passwordChangeTimeoutRef.current);
    };
  }, []);

  // ───────────────────────────────────────────
  // 키보드 리스너 등록/해제 (1회)
  // ───────────────────────────────────────────
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, [handleKeyboardShow, handleKeyboardHide]);

  // ───────────────────────────────────────────
  // 로그인 처리
  //  - 실제 API 연동 위치
  //  - 데모: 약간의 지연 후 탭으로 이동
  // ───────────────────────────────────────────
  const handleLogin = useCallback(async () => {
    // 입력값 검증
    if (!userId.trim() || !password.trim()) {
      setShowPasswordError(true);
      return;
    }

    setIsLoading(true);
    setShowPasswordError(false);

    try {
      console.log('🔐 로그인 시도:', {
        loginCode: userId.trim(),
        password: '***' // 로그에는 패스워드 숨김
      });

      // 실제 API 호출
      const result = await authLogic.login({
        loginCode: userId.trim(),
        password: password.trim(),
      });

      if (result.success) {
        console.log('✅ 로그인 성공!', {
          userId: result.data.user.id,
          userName: result.data.user.name,
          position: result.data.user.position,
        });

        // 성공 시 메인 화면으로 이동
        router.replace('/(tabs)');
      } else {
        console.error('❌ 로그인 실패:', result.error);
        setShowPasswordError(true);
      }
    } catch (error) {
      console.error('❌ 로그인 중 예외 발생:', error);
      setShowPasswordError(true);
    } finally {
      setIsLoading(false);
    }
  }, [userId, password]);

  // ───────────────────────────────────────────
  // 포커스 핸들러
  // ───────────────────────────────────────────
  const handleUserIdFocus = useCallback(() => {
    focusStateRef.current = 'userId';
    setUserIdFocused(true);
    handleKeyboardShow();
  }, [handleKeyboardShow]);

  const handleUserIdBlur = useCallback(() => {
    focusStateRef.current = 'none';
    setUserIdFocused(false);
  }, []);

  const handlePasswordFocus = useCallback(() => {
    focusStateRef.current = 'password';
    setPasswordFocused(true);
    handleKeyboardShow();
  }, [handleKeyboardShow]);

  const handlePasswordBlur = useCallback(() => {
    focusStateRef.current = 'none';
    setPasswordFocused(false);
  }, []);

  // ───────────────────────────────────────────
  // 입력 변경 핸들러 (디바운싱만 유지, 로깅 제거)
  // ───────────────────────────────────────────
  const handleUserIdChange = useCallback((text: string) => {
    setUserId(text);
    if (userIdChangeTimeoutRef.current) {
      clearTimeout(userIdChangeTimeoutRef.current);
    }
    userIdChangeTimeoutRef.current = setTimeout(() => { }, 500);
  }, []);

  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
    if (passwordChangeTimeoutRef.current) {
      clearTimeout(passwordChangeTimeoutRef.current);
    }
    passwordChangeTimeoutRef.current = setTimeout(() => { }, 500);
  }, []);

  // ───────────────────────────────────────────
  // 사용자 ID 제출 시 다음 필드로 포커스 이동
  // ───────────────────────────────────────────
  const handleSubmitUserId = useCallback(() => {
    passwordInputRef.current?.focus();
  }, []);

  // ───────────────────────────────────────────
  // 이미지 로드 콜백 (중복 호출 방지)
  // ───────────────────────────────────────────
  const handleImageLoad = useCallback((imageName: string) => {
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
        return;
    }
    // 모든 이미지 로드 완료 여부를 내부적으로만 확인 (로그/계측 제거)
    // const allLoaded = imageStates.current.logo && imageStates.current.leftBackground && imageStates.current.rightBackground;
  }, []);

  // ───────────────────────────────────────────
  // 스타일 메모이제이션
  // ───────────────────────────────────────────
  const userIdDividerStyle = useMemo(
    () => [style.inputDivider, { backgroundColor: userIdFocused ? Colors.navy400 : Colors.backgroundInput }],
    [userIdFocused]
  );

  const passwordDividerStyle = useMemo(
    () => [style.inputDivider, { backgroundColor: passwordFocused ? Colors.navy400 : Colors.backgroundInput }],
    [passwordFocused]
  );

  const loginButtonStyle = useMemo(
    () => [style.loginButton, isLoading && style.buttonDisabled],
    [isLoading]
  );

  // ───────────────────────────────────────────
  // 렌더링
  // ───────────────────────────────────────────
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
          {/* ───────── 로고/배경 영역 ───────── */}
          <View style={style.logoContainer}>
            {/* 배경 이미지 (프리로딩된 URI 있으면 사용) */}
            {backgroundImagesReady && (
              <>
                <ExpoImage
                  source={
                    preloadedAssets.isReady && preloadedAssets.backgroundImageLeft
                      ? { uri: preloadedAssets.backgroundImageLeft }
                      : require('../../assets/images/pictures/login_left.png')
                  }
                  style={style.triangleLeft}
                  onLoad={() => handleImageLoad('왼쪽 배경')}
                  cachePolicy="memory-disk"
                  priority="normal"
                />
                <ExpoImage
                  source={
                    preloadedAssets.isReady && preloadedAssets.backgroundImageRight
                      ? { uri: preloadedAssets.backgroundImageRight }
                      : require('../../assets/images/pictures/login_right.png')
                  }
                  style={style.triangleRight}
                  onLoad={() => handleImageLoad('오른쪽 배경')}
                  cachePolicy="memory-disk"
                  priority="normal"
                />
              </>
            )}

            {/* 로고 이미지 */}
            <ExpoImage
              source={
                preloadedAssets.isReady && preloadedAssets.logoImage
                  ? { uri: preloadedAssets.logoImage }
                  : require('../../assets/images/logos/AudixLogoNavy.png')
              }
              style={style.logo}
              contentFit="contain"
              onLoad={() => handleImageLoad('로고')}
              cachePolicy="memory-disk"
              priority="high"
            />
          </View>

          {/* ───────── 입력 폼 영역 ───────── */}
          <View style={style.form}>
            {/* 사용자 ID 입력 */}
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

            {/* 비밀번호 입력 */}
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
                <Text style={style.errorText}>아이디 또는 비밀번호를 다시 확인해주세요.</Text>
              )}
            </View>

            {/* 로그인 버튼 */}
            <TouchableOpacity onPress={handleLogin} disabled={isLoading} style={loginButtonStyle}>
              <Text style={style.loginButtonText}>{isLoading ? '로그인 중...' : 'LOGIN'}</Text>
            </TouchableOpacity>

            {/* 비밀번호 변경 링크 */}
            <TouchableOpacity onPress={() => { /* TODO: 비밀번호 변경 화면 이동 */ }}>
              <Text style={style.forgotPassword}>비밀번호 변경</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ─────────────────────────────────────────────
// 메인 익스포트 (Profiler 제거)
// ─────────────────────────────────────────────
export default function LoginScreen() {
  return <LoginScreenContent />;
}
