// app/index.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { cards } from '../assets/data/areaData';
import AreaCard from '../components/screens/areaCard';

export const headerShown = false;

const AreaScreen: React.FC = () => {
  const router = useRouter();

  // Ionicons 가 허용하는 정확한 name 타입을 추출
  type IconName = React.ComponentProps<typeof Ionicons>['name'];

  // tabs 배열에 icon: IconName 으로 타입을 강제
  const tabs: { icon: IconName; label: string; action?: () => void }[] = [
    { icon: 'map-outline',        label: 'Area',   action: () => router.push('/') },
    { icon: 'notifications-outline', label: 'Alarm' },
    { icon: 'person-outline',     label: 'My'    },
    { icon: 'people-outline',     label: 'Team'  },
    { icon: 'settings-outline',   label: 'Setting' },
  ];


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../assets/images/AudixLogoNavy.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Search Bar */}
      <View style={styles.appBar}>
        <TextInput
          placeholder="검색어를 입력하세요"
          style={styles.searchInput}
        />
      </View>

      {/* Card List */}
      <ScrollView contentContainerStyle={styles.body}>
        {cards.map((item) => (
          <AreaCard
            key={item.id}
            {...item}
            onPress={() =>
              router.push({
                pathname: '/detail/[id]',
                params: { id: item.id },
              })
            }
          />
        ))}
      </ScrollView>

      {/* Bottom Tabs */}
      <View style={styles.tabBar}>
        {tabs.map(({ icon, label, action }, i) => (
          <View
            key={i}
            style={styles.tabItem}
            onTouchEnd={action}
          >
            <Ionicons name={icon} size={24} color="#656565" />
            <Text style={styles.tabText}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default AreaScreen;


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: 120, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', paddingTop: 20 },
  logo: { width: 220, height: 220 },
  appBar: { height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', marginBottom: 30 },
  searchInput: { width: 279, backgroundColor: '#fff', borderRadius: 8, height: 36, paddingHorizontal: 12, borderWidth: 1, borderColor: '#656565' },
  body: { flexGrow: 1, padding: 16, backgroundColor: '#f2f2f2' },
  tabBar: { height: 120, flexDirection: 'row', borderTopWidth: 1, borderColor: '#e0e0e0', backgroundColor: '#fff' },
  tabItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabText: { color: '#333', fontSize: 12, marginTop: 4 },
});
