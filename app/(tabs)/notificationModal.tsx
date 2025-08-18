// app/(tabs)/notificationModal.tsx
import { CardState } from '@/assets/data/areaData';
import React, { useEffect, useCallback } from 'react';
import { Text, TouchableOpacity, View, BackHandler } from 'react-native';
import RNModal from 'react-native-modal';
import { Portal } from 'react-native-portalize';
import { AlarmType } from '../../assets/data/alarmData';
import { useModal } from '../../shared/api/modalContextApi';
import { Colors } from '../../shared/styles/colors';
import { NotificationModalStyles as style } from '../../shared/styles/screens';

/**
 * 알림 모달 내부 콘텐츠
 */
const NotificationModalContent: React.FC = () => {
  const { modalVisible, modalData, hideModal } = useModal();

  // 모달 상태 변화 로깅
  useEffect(() => {
    console.log('🎭 모달 상태 변화:', {
      visible: modalVisible,
      hasData: !!modalData,
      alarmId: modalData?.alarmId
    });
  }, [modalVisible, modalData]);

  // Android 뒤로가기 버튼 처리
  useEffect(() => {
    if (!modalVisible) return;

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      console.log('🎭 Android 뒤로가기 버튼 - 모달 닫기');
      hideModal();
      return true; // 이벤트 소비
    });

    return () => backHandler.remove();
  }, [modalVisible, hideModal]);

  /**
   * 상단 타이틀 계산
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

  // 모달 닫기 핸들러 (사용자 액션에 의해서만)
  const handleHideModal = useCallback(() => {
    console.log('🎭 사용자 액션으로 모달 닫기');
    hideModal();
  }, [hideModal]);

  // 모달이 보이지 않거나 데이터가 없으면 렌더링하지 않음
  if (!modalVisible || !modalData) {
    console.log('🎭 모달 렌더링 스킵:', { visible: modalVisible, hasData: !!modalData });
    return null;
  }

  console.log('🎭 모달 렌더링 시작:', {
    visible: modalVisible,
    regionName: modalData.regionName,
    status: modalData.status
  });

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
        animationIn="slideInDown"
        animationInTiming={400}
        animationOut="slideOutUp"
        animationOutTiming={300}
        statusBarTranslucent={false}
        useNativeDriver={true}
        onBackdropPress={handleHideModal}
        onBackButtonPress={handleHideModal}
        onModalWillShow={() => console.log('🎭 모달 표시 시작')}
        onModalShow={() => console.log('🎭 모달 표시 완료')}
        onModalWillHide={() => console.log('🎭 모달 숨김 시작')}
        onModalHide={() => console.log('🎭 모달 숨김 완료')}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          margin: 0,
          zIndex: 10000
        }}
        // 자동 닫기 방지를 위한 추가 옵션
        swipeDirection={undefined} // 스와이프로 닫기 완전 비활성화
        propagateSwipe={false}
        coverScreen={true}
        hasBackdrop={true}
      >
        <View style={[
          style.container,
          {
            backgroundColor: bodyBackgroundColor,
            width: '90%',
            maxWidth: 400,
            alignSelf: 'center'
          }
        ]}>
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
            {!isSafetyAlarm && modalData.model && (
              <Text style={style.alarmSubtitle}>모델: {modalData.model}</Text>
            )}

            {/* 메시지 박스 */}
            <View
              style={[
                style.messageBox,
                {
                  backgroundColor: isSafetyAlarm
                    ? Colors.backgroundSafetyAlarm || Colors.danger
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
            <TouchableOpacity
              style={[
                style.closeButton,
                { backgroundColor: Colors.backgroundSecondary }
              ]}
              onPress={handleHideModal}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  style.closeButtonText,
                  { color: Colors.textPrimary },
                ]}
              >
                확인
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </RNModal>
    </Portal>
  );
};

/**
 * 모달 컴포넌트
 */
const NotificationModal: React.FC = () => {
  return <NotificationModalContent />;
};

export default NotificationModal;