import React, { createContext, useContext } from 'react';
import { useLanguage } from './LanguageContext';

const TranslationContext = createContext();

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

export const TranslationProvider = ({ children }) => {
  const { isArabic, isLoading } = useLanguage();

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

  // Translation function for common terms
  const t = (key) => {
    const translations = {
      selectFromList: {
        en: 'Select from list',
        ar: 'اختر من القائمة'
      },
      selectCountry: {
        en: 'Select Country',
        ar: 'اختر الدولة'
      },
      search: {
        en: 'Search...',
        ar: 'بحث...'
      },
      noResults: {
        en: 'No results found',
        ar: 'لا توجد نتائج'
      },
      selectOption: {
        en: 'Select an option',
        ar: 'اختر من القائمة'
      }
    };

    return getText(translations[key] || { en: key, ar: key });
  };

  const value = {
    getText,
    getLabel,
    getPlaceholder,
    t,
    isArabic
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};
