// ./components/screens/SearchInput.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TextInput, View } from 'react-native';
import { SEARCH_ICON_SIZE, SearchInputStyles as style } from '../../shared/styles/components';
import { Colors } from '../../shared/styles/global';

interface SearchInputProps {
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ placeholder }) => (
  <View style={style.container}>
    <Ionicons 
      name="search" 
      size={SEARCH_ICON_SIZE} 
      color={Colors.textSecondary} 
      style={style.icon}
    />
    <TextInput
      placeholder={placeholder}
      style={style.input}
      placeholderTextColor={Colors.textSecondary}
    />
  </View>
);

export default SearchInput;