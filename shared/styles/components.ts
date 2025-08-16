import { Dimensions, StyleSheet } from 'react-native';
import { Colors } from './colors';

const { width: W, height: H } = Dimensions.get('window');
const vw = (r: number) => W * r;
const vh = (r: number) => H * r;

/* =========================
   Common Components Styles
   ========================= */

export const AppBarStyles = StyleSheet.create({
  appBar: {
    height: vh(0.13),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    marginBottom: vh(0.015),
    paddingHorizontal: 16,
  },
  appBarCompact: { height: vh(0.13) * 0.6 },
  title: {
    marginBottom: 16,
    fontSize: vh(0.02),
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  titleCentered: { marginBottom: 0 },
});

const ICON_SIZE = vw(0.085);
export const BottomNavStyles = StyleSheet.create({
  tabBar: {
    height: vh(0.1),
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    borderTopWidth: 1,
    borderColor: Colors.borderBottom,
    backgroundColor: Colors.background,
  },
  tabItem: { flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' },
  areaIconContainer: {
    width: ICON_SIZE * 1.4,
    height: ICON_SIZE * 1.4,
    borderRadius: (ICON_SIZE * 1.4) / 2,
    backgroundColor: Colors.menuIcon,
    justifyContent: 'center',
    alignItems: 'center',
  },
  areaIcon: { width: ICON_SIZE * 0.87, height: ICON_SIZE * 0.87, color: Colors.iconWhite },
  tabIcon: { width: ICON_SIZE, height: ICON_SIZE, color: Colors.tabIcon },
  tabText: { color: Colors.textSecondary, fontSize: vw(0.03), marginTop: vw(0.005) },
});

export const BACK_ICON_SIZE = vw(0.05);
const ICON_BTN_W = BACK_ICON_SIZE + vw(0.02) * 2;
export const HeaderStyles = StyleSheet.create({
  header: {
    height: vh(0.05),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: vh(0.05) * 0.35,
    paddingHorizontal: vw(0.05),
    backgroundColor: Colors.background,
  },
  spacer: { width: ICON_BTN_W },
  logo: { width: vw(0.4), height: vw(0.4), alignItems: 'center' },
  iconButton: { width: ICON_BTN_W, height: ICON_BTN_W, justifyContent: 'center', alignItems: 'center' },
  backIcon: { width: BACK_ICON_SIZE, height: BACK_ICON_SIZE, color: Colors.tabIcon },
});

export const LoadingScreenStyles = StyleSheet.create({
  container: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: { marginTop: 16, fontSize: 16, color: Colors.textPrimary, textAlign: 'center' },
});

export const SkeletonLoaderStyles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
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
  skeletonLineShort: { height: 12, backgroundColor: Colors.gray300, borderRadius: 4, width: '60%' },
});

export const SplashScreenStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  backgroundShapes: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 },
  shape: { position: 'absolute' },
  topShape: { top: 0, left: 0 },
  bottomShape: { bottom: 0, right: 0 },
  content: {
    flex: 1,
    flexDirection: 'column',
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  logoContainer: { alignItems: 'center' },
  logo: { width: 250, height: 80 },
  textContainer: { alignItems: 'center' },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
  },
});

/* =========================
   Screen Components Styles
   ========================= */

export const AlarmCardStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
  },
  content: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  textContainer: { flex: 1, marginRight: 12 },
  title: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
  timestamp: { fontSize: 12, color: Colors.textTertiary, marginTop: 2 },
});

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
    elevation: 2,
  },
  cardImage: { width: 80, height: 80, borderRadius: 4 },
  textContainer: { flex: 1, marginLeft: 12 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: Colors.textPrimary },
  cardSubtitle: { fontSize: 14, color: Colors.textSecondary },
});

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
  buttonContainer: { flexDirection: 'row', gap: 24, width: '100%' },
  button: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  cancelButton: { backgroundColor: Colors.backgroundSecondary },
  confirmButton: { backgroundColor: Colors.buttonPrimary },
  cancelText: { fontSize: 16, fontWeight: '500', color: Colors.textPrimary },
  confirmText: { fontSize: 16, fontWeight: '500', color: Colors.textWhite },
});

export const MachineCardStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  flex1: { flex: 1, flexDirection: 'column' },
  image: {
    width: 120,
    height: 120,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: Colors.backgroundSecondary,
  },
  name: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary },
  subName: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  flex3: { marginTop: 12 },
  infoText: { fontSize: 14, color: Colors.textTertiary, marginTop: 2 },
  machineImage: { width: 60, height: 60 },
});

/* =========================
   SearchInput
   ========================= */

const SEARCH_WIDTH = vw(0.65);
const H_PADDING = SEARCH_WIDTH * 0.043;
const PLACEHOLDER_FONT = vh(0.015);
const SEARCH_HEIGHT = vh(0.045);
export const SEARCH_ICON_SIZE = SEARCH_HEIGHT * 0.5;

export const SearchInputStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: SEARCH_WIDTH,
    height: 40,
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingHorizontal: H_PADDING,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, fontSize: PLACEHOLDER_FONT, color: Colors.textPrimary },
});

/* =========================
   Donut Charts
   ========================= */

export const size = vw(0.4);

export const VDonutChartStyles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center', width: size, height: size, zIndex: 1 },
  chartContainer: { position: 'relative', justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  centerContent: { position: 'absolute', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', zIndex: 2 },
  percentText: { fontWeight: 'bold', color: Colors.textPrimary, textAlign: 'center', fontSize: size * 0.5 },
});

export const DonutChartStyles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center', width: size, height: size },
  chartContainer: { position: 'relative', justifyContent: 'center', alignItems: 'center', width: size, height: size },
  svgContainer: { position: 'absolute', top: 0, left: 0 },
  centerContent: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  percentText: { fontWeight: 'bold', color: Colors.textPrimary, textAlign: 'center', fontSize: size * 0.15, backgroundColor: 'transparent' },
});
