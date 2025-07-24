// components/common/Header.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import NotificationModal from '../../app/notificationModal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get('window');

const HEADER_HEIGHT_RATIO = 0.07;
const LOGO_RATIO = 0.4;
const PADDING_TOP_RATIO = 0.2;
const ICON_RATIO = 0.06;
const ICON_HORIZONTAL_PADDING_RATIO = 0.02;

const HEADER_HEIGHT = SCREEN_HEIGHT * HEADER_HEIGHT_RATIO;
const LOGO_SIZE    = SCREEN_WIDTH * LOGO_RATIO;
const ICON_SIZE    = SCREEN_WIDTH * ICON_RATIO;
const ICON_BTN_W   = ICON_SIZE + SCREEN_WIDTH * ICON_HORIZONTAL_PADDING_RATIO * 2;

const Header: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const segments = useSegments();
  const canGoBack = segments.length > 1;  // 루트(segments length=1)일 땐 false

  return (
    <>
      <View style={styles.header}>
        {/* 왼쪽: 뒤로 버튼 or spacer */}
        {canGoBack ? (
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={ICON_SIZE} color="#656565" />
          </TouchableOpacity>
        ) : (
          <View style={styles.spacer} />
        )}

        {/* 중앙 로고 */}
        <Image
          source={require('../../assets/images/AudixLogoNavy.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* 오른쪽 알림 버튼 */}
        <TouchableOpacity
          style={styles.iconButton}
          activeOpacity={0.7}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="notifications-outline" size={ICON_SIZE} color="#656565" />
        </TouchableOpacity>
      </View>

      {/* 알림 모달 */}
      <NotificationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        status="warning"
        regionName="A-2 구역"
        regionLocation="2층 자동차 부재료 조립 구역"
        equipmentCode="VT-450"
      />
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: HEADER_HEIGHT * PADDING_TOP_RATIO,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    backgroundColor: '#fff',
  },
  spacer: {
    width: ICON_BTN_W,
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
  iconButton: {
    width: ICON_BTN_W,
    height: ICON_BTN_W,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
