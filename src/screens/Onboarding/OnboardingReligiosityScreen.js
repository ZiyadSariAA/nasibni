import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { OnboardingQuestion } from '../../components/onboarding';
import { Text } from '../../components/main';

export default function OnboardingReligiosityScreen({ navigation }) {
  const { isArabic } = useLanguage();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [religiosity, setReligiosity] = useState(onboardingData.religiosityLevel);

  const questionText = isArabic ? 'ما مدى التزامك الديني؟' : 'What is your level of religiosity?';

  const options = [
    { id: 'very_religious', label: isArabic ? 'ملتزم جداً' : 'Very religious' },
    { id: 'religious', label: isArabic ? 'ملتزم' : 'Religious' },
    { id: 'moderate', label: isArabic ? 'متوسط' : 'Moderate' },
    { id: 'not_very', label: isArabic ? 'غير ملتزم كثيراً' : 'Not very religious' },
  ];

  const handleNext = () => {
    if (religiosity) {
      updateOnboardingData('religiosityLevel', religiosity);
      navigation.navigate('OnboardingPrayer');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <OnboardingQuestion
      question={questionText}
      onNext={handleNext}
      onBack={handleBack}
      currentStep={11}
      totalSteps={23}
      isArabic={isArabic}
      nextDisabled={!religiosity}
    >
      <View className="gap-3">
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            className={`bg-white rounded-2xl border-2 p-4 flex-row items-center justify-between ${
              religiosity === option.id ? 'border-[#5B2C91] bg-[#5B2C91]/10' : 'border-[#E7E5EA]'
            }`}
            onPress={() => setReligiosity(option.id)}
            activeOpacity={0.8}
          >
            <Text 
              variant="body" 
              weight={religiosity === option.id ? 'semibold' : 'regular'}
              className={`text-lg flex-1 ${religiosity === option.id ? 'text-[#5B2C91]' : 'text-[#1A1A1A]'} ${
                isArabic ? 'text-right' : 'text-left'
              }`}
            >
              {option.label}
            </Text>
            {religiosity === option.id && (
              <View className="w-6 h-6 rounded-full bg-[#5B2C91] items-center justify-center">
                <Text className="text-white text-base font-bold">✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </OnboardingQuestion>
  );
}

