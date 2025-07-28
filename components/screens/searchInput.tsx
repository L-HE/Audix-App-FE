// ./components/screens/SearchInput.tsx
import React from 'react';
import { Dimensions, StyleSheet, TextInput } from 'react-native';
import { Colors } from '../../shared/styles/global';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 비율 상수
const SEARCH_WIDTH_RATIO = 0.65;
const SEARCH_HEIGHT_RATIO = 0.06;
const PADDING_RATIO = 0.043;
const PLACEHOLDER_FONT_RATIO = 0.018; // 화면 높이의 1.8%

const SEARCH_WIDTH = SCREEN_WIDTH * SEARCH_WIDTH_RATIO;
const SEARCH_HEIGHT = SCREEN_HEIGHT * SEARCH_HEIGHT_RATIO;
const HORIZONTAL_PADDING = SEARCH_WIDTH * PADDING_RATIO;
const PLACEHOLDER_FONT_SIZE = SCREEN_HEIGHT * PLACEHOLDER_FONT_RATIO;

interface SearchInputProps {
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ placeholder }) => (
  <TextInput
    placeholder={placeholder}
    style={styles.input}
  />
);

export default SearchInput;

const styles = StyleSheet.create({
  input: {
    width: SEARCH_WIDTH,
    height: SEARCH_HEIGHT,
    backgroundColor: Colors.background,
    borderRadius: SEARCH_HEIGHT * 0.22,
    paddingHorizontal: HORIZONTAL_PADDING,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: PLACEHOLDER_FONT_SIZE, // 반응형 폰트 사이즈
  },
});