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
const BACK_ICON_RATIO = 0.05;
const ICON_HORIZONTAL_PADDING_RATIO = 0.02;

const HEADER_HEIGHT = SCREEN_HEIGHT * HEADER_HEIGHT_RATIO;
const LOGO_SIZE    = SCREEN_WIDTH * LOGO_RATIO;
export const BACK_ICON_SIZE = SCREEN_WIDTH * BACK_ICON_RATIO;
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
    flex: 1,
    padding: 16,
  },
  skeletonCard: {
    backgroundColor: Colors.backgroundInput,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    height: 80,
  },
  skeletonLine: {
    height: 16,
    backgroundColor: Colors.gray300,
    borderRadius: 4,
    marginBottom: 8,
    width: '80%',
  },
  skeletonLineShort: {
    height: 12,
    backgroundColor: Colors.gray300,
    borderRadius: 4,
    width: '60%',
  },
});

// SplashScreen Styles
export const SplashScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backgroundShapes: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  shape: {
    position: 'absolute',
  },
  topShape: {
    top: 0,
    left: 0,
  },
  bottomShape: {
    bottom: 0,
    right: 0,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 80,
  },
  textContainer: {
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
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
    shadowColor: Colors.shadow,
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
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
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
    shadowColor: Colors.shadow,
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
    backgroundColor: Colors.backgroundModal,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modal: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 36,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 46,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 24,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.backgroundSecondary,
  },
  confirmButton: {
    backgroundColor: Colors.buttonPrimary,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textWhite,
  },
});

// MachineCard Styles
export const MachineCardStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  flex1: {
    flex: 1,
    flexDirection: 'column'
  },
  image: {
    width: 120,
    height: 120,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: Colors.backgroundSecondary,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  subName: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4
  },
  flex3: {
    marginTop: 12
  },
  infoText: {
    fontSize: 14,
    color: Colors.textTertiary,
    marginTop: 2
  },
  machineImage: { 
    width: 60,
    height: 60,
  },
});

// SearchInput Styles
const SEARCH_WIDTH_RATIO = 0.65;
const PADDING_RATIO = 0.043;
const PLACEHOLDER_FONT_RATIO = 0.015;
const SEARCH_HEIGHT_RATIO = 0.045;

const SEARCH_WIDTH = SCREEN_WIDTH * SEARCH_WIDTH_RATIO;
const HORIZONTAL_PADDING = SEARCH_WIDTH * PADDING_RATIO;
const PLACEHOLDER_FONT_SIZE = SCREEN_HEIGHT * PLACEHOLDER_FONT_RATIO;
const SEARCH_HEIGHT = SCREEN_HEIGHT * SEARCH_HEIGHT_RATIO;

export const SEARCH_ICON_SIZE = SEARCH_HEIGHT * 0.5;

export const SearchInputStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: SEARCH_WIDTH,
    height: 40,
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingHorizontal: HORIZONTAL_PADDING,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: PLACEHOLDER_FONT_SIZE,
    color: Colors.textPrimary,
  },
});

// VDonutChart Styles
export const size = SCREEN_WIDTH * 0.4;

export const VDonutChartStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: size, 
    height: size, 
    zIndex: 1,
  },
  chartContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1
  },
  centerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  percentText: {
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    fontSize: size * 0.12,
  },
});

