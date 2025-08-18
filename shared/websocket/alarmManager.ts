import { DeviceAlertData } from './types';
import { webSocketClient } from './client';

// 간단한 브로드캐스터
class DeviceUpdateBroadcaster {
  private subscribers: Set<(deviceData: DeviceAlertData) => void> = new Set();

  subscribe(callback: (deviceData: DeviceAlertData) => void) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  broadcast(deviceData: DeviceAlertData) {
    this.subscribers.forEach(callback => callback(deviceData));
  }
}

export const deviceUpdateBroadcaster = new DeviceUpdateBroadcaster();

// 간단한 AlarmManager
class AlarmManager {
  initialize() {
    console.log('🚀 AlarmManager 초기화');

    webSocketClient.connect();

    webSocketClient.setOnAlert((deviceData: DeviceAlertData) => {
      console.log('🚨 알림:', deviceData.name);
      deviceUpdateBroadcaster.broadcast(deviceData);
    });
  }
}

export const alarmManager = new AlarmManager();
