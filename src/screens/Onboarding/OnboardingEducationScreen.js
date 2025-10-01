import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { OnboardingQuestion } from '../../components/onboarding';
import { Text } from '../../components/main';

export default function OnboardingEducationScreen({ navigation }) {
  const { isArabic } = useLanguage();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [education, setEducation] = useState(onboardingData.educationLevel);

  const questionText = isArabic ? 'ما هو مستواك التعليمي؟' : 'What is your education level?';

  const options = [
    { id: 'high_school', label: isArabic ? 'ثانوي' : 'High School' },
    { id: 'diploma', label: isArabic ? 'دبلوم' : 'Diploma' },
    { id: 'bachelor', label: isArabic ? 'بكالوريوس' : 'Bachelor' },
    { id: 'master', label: isArabic ? 'ماجستير' : 'Master' },
    { id: 'phd', label: isArabic ? 'دكتوراه' : 'PhD' },
  ];

  const handleNext = () => {
    if (education) {
      updateOnboardingData('educationLevel', education);
      navigation.navigate('OnboardingWork');
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
      currentStep={13}
      totalSteps={23}
      isArabic={isArabic}
      nextDisabled={!education}
    >
      <View className="gap-3">
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            className={`bg-white rounded-2xl border-2 p-4 flex-row items-center justify-between ${
              education === option.id ? 'border-[#5B2C91] bg-[#5B2C91]/10' : 'border-[#E7E5EA]'
            }`}
            onPress={() => setEducation(option.id)}
            activeOpacity={0.8}
          >
            <Text 
              variant="body" 
              weight={education === option.id ? 'semibold' : 'regular'}
              className={`text-lg flex-1 ${education === option.id ? 'text-[#5B2C91]' : 'text-[#1A1A1A]'} ${
                isArabic ? 'text-right' : 'text-left'
              }`}
            >
              {option.label}
            </Text>
            {education === option.id && (
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

