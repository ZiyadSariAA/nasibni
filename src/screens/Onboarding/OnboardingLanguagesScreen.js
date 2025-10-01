import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { OnboardingQuestion } from '../../components/onboarding';
import { Text } from '../../components/main';

export default function OnboardingLanguagesScreen({ navigation }) {
  const { isArabic } = useLanguage();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [selectedLanguages, setSelectedLanguages] = useState(onboardingData.chatLanguages || []);

  const questionText = isArabic ? 'ما اللغات التي تتحدث بها؟' : 'What languages do you speak?';
  const subtitle = isArabic ? '(اختر واحدة أو أكثر)' : '(Select one or more)';

  const languages = [
    { id: 'arabic', label: isArabic ? 'العربية' : 'Arabic' },
    { id: 'english', label: isArabic ? 'الإنجليزية' : 'English' },
    { id: 'french', label: isArabic ? 'الفرنسية' : 'French' },
    { id: 'urdu', label: isArabic ? 'الأردية' : 'Urdu' },
    { id: 'turkish', label: isArabic ? 'التركية' : 'Turkish' },
    { id: 'malay', label: isArabic ? 'الماليزية' : 'Malay' },
  ];

  const toggleLanguage = (langId) => {
    if (selectedLanguages.includes(langId)) {
      setSelectedLanguages(selectedLanguages.filter(id => id !== langId));
    } else {
      setSelectedLanguages([...selectedLanguages, langId]);
    }
  };

  const handleNext = () => {
    if (selectedLanguages.length > 0) {
      updateOnboardingData('chatLanguages', selectedLanguages);
      navigation.navigate('OnboardingSmoking');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <OnboardingQuestion
      question={`${questionText} ${subtitle}`}
      onNext={handleNext}
      onBack={handleBack}
      currentStep={18}
      totalSteps={23}
      isArabic={isArabic}
      nextDisabled={selectedLanguages.length === 0}
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="gap-3">
          {languages.map((lang) => {
            const isSelected = selectedLanguages.includes(lang.id);
            return (
              <TouchableOpacity
                key={lang.id}
                className={`bg-white rounded-2xl border-2 p-4 flex-row items-center justify-between ${
                  isSelected ? 'border-[#5B2C91] bg-[#5B2C91]/10' : 'border-[#E7E5EA]'
                }`}
                onPress={() => toggleLanguage(lang.id)}
                activeOpacity={0.8}
              >
                <Text 
                  variant="body" 
                  weight={isSelected ? 'semibold' : 'regular'}
                  className={`text-lg flex-1 ${isSelected ? 'text-[#5B2C91]' : 'text-[#1A1A1A]'} ${
                    isArabic ? 'text-right' : 'text-left'
                  }`}
                >
                  {lang.label}
                </Text>
                {isSelected && (
                  <View className="w-6 h-6 rounded-full bg-[#5B2C91] items-center justify-center">
                    <Text className="text-white text-base font-bold">✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </OnboardingQuestion>
  );
}

