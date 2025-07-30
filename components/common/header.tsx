// components/common/Header.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';
import React from 'react';
import { Dimensions, Image, TouchableOpacity, View } from 'react-native';
import { useModal } from '../../shared/api/modalContextApi';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get('window');
const ICON_SIZE = SCREEN_WIDTH * 0.06;
const LOGO_SIZE = SCREEN_WIDTH * 0.4;
const ICON_BTN_W = ICON_SIZE + (SCREEN_WIDTH * 0.02 * 2);

const Header: React.FC = () => {
  const { setModalVisible } = useModal();
  const router = useRouter();
  const segments = useSegments();
  const canGoBack = segments.length > 1;

  const handleNotificationPress = () => {
    setModalVisible(true);
  };

  return (
    <View className="header-container">
      {/* 왼쪽: 뒤로 버튼 or spacer */}
      {canGoBack ? (
        <TouchableOpacity
          className="header-icon-button active:opacity-70"
          style={{ width: ICON_BTN_W, height: ICON_BTN_W }}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={ICON_SIZE}
            color="var(--color-border)"
          />
        </TouchableOpacity>
      ) : (
        <View style={{ width: ICON_BTN_W }} />
      )}

      {/* 중앙 로고 */}
      <Image
        source={require('../../assets/images/AudixLogoNavy.png')}
        style={{resizeMode: 'contain'}}
        className='header-logo'
      />

      {/* 오른쪽 알림 버튼 */}
      <TouchableOpacity
        className="header-icon-button active:opacity-70"
        style={{ width: ICON_BTN_W, height: ICON_BTN_W }}
        onPress={handleNotificationPress}
      >
        <Ionicons
          name="notifications-outline"
          size={ICON_SIZE}
          color="var(--color-border)"
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;