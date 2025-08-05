// components/screens/MachineCard.tsx
import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { CardState } from '../../assets/data/areaData';
import { Machine } from '../../assets/data/machineData';
import { Colors, getBorderColor } from '../../shared/styles/global';
import VDonutChart from './vDonutChart';

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
  const imageSource = React.useMemo(() => 
    image ? { uri: image } : require('../../assets/images/logos/AudixLogoNavy.png'), 
    [image]
  );

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
            <VDonutChart deviceId={String(deviceId)} normalScore={normalScore} status={status} name={name} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}, (prevProps, nextProps) => {
  // 핵심 데이터만 비교하여 리렌더링 결정
  return (
    prevProps.status === nextProps.status &&
    prevProps.normalScore === nextProps.normalScore
  );
});

export default MachineCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  flex1: {
    flex: 1,
    flexDirection: 'column'
  },
  image: {
    width: 120,
    height: 120,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: Colors.backgroundSecondary,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  subName: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4
  },
  flex3: {
    marginTop: 12
  },
  infoText: {
    fontSize: 14,
    color: Colors.textTertiary,
    marginTop: 2
  },
});
