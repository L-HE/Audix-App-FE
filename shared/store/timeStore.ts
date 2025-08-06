// shared/store/timeStore.ts
import { create } from 'zustand';

interface TimeStore {
  currentTime: number;
  updateCurrentTime: () => void;
  getRelativeTime: (date: Date) => string;
  startTimer: () => void;
  stopTimer: () => void;
}

let globalInterval: ReturnType<typeof setInterval> | null = null;

export const useTimeStore = create<TimeStore>((set, get) => ({
  currentTime: Date.now(),
  
  updateCurrentTime: () => {
    const newTime = Date.now();
    //console.log('⏰ [TimeStore] Updating currentTime:', new Date(newTime).toLocaleTimeString());
    set({ currentTime: newTime });
  },
  
  getRelativeTime: (date: Date) => {
    //console.log('🕒 [TimeStore] getRelativeTime called with:', date);
    
    // ✅ 타입 검증
    if (!date) {
      console.warn('🚨 [TimeStore] date is null/undefined');
      return '시간 정보 없음';
    }
    
    if (!(date instanceof Date)) {
      console.warn('🚨 [TimeStore] date is not Date instance:', typeof date, date);
      return '시간 정보 없음';
    }
    
    if (isNaN(date.getTime())) {
      console.warn('🚨 [TimeStore] date is invalid Date:', date);
      return '시간 정보 없음';
    }
    
    const currentTime = get().currentTime;
    const now = new Date(currentTime);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 0) return '방금 전';
    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}일 전`;
  },
  
  startTimer: () => {
    if (globalInterval) return; // 이미 시작된 경우 무시
    
    globalInterval = setInterval(() => {
      get().updateCurrentTime();
    }, 30000); // 30초마다 업데이트
  },
  
  stopTimer: () => {
    if (globalInterval) {
      clearInterval(globalInterval);
      globalInterval = null;
    }
  },
}));