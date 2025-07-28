// components/common/notificationModal.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RNModal from 'react-native-modal';

type Status = 'danger' | 'warning';

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
  status: Status;
  regionName: string;
  regionLocation: string;
  equipmentCode: string;
  message?: string;
}

const STATUS_COLORS: Record<Status, string> = {
  danger: '#e74c3c',
  warning: '#f1c40f',
};

const STATUS_LABELS: Record<Status, string> = {
  danger: '위험',
  warning: '점검 요망',
};

const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  onClose,
  status,
  regionName,
  regionLocation,
  equipmentCode,
  message = '현재 장비에서 이상음이 감지됩니다. 점검이 필요합니다.',
}) => {
  const topColor = STATUS_COLORS[status];
  const statusLabel = STATUS_LABELS[status];

  return (
    <RNModal
      isVisible={visible}
      backdropOpacity={0.5}
      animationIn="zoomInDown"     // 등장 애니메이션
      animationInTiming={400}
      animationOut="zoomOutDown"     // 퇴장 애니메이션
      animationOutTiming={300}
      useNativeDriver
      onBackdropPress={onClose}    // 배경 터치 시 닫기
      onBackButtonPress={onClose}  // Android 뒤로가기 시 닫기
    >
      <View style={styles.container}>
        {/* 상단 컬러 헤더 */}
        <View style={[styles.header, { backgroundColor: topColor }]}>
          <Text style={styles.headerTitle}>장비 알림</Text>
          <Text style={styles.headerStatus}>{statusLabel}</Text>
        </View>

        {/* 본문 */}
        <View style={styles.body}>
          <Text style={styles.regionName}>{regionName}</Text>
          <Text style={styles.regionLocation}>{regionLocation}</Text>
          <Text style={styles.equipmentCode}>{equipmentCode}</Text>

          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{message}</Text>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </RNModal>
  );
};

export default NotificationModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  header: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  headerStatus: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
  },
  body: {
    padding: 20,
    alignItems: 'center',
  },
  regionName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  regionLocation: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
    textAlign: 'center',
  },
  equipmentCode: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  messageBox: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    lineHeight: 20,
  },
  closeButton: {
    width: '100%',
    backgroundColor: '#333',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
