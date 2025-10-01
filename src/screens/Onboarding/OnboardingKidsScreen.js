import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { OnboardingQuestion } from '../../components/onboarding';
import { Text } from '../../components/main';

export default function OnboardingKidsScreen({ navigation }) {
  const { isArabic } = useLanguage();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [kids, setKids] = useState(onboardingData.kidsPreference);

  const questionText = isArabic ? 'هل تريد أطفالاً في المستقبل؟' : 'Do you want children in the future?';

  const options = [
    { id: 'yes', label: isArabic ? 'نعم، أريد أطفالاً' : 'Yes, I want children' },
    { id: 'maybe', label: isArabic ? 'ربما' : 'Maybe' },
    { id: 'no', label: isArabic ? 'لا، لا أريد أطفالاً' : 'No, I don\'t want children' },
    { id: 'not_sure', label: isArabic ? 'لست متأكد/متأكدة' : 'Not sure' },
  ];

  const handleNext = () => {
    if (kids) {
      updateOnboardingData('kidsPreference', kids);
      navigation.navigate('OnboardingLanguages');
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
      currentStep={17}
      totalSteps={23}
      isArabic={isArabic}
      nextDisabled={!kids}
    >
      <View className="gap-3">
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            className={`bg-white rounded-2xl border-2 p-4 flex-row items-center justify-between ${
              kids === option.id ? 'border-[#5B2C91] bg-[#5B2C91]/10' : 'border-[#E7E5EA]'
            }`}
            onPress={() => setKids(option.id)}
            activeOpacity={0.8}
          >
            <Text 
              variant="body" 
              weight={kids === option.id ? 'semibold' : 'regular'}
              className={`text-lg flex-1 ${kids === option.id ? 'text-[#5B2C91]' : 'text-[#1A1A1A]'} ${
                isArabic ? 'text-right' : 'text-left'
              }`}
            >
              {option.label}
            </Text>
            {kids === option.id && (
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

