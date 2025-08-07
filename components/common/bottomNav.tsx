// components/common/bottomNav.tsx
import { BottomNavStyles } from '@/shared/styles/components';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import {
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export interface NavItem {
  icon: IconName;
  label: string;
  action: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 비율 상수를 컴포넌트 외부로 이동
const TAB_BAR_HEIGHT_RATIO = 0.1;
const ICON_RATIO = 0.07;
const TEXT_RATIO = 0.03;
const LABEL_MARGIN_RATIO = 0.005;

const TAB_BAR_HEIGHT = SCREEN_HEIGHT * TAB_BAR_HEIGHT_RATIO;
const ICON_SIZE = SCREEN_WIDTH * ICON_RATIO;
const AREA_CONTAINER_MULTIPLIER = 1.4;
const AREA_ICON_CONTAINER_SIZE = ICON_SIZE * AREA_CONTAINER_MULTIPLIER;
const AREA_ICON_SIZE = ICON_SIZE * 0.8;
const FONT_SIZE = SCREEN_WIDTH * TEXT_RATIO;
const LABEL_MARGIN = SCREEN_WIDTH * LABEL_MARGIN_RATIO;

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
    <View style={BottomNavStyles.tabBar}>
      {items.map(({ icon, label, action }) => (
        <TouchableOpacity
          key={label}
          style={BottomNavStyles.tabItem}
          onPress={action}
          activeOpacity={0.7}
        >
          {label === 'Area' ? (
            <View style={BottomNavStyles.areaIconContainer}>
              <Ionicons
                name={icon}
                size={AREA_ICON_SIZE}
                color="#fff"
              />
            </View>
          ) : (
            <Ionicons
              name={icon}
              size={ICON_SIZE}
              color="#656565"
            />
          )}
          <Text style={BottomNavStyles.tabText}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// React.memo로 감싸고 displayName 설정
const BottomNav = React.memo(BottomNavComponent);
BottomNav.displayName = 'BottomNav';

// default export
export default BottomNav;
