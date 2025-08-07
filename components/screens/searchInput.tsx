// ./components/screens/SearchInput.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, TextInput, View } from 'react-native';
import { SearchInputStyles } from '../../shared/styles/components';
import { Colors } from '../../shared/styles/global';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 비율 상수
const SEARCH_WIDTH_RATIO = 0.65;
const SEARCH_HEIGHT_RATIO = 0.045; // 화면 높이의 4.5%
const PADDING_RATIO = 0.043;
const PLACEHOLDER_FONT_RATIO = 0.015; // 화면 높이의 1.5%

const SEARCH_WIDTH = SCREEN_WIDTH * SEARCH_WIDTH_RATIO;
const SEARCH_HEIGHT = SCREEN_HEIGHT * SEARCH_HEIGHT_RATIO;
const HORIZONTAL_PADDING = SEARCH_WIDTH * PADDING_RATIO;
const PLACEHOLDER_FONT_SIZE = SCREEN_HEIGHT * PLACEHOLDER_FONT_RATIO;
const ICON_SIZE = SEARCH_HEIGHT * 0.5; // 아이콘 크기

interface SearchInputProps {
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ placeholder }) => (
  <View style={SearchInputStyles.container}>
    <Ionicons 
      name="search" 
      size={ICON_SIZE} 
      color={Colors.textSecondary} 
      style={SearchInputStyles.icon}
    />
    <TextInput
      placeholder={placeholder}
      style={SearchInputStyles.input}
      placeholderTextColor={Colors.textSecondary}
    />
  </View>
);

export default SearchInput;