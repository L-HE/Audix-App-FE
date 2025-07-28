import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
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

  return (
    <ModalContext.Provider value={{ modalVisible, setModalVisible }}>
      {children}
    </ModalContext.Provider>
  );
};