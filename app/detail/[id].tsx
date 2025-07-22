import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

type DetailCard = {
  id: string;
  name: string;
  info: string;
  image: any;
};

// 예시 상세 데이터
const detailData: DetailCard[] = [
  { id: '1', name: '설비 A-1-1', info: '온도 이상 감지', image: require('../../assets/images/AudixLogoNavy.png') },
  { id: '1', name: '설비 A-1-2', info: '정상 작동 중', image: require('../../assets/images/AudixLogoNavy.png') },
  { id: '2', name: '설비 B-2-1', info: '점검 필요', image: require('../../assets/images/AudixLogoNavy.png') },
];

const DetailScreen: React.FC = () => {
  // useLocalSearchParams로 id 파라미터 가져오기
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const cards = detailData.filter(item => item.id === id);

  return (
    <View style={styles.container}>
      {/* Header with Logo */}
      <View style={styles.header}>
        <Image source={require('../../assets/images/AudixLogoNavy.png')} style={styles.logo} resizeMode="contain" />
      </View>

      {/* App Bar with Search */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#656565" />
        </TouchableOpacity>
        <TextInput placeholder="검색어를 입력하세요" style={styles.searchInput} />
      </View>

      {/* Body: 상세 카드 리스트 */}
      <ScrollView contentContainerStyle={styles.body}>
        {cards.map((item, index) => (
          <View key={index} style={styles.detailCard}>
            <Image source={item.image} style={styles.detailImage} />
            <View style={styles.detailText}>
              <Text style={styles.detailName}>{item.name}</Text>
              <Text style={styles.detailInfo}>{item.info}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/')}>  
          <Ionicons name="map-outline" size={24} color="#656565" />
          <Text style={styles.tabText}>Area</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="notifications-outline" size={24} color="#656565" />
          <Text style={styles.tabText}>Alarm</Text>
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

export default DetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: 120, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', paddingTop: 20 },
  logo: { width: 220, height: 220 },
  appBar: { flexDirection: 'row', alignItems: 'center', height: 50, backgroundColor: '#fff', paddingHorizontal: 16, marginBottom: 30 },
  backButton: { marginRight: 12 },
  searchInput: { flex: 1, backgroundColor: '#fff', borderRadius: 8, height: 36, paddingHorizontal: 12, borderWidth: 1, borderColor: '#656565' },
  body: { flexGrow: 1, padding: 16, backgroundColor: '#f2f2f2' },
  detailCard: { flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 30, backgroundColor: '#fff', borderRadius: 8, borderWidth: 2, borderColor: '#e0e0e0', overflow: 'hidden', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', elevation: 4 },
  detailImage: { width: 80, height: 80, borderRadius: 4 },
  detailText: { marginLeft: 12 },
  detailName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  detailInfo: { fontSize: 14, color: '#666' },
  tabBar: { height: 120, flexDirection: 'row', borderTopWidth: 1, borderColor: '#e0e0e0', backgroundColor: '#fff' },
  tabItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabText: { color: '#333', fontSize: 12, marginTop: 4 },
});
