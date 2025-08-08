// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthLayoutStyles as style } from '../../shared/styles/screens';

export default function AuthLayout() {
  return (
    <SafeAreaView style={style.container} edges={['top', 'bottom']}>
      <View style={style.content}>
        <Stack
          screenOptions={{
            headerShown: false,
            gestureEnabled: false,
          }}
        >
          <Stack.Screen
            name="login"
            options={{
              title: '로그인',
            }}
          />
        </Stack>
      </View>
    </SafeAreaView>
  );
}