import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { OnboardingQuestion } from '../../components/onboarding';
import { Text } from '../../components/main';

export default function OnboardingIdealPartnerScreen({ navigation }) {
  const { isArabic } = useLanguage();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [idealPartner, setIdealPartner] = useState(onboardingData.idealPartner || '');

  const questionText = isArabic ? 'صف شريك حياتك المثالي' : 'Describe your ideal life partner';
  const placeholderText = isArabic 
    ? 'مثال: أبحث عن شخص ملتزم، طموح، يحترم العائلة...'
    : 'Example: I\'m looking for someone committed, ambitious, who respects family...';

  const maxLength = 500;
  const charCount = idealPartner.length;

  const handleNext = () => {
    if (idealPartner.trim()) {
      updateOnboardingData('idealPartner', idealPartner.trim());
      navigation.navigate('OnboardingReview');
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
      currentStep={22}
      totalSteps={23}
      isArabic={isArabic}
      nextDisabled={!idealPartner.trim()}
    >
      <View className="gap-2">
        <TextInput
          className={`bg-white rounded-2xl border-2 border-[#E7E5EA] p-4 text-base text-[#1A1A1A] min-h-[150px] ${
            isArabic ? 'text-right' : 'text-left'
          }`}
          value={idealPartner}
          onChangeText={setIdealPartner}
          placeholder={placeholderText}
          placeholderTextColor="#9CA3AF"
          multiline
          textAlignVertical="top"
          maxLength={maxLength}
        />
        <Text variant="caption" color="muted" className={isArabic ? 'text-right' : 'text-left'}>
          {charCount}/{maxLength} {isArabic ? 'حرف' : 'characters'}
        </Text>
      </View>
    </OnboardingQuestion>
  );
}

