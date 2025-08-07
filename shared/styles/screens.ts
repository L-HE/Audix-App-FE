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
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: '80%',
    height: '80%',
    marginBottom: '-60%',
  },
  form: {
    gap: 24,
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
export const AreaScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});

export const AlarmsScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export const MenuScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  menuArrow: {
    marginLeft: 8,
  },
});

// =====================================
// Modal Styles
// =====================================
export const NotificationModalStyles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    borderRadius: 10,
    overflow: 'hidden',
    zIndex: 9999,
    elevation: 1000,
    maxHeight: '80%',
    width: '90%',
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
    width: '100%',
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