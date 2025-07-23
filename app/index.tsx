// app/index.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { cards } from '../assets/data/areaData';
import AreaCard from '../components/screens/areaCard';
import SearchInput from '../components/screens/searchInput';

export const headerShown = false;

const AreaScreen: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* Search Bar */}
      <SearchInput />

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
  body: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
});
