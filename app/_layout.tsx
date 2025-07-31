// app/_layout.tsx
import { Slot, usePathname, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Host } from 'react-native-portalize';
import {
  SafeAreaProvider,
  SafeAreaView
} from 'react-native-safe-area-context';

import AppBar from '../components/common/appBar';
import BottomNav from '../components/common/bottomNav';
import Header from '../components/common/header';
import LoadingScreen from '../components/common/loadingScreen';
import SplashScreen from '../components/common/splashScreen';
import { ModalProvider } from '../shared/api/modalContextApi';
import { useLoadingStore } from '../shared/store/loadingStore';
import { Colors } from '../shared/styles/global';
import NotificationModal from './notificationModal';

export const headerShown = false;

function RootLayoutContent() {
  const segments = useSegments();
  const pathname = usePathname();
  const { isLoading, loadingMessage } = useLoadingStore();
  const [isAppInitialized, setIsAppInitialized] = useState(false);

  // 앱 초기화
  useEffect(() => {    
    const initializeApp = async () => {
      try {
        
        // 초기화 작업 수행
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 초기화 완료 후 상태 변경
        setIsAppInitialized(true);    
      } catch (error) {
        console.error('앱 초기화 실패 :', error);
        setIsAppInitialized(true);
      }
    };

    initializeApp();
  }, []);

  // 앱이 초기화되지 않았으면 스플래시 화면 표시
  if (!isAppInitialized) {
    return <SplashScreen />;
  }

  // pathname에서 id 추출 (예: "/detail/1" -> "1")
  const getCurrentId = () => {
    if (segments[0] === 'detail' && segments[1] === '[id]') {
      const pathParts = pathname.split('/');
      const id = pathParts[pathParts.length - 1]; // 마지막 부분이 id
      return id;
    }
    return undefined;
  };

  const currentId = getCurrentId();

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'bottom']}
    >
      <View style={styles.background}>
        {/* 상단 노치·상태바 영역 자동 패딩 */}
        <Header />

        {/* 검색바 포함 AppBar */}
        <AppBar currentId={currentId} />

        {/* 각 화면 컴포넌트 */}
        <View style={styles.slot}>
          <Slot />
        </View>

        {/* 바텀 내비게이션 (SafeAreaView bottom inset이 자동 적용) */}
        <BottomNav />

        {/* 알림 모달 */}
        <NotificationModal />

        {/* 전역 로딩 화면 */}
        {isLoading && <LoadingScreen message={loadingMessage} />}

      </View>
    </SafeAreaView>
  );
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  slot: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary
  },
});

