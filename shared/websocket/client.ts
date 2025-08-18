// shared/websocket/client.ts
import { io, Socket } from 'socket.io-client';
import { DeviceAlertData } from './types';

class WebSocketClient {
    private socket: Socket | null = null;
    private onAlertCallback?: (data: DeviceAlertData) => void;

    connect() {
        // 이미 소켓이 있으면 아무것도 하지 않음
        if (this.socket) {
            return;
        }

        console.log('🔌 Socket.IO 연결 시작');

        this.socket = io('http://165.246.116.18:3000', {
            transports: ['polling'],
            autoConnect: true,
        });

        // 연결 성공 시
        this.socket.once('connect', () => {
            console.log('✅ Socket.IO 연결 성공');
            this.setupListener();
        });

        // 에러는 무시 (로그 출력 안함)
        this.socket.on('connect_error', () => {
            // 에러 로그 출력하지 않음
        });
    }

    private setupListener() {
        if (!this.socket) return;

        this.socket.on('device-alert', (data: DeviceAlertData) => {
            console.log('📡 알림 수신:', data.name);

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