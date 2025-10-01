import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { OnboardingQuestion } from '../../components/onboarding';
import { Text } from '../../components/main';

export default function OnboardingLanguageScreen({ navigation }) {
  const { isArabic } = useLanguage();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [selectedLanguage, setSelectedLanguage] = useState(onboardingData.appLanguage);

  const questionText = isArabic ? 'اختر لغة التطبيق' : 'Choose your app language';

  const options = [
    { id: 'ar', label: 'العربية', value: 'Arabic' },
    { id: 'en', label: 'English', value: 'English' }
  ];

  const handleNext = () => {
    if (selectedLanguage) {
      updateOnboardingData('appLanguage', selectedLanguage);
      navigation.navigate('OnboardingLocation');
    }
  };

  const handleBack = () => {
    // First screen - no back
  };

  return (
    <OnboardingQuestion
      question={questionText}
      onNext={handleNext}
      onBack={null}
      currentStep={1}
      totalSteps={23}
      isArabic={isArabic}
      nextDisabled={!selectedLanguage}
    >
      <View className="gap-3">
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            className={`bg-white rounded-2xl border-2 p-4 flex-row items-center justify-between ${
              selectedLanguage === option.id ? 'border-[#5B2C91] bg-[#5B2C91]/10' : 'border-[#E7E5EA]'
            }`}
            onPress={() => setSelectedLanguage(option.id)}
            activeOpacity={0.8}
          >
            <Text 
              variant="body" 
              weight={selectedLanguage === option.id ? 'semibold' : 'regular'}
              className={`text-lg flex-1 ${selectedLanguage === option.id ? 'text-[#5B2C91]' : 'text-[#1A1A1A]'} ${
                isArabic ? 'text-right' : 'text-left'
              }`}
            >
              {option.label}
            </Text>
            {selectedLanguage === option.id && (
              <View className="w-6 h-6 rounded-full bg-[#5B2C91] items-center justify-center">
                <Text className="text-white text-base font-bold">✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <Text variant="caption" color="muted" className={`mt-4 ${isArabic ? 'text-right' : 'text-left'}`}>
        {isArabic 
          ? 'هذا يغير لغة الواجهة فقط'
          : 'This changes the interface language only'
        }
      </Text>
    </OnboardingQuestion>
  );
}
