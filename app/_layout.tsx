// app/_layout.tsx
import { Slot } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Host } from 'react-native-portalize';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from '../components/common/splashScreen';
import { ModalProvider, useModal } from '../shared/api/modalContextApi';
import { useTimeStore } from '../shared/store/timeStore';
import { webSocketClient, alarmManager, deviceUpdateBroadcaster } from '../shared/websocket';
import { DeviceAlertData } from '../shared/websocket/types';
import { AlarmData } from '../assets/data/alarmData';
import { preloadLoginAssets } from './(auth)/login';

export const headerShown = false;

function RootLayoutContent() {
  const [isAppInitialized, setIsAppInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { showModal, hideModal } = useModal();
  const initializationStartedRef = useRef(false);
  const startTimer = useTimeStore((s) => s.startTimer);
  const stopTimer = useTimeStore((s) => s.stopTimer);

  useEffect(() => {
    if (initializationStartedRef.current) return;
    initializationStartedRef.current = true;

    const initializeApp = async () => {
      try {
        preloadLoginAssets();
        const token = await checkAuthToken();
        setIsAuthenticated(!!token);

        // WebSocket 초기화
        try {
          webSocketClient.connect();
          alarmManager.initialize();

          // WebSocket 알림 처리
          deviceUpdateBroadcaster.subscribe((deviceData: DeviceAlertData) => {
            console.log('🚨 WebSocket 알림:', deviceData.name);

            const alarmData: AlarmData = {
              alarmId: `alarm-${Date.now()}`,
              regionName: deviceData.name || 'Unknown Device',
              regionLocation: deviceData.address || '위치 정보 없음',
              status: deviceData.status as 'normal' | 'warning' | 'danger',
              type: 'machine' as const,
              createdAt: new Date(),
              message: deviceData.message || '디바이스 알림이 발생했습니다.',
              model: deviceData.model || '',
            };

            // 기존 모달 닫고 새 모달 띄우기
            console.log('🔄 모달 닫기');
            hideModal();
            setTimeout(() => {
              console.log('🎭 새 모달 띄우기');
              showModal(alarmData);
            }, 300);
          });
        } catch (error) {
          console.log('WebSocket 연결 실패');
        }

        startTimer();
        setIsAppInitialized(true);
      } catch {
        setIsAppInitialized(true);
      }
    };

    initializeApp();

    return () => {
      webSocketClient.disconnect();
      stopTimer();
    };
  }, [showModal, hideModal, startTimer, stopTimer]);

  if (!isAppInitialized) {
    return <SplashScreen onInitializationComplete={() => { }} />;
  }

  return <Slot />;
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

function wait(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms));
}

async function checkAuthToken() {
  await wait(100);
  return null;
}
