// shared/store/loadingStore.ts
import { create } from 'zustand';

// 로딩 상태 타입 정의
interface LoadingState {
  isLoading: boolean;                      // 로딩 중 여부
  loadingMessage?: string;                 // 로딩 메시지(선택)
  hideLoading: () => void;                  // 로딩 숨김 함수
  setLoading: (loading: boolean, message?: string) => void; // 로딩 상태 설정 함수
}

// 로딩 상태 전역 store 생성
export const useLoadingStore = create<LoadingState>((set) => ({
  // 초기 상태
  isLoading: false,
  loadingMessage: undefined,

  // 로딩 종료(상태 초기화)
  hideLoading: () => set({ 
    isLoading: false, 
    loadingMessage: undefined 
  }),

  // 로딩 시작/종료 및 메시지 설정
  setLoading: (loading: boolean, message?: string) =>
    set({ 
      isLoading: loading, 
      loadingMessage: message 
    }),
}));
