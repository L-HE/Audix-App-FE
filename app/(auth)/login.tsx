// app/(auth)/login.tsx
import { Colors } from '@/shared/styles/global';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function LoginScreen() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);

  const handleLogin = async () => {
    router.replace('/(tabs)'); // 임시로 바로 이동

    setIsLoading(true);
    setShowPasswordError(false);
  };

  return (
    <View style={styles.container}>
      {/* 배경 도형들 */}
      <View style={styles.backgroundShapes}>
        <View style={styles.circle} />
        <Image
          source={require('../../assets/images/pictures/login_left.png')}
          style={styles.triangleLeft}
        />
      </View>

      <View style={styles.content}>
        {/* 로고 영역 */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logos/AudixLogoNavy.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* 입력 폼 */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIcon}>
                <Ionicons 
                  name="person-circle-outline" 
                  size={35} 
                  color="#999" 
                />
              </View>
              <TextInput
                style={styles.input}
                placeholder="사원번호를 입력해주세요."
                placeholderTextColor="#999"
                value={userId}
                onChangeText={setUserId}
                keyboardType="default"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputDivider} />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIcon}>
                <Ionicons 
                  name="lock-closed-outline" 
                  size={35} 
                  color="#999" 
                />
              </View>
              <TextInput
                style={styles.input}
                placeholder="비밀번호를 입력해주세요."
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            <View style={styles.inputDivider} />
            
            {showPasswordError && (
              <Text style={styles.errorText}>
                아이디 또는 비밀번호를 다시 확인해주세요.
              </Text>
            )}
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            style={[styles.loginButton, isLoading && styles.buttonDisabled]}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? '로그인 중...' : 'LOGIN'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.forgotPassword}>비밀번호 변경</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    color: '#333',
    paddingVertical: 8,
  },
  inputDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
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
    color: '#FF3B30',
    marginTop: 4,
    marginLeft: 32,
  },
  loginButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 1,
  },
  forgotPassword: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});