import React, { createContext, useContext } from 'react';
import { useLanguage } from './LanguageContext';
import translations from './translations.json';

const TranslationContext = createContext();

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

export const TranslationProvider = ({ children }) => {
  const { isArabic, isRTL, isLoading, language } = useLanguage();

  // Don't render until language is loaded
  if (isLoading) {
    return null;
  }

  // Helper function to get localized text from object
  const getText = (textObject) => {
    if (!textObject) return '';
    
    if (typeof textObject === 'string') {
      return textObject;
    }
    
    if (typeof textObject === 'object' && textObject !== null) {
      return isArabic ? textObject.ar : textObject.en;
    }
    
    return '';
  };

  // Helper function to get option label
  const getLabel = (option) => {
    if (!option || !option.label) return '';
    return getText(option.label);
  };

  // Helper function to get placeholder text
  const getPlaceholder = (placeholder, fallback = '') => {
    if (placeholder) {
      return getText(placeholder);
    }
    return fallback;
  };

  // Enhanced translation function with nested key support
  const t = (key) => {
    // Handle nested keys like "common.skip" or "settings.language"
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        // Key not found, return the key itself
        return key;
      }
    }
    
    // If we found a translation object, get the text
    if (value && typeof value === 'object') {
      return getText(value);
    }
    
    // If it's already a string, return it
    if (typeof value === 'string') {
      return value;
    }
    
    // Fallback to key if nothing found
    return key;
  };

  // Direct access to translation categories
  const common = Object.keys(translations.common || {}).reduce((acc, key) => {
    acc[key] = getText(translations.common[key]);
    return acc;
  }, {});

  const value = {
    getText,
    getLabel,
    getPlaceholder,
    t,
    common,
    isArabic,
    isRTL,
    language
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};
