import { io, Socket } from 'socket.io-client';

class WebSocketClient {
    private socket: Socket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 2;
    private connectionTimeout = 10000; // 10초로 증가
    private isConnected = false; // 연결 상태 추적
    private onAlertCallback?: (data: any) => void;

    connect() {
        return new Promise<boolean>((resolve, reject) => {
            try {
                console.log('🔌 Socket.IO 연결 시도...');

                const timeoutId = setTimeout(() => {
                    console.log('⏰ Socket.IO 연결 타임아웃 (10초)');
                    if (this.socket) {
                        this.socket.disconnect();
                    }
                    this.isConnected = false;
                    resolve(false);
                }, this.connectionTimeout);

                // Socket.IO 클라이언트 연결
                this.socket = io('http://165.246.243.29:3000', {
                    transports: ['websocket', 'polling'], // WebSocket 우선, 실패시 polling
                    timeout: this.connectionTimeout,
                });

                this.socket.on('connect', () => {
                    clearTimeout(timeoutId);
                    console.log('✅ Socket.IO 연결 성공');
                    this.isConnected = true;
                    this.reconnectAttempts = 0;

                    // device-alert 이벤트 리스너 등록
                    this.socket?.on('device-alert', (data) => {
                        console.log('📡 알림 수신:', data);
                        if (this.onAlertCallback) {
                            this.onAlertCallback(data);
                        }
                    });

                    resolve(true);
                });

                this.socket.on('connect_error', (error) => {
                    clearTimeout(timeoutId);
                    console.error('❌ Socket.IO 연결 오류:', error);
                    this.isConnected = false;
                    resolve(false);
                });

                this.socket.on('disconnect', () => {
                    clearTimeout(timeoutId);
                    console.log('🔌 Socket.IO 연결 종료');
                    this.isConnected = false;
                    this.attemptReconnect();
                });
            } catch (error) {
                console.error('❌ Socket.IO 연결 실패:', error);
                this.isConnected = false;
                resolve(false);
            }
        });
    }

    // ✅ 연결 상태 확인 메서드
    getConnectionStatus(): boolean {
        return this.isConnected && this.socket !== null && this.socket.connected;
    }

    private attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`🔄 Socket.IO 재연결 시도 ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);

            setTimeout(() => {
                this.connect();
            }, 2000 * this.reconnectAttempts);
        } else {
            console.log('❌ Socket.IO 최대 재연결 횟수 초과');
            this.isConnected = false;
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.isConnected = false;
    }

    setOnAlert(callback: (data: any) => void) {
        this.onAlertCallback = callback;
    }
}

export const webSocketClient = new WebSocketClient();