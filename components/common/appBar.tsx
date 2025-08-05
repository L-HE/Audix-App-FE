// ./components/common/appBar.tsx
import { useSegments } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { areaData } from '../../assets/data/areaData';
import { Colors } from '../../shared/styles/global';
import SearchInput from '../screens/searchInput';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const APPBAR_HEIGHT_RATIO = 0.13; // 화면 높이의 13%
const MARGIN_BOTTOM_RATIO = 0.015; // 화면 높이의 1.5%
const TITLE_FONT_RATIO = 0.025; // 화면 높이의 2.5%

const APPBAR_HEIGHT = SCREEN_HEIGHT * APPBAR_HEIGHT_RATIO;
const MARGIN_BOTTOM = SCREEN_HEIGHT * MARGIN_BOTTOM_RATIO;
const TITLE_FONT_SIZE = SCREEN_HEIGHT * TITLE_FONT_RATIO;

interface AppBarProps {
  currentId?: string; // _layout.tsx에서 전달받는 id
}

const AppBar: React.FC<AppBarProps> = ({ currentId }) => {
  const segments = useSegments();
  
  // 화면별 설정 객체
  const getScreenConfig = () => {
    if (segments[1] === 'detail' && currentId) {
      const currentArea = areaData.find(a => a.id === currentId);
      return {
        title: currentArea ? currentArea.title : '장비 상세',
        showSearch: true,
        placeholder: '장비를 검색하세요'
      };
    } else if (segments[1] === 'alarms') {
      return {
        title: '알림 목록',
        showSearch: false,
        placeholder: ''
      };
    } else if (segments[1] === 'menu') {
      return {
        title: '메뉴',
        showSearch: false,
        placeholder: ''
      };
    } else {
      return {
        title: '전체 관리 구역',
        showSearch: true,
        placeholder: '구역을 검색하세요'
      };
    }
  };

  const config = getScreenConfig();
  
  return (
    <View style={[
      styles.appBar, 
      !config.showSearch && styles.appBarCompact
    ]}>
      <Text style={[
        styles.title,
        !config.showSearch && styles.titleCentered
      ]}>
        {config.title}
      </Text>
      {config.showSearch && (
        <SearchInput placeholder={config.placeholder} />
      )}
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
  appBarCompact: {
    height: APPBAR_HEIGHT * 0.6,
  },
  title: {
    marginBottom: 12,
    fontSize: TITLE_FONT_SIZE,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  titleCentered: {
    marginBottom: 0, // 검색이 없을 때 하단 마진 제거
  },
});
