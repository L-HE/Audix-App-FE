// shared/websocket/types.ts
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
    status: string;
    aiText: string;
    message: string;
    timestamp: string;
}

export interface AlarmCardData {
    id: string;
    regionName: string;
    regionLocation: string;
    status: 'danger' | 'warning' | 'normal' | 'repair' | 'offline';
    type: 'machine' | 'safety';
    createdAt: string;
    deviceId?: number;
    deviceName?: string;
    message?: string;
}
