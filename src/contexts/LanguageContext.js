import React, { createContext, useContext, useState, useEffect } from 'react';
import { I18nManager, Alert } from 'react-native';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageContext = createContext();

const LANGUAGE_KEY = '@app_language';

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ar'); // Default to Arabic
  const [isLoading, setIsLoading] = useState(true);

  // Load saved language on app start
  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      // Try to load saved language preference
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      
      if (savedLanguage) {
        console.log('✅ Loaded saved language:', savedLanguage);
        setLanguage(savedLanguage);
        applyRTL(savedLanguage === 'ar');
      } else {
        // No saved preference, detect device language
        const locale = Localization.locale || Localization.getLocales()?.[0]?.languageCode || 'ar';
        const deviceLanguage = typeof locale === 'string' ? locale.split('-')[0] : 'ar';
        
        // Set language based on device language
        const detectedLang = deviceLanguage === 'ar' ? 'ar' : 'en';
        console.log('📱 Detected device language:', detectedLang);
        setLanguage(detectedLang);
        applyRTL(detectedLang === 'ar');
        
        // Save the detected language
        await AsyncStorage.setItem(LANGUAGE_KEY, detectedLang);
      }
    } catch (error) {
      console.log('❌ Language loading error:', error);
      // Fallback to Arabic
      setLanguage('ar');
      applyRTL(true);
    }
    
    setIsLoading(false);
  };

  // Apply RTL/LTR based on language
  const applyRTL = (isRTL) => {
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);
      console.log(`🔄 RTL ${isRTL ? 'enabled' : 'disabled'} (I18nManager updated)`);
    }
  };

  const changeLanguage = async (newLanguage) => {
    try {
      const newIsRTL = newLanguage === 'ar';
      const needsReload = I18nManager.isRTL !== newIsRTL;

      // Save language preference
      await AsyncStorage.setItem(LANGUAGE_KEY, newLanguage);
      console.log('💾 Saved language:', newLanguage);

      // Update state
      setLanguage(newLanguage);
      applyRTL(newIsRTL);

      // If RTL direction changed, show alert about restart (only in production)
      if (needsReload) {
        Alert.alert(
          newLanguage === 'ar' ? 'تم تغيير اللغة' : 'Language Changed',
          newLanguage === 'ar' 
            ? 'سيتم تطبيق التغييرات فوراً' 
            : 'Changes will apply immediately',
          [
            {
              text: newLanguage === 'ar' ? 'حسناً' : 'OK',
              onPress: () => console.log('✅ Language changed to:', newLanguage)
            }
          ]
        );
      }
    } catch (error) {
      console.error('❌ Error changing language:', error);
    }
  };

  const isArabic = language === 'ar';
  const isEnglish = language === 'en';
  const isRTL = isArabic;

  const value = {
    language,
    isArabic,
    isEnglish,
    isRTL,
    changeLanguage,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};