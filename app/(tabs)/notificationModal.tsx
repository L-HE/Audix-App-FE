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

/**
 * 알림 모달 내부 콘텐츠
 * - 모달 컨텍스트에서 가시성/데이터/닫기 핸들러를 받아 표시
 * - safety/machine 타입에 따라 라벨/색상/본문 구성을 다르게 처리
 */
const NotificationModalContent: React.FC = () => {
  // 모달 전역 상태 훅
  const { modalVisible, modalData, hideModal } = useModal();

  /**
   * 상단 타이틀 계산
   * - safety: 고정 "안전 사고 발생"
   * - machine: 상태에 따른 라벨
   */
  const displayTitle = React.useMemo(() => {
    if (!modalData) return '';
    if (modalData.type === 'safety') return '안전 사고 발생';

    const STATUS_LABELS: Record<CardState, string> = {
      danger: '위험',
      warning: '점검 요망',
      normal: '정상',
      repair: '점검 중',
      offline: '마이크 미연결',
    };
    return STATUS_LABELS[modalData.status];
  }, [modalData?.type, modalData?.status]);

  // 데이터가 없으면 렌더링하지 않음
  if (!modalData) return null;

  // 상태/타입별 색상 및 라벨 매핑
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

  // 현재 알람에 맞는 표현 값들
  const topColor = STATUS_COLORS[modalData.status];
  const statusLabel = STATUS_LABELS[modalData.status];
  const alarmType = ALARM_LABELS[modalData.type];

  // safety 타입일 때 본문 배경 강조
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
          {/* 상단: 알람 종류/상태 뱃지 영역 */}
          <View style={[style.header, { backgroundColor: topColor }]}>
            <Text style={style.headerTitle}>{alarmType}</Text>
            <Text style={style.headerStatus}>{statusLabel}</Text>
          </View>

          {/* 본문: 위치/모델/메시지/닫기 버튼 */}
          <View style={[style.body, { backgroundColor: bodyBackgroundColor }]}>
            {/* 지역/위치 */}
            <Text style={style.alarmTitle}>{modalData.regionName}</Text>
            <Text style={style.alarmSubtitle}>{modalData.regionLocation}</Text>

            {/* machine 타입일 때만 모델 정보 노출 */}
            {!isSafetyAlarm && <Text style={style.alarmSubtitle}>{modalData.model}</Text>}

            {/* 메시지 박스 (safety일 때 배경 강조) */}
            <View
              style={[
                style.messageBox,
                {
                  backgroundColor: isSafetyAlarm
                    ? Colors.backgroundSafetyAlarm
                    : Colors.backgroundSecondary,
                },
              ]}
            >
              <Text
                style={[
                  style.messageText,
                  { color: Colors.textPrimary },
                ]}
              >
                {modalData.message}
              </Text>
            </View>

            {/* 닫기 버튼 */}
            <TouchableOpacity style={style.closeButton} onPress={hideModal}>
              <Text
                style={[
                  style.closeButtonText,
                  { color: Colors.textPrimary },
                ]}
              >
                닫기
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </RNModal>
    </Portal>
  );
};

/**
 * 모달 컴포넌트 (Profiler 제거)
 * - 포털 내부에 모달 콘텐츠만 렌더
 */
const NotificationModal: React.FC = () => {
  return <NotificationModalContent />;
};

export default NotificationModal;
