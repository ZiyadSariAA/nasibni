import React, { useEffect, useRef } from 'react';
import { View, Text, Image, ActivityIndicator, Animated, Dimensions } from 'react-native';
import Constants from 'expo-constants';
import { SmartStatusBar } from '../../../components/main';
import { APP_NAME_STYLE } from '../../../config/fonts';

const { width } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  // Responsive logo size: 30% of screen width, max 150px
  const logoSize = Math.min(width * 0.3, 150);

  useEffect(() => {
    // Animate logo entry
    Animated.parallel([
      Animated.spring(logoOpacity, {
        toValue: 1,
        useNativeDriver: true,
        damping: 15,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        useNativeDriver: true,
        damping: 15,
      }),
    ]).start();

    // Animate text entry with delay
    Animated.spring(textOpacity, {
      toValue: 1,
      delay: 200,
      useNativeDriver: true,
      damping: 15,
    }).start();

    // Fade out and navigate
    const timer = setTimeout(() => {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        navigation.replace('Welcome');
      });
    }, 2200); // Start fade-out at 2.2s (finish at 2.5s)

    return () => clearTimeout(timer);
  }, [navigation, logoOpacity, logoScale, textOpacity, containerOpacity]);

  return (
    <Animated.View 
      className="flex-1 bg-primary items-center justify-center"
      style={{ opacity: containerOpacity }}
    >
      <SmartStatusBar backgroundColor="#4F2396" />
      <View className="items-center">
        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
            marginBottom: 24,
          }}
        >
          <Image
            source={require('../../../assets/logos/Group1.png')}
            style={{ width: logoSize, height: logoSize }}
            resizeMode="contain"
            accessibilityLabel="Nasibni logo"
            accessible={true}
          />
        </Animated.View>
        <Animated.View style={{ opacity: textOpacity }}>
          <Text
            className="text-4xl"
            style={{...APP_NAME_STYLE, color: '#FFFFFF'}}
          >
            ناسبني
          </Text>
        </Animated.View>
        <ActivityIndicator 
          color="#FFFFFF" 
          size="small" 
          style={{ marginTop: 20 }}
        />
      </View>
      
      {/* Version Number */}
      <View style={{ position: 'absolute', bottom: 40 }}>
        <Text 
          style={{ 
            color: '#FFFFFF', 
            opacity: 0.7, 
            fontSize: 12,
            fontFamily: 'Cairo_400Regular'
          }}
        >
          v{Constants.expoConfig?.version || '1.0.0'}
        </Text>
      </View>
    </Animated.View>
  );
}
