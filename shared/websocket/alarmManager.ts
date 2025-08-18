// shared/websocket/alarmManager.ts
import { DeviceAlertData } from './types';
import { webSocketClient } from './client';

// 간단한 브로드캐스터
class DeviceUpdateBroadcaster {
  private subscribers: Set<(deviceData: DeviceAlertData) => void> = new Set();

  subscribe(callback: (deviceData: DeviceAlertData) => void) {
    this.subscribers.add(callback);
    console.log('➕ 구독자 추가됨, 총 구독자:', this.subscribers.size);
    return () => {
      this.subscribers.delete(callback);
      console.log('➖ 구독자 제거됨, 총 구독자:', this.subscribers.size);
    };
  }

  broadcast(deviceData: DeviceAlertData) {
    console.log('📢 Broadcasting to', this.subscribers.size, 'subscribers');
    this.subscribers.forEach(callback => {
      console.log('📤 Calling subscriber callback');
      callback(deviceData);
    });
  }
}

export const deviceUpdateBroadcaster = new DeviceUpdateBroadcaster();

// 간단한 AlarmManager
class AlarmManager {
  private initialized = false;

  initialize() {
    if (this.initialized) {
      console.log('⚠️ AlarmManager 이미 초기화됨');
      return;
    }

    console.log('🚀 AlarmManager 초기화');

    // webSocketClient.connect() 제거! - 이미 _layout.tsx에서 호출됨

    webSocketClient.setOnAlert((deviceData: DeviceAlertData) => {
      console.log('🚨 알림:', deviceData.name, 'deviceId:', deviceData.deviceId);
      deviceUpdateBroadcaster.broadcast(deviceData);
    });

    this.initialized = true;
    console.log('✅ AlarmManager 초기화 완료');
  }
}

export const alarmManager = new AlarmManager();