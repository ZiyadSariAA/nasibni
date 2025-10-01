import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { OnboardingQuestion } from '../../components/onboarding';

export default function OnboardingNationalityScreen({ navigation }) {
  const { isArabic } = useLanguage();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [nationality, setNationality] = useState(onboardingData.nationality || '');

  const questionText = isArabic ? 'ما هي جنسيتك؟' : 'What is your nationality?';
  const placeholderText = isArabic ? 'مثال: سعودي' : 'Example: Saudi';

  const handleNext = () => {
    if (nationality.trim()) {
      updateOnboardingData('nationality', nationality.trim());
      navigation.navigate('OnboardingMaritalStatus');
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
      currentStep={7}
      totalSteps={23}
      isArabic={isArabic}
      nextDisabled={!nationality.trim()}
    >
      <View className="gap-4">
        <TextInput
          className={`bg-white rounded-2xl border-2 border-[#E7E5EA] p-4 text-lg text-[#1A1A1A] ${
            isArabic ? 'text-right' : 'text-left'
          }`}
          value={nationality}
          onChangeText={setNationality}
          placeholder={placeholderText}
          placeholderTextColor="#9CA3AF"
        />
      </View>
    </OnboardingQuestion>
  );
}
