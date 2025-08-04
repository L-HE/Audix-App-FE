// app/(tabs)/_layout.tsx
import { Slot, usePathname, useSegments } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppBar from '../../components/common/appBar';
import BottomNav from '../../components/common/bottomNav';
import Header from '../../components/common/header';
import LoadingScreen from '../../components/common/loadingScreen';
import { useLoadingStore } from '../../shared/store/loadingStore';
import { Colors } from '../../shared/styles/global';
import NotificationModal from './notificationModal';

function TabsLayoutContent() {
  const segments = useSegments();
  const pathname = usePathname();
  const { isLoading, loadingMessage } = useLoadingStore();
  const [currentPath, setCurrentPath] = useState(pathname);

  // 경로 변경 감지 - 딜레이 추가
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pathname !== currentPath) {
        setCurrentPath(pathname);
      }
    }, 100); // ✅ 100ms 딜레이

    return () => clearTimeout(timer);
  }, [pathname, currentPath]);

  // pathname에서 id 추출
  const getCurrentId = () => {
    if (segments[1] === 'detail' && segments[2] === '[id]') {
      const pathParts = pathname.split('/');
      const id = pathParts[pathParts.length - 1];
      return id;
    }
    return undefined;
  };

  const currentId = getCurrentId();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.background}>
        <Header />
        <AppBar currentId={currentId} />
        
        <View style={styles.slot}>
          <Animated.View
            key={currentPath} // 경로 변경 시 새로운 컴포넌트로 인식
            style={styles.animatedSlot}
            entering={FadeInDown.duration(200)} // ✅ 시간 단축
          >
            <Slot />
          </Animated.View>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background || '#1a1a1a',
  },
  slot: {
    flex: 1,
    position: 'relative',
  },
  animatedSlot: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary || '#2a2a2a',
  },
});