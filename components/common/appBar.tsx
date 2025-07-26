// ./components/common/appBar.tsx
import { useSegments } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import SearchInput from '../screens/searchInput';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// 비율 상수 (필요시 조정)
const APPBAR_HEIGHT_RATIO = 0.02;        // 화면 높이의 약 2%
const MARGIN_TOP_RATIO = 0.04;           // 화면 높이의 약 4%
const MARGIN_BOTTOM_RATIO = 0.04;        // 화면 높이의 약 4%

const APPBAR_HEIGHT = SCREEN_HEIGHT * APPBAR_HEIGHT_RATIO;
const MARGIN_TOP    = SCREEN_HEIGHT * MARGIN_TOP_RATIO;
const MARGIN_BOTTOM = SCREEN_HEIGHT * MARGIN_BOTTOM_RATIO;

const AppBar: React.FC = () => {
  const segments = useSegments();
  // segments[0] === 'detail' 이면 detail/[id] 스크린
  const placeholder =
    segments[0] === 'detail'
      ? '장비를 검색하세요'
      : '구역을 검색하세요';

  return (
    <View style={styles.appBar}>
      <SearchInput placeholder={placeholder} />
    </View>
  );
};

export default AppBar;

const styles = StyleSheet.create({
  appBar: {
    height: APPBAR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: MARGIN_TOP,
    marginBottom: MARGIN_BOTTOM,
  },
});
