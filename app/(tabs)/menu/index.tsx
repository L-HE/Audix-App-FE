// app/(tabs)/menu/index.tsx
import { Colors } from '@/shared/styles/global';
import { MenuScreenStyles as style } from '@/shared/styles/screens';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { Animated, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import LogoutModal from '../../../components/screens/logoutModal';

export const headerShown = false;

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

const MenuScreenContent: React.FC = () => {
  const router = useRouter();
  
  // 모달 상태 관리
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // 애니메이션 관련 상태
  const slideAnim = useRef(new Animated.Value(100)).current; // 초기값: 화면 오른쪽 밖 (+100)
  const opacityAnim = useRef(new Animated.Value(0)).current;   // 초기값: 투명
  const hasAnimatedRef = useRef(false); // 최초 1회만 애니메이션

  // 탭 포커스 시 슬라이드 애니메이션 (오른쪽 → 왼쪽)
  useFocusEffect(
    useCallback(() => {
      console.log('📱 [MenuScreen] Tab focused');
      
      // 이미 애니메이션 재생했으면 스킵 (탭 재방문 시 애니메이션 안함)
      if (hasAnimatedRef.current) {
        slideAnim.setValue(0);
        opacityAnim.setValue(1);
        return;
      }

      // 최초 진입 시에만 애니메이션
      hasAnimatedRef.current = true;
      
      // 초기 위치 설정 (오른쪽 밖)
      slideAnim.setValue(100);
      opacityAnim.setValue(0);

      // 슬라이드 + 페이드인 애니메이션 (동시 실행)
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
      ]).start(() => {
        console.log('✅ [MenuScreen] 슬라이드 애니메이션 완료');
      });

      // cleanup (탭 떠날 때는 애니메이션 없음)
      return () => {
        console.log('🔄 [MenuScreen] Tab unfocused');
      };
    }, [slideAnim, opacityAnim])
  );

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
    console.log('✅ [MenuScreen] 로그아웃 확인 → 로그인 화면으로 이동');
    setShowLogoutModal(false);
    // 로그아웃 로직 실행
    router.replace('/(auth)/login');
  };

  const menuItems = [
    {
      icon: 'person-circle-outline' as const,
      title: '내 정보',
      subtitle: '사원 및 조직 정보',
      onPress: () => {
        console.log('👤 [MenuScreen] 내 정보 클릭');
        router.push('/');
      },
    },
    {
      icon: 'key-outline' as const,
      title: '비밀번호 변경',
      subtitle: '비밀번호 설정 변경',
      onPress: () => {
        console.log('🔑 [MenuScreen] 비밀번호 변경 클릭');
        router.push('/');
      },
    },
    {
      icon: 'chatbubble-ellipses-outline' as const,
      title: '문의하기',
      subtitle: '앱 관련 문의',
      onPress: () => {
        console.log('💬 [MenuScreen] 문의하기 클릭');
        router.push('/');
      },
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
          transform: [{ translateX: slideAnim }], // 오른쪽(+100) → 중앙(0)
          opacity: opacityAnim,
        }
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

      {/* 로그아웃 확인 모달*/}
      <LogoutModal
        visible={showLogoutModal}
        onCancel={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </Animated.View>
  );
};

// 메인 컴포넌트 (애니메이션 래퍼)
const MenuScreen: React.FC = () => {
  return <MenuScreenContent />;
};

export default MenuScreen;