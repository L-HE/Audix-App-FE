// app/index.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { area } from '../assets/data/areaData';
import AreaCard from '../components/screens/areaCard';

export const headerShown = false;

const AreaScreen: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* Card List */}
      <ScrollView contentContainerStyle={styles.body}>
        {area.map(item => (
          <AreaCard
            key={item.state}
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
  body: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
});
