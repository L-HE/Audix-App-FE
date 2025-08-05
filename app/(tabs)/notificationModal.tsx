// app/(tabs)/notificationModal.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RNModal from 'react-native-modal';
import { Portal } from 'react-native-portalize';
import { AlarmType } from '../../assets/data/alarmData';
import { useModal } from '../../shared/api/modalContextApi';
import { Colors } from '../../shared/styles/global';

// CardState를 Status로 매핑
type Status = 'danger' | 'warning' | 'normal' | 'fixing' | 'unknown';

const NotificationModal: React.FC = () => {
  const { modalVisible, modalData, hideModal } = useModal();

  // modalData가 없으면 모달을 표시하지 않음
  if (!modalData) return null;

  // CardState를 Status로 매핑
  const mapCardStateToStatus = (cardState: string): Status => {
    switch (cardState) {
      case 'danger':
        return 'danger';
      case 'warning':
        return 'warning';
      case 'normal':
        return 'normal';
      default:
        return 'fixing';
    }
  };

  const STATUS_COLORS: Record<Status, string> = {
    danger: Colors.danger,
    warning: Colors.warning,
    normal: Colors.normal,
    fixing: Colors.textSecondary,
    unknown: Colors.textSecondary,
  };

  const STATUS_LABELS: Record<Status, string> = {
    danger: '위험',
    warning: '점검 요망',
    normal: '정상',
    fixing: '점검 중',
    unknown: '알 수 없음',
  };

  const ALARM_LABELS: Record<AlarmType, string> = {
    machine: '장비 알람',
    safety: '비상 알람',
    other: '장비 상태',
  };
  
  const mappedStatus = mapCardStateToStatus(modalData.machineStatus as string);
  const topColor = STATUS_COLORS[mappedStatus];
  const statusLabel = STATUS_LABELS[mappedStatus];
  const alarmType = ALARM_LABELS[modalData.type];

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
        onBackdropPress={hideModal}
        onBackButtonPress={hideModal}
        style={{ zIndex: 10000 }}
      >
        <View style={styles.container}>
          {/* 상단 컬러 헤더 */}
          <View style={[styles.header, { backgroundColor: topColor }]}>
            <Text style={styles.headerTitle}>{alarmType}</Text>
            <Text style={styles.headerStatus}>{statusLabel}</Text>
          </View>

          {/* 본문 */}
          <View style={styles.body}>
            <Text style={styles.alarmTitle}>{modalData.regionName}</Text>
            <Text style={styles.alarmSubtitle}>{modalData.regionLocation}</Text>
            <Text style={styles.alarmSubtitle}>{modalData.model}</Text>

            <View style={styles.messageBox}>
              <Text style={styles.messageText}>
                {modalData.message}
              </Text>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={hideModal}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RNModal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    overflow: 'hidden',
    zIndex: 9999,
    elevation: 1000,
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
  alarmTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    color: Colors.textPrimary,
  },
  alarmSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.textSecondary,
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
    backgroundColor: Colors.background,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeButtonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NotificationModal;