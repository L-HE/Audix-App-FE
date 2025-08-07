// ./components/screens/SearchInput.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, StyleSheet, TextInput, View } from 'react-native';
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
  <View style={styles.container}>
    <Ionicons 
      name="search" 
      size={ICON_SIZE} 
      color={Colors.textSecondary} 
      style={styles.icon}
    />
    <TextInput
      placeholder={placeholder}
      style={styles.input}
      placeholderTextColor={Colors.textSecondary}
    />
  </View>
);

export default SearchInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: SEARCH_WIDTH,
    height: SEARCH_HEIGHT,
    backgroundColor: Colors.background,
    borderRadius: SEARCH_HEIGHT * 0.5,
    paddingHorizontal: HORIZONTAL_PADDING,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: PLACEHOLDER_FONT_SIZE, // 반응형 폰트 사이즈
    color: Colors.textPrimary,
  },
});