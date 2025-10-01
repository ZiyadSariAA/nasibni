import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { OnboardingQuestion } from '../../components/onboarding';
import { Text } from '../../components/main';

export default function OnboardingSmokingScreen({ navigation }) {
  const { isArabic } = useLanguage();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [smoking, setSmoking] = useState(onboardingData.smoking);

  const questionText = isArabic ? 'هل تدخن؟' : 'Do you smoke?';
  const optional = isArabic ? '(اختياري)' : '(Optional)';

  const options = [
    { id: 'no', label: isArabic ? 'لا' : 'No' },
    { id: 'yes', label: isArabic ? 'نعم' : 'Yes' },
    { id: 'occasionally', label: isArabic ? 'أحياناً' : 'Occasionally' },
    { id: 'skip', label: isArabic ? 'تخطي' : 'Skip' },
  ];

  const handleNext = () => {
    if (smoking === 'skip') {
      updateOnboardingData('smoking', null);
    } else if (smoking) {
      updateOnboardingData('smoking', smoking);
    }
    navigation.navigate('OnboardingPhotos');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <OnboardingQuestion
      question={`${questionText} ${optional}`}
      onNext={handleNext}
      onBack={handleBack}
      currentStep={19}
      totalSteps={23}
      isArabic={isArabic}
      nextDisabled={false}
      isOptional={true}
    >
      <View className="gap-3">
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            className={`bg-white rounded-2xl border-2 p-4 flex-row items-center justify-between ${
              smoking === option.id ? 'border-[#5B2C91] bg-[#5B2C91]/10' : 'border-[#E7E5EA]'
            }`}
            onPress={() => setSmoking(option.id)}
            activeOpacity={0.8}
          >
            <Text 
              variant="body" 
              weight={smoking === option.id ? 'semibold' : 'regular'}
              className={`text-lg flex-1 ${smoking === option.id ? 'text-[#5B2C91]' : 'text-[#1A1A1A]'} ${
                isArabic ? 'text-right' : 'text-left'
              }`}
            >
              {option.label}
            </Text>
            {smoking === option.id && option.id !== 'skip' && (
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

