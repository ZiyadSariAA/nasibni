import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { OnboardingQuestion } from '../../components/onboarding';
import { Text } from '../../components/main';

export default function OnboardingBirthYearScreen({ navigation }) {
  const { isArabic } = useLanguage();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [birthYear, setBirthYear] = useState(onboardingData.birthYear?.toString() || '');

  const questionText = isArabic ? 'ما هو عام ميلادك؟' : 'What is your birth year?';
  const placeholderText = isArabic ? 'مثال: 1995' : 'Example: 1995';

  const handleNext = () => {
    const year = parseInt(birthYear);
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;

    if (year && year >= 1940 && year <= currentYear - 18 && age <= 100) {
      updateOnboardingData('birthYear', year);
      navigation.navigate('OnboardingHeight');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const isValid = () => {
    const year = parseInt(birthYear);
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    return year >= 1940 && year <= currentYear - 18 && age <= 100;
  };

  const getAge = () => {
    const year = parseInt(birthYear);
    if (year) {
      const currentYear = new Date().getFullYear();
      return currentYear - year;
    }
    return null;
  };

  return (
    <OnboardingQuestion
      question={questionText}
      onNext={handleNext}
      onBack={handleBack}
      currentStep={4}
      totalSteps={23}
      isArabic={isArabic}
      nextDisabled={!isValid()}
    >
      <View className="gap-4">
        <TextInput
          className="bg-white rounded-2xl border-2 border-[#E7E5EA] p-4 text-2xl font-bold text-[#1A1A1A] text-center"
          value={birthYear}
          onChangeText={setBirthYear}
          placeholder={placeholderText}
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
          maxLength={4}
        />
        
        {getAge() && (
          <Text variant="body" color="secondary" className="text-center text-lg">
            {isArabic ? `العمر: ${getAge()} سنة` : `Age: ${getAge()} years`}
          </Text>
        )}

        <Text variant="caption" color="muted" className={`mt-2 ${isArabic ? 'text-right' : 'text-left'}`}>
          {isArabic 
            ? 'يجب أن يكون عمرك 18 سنة أو أكثر'
            : 'You must be 18 years or older'
          }
        </Text>
      </View>
    </OnboardingQuestion>
  );
}
