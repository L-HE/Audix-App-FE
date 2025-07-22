import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type CardState = 'danger' | 'warning' | 'normal' | 'unknown';

export interface AreaCardProps {
  id: string;
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
  state: CardState;
  onPress: () => void;
}

const getBorderColor = (state: CardState): string => {
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

const AreaCard: React.FC<AreaCardProps> = ({ title, subtitle, image, state, onPress }) => {
  const borderColor = getBorderColor(state);
  return (
    <TouchableOpacity style={[styles.card, { borderColor }]} onPress={onPress}>
      <Image source={image} style={styles.cardImage} />
      <View style={styles.textContainer}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default AreaCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});
