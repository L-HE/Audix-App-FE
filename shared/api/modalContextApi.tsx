import React, { createContext, ReactNode, useContext, useState } from 'react';
import { AlarmData } from '../../assets/data/alarmData';

/* ==============================
   ModalContext 타입 정의
   ============================== */
interface ModalContextType {
  modalVisible: boolean;                    // 모달 표시 여부
  modalData: AlarmData | null;               // 모달에 전달되는 알람 데이터
  setModalVisible: (visible: boolean) => void; // 모달 표시 여부 직접 변경
  setModalData: (data: AlarmData | null) => void; // 모달 데이터 직접 변경
  showModal: (data: AlarmData) => void;      // 모달 표시 + 데이터 설정
  hideModal: () => void;                     // 모달 숨김 + 데이터 초기화
}

/* ==============================
   Context 생성
   ============================== */
const ModalContext = createContext<ModalContextType | undefined>(undefined);

/* ==============================
   Context 전용 커스텀 훅
   - 반드시 ModalProvider 내부에서만 사용 가능
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
  children: ReactNode; // Provider 하위에서 렌더링할 컴포넌트들
}

/* ==============================
   ModalProvider 컴포넌트
   - 모달 상태/제어 함수를 Context로 제공
   ============================== */
export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  // 모달 표시 여부 상태
  const [modalVisible, setModalVisible] = useState(false);
  // 모달에 표시할 알람 데이터
  const [modalData, setModalData] = useState<AlarmData | null>(null);

  // 모달 표시 + 데이터 설정
  const showModal = (data: AlarmData) => {
    setModalData(data);
    setModalVisible(true);
  };

  // 모달 숨김 + 데이터 초기화
  const hideModal = () => {
    setModalVisible(false);
    setModalData(null);
  };

  return (
    <ModalContext.Provider 
      value={{ 
        modalVisible, 
        modalData, 
        setModalVisible, 
        setModalData, 
        showModal, 
        hideModal 
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
