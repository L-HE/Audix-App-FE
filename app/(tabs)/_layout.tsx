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
import { TabsLayoutStyles as style } from '../../shared/styles/screens';
import NotificationModal from './notificationModal';

function TabsLayoutContent() {
  const segments = useSegments();
  const pathname = usePathname();
  const { isLoading, loadingMessage, hideLoading } = useLoadingStore();

  const [currentPath, setCurrentPath] = useState(pathname);

  // 경로 변경 시 로딩 상태 초기화
  useEffect(() => {
    const leavingDetail = currentPath.includes('/detail/') && !pathname.includes('/detail/');
    if (leavingDetail && isLoading) {
      hideLoading();
    }
    setCurrentPath(pathname);
  }, [pathname, currentPath, isLoading, hideLoading]);

  // 현재 경로가 detail/[id]면 id 추출
  const getCurrentId = useCallback(() => {
    if (segments[1] === 'detail') {
      return pathname.split('/').pop();
    }
    return undefined;
  }, [segments, pathname]);

  const currentId = getCurrentId();

  return (
    <SafeAreaView style={style.safeArea} edges={['top', 'bottom']}>
      <View style={style.background}>
        <Header />
        <AppBar currentId={currentId} />

        <View style={style.slot}>
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
