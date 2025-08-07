import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { AreaCardProps } from '../../assets/data/areaData';
import { AreaCardStyles } from '../../shared/styles/components';
import { getBorderColor } from '../../shared/styles/global';

const AreaCard: React.FC<AreaCardProps> = ({ title, subtitle, image, state, onPress }) => {
  const borderColor = getBorderColor(state);
  
  return (
    <TouchableOpacity style={[AreaCardStyles.card, { borderColor }]} onPress={onPress}>
      <Image source={image} style={AreaCardStyles.cardImage} />
      <View style={AreaCardStyles.textContainer}>
        <Text style={AreaCardStyles.cardTitle}>{title}</Text>
        <Text style={AreaCardStyles.cardSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default AreaCard;
