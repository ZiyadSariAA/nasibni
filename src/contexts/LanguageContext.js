import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Localization from 'expo-localization';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      // Detect device language with fallback
      const locale = Localization.locale || Localization.getLocales()?.[0]?.languageCode || 'en';
      const deviceLanguage = typeof locale === 'string' ? locale.split('-')[0] : 'en';
      
      // Set language based on device language
      if (deviceLanguage === 'ar') {
        setLanguage('ar');
      } else {
        setLanguage('en'); // Default to English for other languages
      }
    } catch (error) {
      console.log('Language detection error:', error);
      // Fallback to English if there's any error
      setLanguage('en');
    }
    
    setIsLoading(false);
  }, []);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const isArabic = language === 'ar';
  const isEnglish = language === 'en';

  const value = {
    language,
    isArabic,
    isEnglish,
    changeLanguage,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};