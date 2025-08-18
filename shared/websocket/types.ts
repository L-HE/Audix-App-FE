// shared/websocket/types.ts
import { CardState } from '../../assets/data/areaData';

export interface DeviceAlertData {
    deviceId: number;
    areaId?: number;
    name: string;
    model: string;
    address: string;
    deviceManager: string;
    parts: any;
    normalScore: number;
    image: string;
    status: string; // 서버에서 오는 원본 status (문자열)
    aiText: string;
    message: string;
    timestamp: string;
}

export interface AlarmCardData {
    id: string;
    regionName: string;
    regionLocation: string;
    status: CardState; // CardState 타입으로 정의
    type: 'machine' | 'safety';
    createdAt: string;
    deviceId?: number;
    deviceName?: string;
    message?: string;
}

// DeviceAlertData를 AlarmCardData로 변환하는 헬퍼 타입
export interface DeviceAlertMapper {
    mapToAlarmCard: (deviceData: DeviceAlertData) => AlarmCardData;
    mapStatusToCardState: (status: string) => CardState;
}

// 웹소켓 연결 상태
export interface WebSocketConnectionStatus {
    isConnected: boolean;
    lastConnectionTime?: Date;
    connectionAttempts: number;
}

// 웹소켓 이벤트 타입
export type WebSocketEventType = 'device-alert' | 'connection' | 'disconnection' | 'error';

// 웹소켓 이벤트 데이터
export interface WebSocketEvent {
    type: WebSocketEventType;
    data?: any;
    timestamp: Date;
}