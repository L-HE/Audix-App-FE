// components/screens/MachineCard.tsx
import React from 'react';
import { Image, SafeAreaView, Text, View } from 'react-native';
import { CardState } from '../../assets/data/areaData';
import { Machine } from '../../assets/data/machineData';
import { getBorderColor } from '../../shared/styles/colors';
import { MachineCardStyles as styles } from '../../shared/styles/components';
import NativeDonutChart from './nativeDonutChart';

// 📌 MachineCard 컴포넌트 Props 타입 정의
interface MachineCardProps extends Machine {
  animateOnFirstMount?: boolean; // 최초 마운트 시 애니메이션 여부
}

// 📌 React.memo로 감싸서 불필요한 리렌더링 방지
const MachineCard: React.FC<MachineCardProps> = React.memo((
  {
    deviceId,
    name,
    explain,
    address,
    deviceManager,
    status,
    image,
    normalScore,
    animateOnFirstMount
  }
) => {
  // ===== 테두리 색상 계산 (status 값에 따라) =====
  const borderColor = React.useMemo(
    () => getBorderColor(status as CardState),
    [status]
  );

  // ===== 이미지 소스 처리 =====
  const imageSource = React.useMemo(() => {
    if (!image) {
      // 이미지 없을 경우 기본 로고 사용
      return require('../../assets/images/logos/AudixLogoNavy.png');
    }
    if (typeof image === 'string') {
      // 원격 URL 문자열일 경우 { uri } 형태로 변환
      return { uri: image };
    }
    // require() 결과나 이미 { uri } 객체면 그대로 사용
    return image;
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
              <Text style={styles.subName}>{explain}</Text>
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

      </View>
    </SafeAreaView>
  );
}, 
// ===== React.memo 비교 함수 =====
(prevProps, nextProps) => {
  // 핵심 데이터(status, normalScore)만 비교해서 변경 없으면 리렌더링 스킵
  const shouldSkipUpdate =
    prevProps.status === nextProps.status &&
    prevProps.normalScore === nextProps.normalScore;
  
  return shouldSkipUpdate;
});

export default MachineCard;
