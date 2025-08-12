// components/common/Header.tsx
import { BACK_ICON_SIZE, HeaderStyles as style } from '@/shared/styles/components';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

/**
 * 상단 헤더 컴포넌트
 * - 좌측: 뒤로가기 버튼(가능할 때만) 또는 자리 맞춤용 spacer
 * - 중앙: 앱 로고
 * - 우측: spacer (좌우 균형 유지)
 */
const Header: React.FC = () => {
  // 네비게이션/경로 세그먼트
  const router = useRouter();
  const segments = useSegments();

  /**
   * 뒤로가기 가능 여부
   * - 세그먼트 길이가 2 초과면 (예: /tabs/detail/123) 뒤로가기 표시
   */
  const canGoBack = segments.length > 2;

  // 렌더
  return (
    <View style={style.header}>
      {/* 좌측 영역: 뒤로 버튼 or spacer */}
      {canGoBack ? (
        <TouchableOpacity
          onPress={() => router.back()}
          style={style.iconButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="뒤로가기"
        >
          <Ionicons name="arrow-back" size={BACK_ICON_SIZE} style={style.backIcon} />
        </TouchableOpacity>
      ) : (
        <View style={style.spacer} />
      )}

      {/* 중앙 영역: 로고 이미지 */}
      <Image
        source={require('../../assets/images/logos/AudixLogoNavy.png')}
        style={style.logo}
        resizeMode="contain"
        accessible
        accessibilityLabel="Audix 로고"
      />

      {/* 우측 영역: spacer (좌/우 균형 맞춤) */}
      <View style={style.spacer} />
    </View>
  );
};

export default Header;
