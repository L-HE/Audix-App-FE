// ./components/screens/SearchInput.tsx
import { Ionicons } from '@expo/vector-icons'; // Ionicons 아이콘 라이브러리
import React from 'react';
import { TextInput, View } from 'react-native';
import { Colors } from '../../shared/styles/colors'; // 전역 색상
import { SEARCH_ICON_SIZE, SearchInputStyles as style } from '../../shared/styles/components'; // 검색창 스타일 & 아이콘 크기

// SearchInput 컴포넌트 Props 타입 정의
interface SearchInputProps {
  placeholder?: string; // 입력창 플레이스홀더 텍스트
}

// 검색 입력창 컴포넌트
const SearchInput: React.FC<SearchInputProps> = ({ placeholder }) => (
  // ===== 검색창 컨테이너 =====
  <View style={style.container}>
    {/* 🔍 검색 아이콘 */}
    <Ionicons 
      name="search" 
      size={SEARCH_ICON_SIZE} 
      color={Colors.textSecondary} 
      style={style.icon}
    />

    {/* ✏️ 텍스트 입력창 */}
    <TextInput
      placeholder={placeholder} // 플레이스홀더 텍스트
      style={style.input} // 입력창 스타일
      placeholderTextColor={Colors.textSecondary} // 플레이스홀더 색상
    />
  </View>
);

export default SearchInput;
