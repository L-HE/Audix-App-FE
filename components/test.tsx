// components/test/TailwindTest.tsx
import React from 'react';
import { Text, View } from 'react-native';

const TailwindTest = () => {
  return (
    <View className="flex-1 justify-center items-center bg-app-primary">
      <View className="card-danger">
        <Text className="text-app-primary text-lg font-bold">
          TailwindCSS 테스트
        </Text>
        <Text className="text-app-secondary mt-2">
          이 텍스트가 보이면 설정 완료!
        </Text>
      </View>
      
      <View className="flex flex-row space-x-4 mt-4">
        <View className="w-8 h-8 bg-danger rounded"></View>
        <View className="w-8 h-8 bg-warning rounded"></View>
        <View className="w-8 h-8 bg-normal rounded"></View>
        <View className="w-8 h-8 bg-unknown rounded"></View>
      </View>
    </View>
  );
};

export default TailwindTest;