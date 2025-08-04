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

  // ✅ 단순한 경로 동기화
  useEffect(() => {
    //console.log('📊 [useEffect] pathname changed:', pathname, '-> currentPath:', currentPath);
    
    if (pathname !== currentPath) {
      //console.log('🚀 [Transition] Path change detected');
      setCurrentPath(pathname);
    }
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
            key={currentPath}
            style={styles.animatedSlot}
            entering={FadeInDown.duration(200)}
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
  //console.log('🏗️ [TabsLayout] Component mounting/re-mounting');
  return <TabsLayoutContent />;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  slot: {
    flex: 1,
    position: 'relative',
  },
  animatedSlot: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary || '#2a2a2a',
  },
  background: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary || '#2a2a2a',
  },
});