// app/_layout.tsx
import { Slot } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Host } from 'react-native-portalize';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from '../components/common/splashScreen';
import { ModalProvider } from '../shared/api/modalContextApi';

// 수정 부분
import { useModal } from '../shared/api/modalContextApi';
import { webSocketClient } from '../shared/websocket/client';
import NotificationModal from './(tabs)/notificationModal';
//---

export const headerShown = false;

function RootLayoutContent() {
  const [isAppInitialized, setIsAppInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 수정 부분
  const { setModalVisible, setModalData } = useModal();
  //---

  // 앱 초기화
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('앱 초기화 시작...');

        // 사용자 인증 상태 확인
        const token = await checkAuthToken();
        setIsAuthenticated(!!token);

        // 수정 부분
        // WebSocket 연결 초기화
        console.log('🔧 WebSocket 초기화 시작...');
        webSocketClient.connect();

        webSocketClient.setOnAlert((data) => {
          console.log('🚨 WebSocket 알림 수신:', data);
          console.log('🔔 알림 데이터 상세:', {
            deviceId: data.deviceId,
            normalScore: data.normalScore,
            timestamp: new Date().toISOString()
          });

          // normalScore 기반으로 상태 결정
          let status: 'danger' | 'warning' | 'normal' = 'normal';
          if (data.normalScore < 0.3) {
            status = 'danger';
          } else if (data.normalScore < 0.5) {
            status = 'warning';
          }

          // AlarmCardProps 형식으로 변환
          const alarmData = {
            alarmId: `alert_${data.deviceId}_${Date.now()}`,
            machineStatus: status,
            alarmTitle: status === 'danger' ? '위험' : '점검 요망',
            regionName: `Device ${data.deviceId}`,
            regionLocation: '실시간 모니터링',
            model: '장비',
            timestamp: '방금 전',
            createdAt: new Date(),
            message: `장비 ${data.deviceId}에서 이상이 감지되었습니다. Normal Score: ${Math.round(data.normalScore * 100)}%`,
            type: 'machine' as const,
          };

          console.log('📱 모달 데이터 설정:', alarmData);
          console.log('📱 모달 표시 시도...');
          setModalData(alarmData);
          setModalVisible(true);
        });

        console.log('✅ WebSocket 초기화 완료');
        // ---

        // 초기화 작업
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('앱 초기화 완료');
        setIsAppInitialized(true);

      } catch (error) {
        console.error('앱 초기화 실패:', error);
        setIsAppInitialized(true);
      }
    };

    initializeApp();

    // 수정 부분
    // 앱 종료 시 WebSocket 연결 해제
    return () => {
      webSocketClient.disconnect();
    };
  }, [setModalVisible, setModalData]);
  //---

  // 스플래시 화면 표시
  if (!isAppInitialized) {
    return <SplashScreen />;
  }
  // 인증되지 않은 경우 로그인 화면으로 리다이렉트
  return (
    <>
      <Slot />
      <NotificationModal />
    </>
  );
}

// 임시 인증 토큰 확인 함수
async function checkAuthToken() {
  // 실제로는 AsyncStorage나 SecureStore에서 토큰 확인
  return null; // 현재는 로그인 안된 상태로 시뮬레이션
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