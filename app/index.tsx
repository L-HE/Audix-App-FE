// app/index.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { cards } from '../assets/data/areaData';
import AreaCard from '../components/screens/areaCard';

export const headerShown = false;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 비율 상수 (필요시 조정)
const SEARCH_WIDTH_RATIO = 0.6;
const SEARCH_HEIGHT_RATIO = 0.045;
const PADDING_RATIO       = 0.043; // 원래 12px/279px 비율

const SEARCH_WIDTH  = SCREEN_WIDTH * SEARCH_WIDTH_RATIO;
const SEARCH_HEIGHT = SCREEN_HEIGHT * SEARCH_HEIGHT_RATIO;
const HORIZONTAL_PADDING = SEARCH_WIDTH * PADDING_RATIO;

const AreaScreen: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* Search Bar */}
      <View style={styles.appBar}>
        <TextInput
          placeholder="구역을 검색하세요"
          style={styles.searchInput}
        />
      </View>

      {/* Card List */}
      <ScrollView contentContainerStyle={styles.body}>
        {cards.map(item => (
          <AreaCard
            key={item.id}
            {...item}
            onPress={() =>
              router.push({ pathname: '/detail/[id]', params: { id: item.id } })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default AreaScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  appBar: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 10,
    marginBottom: 20,
  },
  searchInput: {
    width: SEARCH_WIDTH,
    height: SEARCH_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: SEARCH_HEIGHT * 0.22,  // 높이의 22%
    paddingHorizontal: HORIZONTAL_PADDING,
    borderWidth: 1,
    borderColor: '#656565',
  },
  body: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
});
