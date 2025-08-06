// app/(tabs)/menu/index.tsx
import { Colors } from '@/shared/styles/global';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LogoutModal from '../../../components/screens/logoutModal';

export const headerShown = false;

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuIcon}>
      <Ionicons name={icon} size={24} color={Colors.menuIcon} />
    </View>
    <View style={styles.menuText}>
      <Text style={styles.menuTitle}>{title}</Text>
      {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
    </View>
    <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
  </TouchableOpacity>
);

const MenuScreen: React.FC = () => {
  const router = useRouter();
  
  // 모달 상태 관리
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // 로그아웃 모달 보이기
  const handleLogoutPress = () => {
    setShowLogoutModal(true);
  };

  // 로그아웃 모달 취소
  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  // 로그아웃 모달 확인
  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    // 로그아웃 로직 실행
    router.replace('/(auth)/login');
  };

  const menuItems = [
    {
      icon: 'person-circle-outline' as const,
      title: '내 정보',
      subtitle: '사원 및 조직 정보',
      onPress: () => router.push('/'),
    },
    {
      icon: 'key-outline' as const,
      title: '비밀번호 변경',
      subtitle: '비밀번호 설정 변경',
      onPress: () => router.push('/'),
    },
    {
      icon: 'chatbubble-ellipses-outline' as const,
      title: '문의하기',
      subtitle: '앱 관련 문의',
      onPress: () => router.push('/'),
    },
    {
      icon: 'help-circle-outline' as const,
      title: '도움말',
      subtitle: '사용 가이드 및 FAQ',
      onPress: () => router.push('/'),
    },
    {
      icon: 'exit-outline' as const,
      title: '로그아웃',
      onPress: handleLogoutPress, // 모달 표시 함수 연결
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              onPress={item.onPress}
            />
          ))}
        </View>
      </ScrollView>

      {/* 로그아웃 확인 모달*/}
      <LogoutModal
        visible={showLogoutModal}
        onCancel={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#ffffff',
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
});

export default MenuScreen;