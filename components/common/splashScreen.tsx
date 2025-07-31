// app/splash.tsx
import { Colors } from '@/shared/styles/global';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const SplashScreen = () => {
  useEffect(() => {
    // 앱 초기화 작업 수행
    const initializeApp = async () => {
      try {
        // 여기서 초기화 작업 수행
        // 예: 사용자 인증 상태 확인, 설정 로드 등
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2초 딜레이
        
        // 초기화 완료 후 메인 화면으로 이동
        router.replace('/');
      } catch (error) {
        console.error('앱 초기화 실패:', error);
        // 에러 처리
        router.replace('/');
      }
    };

    initializeApp();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* 앱 로고 */}
        <Text style={styles.logo}>Audix</Text>
        
        {/* 로딩 인디케이터 */}
        <ActivityIndicator 
          size="large" 
          color={Colors.textPrimary} 
          style={styles.loader} 
        />
        
        {/* 로딩 메시지 */}
        <Text style={styles.message}>
          AI 기반 이상음 감지 시스템을 시작하는 중...
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 40,
  },
  loader: {
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default SplashScreen;