import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';

import { useAuth } from '../contexts/AuthContext';
import { Text } from '../components/main';
import SplashScreen from '../screens/main/splash/SplashScreen';
import WelcomeCarouselScreen from '../screens/main/welcome/WelcomeCarouselScreen';
import SignInScreen from '../screens/main/login/SignInScreen';
import OnboardingNavigator from './OnboardingNavigator';

const Stack = createNativeStackNavigator();

// Temporary Home Screen
function HomeScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text variant="h1" weight="bold" className="text-[#5B2C91] mb-4 text-center">
        مرحباً في ناسبني! 🎉
      </Text>
      <Text variant="body" color="secondary" className="text-center px-8 mb-2">
        تم إكمال ملفك الشخصي بنجاح
      </Text>
      <Text variant="caption" color="muted" className="text-center px-8 mt-4">
        الشاشة الرئيسية قريباً...
      </Text>
    </View>
  );
}

export default function AppNavigator() {
  const { user, initializing } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show splash for at least 2 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Show splash screen while initializing
  if (initializing || showSplash) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {!user ? (
          // Not signed in - Show auth flow
          <>
            <Stack.Screen name="Welcome" component={WelcomeCarouselScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
          </>
        ) : !user.profile?.completed ? (
          // Signed in but profile incomplete - Show onboarding
          <Stack.Screen 
            name="Onboarding" 
            component={OnboardingNavigator}
            options={{ gestureEnabled: false }}
          />
        ) : (
          // Signed in and profile complete - Show home
          <Stack.Screen name="Home" component={HomeScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
