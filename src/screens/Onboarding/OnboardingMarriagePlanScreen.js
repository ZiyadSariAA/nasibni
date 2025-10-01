import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { OnboardingQuestion } from '../../components/onboarding';
import { Text } from '../../components/main';

export default function OnboardingMarriagePlanScreen({ navigation }) {
  const { isArabic } = useLanguage();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [plan, setPlan] = useState(onboardingData.marriagePlan);

  const questionText = isArabic ? 'متى تخطط للزواج؟' : 'When do you plan to get married?';

  const options = [
    { id: 'asap', label: isArabic ? 'في أقرب وقت ممكن' : 'As soon as possible' },
    { id: 'within_year', label: isArabic ? 'خلال سنة' : 'Within a year' },
    { id: '1_2_years', label: isArabic ? 'خلال سنة إلى سنتين' : 'In 1-2 years' },
    { id: 'not_sure', label: isArabic ? 'لست متأكد/متأكدة' : 'Not sure yet' },
  ];

  const handleNext = () => {
    if (plan) {
      updateOnboardingData('marriagePlan', plan);
      navigation.navigate('OnboardingKids');
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
      currentStep={16}
      totalSteps={23}
      isArabic={isArabic}
      nextDisabled={!plan}
    >
      <View className="gap-3">
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            className={`bg-white rounded-2xl border-2 p-4 flex-row items-center justify-between ${
              plan === option.id ? 'border-[#5B2C91] bg-[#5B2C91]/10' : 'border-[#E7E5EA]'
            }`}
            onPress={() => setPlan(option.id)}
            activeOpacity={0.8}
          >
            <Text 
              variant="body" 
              weight={plan === option.id ? 'semibold' : 'regular'}
              className={`text-lg flex-1 ${plan === option.id ? 'text-[#5B2C91]' : 'text-[#1A1A1A]'} ${
                isArabic ? 'text-right' : 'text-left'
              }`}
            >
              {option.label}
            </Text>
            {plan === option.id && (
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

