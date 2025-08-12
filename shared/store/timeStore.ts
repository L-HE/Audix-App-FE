// shared/store/timeStore.ts
import { create } from 'zustand';

// 시간 관련 전역 상태 타입 정의
interface TimeStore {
  currentTime: number;                     // 현재 시각(타임스탬프, ms)
  updateCurrentTime: () => void;            // 현재 시각을 Date.now()로 갱신
  getRelativeTime: (date: Date) => string;  // 주어진 날짜와 현재 시각의 차이를 문자열로 반환
  startTimer: () => void;                   // 주기적으로 시간 갱신 시작
  stopTimer: () => void;                    // 주기적으로 시간 갱신 중단
}

// 전역 interval 참조 (중복 실행 방지용)
let globalInterval: ReturnType<typeof setInterval> | null = null;

// 시간 전역 store 생성
export const useTimeStore = create<TimeStore>((set, get) => ({
  // ===== 현재 시각 초기값 =====
  currentTime: Date.now(),
  
  // ===== 현재 시각 업데이트 =====
  updateCurrentTime: () => {
    const newTime = Date.now();
    set({ currentTime: newTime });
  },
  
  // ===== 상대 시간 계산 =====
  getRelativeTime: (date: Date) => {
    // 타입 검증
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return '시간 정보 없음';
    }
    
    // 현재 시각과의 차이 계산 (초 단위)
    const currentTime = get().currentTime;
    const now = new Date(currentTime);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    // 차이에 따른 표현 반환
    if (diffInSeconds < 0) return '방금 전';
    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}일 전`;
  },
  
  // ===== 타이머 시작 (30초마다 시간 갱신) =====
  startTimer: () => {
    if (globalInterval) return; // 이미 실행 중이면 무시
    
    globalInterval = setInterval(() => {
      get().updateCurrentTime();
    }, 30000); // 30초 주기
  },
  
  // ===== 타이머 중지 =====
  stopTimer: () => {
    if (globalInterval) {
      clearInterval(globalInterval);
      globalInterval = null;
    }
  },
}));
