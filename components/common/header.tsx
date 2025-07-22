// components/common/header.tsx
import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 비율 상수 (필요시 조정)
const HEADER_HEIGHT_RATIO = 0.115;
const LOGO_RATIO = 0.4;
const PADDING_TOP_RATIO = 0.45;

const HEADER_HEIGHT = SCREEN_HEIGHT * HEADER_HEIGHT_RATIO;
const LOGO_SIZE = SCREEN_WIDTH * LOGO_RATIO;

const Header: React.FC = () => (
  <View style={styles.header}>
    <Image
      source={require('../../assets/images/AudixLogoNavy.png')}
      style={styles.logo}
      resizeMode="contain"
    />
  </View>
);

export default Header;

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: HEADER_HEIGHT * PADDING_TOP_RATIO,
    backgroundColor: '#fff',
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
});
