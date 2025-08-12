
class WebSocketClient {
    private ws: WebSocket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 2;
    private connectionTimeout = 500;
    private isConnected = false; // 연결 상태 추적
    private onAlertCallback?: (data: any) => void;

    connect() {
        return new Promise<boolean>((resolve, reject) => {
            try {
                console.log('🔌 WebSocket 연결 시도...');

                const timeoutId = setTimeout(() => {
                    console.log('⏰ WebSocket 연결 타임아웃 (1초)');
                    if (this.ws) {
                        this.ws.close();
                    }
                    this.isConnected = false; // ✅ 타임아웃 시 연결 상태 false
                    resolve(false);
                }, this.connectionTimeout);

                this.ws = new WebSocket('ws://your-websocket-url');

                this.ws.onopen = () => {
                    clearTimeout(timeoutId);
                    console.log('✅ WebSocket 연결 성공');
                    this.isConnected = true; // ✅ 연결 성공 시 true
                    this.reconnectAttempts = 0;
                    resolve(true);
                };

                this.ws.onerror = (error) => {
                    clearTimeout(timeoutId);
                    console.error('❌ WebSocket 연결 오류:', error);
                    this.isConnected = false; // ✅ 오류 시 false
                    resolve(false);
                };

                this.ws.onclose = () => {
                    clearTimeout(timeoutId);
                    console.log('🔌 WebSocket 연결 종료');
                    this.isConnected = false; // ✅ 연결 종료 시 false
                    this.attemptReconnect();
                };
            } catch (error) {
                console.error('❌ WebSocket 연결 실패:', error);
                this.isConnected = false; // ✅ 예외 시 false
                resolve(false);
            }
        });
    }

    // ✅ 연결 상태 확인 메서드
    getConnectionStatus(): boolean {
        return this.isConnected && this.ws !== null && this.ws.readyState === WebSocket.OPEN;
    }

    private attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`🔄 WebSocket 재연결 시도 ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);

            setTimeout(() => {
                this.connect();
            }, 2000 * this.reconnectAttempts);
        } else {
            console.log('❌ WebSocket 최대 재연결 횟수 초과');
            this.isConnected = false; // ✅ 재연결 포기 시 false
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.isConnected = false; // ✅ 수동 연결 해제 시 false
    }

    setOnAlert(callback: (data: any) => void) {
    this.onAlertCallback = callback;
  }
}

export const webSocketClient = new WebSocketClient();