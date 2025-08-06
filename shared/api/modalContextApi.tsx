import React, { createContext, ReactNode, useContext, useState } from 'react';
import { AlarmData } from '../../assets/data/alarmData';

interface ModalContextType {
  modalVisible: boolean;
  modalData: AlarmData | null;
  setModalVisible: (visible: boolean) => void;
  setModalData: (data: AlarmData | null) => void;
  showModal: (data: AlarmData) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<AlarmData | null>(null);

  const showModal = (data: AlarmData) => {
    setModalData(data);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    setModalData(null);
  };

  return (
    <ModalContext.Provider value={{ 
      modalVisible, 
      modalData, 
      setModalVisible, 
      setModalData, 
      showModal, 
      hideModal 
    }}>
      {children}
    </ModalContext.Provider>
  );
};