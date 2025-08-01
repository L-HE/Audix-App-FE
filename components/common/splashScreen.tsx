// splashScreen.tsx
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../shared/styles/global';

const SplashScreen = () => {
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