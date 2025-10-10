import './global.css';
import AppNavigator from './src/navigation/AppNavigator';
import { LanguageProvider } from './src/contexts/LanguageContext';
import { TranslationProvider } from './src/contexts/TranslationContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { OnboardingProvider } from './src/contexts/OnboardingContext';
import {
  useFonts,
  Cairo_400Regular,
  Cairo_600SemiBold,
  Cairo_700Bold,
  Cairo_900Black
} from '@expo-google-fonts/cairo';
import {
  Tajawal_400Regular,
  Tajawal_500Medium,
  Tajawal_700Bold,
  Tajawal_900Black
} from '@expo-google-fonts/tajawal';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    // Cairo for everything - خط واحد موحد
    Cairo_400Regular,
    Cairo_600SemiBold,
    Cairo_700Bold,
    Cairo_900Black,
    // Tajawal for splash screen
    Tajawal_400Regular,
    Tajawal_500Medium,
    Tajawal_700Bold,
    Tajawal_900Black,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <LanguageProvider>
      <TranslationProvider>
        <AuthProvider>
          <OnboardingProvider>
            <AppNavigator />
          </OnboardingProvider>
        </AuthProvider>
      </TranslationProvider>
    </LanguageProvider>
  );
}
