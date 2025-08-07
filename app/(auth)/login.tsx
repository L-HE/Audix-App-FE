// app/(auth)/login.tsx
import { Colors } from '@/shared/styles/global';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { LoginScreenStyles } from '../../shared/styles/screens';

export default function LoginScreen() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  
  // 포커스 상태 관리
  const [userIdFocused, setUserIdFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleLogin = async () => {
    router.replace('/(tabs)'); // 임시로 바로 이동
    setIsLoading(true);
    setShowPasswordError(false);
  };

  return (
    <View style={LoginScreenStyles.container}>
      {/* 배경 도형들 */}
      <View style={LoginScreenStyles.backgroundShapes}>
        <View style={LoginScreenStyles.circle} />
        <Image
          source={require('../../assets/images/pictures/login_left.png')}
          style={LoginScreenStyles.triangleLeft}
        />
      </View>

      <View style={LoginScreenStyles.content}>
        {/* 로고 영역 */}
        <View style={LoginScreenStyles.logoContainer}>
          <Image
            source={require('../../assets/images/logos/AudixLogoNavy.png')}
            style={LoginScreenStyles.logo}
            resizeMode="contain"
          />
        </View>

        {/* 입력 폼 */}
        <View style={LoginScreenStyles.form}>
          <View style={LoginScreenStyles.inputContainer}>
            <View style={LoginScreenStyles.inputWrapper}>
              <View style={LoginScreenStyles.inputIcon}>
                <Ionicons 
                  name="person-circle-outline" 
                  size={35} 
                  color={userIdFocused ? Colors.navy400 : "#999"} // 포커스 시 색상 변경
                />
              </View>
              <TextInput
                style={LoginScreenStyles.input}
                placeholder="사원번호를 입력해주세요."
                placeholderTextColor="#999"
                value={userId}
                onChangeText={setUserId}
                keyboardType="default"
                autoCapitalize="none"
                // 포커스 이벤트 추가
                onFocus={() => setUserIdFocused(true)}
                onBlur={() => setUserIdFocused(false)}
              />
            </View>
            <View style={[
              LoginScreenStyles.inputDivider,
              { backgroundColor: userIdFocused ? Colors.navy400 : '#E0E0E0' } // 포커스 시 구분선 색상 변경
            ]} />
          </View>

          <View style={LoginScreenStyles.inputContainer}>
            <View style={LoginScreenStyles.inputWrapper}>
              <View style={LoginScreenStyles.inputIcon}>
                <Ionicons 
                  name="lock-closed-outline" 
                  size={35} 
                  color={passwordFocused ? Colors.navy400 : "#999"} // 포커스 시 색상 변경
                />
              </View>
              <TextInput
                style={LoginScreenStyles.input}
                placeholder="비밀번호를 입력해주세요."
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                // 포커스 이벤트 추가
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
            </View>
            <View style={[
              LoginScreenStyles.inputDivider,
              { backgroundColor: passwordFocused ? Colors.navy400 : '#E0E0E0' } // 포커스 시 구분선 색상 변경
            ]} />
            
            {showPasswordError && (
              <Text style={LoginScreenStyles.errorText}>
                아이디 또는 비밀번호를 다시 확인해주세요.
              </Text>
            )}
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            style={[LoginScreenStyles.loginButton, isLoading && LoginScreenStyles.buttonDisabled]}
          >
            <Text style={LoginScreenStyles.loginButtonText}>
              {isLoading ? '로그인 중...' : 'LOGIN'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={LoginScreenStyles.forgotPassword}>비밀번호 변경</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
