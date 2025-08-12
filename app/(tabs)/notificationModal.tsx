// app/(tabs)/notificationModal.tsx
import { CardState } from '@/assets/data/areaData';
import React, { Profiler } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import RNModal from 'react-native-modal';
import { Portal } from 'react-native-portalize';
import { AlarmType } from '../../assets/data/alarmData';
import { useModal } from '../../shared/api/modalContextApi';
import { Colors } from '../../shared/styles/global';
import { NotificationModalStyles as style } from '../../shared/styles/screens';

// NotificationModal 전용 Profiler 콜백
const onModalRenderCallback = (
  id: string,
  phase: 'mount' | 'update' | 'nested-update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) => {
  const threshold = 16; // 60fps 기준
  const isSlowRender = actualDuration > threshold;
  
  if (isSlowRender) {
    console.log(`[Modal Profiler] ${id} (${phase}): ${actualDuration.toFixed(2)}ms <- SLOW MODAL RENDER!`);
    
    // 모달의 경우 50ms 이상이면 상세 정보 출력
    if (actualDuration > 50) {
      console.log(`[Modal Details] ${id}:`, {
        phase,
        actualDuration: `${actualDuration.toFixed(2)}ms`,
        baseDuration: `${baseDuration.toFixed(2)}ms`,
        startTime: `${startTime.toFixed(2)}ms`,
        commitTime: `${commitTime.toFixed(2)}ms`,
        renderingTime: `${(commitTime - startTime).toFixed(2)}ms`
      });
    }
  } else {
    console.log(`[Modal Profiler] ${id} (${phase}): ${actualDuration.toFixed(2)}ms`);
  }
};

const NotificationModalContent: React.FC = () => {
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
      repair: '점검 중',
      offline: '마이크 미연결',
    };
    
    return STATUS_LABELS[modalData.status];
  }, [modalData?.type, modalData?.status]);

  if (!modalData) return null;

  const STATUS_COLORS: Record<CardState, string> = {
    danger: Colors.danger,
    warning: Colors.warning,
    normal: Colors.normal,
    repair: Colors.repair,
    offline: Colors.offline,
  };

  const STATUS_LABELS: Record<CardState, string> = {
    danger: '위험',
    warning: '점검 요망',
    normal: '정상',
    repair: '점검 중',
    offline: '마이크 미연결',
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
        onModalShow={() => {
          console.log(`[Modal] 애니메이션 완료 - 모달 완전히 표시됨`);
        }}
        onModalHide={() => {
          console.log(`[Modal] 애니메이션 완료 - 모달 완전히 숨겨짐`);
        }}
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

            {/* LLM 메세지 box */}
            <View style={[
              style.messageBox, 
              { backgroundColor: isSafetyAlarm ? Colors.backgroundSafetyAlarm : Colors.backgroundSecondary }
            ]}>
              <Text style={[
                style.messageText,
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

// Profiler로 감싼 메인 컴포넌트
const NotificationModal: React.FC = () => {
  return (
    <Profiler id="NotificationModal" onRender={onModalRenderCallback}>
      <NotificationModalContent />
    </Profiler>
  );
};

export default NotificationModal;