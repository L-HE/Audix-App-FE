// shared/api/modalContextApi.tsx
import React, { createContext, ReactNode, useContext, useState, useCallback } from 'react';
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

  // 모달 표시 + 데이터 설정
  const showModal = useCallback((data: AlarmData) => {
    console.log('🎭 modalContext showModal 호출됨:', {
      alarmId: data.alarmId,
      regionName: data.regionName,
      status: data.status
    });

    setModalData(data);
    setModalVisible(true);

    console.log('🎭 모달 상태 업데이트 완료 - visible: true');
  }, []);

  // 모달 숨김 + 데이터 초기화
  const hideModal = useCallback(() => {
    console.log('🎭 모달 숨김 요청');
    setModalVisible(false);
    // 애니메이션이 끝난 후 데이터 정리
    setTimeout(() => {
      setModalData(null);
    }, 300);
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