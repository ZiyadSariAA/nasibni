import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { OnboardingQuestion } from '../../components/onboarding';
import { Text } from '../../components/main';

export default function OnboardingWorkScreen({ navigation }) {
  const { isArabic } = useLanguage();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [work, setWork] = useState(onboardingData.workStatus || '');

  const questionText = isArabic ? 'ما هي مهنتك؟' : 'What is your profession?';
  const optional = isArabic ? '(اختياري)' : '(Optional)';
  const placeholderText = isArabic ? 'مثال: مهندس، طبيب، معلم' : 'Example: Engineer, Doctor, Teacher';

  const handleNext = () => {
    updateOnboardingData('workStatus', work.trim() || null);
    navigation.navigate('OnboardingMarriageType');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <OnboardingQuestion
      question={`${questionText} ${optional}`}
      onNext={handleNext}
      onBack={handleBack}
      currentStep={14}
      totalSteps={23}
      isArabic={isArabic}
      nextDisabled={false}
      isOptional={true}
    >
      <View className="gap-4">
        <TextInput
          className={`bg-white rounded-2xl border-2 border-[#E7E5EA] p-4 text-lg text-[#1A1A1A] ${
            isArabic ? 'text-right' : 'text-left'
          }`}
          value={work}
          onChangeText={setWork}
          placeholder={placeholderText}
          placeholderTextColor="#9CA3AF"
        />
        <Text variant="caption" color="muted" className={isArabic ? 'text-right' : 'text-left'}>
          {isArabic 
            ? 'يمكنك ترك هذا الحقل فارغاً إذا لم ترغب في المشاركة'
            : 'You can leave this field empty if you prefer not to share'
          }
        </Text>
      </View>
    </OnboardingQuestion>
  );
}

