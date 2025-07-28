// ./components/common/appBar.tsx
import { useSegments } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { area } from '../../assets/data/areaData';
import { Colors } from '../../shared/styles/global';
import SearchInput from '../screens/searchInput';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const APPBAR_HEIGHT_RATIO = 0.15; // 화면 높이의 15%
const MARGIN_BOTTOM_RATIO = 0.0001; // 화면 높이의 0.01%
const TITLE_FONT_RATIO = 0.025; // 화면 높이의 2.5%

const APPBAR_HEIGHT = SCREEN_HEIGHT * APPBAR_HEIGHT_RATIO;
const MARGIN_BOTTOM = SCREEN_HEIGHT * MARGIN_BOTTOM_RATIO;
const TITLE_FONT_SIZE = SCREEN_HEIGHT * TITLE_FONT_RATIO;

interface AppBarProps {
  currentId?: string; // _layout.tsx에서 전달받는 id
}

const AppBar: React.FC<AppBarProps> = ({ currentId }) => {
  // segments[0]이 'detail'이면 장비 검색, 아니면 구역 검색
  const segments = useSegments();
  
  // detail 스크린일 때 해당 id의 title 찾기
  const getTitle = () => {
    if (segments[0] === 'detail' && currentId) {
      const currentArea = area.find(a => a.id === currentId);
      return currentArea ? currentArea.title : '장비 상세';
    } else {
      // 루트 화면일 때 전체 관리 구역
      return '전체 관리 구역';
    }
  };

  const placeholder =
    segments[0] === 'detail'
      ? '장비를 검색하세요'
      : '구역을 검색하세요';
  
  return (
    <View style={styles.appBar}>
      <Text style={styles.title}>
        {getTitle()}
      </Text>
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
    backgroundColor: Colors.background,
    marginBottom: MARGIN_BOTTOM,
    paddingHorizontal: 16,
  },
  title: {
    marginBottom: 8,
    fontSize: TITLE_FONT_SIZE,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
