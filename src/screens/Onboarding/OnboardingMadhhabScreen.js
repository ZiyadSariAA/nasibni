import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { OnboardingQuestion } from '../../components/onboarding';
import { Text } from '../../components/main';

export default function OnboardingMadhhabScreen({ navigation }) {
  const { isArabic } = useLanguage();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [madhhab, setMadhhab] = useState(onboardingData.madhhab);

  const questionText = isArabic ? 'ما هو مذهبك؟' : 'What is your Madhhab?';

  const options = [
    { id: 'sunni', label: isArabic ? 'سني' : 'Sunni' },
    { id: 'shia', label: isArabic ? 'شيعي' : 'Shia' },
    { id: 'other', label: isArabic ? 'أخرى' : 'Other' },
    { id: 'prefer_not', label: isArabic ? 'أفضل عدم الذكر' : 'Prefer not to say' },
  ];

  const handleNext = () => {
    if (madhhab) {
      updateOnboardingData('madhhab', madhhab);
      navigation.navigate('OnboardingReligiosity');
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
      currentStep={10}
      totalSteps={23}
      isArabic={isArabic}
      nextDisabled={!madhhab}
    >
      <View className="gap-3">
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            className={`bg-white rounded-2xl border-2 p-4 flex-row items-center justify-between ${
              madhhab === option.id ? 'border-[#5B2C91] bg-[#5B2C91]/10' : 'border-[#E7E5EA]'
            }`}
            onPress={() => setMadhhab(option.id)}
            activeOpacity={0.8}
          >
            <Text 
              variant="body" 
              weight={madhhab === option.id ? 'semibold' : 'regular'}
              className={`text-lg flex-1 ${madhhab === option.id ? 'text-[#5B2C91]' : 'text-[#1A1A1A]'} ${
                isArabic ? 'text-right' : 'text-left'
              }`}
            >
              {option.label}
            </Text>
            {madhhab === option.id && (
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

