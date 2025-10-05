import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { APP_NAME_STYLE } from '../../../config/fonts';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 2500); // 2.5 seconds

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View className="flex-1 bg-primary items-center justify-center">
      <View className="items-center">
        <Image 
          source={require('../../../assets/logos/Group1.png')} 
          className="w-30 h-30 mb-6"
          resizeMode="contain"
        />
        <Text
          className="text-4xl"
          style={{...APP_NAME_STYLE, color: '#FFFFFF'}}
        >
          ناسبني
        </Text>
      </View>
    </View>
  );
}
