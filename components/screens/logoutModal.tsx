// components/screens/logoutModal.tsx
import { LogoutModalStyles as style } from '@/shared/styles/components';
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
      <View style={style.overlay}>
        <View style={style.modal}>
          <Text style={style.modalTitle}>로그아웃 하시겠습니까?</Text>

          <View style={style.buttonContainer}>
            <TouchableOpacity style={[style.button, style.cancelButton]} onPress={onCancel}>
              <Text style={style.cancelText}>취소</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[style.button, style.confirmButton]} onPress={onConfirm}>
              <Text style={style.confirmText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;