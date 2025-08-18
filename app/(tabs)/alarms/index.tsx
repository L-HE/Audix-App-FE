// app/(tabs)/alarms/index.tsx
import React from 'react';
import { View, Text } from 'react-native';

const AlarmScreen: React.FC = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 16, color: '#666' }}>알림은 자동으로 모달로 표시됩니다</Text>
    </View>
  );
};

export default AlarmScreen;