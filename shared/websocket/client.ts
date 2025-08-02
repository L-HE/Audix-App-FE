import { io, Socket } from 'socket.io-client';
import { BASE_URL } from '../api/config';

class WebSocketClient {
    private socket: Socket | null = null;
    private onAlertCallback: ((data: any) => void) | null = null;

    connect() {
        console.log(`🔌 WebSocket 연결 시도: ${BASE_URL}`);
        this.socket = io(BASE_URL);

        this.socket.on('connect', () => {
            console.log('✅ WebSocket 연결 성공:', this.socket?.id);
        });

        this.socket.on('connect_error', (error) => {
            console.error('❌ WebSocket 연결 실패:', error);
        });

        this.socket.on('device-alert', (data) => {
            console.log('🚨 device-alert 이벤트 수신:', data);
            if (this.onAlertCallback) {
                this.onAlertCallback(data);
            }
        });
    }

    setOnAlert(callback: (data: any) => void) {
        this.onAlertCallback = callback;
    }

    disconnect() {
        this.socket?.disconnect();
    }
}

export const webSocketClient = new WebSocketClient();