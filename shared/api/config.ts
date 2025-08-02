// API 및 WebSocket URL 통합 관리
export const BASE_URL = 'http://172.22.96.1:3000';

// API 엔드포인트
export const API_ENDPOINTS = {
    BASE: BASE_URL,
    WEBSOCKET: BASE_URL,
} as const;

export default {
    BASE_URL,
    API_ENDPOINTS,
};
