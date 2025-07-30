// components/screens/MachineCard.tsx
import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Machine } from '../../assets/data/machineData';
import { Colors, getBorderColor } from '../../shared/styles/global';
import VDonutChart from './vDonutChart';

const MachineCard: React.FC<Machine> = ({
  machineId,
  image,
  name,
  model,
  location,
  owner,
  state,
}) => {
  const borderColor = getBorderColor(state);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.card, { borderColor }]}>
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
          <View>
            <VDonutChart machineId={String(machineId)} />
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
    marginRight: 12 
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
