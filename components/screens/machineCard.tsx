// components/screens/MachineCard.tsx
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Machine } from '../../assets/data/machineData';
import DonutChart from './donutChart';

const orderColor: Record<Machine['state'], string> = {
  danger: '#e74c3c',
  warning: '#f1c40f',
  normal: '#2ecc71',
  unknown: '#ccc',
};

const MachineCard: React.FC<Machine> = ({
  image,
  name,
  model,
  percent,
  location,
  owner,
  state,
}) => {
  return (
    <View style={[styles.card, { borderColor: orderColor[state] }]}>
      <View style={styles.row}>
        <View style={styles.flex1}>
          <Image source={image} style={styles.image} resizeMode="contain" />
          <View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.subName}>{model}</Text>
          </View>
        </View>
        <View style={styles.flex2}>
          <DonutChart percent={percent} />
        </View>
      </View>
      <View style={styles.flex3}>
        <Text style={styles.infoText}>위치: {location}</Text>
        <Text style={styles.infoText}>담당자: {owner}</Text>
      </View>
    </View>
  );
};

export default MachineCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  flex1: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  image: { width: 100, height: 100, marginRight: 12 },
  name: { fontSize: 16, fontWeight: 'bold' },
  subName: { fontSize: 14, color: '#777', marginTop: 4 },

  flex2: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },

  flex3: { marginTop: 12 },
  infoText: { fontSize: 14, color: '#555', marginTop: 2 },
});
