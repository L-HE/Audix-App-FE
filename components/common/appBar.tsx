// ./components/common/appBar.tsx
import { useSegments } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { areaData } from '../../assets/data/areaData';
import { AppBarStyles as style } from '../../shared/styles/components';
import SearchInput from '../screens/searchInput';

// _layout.tsx에서 전달받는 id
interface AppBarProps {
  currentId?: string; 
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
      style.appBar, 
      !config.showSearch && style.appBarCompact
    ]}>
      <Text style={[
        style.title,
        !config.showSearch && style.titleCentered
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
