import React from 'react';
import { View, Text } from 'react-native';
import { SmartStatusBar } from '../../../components/main';

export default function ChatsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <SmartStatusBar backgroundColor="#FFFFFF" />
      <Text className="text-2xl font-bold text-[#5B2C91]">Chats Screen</Text>
    </View>
  );
}
