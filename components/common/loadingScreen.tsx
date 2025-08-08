// components/common/LoadingScreen.tsx
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { LoadingScreenStyles } from '../../shared/styles/components';
import { Colors } from '../../shared/styles/global';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  return (
    <View style={LoadingScreenStyles.container}>
      <View style={LoadingScreenStyles.content}>
        <ActivityIndicator size="large" color={Colors.textSecondary} />
        {message && (
          <Text style={LoadingScreenStyles.message}>{message}</Text>
        )}
      </View>
    </View>
  );
};

export default LoadingScreen;