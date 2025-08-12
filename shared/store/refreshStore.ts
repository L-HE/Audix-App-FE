// shared/store/refreshStore.ts
import { create } from 'zustand';

// 새로고침 상태 타입 정의
interface RefreshState {
    refreshTrigger: number;   // 새로고침을 감지할 카운터 값
    triggerRefresh: () => void; // 새로고침 트리거 함수
}

// 새로고침 전역 store 생성
export const useRefreshStore = create<RefreshState>((set) => ({
    // 초기 상태
    refreshTrigger: 0,

    // 새로고침 트리거: 값 1 증가 → 해당 값을 의존하는 컴포넌트가 리렌더링됨
    triggerRefresh: () => set((state) => ({
        refreshTrigger: state.refreshTrigger + 1
    })),
}));
