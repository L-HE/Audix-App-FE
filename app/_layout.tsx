// app/_layout.tsx
import { Slot } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Host } from 'react-native-portalize';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Alert } from 'react-native';
import SplashScreen from '../components/common/splashScreen';
import { ModalProvider, useModal } from '../shared/api/modalContextApi';
import { useTimeStore } from '../shared/store/timeStore';
import { webSocketClient, alarmManager, deviceUpdateBroadcaster } from '../shared/websocket';
import { DeviceAlertData } from '../shared/websocket/types';
import { AlarmData } from '../assets/data/alarmData';
import { CardState } from '../assets/data/areaData';
import { preloadLoginAssets } from './(auth)/login';

export const headerShown = false;

// DeviceAlertData의 status를 CardState로 변환하는 헬퍼 함수
const mapDeviceStatusToCardState = (status: string): CardState => {
  const statusLowerCase = status.toLowerCase();

  switch (statusLowerCase) {
    case 'danger':
    case 'critical':
    case 'error':
      return 'danger';
    case 'warning':
    case 'caution':
      return 'warning';
    case 'normal':
    case 'ok':
    case 'good':
      return 'normal';
    case 'repair':
    case 'maintenance':
    case 'fixing':
      return 'repair';
    case 'offline':
    case 'disconnected':
    case 'mic_issue':
      return 'offline';
    default:
      return 'warning';
  }
};

function RootLayoutContent() {
  const [isAppInitialized, setIsAppInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { showModal } = useModal();
  const initializationStartedRef = useRef(false);
  const wsSubscriptionRef = useRef<(() => void) | null>(null);
  const lastModalTimeRef = useRef(0);
  const modalThrottleMs = 1000;

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
          if (wsSubscriptionRef.current) {
            wsSubscriptionRef.current();
          }

          wsSubscriptionRef.current = deviceUpdateBroadcaster.subscribe((deviceData: DeviceAlertData) => {
            const now = Date.now();

            // 🔍 디버깅용 로그 추가
            console.log('🔍 deviceUpdateBroadcaster 데이터:', {
              deviceId: deviceData.deviceId,
              name: deviceData.name,
              type: typeof deviceData.deviceId
            });

            // deviceId가 70인 경우 안전 경고 모달 표시
            if (deviceData.deviceId === 70) {
              console.log('✅ deviceId 70 매칭됨! Alert 표시');
              Alert.alert(
                '⚠️ 안전 경고',
                '안전 주의가 필요한 장비입니다.',
                [{ text: '확인' }],
                { cancelable: false }
              );
              return;
            }

            // 시간 기반 쓰로틀링
            if (now - lastModalTimeRef.current < modalThrottleMs) {
              console.log('🚫 모달 표시 스킵 (쓰로틀링:', now - lastModalTimeRef.current, 'ms)');
              return;
            }

            console.log('🚨 WebSocket 알림 수신:', {
              name: deviceData.name,
              status: deviceData.status,
              deviceId: deviceData.deviceId,
              timeSinceLastModal: now - lastModalTimeRef.current
            });

            // DeviceAlertData를 AlarmData 형식으로 변환
            const alarmData: AlarmData = {
              alarmId: `alarm-${deviceData.deviceId}-${now}`,
              regionName: deviceData.name || 'Unknown Device',
              regionLocation: deviceData.address || '위치 정보 없음',
              status: mapDeviceStatusToCardState(deviceData.status),
              type: 'machine' as const,
              createdAt: new Date(),
              message: deviceData.aiText || deviceData.message || '디바이스 알림이 발생했습니다.',
              model: deviceData.model || 'Unknown Model',
            };

            console.log('🎭 변환된 알람 데이터:', alarmData);
            console.log('🎭 새 모달 표시');

            // 새 모달 표시 및 시간 업데이트
            showModal(alarmData);
            lastModalTimeRef.current = now;
          });

          console.log('✅ WebSocket 및 알림 시스템 초기화 완료');
        } catch (error) {
          console.error('❌ WebSocket 연결 실패:', error);
        }

        startTimer();
        setIsAppInitialized(true);
      } catch (error) {
        console.error('❌ 앱 초기화 실패:', error);
        setIsAppInitialized(true);
      }
    };

    initializeApp();

    return () => {
      console.log('🔌 앱 종료 시 리소스 정리');

      // 웹소켓 구독 해제
      if (wsSubscriptionRef.current) {
        wsSubscriptionRef.current();
        wsSubscriptionRef.current = null;
      }

      webSocketClient.disconnect();
      stopTimer();
    };
  }, [showModal, startTimer, stopTimer]);

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