import { StyleSheet } from 'react-native';
import { Colors } from './global';

// =====================================
// Component Styles
// =====================================
export const SearchInputStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
});

export const BottomNavStyles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  areaIconContainer: {
    borderRadius: 999,
    backgroundColor: Colors.menuIcon,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    color: Colors.textPrimary,
    fontSize: 12,
    marginTop: 4,
  },
});