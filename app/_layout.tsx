// app/_layout.tsx
import { Slot } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Host } from 'react-native-portalize';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from '../components/common/splashScreen';
import { ModalProvider } from '../shared/api/modalContextApi';

// 수정 부분
import { webSocketClient } from '../shared/websocket/client';
import { useModal } from '../shared/api/modalContextApi';
import NotificationModal from './(tabs)/notificationModal';
//---

export const headerShown = false;

function RootLayoutContent() {
  const [isAppInitialized, setIsAppInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 수정 부분
  const { setModalVisible } = useModal();
  //---

  // 앱 초기화
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('앱 초기화 시작...');

        // 사용자 인증 상태 확인
        const token = await checkAuthToken();
        setIsAuthenticated(!!token);

        // 수정 부분
        // WebSocket 연결 초기화
        webSocketClient.connect();
        webSocketClient.setOnAlert((data) => {
          console.log('🚨 WebSocket 알림 수신:', data);

          setModalVisible(true);
        });
        // ---

        // 초기화 작업
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('앱 초기화 완료');
        setIsAppInitialized(true);

      } catch (error) {
        console.error('앱 초기화 실패:', error);
        setIsAppInitialized(true);
      }
    };

    initializeApp();

    // 수정 부분
    // 앱 종료 시 WebSocket 연결 해제
    return () => {
      webSocketClient.disconnect();
    };
  }, [setModalVisible]);
  //---

  // 스플래시 화면 표시
  if (!isAppInitialized) {
    return <SplashScreen />;
  }
  // 인증되지 않은 경우 로그인 화면으로 리다이렉트
  return (
    <>
      <Slot />
      <NotificationModal />
    </>
  );
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