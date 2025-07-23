// app/_layout.tsx
import { Slot } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import AppBar from '@/components/common/appBar';
import Header from '@/components/common/header';
import BottomNav from '../components/common/bottomNav';

export const headerShown = false;

function RootLayoutContent() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'bottom']}
    >
      {/* 상단 노치·상태바 영역 자동 패딩 */}
      <Header />

      {/* 검색바 포함 AppBar */}
      <AppBar />

      {/* 각 화면 컴포넌트 */}
      <View style={styles.slot}>
        <Slot />
      </View>

      {/* 바텀 내비게이션 (SafeAreaView bottom inset이 자동 적용) */}
      <BottomNav />
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <RootLayoutContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slot: {
    flex: 1,
  },
});
