// components/screens/machineCard.tsx

import React from 'react';
import {
    Image,
    ImageSourcePropType,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export interface MachineCardProps {
  id: string;
  name: string;
  info: string;
  image: ImageSourcePropType;
}

const MachineCard: React.FC<MachineCardProps> = ({
  name,
  info,
  image,
}) => {
  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.subtitle}>{info}</Text>
      </View>
    </View>
  );
};

export default MachineCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  textContainer: {
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
});
