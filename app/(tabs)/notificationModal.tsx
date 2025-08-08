// app/(tabs)/notificationModal.tsx
import { CardState } from '@/assets/data/areaData';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import RNModal from 'react-native-modal';
import { Portal } from 'react-native-portalize';
import { AlarmType } from '../../assets/data/alarmData';
import { useModal } from '../../shared/api/modalContextApi';
import { Colors } from '../../shared/styles/global';
import { NotificationModalStyles as style } from '../../shared/styles/screens';

const NotificationModal: React.FC = () => {
  const { modalVisible, modalData, hideModal } = useModal();

  // Hook을 먼저 모두 호출
  const displayTitle = React.useMemo(() => {
    // modalData가 없으면 기본값 반환
    if (!modalData) return '';
    
    // safety 타입이면 항상 '안전 사고 발생'
    if (modalData.type === 'safety') {
      return '안전 사고 발생';
    }
    
    // machine 타입이면 status에 따라 매핑
    const STATUS_LABELS: Record<CardState, string> = {
      danger: '위험',
      warning: '점검 요망',
      normal: '정상',
      fixing: '점검 중',
      mic_issue: '마이크 미연결',
    };
    
    return STATUS_LABELS[modalData.status];
  }, [modalData?.type, modalData?.status]);

  if (!modalData) return null;

  const STATUS_COLORS: Record<CardState, string> = {
    danger: Colors.danger,
    warning: Colors.warning,
    normal: Colors.normal,
    fixing: Colors.fixing,
    mic_issue: Colors.mic_issue,
  };

  const STATUS_LABELS: Record<CardState, string> = {
    danger: '위험',
    warning: '점검 요망',
    normal: '정상',
    fixing: '점검 중',
    mic_issue: '마이크 미연결',
  };

  const ALARM_LABELS: Record<AlarmType, string> = {
    machine: '장비 알람',
    safety: '비상 알람',
  };
  
  const topColor = STATUS_COLORS[modalData.status];
  const statusLabel = STATUS_LABELS[modalData.status];
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
        statusBarTranslucent
        useNativeDriver
        onBackdropPress={hideModal}
        onBackButtonPress={hideModal}
        style={{ zIndex: 10000 }}
      >
        <View style={[style.container, { backgroundColor: bodyBackgroundColor }]}>
          {/* 상단 컬러 헤더 */}
          <View style={[style.header, { backgroundColor: topColor }]}>
            <Text style={style.headerTitle}>{alarmType}</Text>
            <Text style={style.headerStatus}>{statusLabel}</Text>
          </View>

          {/* 본문 */}
          <View style={[style.body, { backgroundColor: bodyBackgroundColor }]}>
            <Text style={style.alarmTitle}>{modalData.regionName}</Text>
            <Text style={style.alarmSubtitle}>{modalData.regionLocation}</Text>
            
            {/* safety 타입이 아닐 때만 model 출력 */}
            {!isSafetyAlarm && (
              <Text style={style.alarmSubtitle}>{modalData.model}</Text>
            )}

            {/* LLM message box */}
            <View style={[
              style.messageBox, 
              // safety 타입일 때 메시지 박스 배경색도 조정
              { backgroundColor: isSafetyAlarm ? Colors.backgroundSafetyAlarm : Colors.backgroundSecondary }
            ]}>
              <Text style={[
                style.messageText,
                // safety 타입일 때 텍스트 색상도 흰색으로 변경
                { color: isSafetyAlarm ? Colors.textPrimary : Colors.textPrimary }
              ]}>
                {modalData.message}
              </Text>
            </View>

            {/* 닫기 버튼 */}
            <TouchableOpacity 
              style={style.closeButton} 
              onPress={hideModal}
            >
              <Text style={[
                style.closeButtonText,
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

export default NotificationModal;