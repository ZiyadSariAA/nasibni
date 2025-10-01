import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { OnboardingQuestion } from '../../components/onboarding';
import { Text } from '../../components/main';

export default function OnboardingAboutScreen({ navigation }) {
  const { isArabic } = useLanguage();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [about, setAbout] = useState(onboardingData.aboutMe || '');

  const questionText = isArabic ? 'اكتب عن نفسك' : 'Write about yourself';
  const placeholderText = isArabic 
    ? 'مثال: أنا شخص هادئ، أحب القراءة والرياضة...'
    : 'Example: I\'m a calm person, I love reading and sports...';

  const maxLength = 500;
  const charCount = about.length;

  const handleNext = () => {
    if (about.trim()) {
      updateOnboardingData('aboutMe', about.trim());
      navigation.navigate('OnboardingIdealPartner');
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
      currentStep={21}
      totalSteps={23}
      isArabic={isArabic}
      nextDisabled={!about.trim()}
    >
      <View className="gap-2">
        <TextInput
          className={`bg-white rounded-2xl border-2 border-[#E7E5EA] p-4 text-base text-[#1A1A1A] min-h-[150px] ${
            isArabic ? 'text-right' : 'text-left'
          }`}
          value={about}
          onChangeText={setAbout}
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

