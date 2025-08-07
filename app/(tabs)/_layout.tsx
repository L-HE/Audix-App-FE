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
  const { isLoading, loadingMessage } = useLoadingStore();
  const [currentPath, setCurrentPath] = useState(pathname);

  // 단순한 경로 동기화
  useEffect(() => {
    if (pathname !== currentPath) {
      setCurrentPath(pathname);
    }
  }, [pathname, currentPath]);

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