// components/common/bottomNav.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type IconName = React.ComponentProps<typeof Ionicons>['name'];
export interface NavItem {
  icon: IconName;
  label: string;
  action: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 비율 상수 (필요시 조정)
const TAB_BAR_HEIGHT_RATIO = 0.1;
const ICON_RATIO = 0.07;
const TEXT_RATIO = 0.03;
const LABEL_MARGIN_RATIO = 0.005;

const TAB_BAR_HEIGHT = SCREEN_HEIGHT * TAB_BAR_HEIGHT_RATIO;
const ICON_SIZE = SCREEN_WIDTH * ICON_RATIO;
const FONT_SIZE = SCREEN_WIDTH * TEXT_RATIO;
const LABEL_MARGIN = SCREEN_WIDTH * LABEL_MARGIN_RATIO;

interface BottomNavProps {
  tabs?: NavItem[];
}

const BottomNav: React.FC<BottomNavProps> = ({ tabs }) => {
  const router = useRouter();

  // 기본 탭 배열
  const defaultTabs: NavItem[] = [
    {
      icon: 'map-outline',
      label: 'Area',
      action: () => router.push('/'),
    },
    {
      icon: 'notifications-outline',
      label: 'Alarm',
      action: () => router.push('/'),
    },
    {
      icon: 'settings-outline',
      label: 'Setting',
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
          <Ionicons name={icon} size={ICON_SIZE} color="#656565" />
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
  tabText: {
    color: '#333',
    fontSize: FONT_SIZE,
    marginTop: LABEL_MARGIN,
  },
});
