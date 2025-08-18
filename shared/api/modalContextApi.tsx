// shared/api/modalContextApi.tsx
import React, { createContext, ReactNode, useContext, useState, useCallback, useRef } from 'react';
import { AlarmData } from '../../assets/data/alarmData';

/* ==============================
   ModalContext 타입 정의
   ============================== */
interface ModalContextType {
  modalVisible: boolean;
  modalData: AlarmData | null;
  setModalVisible: (visible: boolean) => void;
  setModalData: (data: AlarmData | null) => void;
  showModal: (data: AlarmData) => void;
  hideModal: () => void;
}

/* ==============================
   Context 생성
   ============================== */
const ModalContext = createContext<ModalContextType | undefined>(undefined);

/* ==============================
   Context 전용 커스텀 훅
   ============================== */
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

/* ==============================
   ModalProvider Props 타입
   ============================== */
interface ModalProviderProps {
  children: ReactNode;
}

/* ==============================
   ModalProvider 컴포넌트
   ============================== */
export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<AlarmData | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHidingRef = useRef(false);

  // 모달 표시 + 데이터 설정
  const showModal = useCallback((data: AlarmData) => {
    console.log('🎭 modalContext showModal 호출됨:', {
      alarmId: data.alarmId,
      regionName: data.regionName,
      status: data.status
    });

    // 진행 중인 숨김 작업 취소
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    isHidingRef.current = false;

    // 새 데이터 설정 후 모달 표시
    setModalData(data);
    setModalVisible(true);

    console.log('🎭 모달 상태 업데이트 완료 - visible: true');
  }, []);

  // 모달 숨김 (사용자가 X 버튼 클릭 시에만)
  const hideModal = useCallback(() => {
    // 이미 숨기는 중이면 중복 실행 방지
    if (isHidingRef.current) {
      console.log('🎭 모달 숨김 이미 진행 중 - 스킵');
      return;
    }

    console.log('🎭 모달 숨김 요청 (사용자 액션)');
    isHidingRef.current = true;

    setModalVisible(false);

    // 애니메이션 완료 후 데이터 정리
    hideTimeoutRef.current = setTimeout(() => {
      setModalData(null);
      isHidingRef.current = false;
      hideTimeoutRef.current = null;
      console.log('🎭 모달 데이터 정리 완료');
    }, 400); // 모달 애니메이션 시간과 맞춤
  }, []);

  const contextValue: ModalContextType = {
    modalVisible,
    modalData,
    setModalVisible,
    setModalData,
    showModal,
    hideModal
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
};