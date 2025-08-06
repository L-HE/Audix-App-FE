// app/(tabs)/notificationModal.tsx
import { CardState } from '@/assets/data/areaData';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RNModal from 'react-native-modal';
import { Portal } from 'react-native-portalize';
import { AlarmType } from '../../assets/data/alarmData';
import { useModal } from '../../shared/api/modalContextApi';
import { Colors } from '../../shared/styles/global';

const NotificationModal: React.FC = () => {
  const { modalVisible, modalData, hideModal } = useModal();

  // modalData가 없으면 모달을 표시하지 않음
  if (!modalData) return null;

  const STATUS_COLORS: Record<CardState, string> = {
    danger: Colors.danger,
    warning: Colors.warning,
    normal: Colors.normal,
    fixing: Colors.textSecondary,
    unknown: Colors.textSecondary,
  };

  const STATUS_LABELS: Record<CardState, string> = {
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
  
  const topColor = STATUS_COLORS[modalData.machineStatus];
  const statusLabel = STATUS_LABELS[modalData.machineStatus];
  const alarmType = ALARM_LABELS[modalData.type];

  // safety 타입일 때 본문 배경색 결정
  const isSafetyAlarm = modalData.type === 'safety';
  const bodyBackgroundColor = isSafetyAlarm ? Colors.danger : Colors.background;

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
        <View style={[styles.container, { backgroundColor: bodyBackgroundColor }]}>
          {/* 상단 컬러 헤더 */}
          <View style={[styles.header, { backgroundColor: topColor }]}>
            <Text style={styles.headerTitle}>{alarmType}</Text>
            <Text style={styles.headerStatus}>{statusLabel}</Text>
          </View>

          {/* 본문 */}
          <View style={[styles.body, { backgroundColor: bodyBackgroundColor }]}>
            <Text style={styles.alarmTitle}>{modalData.regionName}</Text>
            <Text style={styles.alarmSubtitle}>{modalData.regionLocation}</Text>
            
            {/* safety 타입이 아닐 때만 model 출력 */}
            {!isSafetyAlarm && (
              <Text style={styles.alarmSubtitle}>{modalData.model}</Text>
            )}

            {/* LLM message box */}
            <View style={[
              styles.messageBox, 
              // safety 타입일 때 메시지 박스 배경색도 조정
              { backgroundColor: isSafetyAlarm ? 'rgba(255, 255, 255, 0.1)' : Colors.backgroundSecondary }
            ]}>
              <Text style={[
                styles.messageText,
                // safety 타입일 때 텍스트 색상도 흰색으로 변경
                { color: isSafetyAlarm ? Colors.textPrimary : Colors.textPrimary }
              ]}>
                {modalData.message}
              </Text>
            </View>

            {/* 닫기 버튼 */}
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={hideModal}
            >
              <Text style={[
                styles.closeButtonText,
                // safety 타입일 때 버튼 텍스트 색상 조정
                { color: isSafetyAlarm ? Colors.textPrimary : Colors.textPrimary }
              ]}>
                닫기
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </RNModal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
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
    color: Colors.textPrimary,
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
    width: '80%',
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
    marginBottom: 20,
  },
  messageText: {
    fontSize: 14,
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
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NotificationModal;