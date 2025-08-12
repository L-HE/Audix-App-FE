// components/screens/logoutModal.tsx
import { LogoutModalStyles as style } from '@/shared/styles/components';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

// LogoutModal 컴포넌트의 Props 타입 정의
interface LogoutModalProps {
  visible: boolean;    // 모달 표시 여부
  onCancel: () => void; // "취소" 버튼 클릭 시 실행할 함수
  onConfirm: () => void; // "확인" 버튼 클릭 시 실행할 함수
}

// 로그아웃 확인 모달 컴포넌트
const LogoutModal: React.FC<LogoutModalProps> = ({ visible, onCancel, onConfirm }) => {
  return (
    // ===== 모달 설정 =====
    <Modal
      visible={visible}           // 표시 여부
      transparent                 // 배경을 투명하게 설정
      animationType="fade"        // 페이드 인/아웃 애니메이션
      statusBarTranslucent        // 상태바 투명 처리
      onRequestClose={onCancel}   // 안드로이드 뒤로가기 버튼 시 취소
    >
      {/* ===== 모달 오버레이 영역 ===== */}
      <View style={style.overlay}>
        
        {/* ===== 모달 컨테이너 ===== */}
        <View style={style.modal}>
          
          {/* ===== 모달 제목 ===== */}
          <Text style={style.modalTitle}>로그아웃 하시겠습니까?</Text>

          {/* ===== 버튼 영역 ===== */}
          <View style={style.buttonContainer}>

            {/* 취소 버튼 */}
            <TouchableOpacity
              style={[style.button, style.cancelButton]}
              onPress={onCancel}
            >
              <Text style={style.cancelText}>취소</Text>
            </TouchableOpacity>

            {/* 확인 버튼 */}
            <TouchableOpacity
              style={[style.button, style.confirmButton]}
              onPress={onConfirm}
            >
              <Text style={style.confirmText}>확인</Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;
