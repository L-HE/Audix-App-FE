import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AreaCardProps } from '../../assets/data/areaData';
import { Colors, getBorderColor } from '../../shared/styles/global';

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
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 2,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
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
    color: Colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
