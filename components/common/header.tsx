// components/common/Header.tsx
import { BACK_ICON_SIZE, HeaderStyles as style } from '@/shared/styles/components';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';
import React from 'react';
import {
  Image,
  TouchableOpacity,
  View
} from 'react-native';

const Header: React.FC = () => {
  const router = useRouter();
  const segments = useSegments();
  const canGoBack = segments.length > 2;

  return (
    <View style={style.header}>
      {/* 왼쪽: 뒤로 버튼 or spacer */}
      {canGoBack ? (
        <TouchableOpacity
          onPress={() => router.back()}
          style={style.iconButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={BACK_ICON_SIZE} style={style.backIcon} />
        </TouchableOpacity>
      ) : (
        <View style={style.spacer} />
      )}

      {/* 중앙 로고 */}
      <Image
        source={require('../../assets/images/logos/AudixLogoNavy.png')}
        style={style.logo}
        resizeMode="contain"
      />

      <View style={style.spacer} />
    </View>
  );
};

export default Header;