// components/common/Header.tsx
import { HeaderStyles } from '@/shared/styles/components';
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
    <View style={HeaderStyles.header}>
      {/* 왼쪽: 뒤로 버튼 or spacer */}
      {canGoBack ? (
        <TouchableOpacity
          onPress={() => router.back()}
          style={HeaderStyles.iconButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" style={HeaderStyles.backIcon} />
        </TouchableOpacity>
      ) : (
        <View style={HeaderStyles.spacer} />
      )}

      {/* 중앙 로고 */}
      <Image
        source={require('../../assets/images/logos/AudixLogoNavy.png')}
        style={HeaderStyles.logo}
        resizeMode="contain"
      />

      <View style={HeaderStyles.spacer} />
    </View>
  );
};

export default Header;