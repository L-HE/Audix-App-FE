// components/screens/MachineCard.tsx
import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Machine } from '../../assets/data/machineData';
import { CardState } from '../../assets/data/areaData';
import { Colors, getBorderColor } from '../../shared/styles/global';
import VDonutChart from './vDonutChart';

const MachineCard: React.FC<Machine> = ({
  deviceId,
  name,
  explain,
  address,
  deviceManager,
  status,
  image,
  normalScore
}) => {
  const borderColor = getBorderColor(status as CardState);

  // 이미지 처리
  const imageSource = image ? { uri: image } : require('../../assets/images/logos/AudixLogoNavy.png');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.card, { borderColor }]}>
        <View style={styles.row}>
          <View style={styles.flex1}>
            <Image source={imageSource} style={styles.image} resizeMode="cover" />
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
};

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
