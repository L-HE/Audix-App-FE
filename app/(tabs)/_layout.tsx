// app/(tabs)/_layout.tsx
import { Slot, usePathname, useSegments } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppBar from '../../components/common/appBar';
import BottomNav from '../../components/common/bottomNav';
import Header from '../../components/common/header';
import LoadingScreen from '../../components/common/loadingScreen';
import { useLoadingStore } from '../../shared/store/loadingStore';
import { TabsLayoutStyles } from '../../shared/styles/screens';
import NotificationModal from './notificationModal';

function TabsLayoutContent() {
  const segments = useSegments();
  const pathname = usePathname();
  const { isLoading, loadingMessage, hideLoading } = useLoadingStore(); // ✅ hideLoading 추가
  const [currentPath, setCurrentPath] = useState(pathname);

  // ✅ 경로 변경 시 로딩 상태 초기화
  useEffect(() => {
    if (pathname !== currentPath) {
      // 이전 경로가 [id] 스크린이었고, 현재 경로가 다르면 로딩 숨기기
      const wasDetailScreen = currentPath.includes('/detail/');
      const isNowDetailScreen = pathname.includes('/detail/');

      if (wasDetailScreen && !isNowDetailScreen && isLoading) {
        hideLoading(); // 로딩 상태 초기화
      }

      setCurrentPath(pathname);
    }
  }, [pathname, currentPath, isLoading, hideLoading]);

  // pathname에서 id 추출
  const getCurrentId = useCallback(() => {
    if (segments[1] === 'detail' && segments[2] === '[id]') {
      return pathname.split('/').pop();
    }
    return undefined;
  }, [segments, pathname]);

  const currentId = getCurrentId();

  return (
    <SafeAreaView style={TabsLayoutStyles.safeArea} edges={['top', 'bottom']}>
      <View style={TabsLayoutStyles.background}>
        <Header />
        <AppBar currentId={currentId} />

        <View style={TabsLayoutStyles.slot}>
          <Slot />
        </View>

        <BottomNav />
        <NotificationModal />

        {isLoading && <LoadingScreen message={loadingMessage} />}
      </View>
    </SafeAreaView>
  );
}

export default function TabsLayout() {
  return <TabsLayoutContent />;
}