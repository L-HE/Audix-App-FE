// components/screens/MachineCard.tsx
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Machine } from '../../assets/data/machineData';
import VDonutChart from './vDonutChart';

const orderColor: Record<Machine['state'], string> = {
  danger: '#e74c3c',
  warning: '#f1c40f',
  normal: '#2ecc71',
  unknown: '#ccc',
};

const sampleData = [
  { x: 'Android', y: 40 },
  { x: 'iOS',      y: 30 },
  { x: 'Web',      y: 20 },
  { x: 'Others',   y: 10 },
];

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
            <View style={styles.flex3}>
                <Text style={styles.infoText}>위치: {location}</Text>
                <Text style={styles.infoText}>담당자: {owner}</Text>
            </View>
        </View>
        <View style={styles.flex2}>
          <VDonutChart
            data={sampleData}
            colors={['#5E35B1', '#1E88E5', '#43A047', '#FDD835']}
            innerRadius={140}
          />
        </View>
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
  flex1: { flex: 1, flexDirection: 'column' },
  image: { width: 120, height: 120, marginRight: 12 },
  name: { fontSize: 16, fontWeight: 'bold' },
  subName: { fontSize: 14, color: '#777', marginTop: 4 },

  flex2: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },

  flex3: { marginTop: 12 },
  infoText: { fontSize: 14, color: '#555', marginTop: 2 },
});
