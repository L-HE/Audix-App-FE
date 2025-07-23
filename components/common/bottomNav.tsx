// components/common/bottomNav.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get('window');

// 비율 상수
const TAB_BAR_HEIGHT_RATIO = 0.1;
const ICON_RATIO = 0.07;
const TEXT_RATIO = 0.03;
const LABEL_MARGIN_RATIO = 0.005;

// Navy 컬러 (로고 원 배경색)
const NAVY_COLOR = '#0D2D59';

const TAB_BAR_HEIGHT = SCREEN_HEIGHT * TAB_BAR_HEIGHT_RATIO;
const ICON_SIZE = SCREEN_WIDTH * ICON_RATIO;
const AREA_CONTAINER_MULTIPLIER = 1.4;           // Area 아이콘 컨테이너를 1.4배
const AREA_ICON_CONTAINER_SIZE = ICON_SIZE * AREA_CONTAINER_MULTIPLIER;
const AREA_ICON_SIZE = ICON_SIZE * 0.8;          // Area 내부 아이콘을 0.8배
const FONT_SIZE = SCREEN_WIDTH * TEXT_RATIO;
const LABEL_MARGIN = SCREEN_WIDTH * LABEL_MARGIN_RATIO;

interface BottomNavProps {
  tabs?: NavItem[];
}

const BottomNav: React.FC<BottomNavProps> = ({ tabs }) => {
  const router = useRouter();

  const defaultTabs: NavItem[] = [
    {
      icon: 'notifications-outline',
      label: 'Alarm',
      action: () => router.push('/'),
    },
    {
      icon: 'map-outline',
      label: 'Area',
      action: () => router.push('/'),
    },
    {
      icon: 'ellipsis-horizontal-outline',  // triple-dot 아이콘
      label: 'Menu',
      action: () => router.push('/'),
    },
  ];

  const items = tabs ?? defaultTabs;

  return (
    <View style={styles.tabBar}>
      {items.map(({ icon, label, action }, i) => (
        <TouchableOpacity
          key={i}
          style={styles.tabItem}
          onPress={action}
          activeOpacity={0.7}
        >
          {label === 'Area' ? (
            <View style={styles.areaIconContainer}>
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
          <Text style={styles.tabText}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default BottomNav;

const styles = StyleSheet.create({
  tabBar: {
    height: TAB_BAR_HEIGHT,
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
  areaIconContainer: {
    width: AREA_ICON_CONTAINER_SIZE,
    height: AREA_ICON_CONTAINER_SIZE,
    borderRadius: AREA_ICON_CONTAINER_SIZE / 2,
    backgroundColor: NAVY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    color: '#333',
    fontSize: FONT_SIZE,
    marginTop: LABEL_MARGIN,
  },
});
