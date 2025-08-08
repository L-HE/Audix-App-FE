import { Dimensions, StyleSheet } from 'react-native';
import { Colors } from './global';

// =====================================
// Common Components Styles
// =====================================

// AppBar Styles
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const APPBAR_HEIGHT_RATIO = 0.13;
const MARGIN_BOTTOM_RATIO = 0.015;
const TITLE_FONT_RATIO = 0.025;

const APPBAR_HEIGHT = SCREEN_HEIGHT * APPBAR_HEIGHT_RATIO;
const MARGIN_BOTTOM = SCREEN_HEIGHT * MARGIN_BOTTOM_RATIO;
const TITLE_FONT_SIZE = SCREEN_HEIGHT * TITLE_FONT_RATIO;

export const AppBarStyles = StyleSheet.create({
  appBar: {
    height: APPBAR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    marginBottom: MARGIN_BOTTOM,
    paddingHorizontal: 16,
  },
  appBarCompact: {
    height: APPBAR_HEIGHT * 0.6,
  },
  title: {
    marginBottom: 12,
    fontSize: TITLE_FONT_SIZE,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  titleCentered: {
    marginBottom: 0,
  },
});

// BottomNav Styles
const TAB_BAR_HEIGHT_RATIO = 0.1;
const ICON_RATIO = 0.085;
const TEXT_RATIO = 0.03;
const LABEL_MARGIN_RATIO = 0.005;

const TAB_BAR_HEIGHT = SCREEN_HEIGHT * TAB_BAR_HEIGHT_RATIO;
const ICON_SIZE = SCREEN_WIDTH * ICON_RATIO;
const AREA_CONTAINER_MULTIPLIER = 1.4;
const AREA_ICON_CONTAINER_SIZE = ICON_SIZE * AREA_CONTAINER_MULTIPLIER;
const AREA_ICON_SIZE = ICON_SIZE * 0.87;
const FONT_SIZE = SCREEN_WIDTH * TEXT_RATIO;
const LABEL_MARGIN = SCREEN_WIDTH * LABEL_MARGIN_RATIO;

export const BottomNavStyles = StyleSheet.create({
  tabBar: {
    height: TAB_BAR_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    borderTopWidth: 1,
    borderColor: Colors.borderBottom,
    backgroundColor: Colors.background,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  areaIconContainer: {
    width: AREA_ICON_CONTAINER_SIZE,
    height: AREA_ICON_CONTAINER_SIZE,
    borderRadius: AREA_ICON_CONTAINER_SIZE / 2,
    backgroundColor: Colors.menuIcon,
    justifyContent: 'center',
    alignItems: 'center',
  },
  areaIcon: {
    width: AREA_ICON_SIZE,
    height: AREA_ICON_SIZE,
    color: Colors.iconWhite,
  },
  tabIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    color: Colors.tabIcon,
  },
  tabText: {
    color: Colors.textSecondary,
    fontSize: FONT_SIZE,
    marginTop: LABEL_MARGIN,
  },
});

// Header Styles
const HEADER_HEIGHT_RATIO = 0.05;
const LOGO_RATIO = 0.4;
const PADDING_TOP_RATIO = 0.35;
const BACK_ICON_RATIO = 0.06;
const ICON_HORIZONTAL_PADDING_RATIO = 0.02;

const HEADER_HEIGHT = SCREEN_HEIGHT * HEADER_HEIGHT_RATIO;
const LOGO_SIZE    = SCREEN_WIDTH * LOGO_RATIO;
const BACK_ICON_SIZE    = SCREEN_WIDTH * BACK_ICON_RATIO;
const ICON_BTN_W   = BACK_ICON_SIZE + SCREEN_WIDTH * ICON_HORIZONTAL_PADDING_RATIO * 2;

export const HeaderStyles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: HEADER_HEIGHT * PADDING_TOP_RATIO,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    backgroundColor: Colors.background,
  },
  spacer: {
    width: ICON_BTN_W,
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    alignItems: 'center',
  },
  iconButton: {
    width: ICON_BTN_W,
    height: ICON_BTN_W,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: BACK_ICON_SIZE,
    height: BACK_ICON_SIZE,
    color: Colors.tabIcon,
  },
});

// LoadingScreen Styles
export const LoadingScreenStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  content: {
    backgroundColor: Colors.background,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
});

// SkeletonLoader Styles
export const SkeletonLoaderStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    overflow: 'hidden',
  },
  shimmer: {
    height: '100%',
    width: '100%',
  },
});

// SplashScreen Styles
export const SplashScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});

// =====================================
// Screen Components Styles
// =====================================

// AlarmCard Styles
export const AlarmCardStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textWhite,
  },
  priority: {
    fontSize: 12,
    fontWeight: '500',
  },
});

// AreaCard Styles
export const AreaCardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 30,
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});

// LogoutModal Styles
export const LogoutModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 300,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: Colors.backgroundSecondary,
  },
  confirmButton: {
    backgroundColor: Colors.danger,
  },
  cancelButtonText: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: Colors.textWhite,
    fontWeight: '600',
  },
});

// MachineCard Styles
export const MachineCardStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    margin: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    color: Colors.textWhite,
  },
  info: {
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  lastUpdate: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
});

// SearchInput Styles
export const SearchInputStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 280,
    height: 40,
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
});

// VDonutChart Styles
export const VDonutChartStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chart: {
    marginBottom: 16,
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  centerLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});

