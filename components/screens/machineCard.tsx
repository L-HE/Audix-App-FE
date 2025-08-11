// components/screens/MachineCard.tsx
import React from 'react';
import { Image, SafeAreaView, Text, View } from 'react-native';
import { CardState } from '../../assets/data/areaData';
import { Machine } from '../../assets/data/machineData';
import { MachineCardStyles as styles } from '../../shared/styles/components';
import { getBorderColor } from '../../shared/styles/global';
import NativeDonutChart from './nativeDonutChart';

const MachineCard: React.FC<Machine> = React.memo(({
  deviceId,
  name,
  explain,
  address,
  deviceManager,
  status,
  image,
  normalScore
}) => {
  const borderColor = React.useMemo(() => getBorderColor(status as CardState), [status]);
  const imageSource = React.useMemo(() => {
  if (!image) {
    return require('../../assets/images/logos/AudixLogoNavy.png');
  }
  // 원격 URL 문자열일 때만 { uri: string } 으로 감싸기
  if (typeof image === 'string') {
    return { uri: image };
  }
  // require() 로 받은 숫자(module id) 또는 이미 { uri } 형태인 경우 그대로
  return image;
}, [image]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.card, { borderColor }]}>
        <View style={styles.row}>
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
            <View style={styles.flex3}>
              <Text style={styles.infoText}>위치: {address}</Text>
              <Text style={styles.infoText}>담당자: {deviceManager}</Text>
            </View>
          </View>
          <View>
            <NativeDonutChart deviceId={String(deviceId)} normalScore={normalScore} status={status} name={name} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}, (prevProps, nextProps) => {
  // 핵심 데이터만 비교하여 리렌더링 결정
  const shouldSkipUpdate = (
    prevProps.status === nextProps.status &&
    prevProps.normalScore === nextProps.normalScore
  );
  
  if (!shouldSkipUpdate) {
    console.log(`🔄 MachineCard [${prevProps.deviceId}] 리렌더링 필요:`, {
      status: `${prevProps.status} → ${nextProps.status}`,
      normalScore: `${prevProps.normalScore} → ${nextProps.normalScore}`
    });
  }
  
  return shouldSkipUpdate;
});

export default MachineCard;
