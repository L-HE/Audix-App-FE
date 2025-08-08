// components/screens/logoutModal.tsx
import { LogoutModalStyles } from '@/shared/styles/components';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface LogoutModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ visible, onCancel, onConfirm }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <View style={LogoutModalStyles.overlay}>
        <View style={LogoutModalStyles.modal}>
          <Text style={LogoutModalStyles.modalTitle}>로그아웃 하시겠습니까?</Text>

          <View style={LogoutModalStyles.buttonContainer}>
            <TouchableOpacity style={[LogoutModalStyles.button, LogoutModalStyles.cancelButton]} onPress={onCancel}>
              <Text style={LogoutModalStyles.cancelText}>취소</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[LogoutModalStyles.button, LogoutModalStyles.confirmButton]} onPress={onConfirm}>
              <Text style={LogoutModalStyles.confirmText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;