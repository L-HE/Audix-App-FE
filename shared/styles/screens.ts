import { StyleSheet } from 'react-native';
import { Colors } from './global';

// =====================================
// Auth Screens Styles
// =====================================
export const AuthLayoutStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export const LoginScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: '100%',
  },
  backgroundShapes: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle: {
    position: 'absolute',
    backgroundColor: '#E8E8E8',
    borderRadius: 999,
    width: '25%',
    height: '12%',
    top: 100,
    right: 50,
  },
  triangleLeft: {
    position: 'absolute',
    left: 60,
    top: 100,
  },
  content: {
    flex: 1,
    paddingHorizontal: '10%',
    paddingVertical: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: '80%',
    height: 300,
  },
  form: {
    gap: 24,
    paddingBottom: 40,
  },
  inputContainer: {
    gap: 12,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  inputIcon: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    paddingVertical: 8,
  },
  inputDivider: {
    height: 1,
    backgroundColor: Colors.backgroundInput,
    marginHorizontal: 12,
  },
  inputLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    marginLeft: 32,
  },
  errorText: {
    fontSize: 12,
    color: Colors.danger,
    marginTop: 4,
    marginLeft: 32,
  },
  loginButton: {
    backgroundColor: Colors.buttonPrimary,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: Colors.buttonDisabled,
  },
  loginButtonText: {
    color: Colors.textWhite,
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 1,
  },
  forgotPassword: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

// =====================================
// Tab Screens Styles
// =====================================
export const TabsLayoutStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  slot: {
    flex: 1,
    position: 'relative',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary || '#2a2a2a',
  },
  background: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary || '#2a2a2a',
  },
});

export const AreaScreenStyles = StyleSheet.create({
  container: {
    flex: 1
  },
  body: {
    flexGrow: 1,
    padding: 16,
  },
  loadingText: {
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 50
  },
});

export const AlarmsScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  flatList: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 12,
    paddingBottom: 20,
  },
});

export const MenuScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: Colors.background,
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderBottom,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  menuSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});

// =====================================
// Stack Screens Styles
// =====================================
export const DetailScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  content: {
    padding: 16
  },
});

// =====================================
// Modal Styles
// =====================================
export const NotificationModalStyles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: 'hidden',
    zIndex: 9999,
    elevation: 1000,
  },
  header: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  headerStatus: {
    fontSize: 30,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  body: {
    padding: 20,
    alignItems: 'center',
  },
  alarmTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    color: Colors.textPrimary,
  },
  alarmSubtitle: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  messageBox: {
    width: '80%',
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
    marginBottom: 20,
  },
  messageText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  closeButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

