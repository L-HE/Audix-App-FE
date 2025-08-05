import { io, Socket } from 'socket.io-client';
import { BASE_URL } from '../api/config';

class WebSocketClient {
    private socket: Socket | null = null;
    private onAlertCallback: ((data: any) => void) | null = null;

    connect() {
        console.log(`🔌 WebSocket 연결 시도: ${BASE_URL}`);
        this.socket = io(BASE_URL, {
            timeout: 20000,
            forceNew: true,
        });

        this.socket.on('connect', () => {
            console.log('✅ WebSocket 연결 성공:', this.socket?.id);
            console.log('📡 WebSocket 서버:', BASE_URL);
        });

        this.socket.on('connect_error', (error) => {
            console.error('❌ WebSocket 연결 실패:', error);
            console.error('🔍 연결 시도 URL:', BASE_URL);
        });

        this.socket.on('disconnect', (reason) => {
            console.warn('⚠️ WebSocket 연결 끊김:', reason);
        });

        this.socket.on('device-alert', (data) => {
            console.log('🚨 device-alert 이벤트 수신:', data);
            console.log('🔔 normalScore:', data.normalScore);
            console.log('🎯 deviceId:', data.deviceId);
            if (this.onAlertCallback) {
                this.onAlertCallback(data);
            } else {
                console.warn('⚠️ onAlertCallback이 설정되지 않음');
            }
        });

        // 연결 테스트를 위한 ping
        this.socket.on('connect', () => {
            console.log('🏓 연결 테스트 ping 전송');
            this.socket?.emit('ping', { test: 'connection' });
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