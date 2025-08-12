// ./components/common/appBar.tsx
import { useSegments } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { areaData } from '../../assets/data/areaData';
import { AppBarStyles as style } from '../../shared/styles/components';
import SearchInput from '../screens/searchInput';

// ========================================
// AppBar Props 타입 정의
// - _layout.tsx에서 현재 화면의 id를 전달받을 수 있음
// ========================================
interface AppBarProps {
  currentId?: string; 
}

// ========================================
// AppBar 컴포넌트
// - 상단에 타이틀과 검색창을 표시
// - 현재 화면의 종류에 따라 타이틀/검색창 여부/placeholder 문구를 변경
// ========================================
const AppBar: React.FC<AppBarProps> = ({ currentId }) => {
  // 현재 라우트의 경로 세그먼트 배열
  // 예: /tabs/detail/123 → ['tabs', 'detail', '123']
  const segments = useSegments();
  
  // ----------------------------------------
  // 현재 화면의 설정을 반환하는 함수
  // - 화면 종류별 타이틀 / 검색창 표시 여부 / placeholder 지정
  // ----------------------------------------
  const getScreenConfig = () => {
    // 1) detail 화면 + currentId가 있는 경우 (장비 상세 화면)
    if (segments[1] === 'detail' && currentId) {
      // 현재 id에 해당하는 구역 데이터 조회
      const currentArea = areaData.find(a => a.id === currentId);

      return {
        title: currentArea ? currentArea.title : '장비 상세', // 해당 장비명 또는 기본 타이틀
        showSearch: true,                                   // 검색창 표시
        placeholder: '장비를 검색하세요'                    // 검색창 안내 문구
      };
    } 
    // 2) 알림 목록 화면
    else if (segments[1] === 'alarms') {
      return {
        title: '알림 목록',
        showSearch: false,  // 검색창 숨김
        placeholder: ''
      };
    } 
    // 3) 메뉴 화면
    else if (segments[1] === 'menu') {
      return {
        title: '메뉴',
        showSearch: false,
        placeholder: ''
      };
    } 
    // 4) 그 외 화면 (예: 전체 관리 구역)
    else {
      return {
        title: '전체 관리 구역',
        showSearch: true,
        placeholder: '구역을 검색하세요'
      };
    }
  };

  // 현재 화면 설정값 가져오기
  const config = getScreenConfig();
  
  // ----------------------------------------
  // 렌더링
  // - showSearch가 false면 compact 스타일 적용 + 타이틀 가운데 정렬
  // - showSearch가 true면 SearchInput 컴포넌트 표시
  // ----------------------------------------
  return (
    <View style={[
      style.appBar, 
      !config.showSearch && style.appBarCompact
    ]}>
      {/* 타이틀 */}
      <Text style={[
        style.title,
        !config.showSearch && style.titleCentered
      ]}>
        {config.title}
      </Text>

      {/* 검색창 */}
      {config.showSearch && (
        <SearchInput placeholder={config.placeholder} />
      )}
    </View>
  );
};

export default AppBar;
