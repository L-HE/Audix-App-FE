// app/_layout.tsx
import { Slot, usePathname, useSegments } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Host } from 'react-native-portalize'; // 추가
import {
  SafeAreaProvider,
  SafeAreaView
} from 'react-native-safe-area-context';

import AppBar from '@/components/common/appBar';
import Header from '@/components/common/header';
import { Colors } from '@/shared/styles/global';
import BottomNav from '../components/common/bottomNav';
import { ModalProvider } from '../shared/api/modalContextApi';
import NotificationModal from './notificationModal';

export const headerShown = false;

function RootLayoutContent() {
  const segments = useSegments();
  const pathname = usePathname();

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
});
