import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { AreaCardProps } from '../../assets/data/areaData';
import { AreaCardStyles as style } from '../../shared/styles/components';
import { getBorderColor } from '../../shared/styles/global';

const AreaCard: React.FC<AreaCardProps> = ({ title, subtitle, image, state, onPress }) => {
  const borderColor = getBorderColor(state);
  
  return (
    <TouchableOpacity style={[style.card, { borderColor }]} onPress={onPress}>
      <Image source={image} style={style.cardImage} />
      <View style={style.textContainer}>
        <Text style={style.cardTitle}>{title}</Text>
        <Text style={style.cardSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default AreaCard;
