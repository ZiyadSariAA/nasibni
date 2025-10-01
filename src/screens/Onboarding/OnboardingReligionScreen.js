import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { OnboardingQuestion } from '../../components/onboarding';
import { Text } from '../../components/main';

export default function OnboardingReligionScreen({ navigation }) {
  const { isArabic } = useLanguage();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [religion, setReligion] = useState(onboardingData.religion);

  const questionText = isArabic ? 'ما هو دينك؟' : 'What is your religion?';

  const options = [
    { id: 'muslim', label: isArabic ? 'مسلم/مسلمة' : 'Muslim' },
    { id: 'christian', label: isArabic ? 'مسيحي/مسيحية' : 'Christian' },
    { id: 'other', label: isArabic ? 'أخرى' : 'Other' },
  ];

  const handleNext = () => {
    if (religion) {
      updateOnboardingData('religion', religion);
      if (religion === 'muslim') {
        navigation.navigate('OnboardingMadhhab');
      } else {
        navigation.navigate('OnboardingReligiosity');
      }
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
      currentStep={9}
      totalSteps={23}
      isArabic={isArabic}
      nextDisabled={!religion}
    >
      <View className="gap-3">
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            className={`bg-white rounded-2xl border-2 p-4 flex-row items-center justify-between ${
              religion === option.id ? 'border-[#5B2C91] bg-[#5B2C91]/10' : 'border-[#E7E5EA]'
            }`}
            onPress={() => setReligion(option.id)}
            activeOpacity={0.8}
          >
            <Text 
              variant="body" 
              weight={religion === option.id ? 'semibold' : 'regular'}
              className={`text-lg flex-1 ${religion === option.id ? 'text-[#5B2C91]' : 'text-[#1A1A1A]'} ${
                isArabic ? 'text-right' : 'text-left'
              }`}
            >
              {option.label}
            </Text>
            {religion === option.id && (
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

