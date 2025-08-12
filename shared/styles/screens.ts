import { StyleSheet } from 'react-native';
import { Colors } from './colors';

const shadowSm = {
  shadowColor: Colors.shadow,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 3,
};

/* =========================
   Auth Screens Styles
   ========================= */
export const AuthLayoutStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, backgroundColor: Colors.background },
});

export const LoginScreenStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: {
    paddingHorizontal: '10%',
    paddingVertical: 20,
    backgroundColor: Colors.background,
    minHeight: '100%',
  },
  logoContainer: { alignItems: 'center', marginBottom: 50, position: 'relative' },
  backgroundShapes: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 },
  triangleLeft: { position: 'absolute', left: 10, top: 60, width: 180, height: 180, zIndex: 1 },
  triangleRight: { position: 'absolute', right: 20, top: 60, width: 100, height: 100, zIndex: 1 },
  logo: { width: 500, height: 300, zIndex: 2 },
  form: { gap: 24, paddingBottom: 60 },
  inputContainer: { gap: 12, marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'flex-start' },
  inputIcon: { width: '30%', alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, fontSize: 16, color: Colors.textPrimary, paddingVertical: 8 },
  inputDivider: { height: 1, backgroundColor: Colors.backgroundInput, marginHorizontal: 12 },
  errorText: { fontSize: 12, color: Colors.danger, marginTop: 4, marginLeft: 32 },
  loginButton: {
    backgroundColor: Colors.buttonPrimary,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: { backgroundColor: Colors.buttonDisabled },
  loginButtonText: { color: Colors.textWhite, fontSize: 24, fontWeight: '600', letterSpacing: 1 },
  forgotPassword: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

/* =========================
   Tab Screens Styles
   ========================= */
export const TabsLayoutStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  slot: { flex: 1, position: 'relative' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary || '#2a2a2a',
  },
  background: { flex: 1, backgroundColor: Colors.backgroundSecondary || '#2a2a2a' },
});

export const AreaScreenStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundSecondary },
  body: { flexGrow: 1, padding: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  loadingText: { fontSize: 16, color: '#666', textAlign: 'center' },
});

export const AlarmsScreenStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundSecondary },
  flatList: { flex: 1 },
  contentContainer: { paddingTop: 12, paddingBottom: 20 },
});

export const MenuScreenStyles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  section: {
    backgroundColor: Colors.background,
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    ...shadowSm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderBottom,
  },
  menuIcon: { marginRight: 16 },
  menuText: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: '500', color: Colors.textPrimary },
  menuSubtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
});

/* =========================
   Stack Screens Styles
   ========================= */
export const DetailScreenStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundSecondary, width: '100%', height: '100%' },
  content: { padding: 16 },
  errorIndicator: {
    backgroundColor: Colors.danger || '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 8,
    alignItems: 'center',
    ...shadowSm,
  },
  errorText: { color: Colors.textWhite, fontSize: 14, fontWeight: '600', textAlign: 'center' },
});

/* =========================
   Modal Styles
   ========================= */
export const NotificationModalStyles = StyleSheet.create({
  container: { borderRadius: 10, overflow: 'hidden', zIndex: 9999, elevation: 1000 },
  header: { paddingVertical: 16, alignItems: 'center' },
  headerTitle: { fontSize: 16, color: Colors.textPrimary, marginBottom: 4 },
  headerStatus: { fontSize: 30, color: Colors.textPrimary, fontWeight: '700' },
  body: { padding: 20, alignItems: 'center' },
  alarmTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4, color: Colors.textPrimary },
  alarmSubtitle: { fontSize: 14, color: Colors.textPrimary, marginBottom: 8, textAlign: 'center', lineHeight: 20 },
  timestamp: { fontSize: 12, color: Colors.textSecondary, marginBottom: 16 },
  messageBox: { width: '80%', padding: 12, borderRadius: 6, marginTop: 10, marginBottom: 20 },
  messageText: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  closeButton: { width: '100%', paddingVertical: 12, borderRadius: 6, alignItems: 'center' },
  closeButtonText: { fontSize: 16, fontWeight: '600' },
});
