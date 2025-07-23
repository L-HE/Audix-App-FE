// components/common/header.tsx
import { Ionicons } from '@expo/vector-icons';
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

// 비율 상수 (필요시 조정)
const HEADER_HEIGHT_RATIO = 0.07;
const LOGO_RATIO = 0.4;
const PADDING_TOP_RATIO = 0.2;
const ICON_RATIO = 0.06;
const ICON_HORIZONTAL_PADDING_RATIO = 0.02;

const HEADER_HEIGHT = SCREEN_HEIGHT * HEADER_HEIGHT_RATIO;
const LOGO_SIZE = SCREEN_WIDTH * LOGO_RATIO;
const ICON_SIZE = SCREEN_WIDTH * ICON_RATIO;
const ICON_BUTTON_WIDTH = ICON_SIZE + SCREEN_WIDTH * ICON_HORIZONTAL_PADDING_RATIO * 2;

const Header: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <View style={styles.header}>
        {/* spacer: logo를 가운데 붙이기 위함 */}
        <View style={styles.spacer} />

        {/* 중앙 로고 */}
        <Image
          source={require('../../assets/images/AudixLogoNavy.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* 오른쪽 벨 아이콘 */}
        <TouchableOpacity
          style={styles.iconButton}
          activeOpacity={0.7}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="notifications-outline" size={ICON_SIZE} color="#656565" />
        </TouchableOpacity>
      </View>

      {/* 임시 알림 모달 */}
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
    width: ICON_BUTTON_WIDTH, // 왼쪽에 빈 공간
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
  iconButton: {
    width: ICON_BUTTON_WIDTH,
    height: ICON_BUTTON_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
