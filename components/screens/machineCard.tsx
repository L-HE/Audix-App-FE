// components/screens/machineCard.tsx - API 응답에 맞춘 props 구조

import React from 'react';
import { Image, SafeAreaView, Text, View } from 'react-native';
import { getBorderColor } from '../../shared/styles/colors';
import { MachineCardStyles as styles } from '../../shared/styles/components';
import NativeDonutChart from './nativeDonutChart';
import { BASE_URL } from '../../shared/api/config';

// DeviceParts 타입 정의
export interface DeviceParts {
  gearbox: number;
  bearing: number;
  fan: number;
  slider: number;
  pump: number;
}

// MachineCard Props 타입 정의 (API 응답 구조에 맞춤)
export interface MachineCardProps {
  deviceId: number;
  areaId: number;
  name: string;
  model: string; // explain → model로 변경
  address: string;
  deviceManager: string;
  parts: DeviceParts;
  normalScore: number;
  image: string;
  status: 'normal' | 'warning' | 'danger';
  aiText: string;
  animateOnFirstMount?: boolean; // 최초 마운트 시 애니메이션 여부
}

// React.memo로 감싸서 불필요한 리렌더링 방지
const MachineCard: React.FC<MachineCardProps> = React.memo((
  {
    deviceId,
    areaId,
    name,
    model, // explain 대신 model 사용
    address,
    deviceManager,
    parts,
    normalScore,
    image,
    status,
    aiText,
    animateOnFirstMount
  }
) => {
  // ===== 테두리 색상 계산 (status 값에 따라) =====
  const borderColor = React.useMemo(
    () => getBorderColor(status),
    [status]
  );

  // ===== 이미지 소스 처리 (API 응답에 맞게) =====
  const imageSource = React.useMemo(() => {
    if (!image) {
      // 이미지 없을 경우 기본 로고 사용
      return require('../../assets/images/logos/AudixLogoNavy.png');
    }

    // API에서 받은 이미지 경로를 전체 URL로 변환
    return { uri: `${BASE_URL}${image}` };
  }, [image]);

  // ===== UI 렌더링 =====
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* 카드 전체 컨테이너 */}
      <View style={[styles.card, { borderColor }]}>

        {/* 상단 영역: 이미지 + 기계 정보 + 도넛 차트 */}
        <View style={styles.row}>

          {/* 좌측: 기계 이미지와 이름 */}
          <View style={styles.flex1}>
            <Image
              source={imageSource}
              style={styles.image}
              resizeMode="cover"
              fadeDuration={0}
            />
            <View>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.subName}>{model}</Text>
            </View>
          </View>

          {/* 우측: 상태 시각화 도넛 차트 */}
          <View>
            <NativeDonutChart
              deviceId={String(deviceId)}
              normalScore={normalScore}
              status={status}
              name={name}
              initialAnimate={!!animateOnFirstMount}
            />
          </View>
        </View>

        {/* 하단 영역: 위치 & 담당자 정보 */}
        <View style={styles.flex3}>
          <Text style={styles.infoText}>위치: {address}</Text>
          <Text style={styles.infoText}>담당자: {deviceManager}</Text>
        </View>

        {/* 부품별 상태 정보 (필요시 표시) */}
        {aiText && (
          <View style={styles.flex3}>
            <Text style={styles.infoText}>AI 분석: {aiText}</Text>
          </View>
        )}

      </View>
    </SafeAreaView>
  );
},
  // ===== React.memo 비교 함수 =====
  (prevProps, nextProps) => {
    // 핵심 데이터(status, normalScore, deviceId)만 비교해서 변경 없으면 리렌더링 스킵
    const shouldSkipUpdate =
      prevProps.deviceId === nextProps.deviceId &&
      prevProps.status === nextProps.status &&
      prevProps.normalScore === nextProps.normalScore &&
      prevProps.animateOnFirstMount === nextProps.animateOnFirstMount;

    return shouldSkipUpdate;
  });

export default MachineCard;