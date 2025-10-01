import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { OnboardingQuestion } from '../../components/onboarding';
import { Text } from '../../components/main';

export default function OnboardingGenderScreen({ navigation }) {
  const { isArabic } = useLanguage();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [gender, setGender] = useState(onboardingData.gender);

  const questionText = isArabic ? 'ما هو جنسك؟' : 'What is your gender?';

  const options = [
    { 
      id: 'male', 
      label: isArabic ? 'ذكر' : 'Male',
      icon: '👨'
    },
    { 
      id: 'female', 
      label: isArabic ? 'أنثى' : 'Female',
      icon: '👩'
    }
  ];

  const handleNext = () => {
    if (gender) {
      updateOnboardingData('gender', gender);
      navigation.navigate('OnboardingBirthYear');
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
      currentStep={3}
      totalSteps={23}
      isArabic={isArabic}
      nextDisabled={!gender}
    >
      <View className="gap-3">
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            className={`bg-white rounded-2xl border-2 p-5 flex-row items-center ${
              gender === option.id ? 'border-[#5B2C91] bg-[#5B2C91]/10' : 'border-[#E7E5EA]'
            }`}
            onPress={() => setGender(option.id)}
            activeOpacity={0.8}
          >
            <Text className="text-3xl mr-3">{option.icon}</Text>
            <Text 
              variant="body" 
              weight={gender === option.id ? 'semibold' : 'regular'}
              className={`text-lg flex-1 ${gender === option.id ? 'text-[#5B2C91]' : 'text-[#1A1A1A]'} ${
                isArabic ? 'text-right' : 'text-left'
              }`}
            >
              {option.label}
            </Text>
            {gender === option.id && (
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
