// components/common/bottomNav.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Ionicons가 허용하는 name 타입을 가져옵니다
type IconName = React.ComponentProps<typeof Ionicons>['name'];

export interface NavItem {
  icon: IconName;
  label: string;
  action: () => void;   // action을 필수로 바꿨어요
}

interface BottomNavProps {
  tabs: NavItem[];
}

const BottomNav: React.FC<BottomNavProps> = ({ tabs }) => (
  <View style={styles.tabBar}>
    {tabs.map(({ icon, label, action }, i) => (
      <TouchableOpacity
        key={i}
        style={styles.tabItem}
        onPress={action}          // onPress로 변경
        activeOpacity={0.7}
      >
        <Ionicons name={icon} size={24} color="#656565" />
        <Text style={styles.tabText}>{label}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default BottomNav;

const styles = StyleSheet.create({
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
