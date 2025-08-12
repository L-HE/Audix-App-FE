// app/(tabs)/menu/index.tsx
import { Colors } from '@/shared/styles/global';
import { MenuScreenStyles as style } from '@/shared/styles/screens';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { Animated, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import LogoutModal from '../../../components/screens/logoutModal';

// 탭 헤더 숨기기
export const headerShown = false;

/** 
 * 단일 메뉴 아이템 컴포넌트
 * - 아이콘, 제목, 부제목, 클릭 이벤트 표시
 */
interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
}
const MenuItem: React.FC<MenuItemProps> = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={style.menuItem} onPress={onPress}>
    <View style={style.menuIcon}>
      <Ionicons name={icon} size={28} color={Colors.menuIcon} />
    </View>
    <View style={style.menuText}>
      <Text style={style.menuTitle}>{title}</Text>
      {subtitle && <Text style={style.menuSubtitle}>{subtitle}</Text>}
    </View>
    <Ionicons name="chevron-forward" size={20} color={Colors.buttonForward} />
  </TouchableOpacity>
);

/**
 * 메뉴 화면 본문
 * - 탭 진입 시 애니메이션
 * - 로그아웃 모달 관리
 */
const MenuScreenContent: React.FC = () => {
  const router = useRouter();

  // 로그아웃 모달 표시 여부
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // 진입 애니메이션 값
  const slideAnim = useRef(new Animated.Value(100)).current; // X축 이동(오른쪽→왼쪽)
  const opacityAnim = useRef(new Animated.Value(0)).current; // 투명도
  const hasAnimatedRef = useRef(false); // 최초 1회만 실행

  // 탭이 포커스될 때 애니메이션 실행
  useFocusEffect(
    useCallback(() => {
      if (hasAnimatedRef.current) {
        // 재진입 시 즉시 표시
        slideAnim.setValue(0);
        opacityAnim.setValue(1);
        return;
      }
      hasAnimatedRef.current = true;

      // 초기값 설정
      slideAnim.setValue(100);
      opacityAnim.setValue(0);

      // 슬라이드+페이드 병렬 실행
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          delay: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }, [slideAnim, opacityAnim])
  );

  // 로그아웃 버튼 클릭 시
  const handleLogoutPress = () => {
    setShowLogoutModal(true);
  };

  // 로그아웃 모달 취소
  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  // 로그아웃 모달 확인 → 로그인 화면 이동
  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    router.replace('/(auth)/login');
  };

  // 메뉴 항목 목록
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
      icon: 'exit-outline' as const,
      title: '로그아웃',
      onPress: handleLogoutPress,
    },
  ];

  return (
    <Animated.View
      style={[
        style.container,
        {
          transform: [{ translateX: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <ScrollView style={style.scrollView}>
        <View style={style.section}>
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

      {/* 로그아웃 확인 모달 */}
      <LogoutModal
        visible={showLogoutModal}
        onCancel={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </Animated.View>
  );
};

// 메인 래퍼
const MenuScreen: React.FC = () => {
  return <MenuScreenContent />;
};

export default MenuScreen;
