import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { AreaCardProps } from '../../assets/data/areaData';
import { getBorderColor } from '../../shared/styles/colors';
import { AreaCardStyles as style } from '../../shared/styles/components';

// 지역/구역 카드를 렌더링하는 컴포넌트
const AreaCard: React.FC<AreaCardProps> = ({ title, subtitle, image, state, onPress }) => {
  // 현재 state에 맞는 border 색상 계산
  const borderColor = getBorderColor(state);
  
  return (
    // 전체 카드 터치 영역
    <TouchableOpacity
      style={[style.card, { borderColor }]} // 스타일 + 테두리 색상 적용
      onPress={onPress} // 터치 시 실행될 함수
    >
      {/* 카드 이미지 */}
      <Image source={image} style={style.cardImage} />

      {/* 텍스트 영역 */}
      <View style={style.textContainer}>
        <Text style={style.cardTitle}>{title}</Text>
        <Text style={style.cardSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default AreaCard;
