import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export const headerShown = false;

interface Card {
  id: string;
  title: string;
  subtitle: string;
  image: any;
}

const cards: Card[] = [
  {
    id: '1',
    title: 'A-1구역',
    subtitle: '2층 자동차 부재료 조립구역',
    image: require('../assets/images/AudixLogoNavy.png'),
  },
  {
    id: '2',
    title: 'B-2구역',
    subtitle: '1층 전장품 검수구역',
    image: require('../assets/images/AudixLogoNavy.png'),
  },
  {
    id: '3',
    title: 'C-2구역',
    subtitle: '1층 전장품 검수구역',
    image: require('../assets/images/AudixLogoNavy.png'),
  },
  {
    id: '4',
    title: 'D-2구역',
    subtitle: '1층 전장품 검수구역',
    image: require('../assets/images/AudixLogoNavy.png'),
  },
  // 필요에 따라 더 많은 카드 추가
];

const AreaScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header with Logo */}
      <View style={styles.header}>
        <Image
          source={require('../assets/images/AudixLogoNavy.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* App Bar with Search */}
      <View style={styles.appBar}>
        <TextInput
          placeholder="검색어를 입력하세요"
          style={styles.searchInput}
        />
      </View>

      {/* Body: Vertical list of cards */}
      <ScrollView contentContainerStyle={styles.body}>
        {cards.map((item: Card) => (
          <TouchableOpacity key={item.id} style={styles.card}>
            <Image source={item.image} style={styles.cardImage} />
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="home-outline" size={24} color="#656565" />
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="notifications-outline" size={24} color="#656565" />
          <Text style={styles.tabText}>Alram</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="person-outline" size={24} color="#656565" />
          <Text style={styles.tabText}>My</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="people-outline" size={24} color="#656565" />
          <Text style={styles.tabText}>Team</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="settings-outline" size={24} color="#656565" />
          <Text style={styles.tabText}>Setting</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AreaScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  logo: {
    width: 220,
    height: 220,
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
    backgroundColor: '#fff',
    borderRadius: 8,
    height: 36,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#656565',
  },
  body: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    // shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // elevation for Android
    elevation: 4,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  tabBar: {
    height: 120,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    color: '#333',
    fontSize: 12,
    marginTop: 4,
  },
});
