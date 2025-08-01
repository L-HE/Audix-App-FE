// components/common/notificationModal.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RNModal from 'react-native-modal';
import { Portal } from 'react-native-portalize';
import { modalData } from '../../assets/data/modalData';
import { useModal } from '../../shared/api/modalContextApi'; // 모달 컨텍스트 API 사용
import { Colors } from '../../shared/styles/global';

type Status = 'danger' | 'warning';

const STATUS_COLORS: Record<Status, string> = {
  danger: Colors.danger,
  warning: Colors.warning,
};

const STATUS_LABELS: Record<Status, string> = {
  danger: '위험',
  warning: '점검 요망',
};

const NotificationModal: React.FC = () => {
  const { modalVisible, setModalVisible } = useModal();
  
  const handleClose = () => {
    setModalVisible(false);
  };

  const topColor = STATUS_COLORS[modalData.status];
  const statusLabel = STATUS_LABELS[modalData.status];

  return (
    <Portal>
      <RNModal
        isVisible={modalVisible}
        backdropOpacity={0.5}
        animationIn="zoomInDown"
        animationInTiming={400}
        animationOut="zoomOutDown"
        animationOutTiming={300}
        useNativeDriver
        onBackdropPress={handleClose}
        onBackButtonPress={handleClose}
        style={{ zIndex: 10000 }} // 추가
      >
        <View style={styles.container}>
          {/* 상단 컬러 헤더 */}
          <View style={[styles.header, { backgroundColor: topColor }]}>
            <Text style={styles.headerTitle}>장비 알람</Text>
            <Text style={styles.headerStatus}>{statusLabel}</Text>
          </View>

          {/* 본문 */}
          <View style={styles.body}>
            <Text style={styles.regionName}>{modalData.regionName}</Text>
            <Text style={styles.regionLocation}>{modalData.regionLocation}</Text>
            <Text style={styles.equipmentCode}>{modalData.equipmentCode}</Text>

            <View style={styles.messageBox}>
              <Text style={styles.messageText}>
                {modalData.message || '현재 장비에서 이상음이 감지됩니다. 점검이 필요합니다.'}
              </Text>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RNModal>
    </Portal>
  );
};

export default NotificationModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    overflow: 'hidden',
    zIndex: 9999, // 최상위 레벨로 설정
    elevation: 1000, // Android 전용
  },
  header: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  headerStatus: {
    fontSize: 30,
    color: Colors.textPrimary,
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
    color: Colors.textSecondary,
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
    backgroundColor: Colors.backgroundSecondary,
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
  },
  messageText: {
    fontSize: 14,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 20,
  },
  closeButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#000',
    fontSize: 16,
  },
});
