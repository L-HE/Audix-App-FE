// components/screens/machineCard.tsx
import React from 'react';
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PieChart from '../screens/pieChart';

export interface MachineCardProps {
  id: string;
  machineId: string;
  image: ImageSourcePropType;
  state: 'danger' | 'warning' | 'normal' | string;
  location: string;
  owner: string;
  percent: number; // 0~100
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_PADDING = 12;
const SPACING = 8;
const IMAGE_SIZE = SCREEN_WIDTH * 0.2;

// 상태에 따른 테두리 색
const getBorderColor = (state: string) => {
  switch (state) {
    case 'danger':
      return '#FF3116';
    case 'warning':
      return '#FFC525';
    case 'normal':
      return '#1CAA00';
    default:
      return '#D7D7D7';
  }
};

const sample = [
  { value: 15, color: '#222' },
  { value: 25, color: '#555' },
  { value: 30, color: '#888' },
  { value: 20, color: '#BBB' },
  { value: 10, color: '#DDD' },
];

const MachineCard: React.FC<MachineCardProps> = ({
  image,
  state,
  location,
  owner,
}) => {
  const borderColor = getBorderColor(state);
  // const remaining = 100 - percent;

  return (
    <View style={[styles.card, { borderColor }]}>      
      {/* (1) 이미지 + 도넛 차트 */}
      <View style={styles.topRow}>
        <Image source={image} style={styles.image} />

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
		      <PieChart series={sample} />
		    </View>
      </View>

      {/* (2) 위치 & 담당자 */}
      <View style={styles.infoColumn}>
        <Text style={styles.infoText}>위치: {location}</Text>
        <Text style={styles.infoText}>담당자: {owner}</Text>
      </View>
    </View>
  );
};

export default MachineCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    padding: CARD_PADDING,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING,
    justifyContent: 'space-around',
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 4,
  },
  infoColumn: {
    flexDirection: 'column',
    paddingHorizontal: CARD_PADDING * 0.5,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: SPACING / 2,
  },
});
