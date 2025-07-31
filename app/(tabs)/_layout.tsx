// app/(tabs)/_layout.tsx
import { Slot, usePathname, useSegments } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppBar from '@/common/appBar';
import BottomNav from '@/common/bottomNav';
import Header from '@/common/header';
import LoadingScreen from '@/common/loadingScreen';
import { useLoadingStore } from '@/store/loadingStore';
import { Colors } from '@/styles/global';
import NotificationModal from './notificationModal';

function TabsLayoutContent() {
  const segments = useSegments();
  const pathname = usePathname();
  const { isLoading, loadingMessage } = useLoadingStore();

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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background || '#1a1a1a',
  },
  slot: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary || '#2a2a2a',
  },
});