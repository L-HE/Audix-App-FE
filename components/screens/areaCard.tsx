// components/screens/areaCard.tsx - API 응답에 맞춘 props 구조

import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { getBorderColor } from '../../shared/styles/colors';
import { AreaCardStyles as style } from '../../shared/styles/components';
import { BASE_URL } from '../../shared/api/config';

// AreaCard Props 타입 정의 (API 응답 구조에 맞춤)
export interface AreaCardProps {
  id: number;
  name: string;
  address: string;
  explain: string;
  status: 'normal' | 'warning' | 'danger';
  image: string;
  created_at: string;
  updated_at: string;
  onPress: () => void;
}

// 지역/구역 카드를 렌더링하는 컴포넌트
const AreaCard: React.FC<AreaCardProps> = ({
  id,
  name,
  address,
  explain,
  status,
  image,
  onPress
}) => {
  // 현재 status에 맞는 border 색상 계산
  const borderColor = getBorderColor(status);

  // 이미지 URL 처리
  const imageSource = image
    ? { uri: `${BASE_URL}${image}` }
    : require('../../assets/images/logos/AudixLogoNavy.png'); // fallback 이미지

  return (
    // 전체 카드 터치 영역
    <TouchableOpacity
      style={[style.card, { borderColor }]} // 스타일 + 테두리 색상 적용
      onPress={onPress} // 터치 시 실행될 함수
    >
      {/* 카드 이미지 */}
      <Image source={imageSource} style={style.cardImage} />

      {/* 텍스트 영역 */}
      <View style={style.textContainer}>
        <Text style={style.cardTitle}>{name}</Text>
        <Text style={style.cardSubtitle}>{address}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default AreaCard;