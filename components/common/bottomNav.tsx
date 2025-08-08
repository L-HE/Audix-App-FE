// components/common/bottomNav.tsx
import { BottomNavStyles as style } from '@/shared/styles/components';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import {
  Text,
  TouchableOpacity,
  View
} from 'react-native';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export interface NavItem {
  icon: IconName;
  label: string;
  action: () => void;
}

interface BottomNavProps {
  tabs?: NavItem[];
}

// 컴포넌트를 먼저 정의
const BottomNavComponent: React.FC<BottomNavProps> = ({ tabs }) => {
  const router = useRouter();

  // 네비게이션 함수들을 useCallback으로 캐싱
  const navigateToAlarms = useCallback(() => router.push('/alarms'), [router]);
  const navigateToArea = useCallback(() => router.push('/'), [router]);
  const navigateToMenu = useCallback(() => router.push('/menu'), [router]);

  const defaultTabs = useMemo(
    () => [
      {
        icon: 'notifications-outline' as IconName,
        label: 'Alarm',
        action: navigateToAlarms,
      },
      {
        icon: 'map-outline' as IconName,
        label: 'Area',
        action: navigateToArea,
      },
      {
        icon: 'ellipsis-horizontal-outline' as IconName,
        label: 'Menu',
        action: navigateToMenu,
      },
    ],
    [navigateToAlarms, navigateToArea, navigateToMenu]
  );

  const items = tabs ?? defaultTabs;

  return (
    <View style={style.tabBar}>
      {items.map(({ icon, label, action }) => (
        <TouchableOpacity
          key={label}
          style={style.tabItem}
          onPress={action}
          activeOpacity={0.7}
        >
          {label === 'Area' ? (
            <View style={style.areaIconContainer}>
              <Ionicons
                name={icon}
                size={30}
                style={style.areaIcon}
              />
            </View>
          ) : (
            <Ionicons
              name={icon}
              size={35}
              style={style.tabIcon}
            />
          )}
          <Text style={style.tabText}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// React.memo로 감싸고 displayName 설정
const BottomNav = React.memo(BottomNavComponent);
BottomNav.displayName = 'BottomNav';

export default BottomNav;
