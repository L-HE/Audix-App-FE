// app/_layout.tsx
import { ModalProvider } from '@/api/modalContextApi';
import SplashScreen from '@/common/splashScreen';
import { router, Slot } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Host } from 'react-native-portalize';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const headerShown = false;

function RootLayoutContent() {
  const [isAppInitialized, setIsAppInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 앱 초기화
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('앱 초기화 시작...');
        
        // 사용자 인증 상태 확인
        const token = await checkAuthToken();
        setIsAuthenticated(!!token);
        
        // 초기화 작업
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('앱 초기화 완료');
        setIsAppInitialized(true);
        
        // 인증 상태에 따라 라우팅
        if (token) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(auth)/login');
        }
        
      } catch (error) {
        console.error('앱 초기화 실패:', error);
        setIsAppInitialized(true);
        router.replace('/(auth)/login');
      }
    };

    initializeApp();
  }, []);

  // 스플래시 화면 표시
  if (!isAppInitialized) {
    return <SplashScreen />;
  }

  return <Slot />;
}

// 임시 인증 토큰 확인 함수
async function checkAuthToken() {
  // 실제로는 AsyncStorage나 SecureStore에서 토큰 확인
  return null; // 현재는 로그인 안된 상태로 시뮬레이션
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Host>
        <ModalProvider>
          <RootLayoutContent />
        </ModalProvider>
      </Host>
    </SafeAreaProvider>
  );
}