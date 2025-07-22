// app/index.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { cards } from '../assets/data/areaData';
import AreaCard from '../components/screens/areaCard';

export const headerShown = false;

const AreaScreen: React.FC = () => {
  const router = useRouter();


  return (
    <View style={styles.container}>

      {/* Search Bar */}
      <View style={styles.appBar}>
        <TextInput
          placeholder="검색어를 입력하세요"
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
    marginBottom: 30,
  },
  searchInput: {
    width: 279,
    height: 36,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#656565',
  },
  body: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
});
