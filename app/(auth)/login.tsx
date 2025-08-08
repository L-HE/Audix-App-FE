// app/(auth)/login.tsx
import { Colors } from '@/shared/styles/global';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { LoginScreenStyles as style } from '../../shared/styles/screens';

export default function LoginScreen() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  
  // 포커스 상태 관리
  const [userIdFocused, setUserIdFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const passwordInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // 키보드 이벤트 처리
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        // 키보드가 올라왔을 때 포커스된 필드로 스크롤
        if (userIdFocused) {
          setTimeout(() => {
            scrollViewRef.current?.scrollTo({ y: 100, animated: true });
          }, 100);
        } else if (passwordFocused) {
          setTimeout(() => {
            scrollViewRef.current?.scrollTo({ y: 200, animated: true });
          }, 100);
        }
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        // 키보드가 내려갔을 때 원래 위치로 스크롤
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        }, 100);
      }
    );

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, [userIdFocused, passwordFocused]);

  const handleLogin = async () => {
    router.replace('/(tabs)'); // 임시로 바로 이동
    setIsLoading(true);
    setShowPasswordError(false);
  };

  return (
    <KeyboardAvoidingView 
      style={style.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        ref={scrollViewRef}
        style={style.scrollView}
        contentContainerStyle={style.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={style.content}>
          {/* 로고 영역 - 배경 도형들 포함 */}
          <View style={style.logoContainer}>
            <View style={style.backgroundShapes}>
              <View style={style.circle} />
              <Image
                source={require('../../assets/images/pictures/login_left.png')}
                style={style.triangleLeft}
              />
            </View>
            
            <Image
              source={require('../../assets/images/logos/AudixLogoNavy.png')}
              style={style.logo}
              resizeMode="contain"
            />
          </View>

          {/* 입력 폼 */}
          <View style={style.form}>
            <View style={style.inputContainer}>
              <View style={style.inputWrapper}>
                <View style={style.inputIcon}>
                  <Ionicons 
                    name="person-circle-outline" 
                    size={35} 
                    color={userIdFocused ? Colors.navy400 : Colors.loginIcon}
                  />
                </View>
                <TextInput
                  style={style.input}
                  placeholder="사원번호를 입력해주세요."
                  placeholderTextColor={Colors.textFourth}
                  value={userId}
                  onChangeText={setUserId}
                  keyboardType="default"
                  autoCapitalize="none"
                  returnKeyType="next"
                  autoFocus={true}
                  onFocus={() => setUserIdFocused(true)}
                  onBlur={() => setUserIdFocused(false)}
                  onSubmitEditing={() => {
                    passwordInputRef.current?.focus();
                  }}
                />
              </View>
              <View style={[
                style.inputDivider,
                { backgroundColor: userIdFocused ? Colors.navy400 : Colors.backgroundInput }
              ]} />
            </View>

            <View style={style.inputContainer}>
              <View style={style.inputWrapper}>
                <View style={style.inputIcon}>
                  <Ionicons 
                    name="lock-closed-outline" 
                    size={35} 
                    color={passwordFocused ? Colors.navy400 : Colors.loginIcon}
                  />
                </View>
                <TextInput
                  ref={passwordInputRef}
                  style={style.input}
                  placeholder="비밀번호를 입력해주세요."
                  placeholderTextColor={Colors.textFourth}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
              </View>
              <View style={[
                style.inputDivider,
                { backgroundColor: passwordFocused ? Colors.navy400 : Colors.backgroundInput }
              ]} />
              
              {showPasswordError && (
                <Text style={style.errorText}>
                  아이디 또는 비밀번호를 다시 확인해주세요.
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              style={[style.loginButton, isLoading && style.buttonDisabled]}
            >
              <Text style={style.loginButtonText}>
                {isLoading ? '로그인 중...' : 'LOGIN'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={style.forgotPassword}>비밀번호 변경</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}