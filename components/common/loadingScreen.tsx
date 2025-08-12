// components/common/LoadingScreen.tsx
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Colors } from '../../shared/styles/colors';
import { LoadingScreenStyles as style } from '../../shared/styles/components';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  return (
    <View style={style.container}>
      <View style={style.content}>
        <ActivityIndicator size="large" color={Colors.textSecondary} />
        {message && (
          <Text style={style.message}>{message}</Text>
        )}
      </View>
    </View>
  );
};

export default LoadingScreen;