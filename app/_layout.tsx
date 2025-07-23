// app/_layout.tsx
import { Slot } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import AppBar from '@/components/common/appBar';
import BottomNav from '../components/common/bottomNav';
import Header from '../components/common/header';


export const headerShown = false;  // 이 레이아웃 자체에 Expo Router 헤더를 숨김

export default function RootLayout() {

  return (
    <View style={styles.container}>
      {/* 공통 헤더 */}
      <Header />

      <AppBar />

      {/* 각 화면 컴포넌트가 들어갈 자리 */}
      <View style={styles.slot}>
        <Slot />
      </View>

      {/* 공통 바텀 내비게이션 */}
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slot: {
    flex: 1,
  },
});
