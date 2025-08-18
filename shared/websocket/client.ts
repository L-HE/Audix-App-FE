// shared/websocket/client.ts 수정

import { io, Socket } from 'socket.io-client';
import { DeviceAlertData } from './types';

class WebSocketClient {
    private socket: Socket | null = null;
    private onAlertCallback?: (data: DeviceAlertData) => void;

    connect() {
        if (this.socket?.connected) {
            console.log('🔌 이미 연결됨');
            return;
        }

        console.log('🔌 Socket.IO 연결 중...');

        this.socket = io('http://165.246.116.18:3000', {
            transports: ['polling'],
            autoConnect: true,
        });

        this.socket.on('connect', () => {
            console.log('✅ Socket.IO 연결 성공');
            this.setupListener();
        });

        this.socket.on('connect_error', (error) => {
            console.error('❌ 연결 실패:', error.message);
        });
    }

    private setupListener() {
        if (!this.socket) return;

        this.socket.on('device-alert', (data: DeviceAlertData) => {
            console.log('📡 알림 수신:', data.name);

            // deviceId가 119인 경우 안전 모달 이벤트 발생
            if (data.deviceId === 70) {
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('showSafetyModal', {
                        detail: {
                            deviceId: 70,
                            message: '안전 주의가 필요한 장비입니다.'
                        }
                    }));
                }
            }

            if (this.onAlertCallback) {
                this.onAlertCallback(data);
            }
        });
    }

    setOnAlert(callback: (data: DeviceAlertData) => void) {
        this.onAlertCallback = callback;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export const webSocketClient = new WebSocketClient();