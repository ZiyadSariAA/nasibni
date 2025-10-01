import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { OnboardingQuestion } from '../../components/onboarding';
import { Text } from '../../components/main';

export default function OnboardingMarriageTypeScreen({ navigation }) {
  const { isArabic } = useLanguage();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [marriageType, setMarriageType] = useState(onboardingData.marriageType);

  const questionText = isArabic ? 'ما نوع الزواج الذي تبحث عنه؟' : 'What type of marriage are you looking for?';

  const options = [
    { id: 'traditional', label: isArabic ? 'زواج تقليدي' : 'Traditional marriage' },
    { id: 'modern', label: isArabic ? 'زواج عصري' : 'Modern marriage' },
    { id: 'mixed', label: isArabic ? 'مزيج من الاثنين' : 'Mix of both' },
  ];

  const handleNext = () => {
    if (marriageType) {
      updateOnboardingData('marriageType', marriageType);
      navigation.navigate('OnboardingMarriagePlan');
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
      currentStep={15}
      totalSteps={23}
      isArabic={isArabic}
      nextDisabled={!marriageType}
    >
      <View className="gap-3">
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            className={`bg-white rounded-2xl border-2 p-4 flex-row items-center justify-between ${
              marriageType === option.id ? 'border-[#5B2C91] bg-[#5B2C91]/10' : 'border-[#E7E5EA]'
            }`}
            onPress={() => setMarriageType(option.id)}
            activeOpacity={0.8}
          >
            <Text 
              variant="body" 
              weight={marriageType === option.id ? 'semibold' : 'regular'}
              className={`text-lg flex-1 ${marriageType === option.id ? 'text-[#5B2C91]' : 'text-[#1A1A1A]'} ${
                isArabic ? 'text-right' : 'text-left'
              }`}
            >
              {option.label}
            </Text>
            {marriageType === option.id && (
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

