// components/common/bottomNav.tsx
import { BottomNavStyles as style } from '@/shared/styles/components';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

// ========================================
// 타입 정의
// - Ionicons의 name 타입을 재활용해 안전한 아이콘 이름 보장
// - NavItem: 탭 항목(아이콘/라벨/동작)
// - BottomNavProps: 외부에서 탭 구성을 커스터마이즈할 수 있도록 옵션 제공
// ========================================
type IconName = React.ComponentProps<typeof Ionicons>['name'];

export interface NavItem {
  icon: IconName;
  label: string;
  action: () => void;
}

interface BottomNavProps {
  tabs?: NavItem[];
}

// ========================================
// BottomNavComponent
// - 하단 탭 바 UI
// - 기본 탭(Alarm/Area/Menu) 제공, 필요 시 props.tabs로 대체 가능
// - 각 탭은 useCallback으로 고정된 네비게이션 액션 사용
// ========================================
const BottomNavComponent: React.FC<BottomNavProps> = ({ tabs }) => {
  const router = useRouter();

  // ----------------------------------------
  // 네비게이션 액션 (라우터로 화면 전환)
  // - useCallback으로 참조 안정화 → 불필요한 리렌더 방지
  // ----------------------------------------
  const navigateToAlarms = useCallback(() => router.push('/alarms'), [router]);
  const navigateToArea   = useCallback(() => router.push('/'),        [router]);
  const navigateToMenu   = useCallback(() => router.push('/menu'),    [router]);

  // ----------------------------------------
  // 기본 탭 구성
  // - 아이콘/라벨/액션 정의
  // - useMemo로 종속 액션 변경 시에만 재생성
  // ----------------------------------------
  const defaultTabs: NavItem[] = useMemo(
    () => [
      { icon: 'notifications-outline', label: 'Alarm', action: navigateToAlarms },
      { icon: 'map-outline',           label: 'Area',  action: navigateToArea   },
      { icon: 'ellipsis-horizontal-outline', label: 'Menu', action: navigateToMenu },
    ],
    [navigateToAlarms, navigateToArea, navigateToMenu]
  );

  // ----------------------------------------
  // 렌더링에 사용할 탭 배열
  // - 외부에서 tabs를 넘기면 그것을 사용하고, 없으면 defaultTabs 사용
  // - useMemo로 props 변경시에만 재계산
  // ----------------------------------------
  const items = useMemo<NavItem[]>(
    () => tabs ?? defaultTabs,
    [tabs, defaultTabs]
  );

  // ----------------------------------------
  // 렌더링
  // - 가운데 'Area' 탭은 원형 배경 등 스타일이 다르므로 분기 처리
  // - 접근성 속성(접근성 레이블/역할)도 함께 지정
  // ----------------------------------------
  return (
    <View style={style.tabBar}>
      {items.map(({ icon, label, action }) => {
        const isArea = label === 'Area';
        return (
          <TouchableOpacity
            key={label}
            style={style.tabItem}
            onPress={action}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`${label} 탭으로 이동`}
          >
            {isArea ? (
              <View style={style.areaIconContainer}>
                <Ionicons name={icon} size={30} style={style.areaIcon} />
              </View>
            ) : (
              <Ionicons name={icon} size={35} style={style.tabIcon} />
            )}
            <Text style={style.tabText}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ========================================
// 메모이제이션된 내보내기 컴포넌트
// - displayName 설정으로 디버깅 편의성 향상
// ========================================
const BottomNav = React.memo(BottomNavComponent);
BottomNav.displayName = 'BottomNav';

export default BottomNav;
