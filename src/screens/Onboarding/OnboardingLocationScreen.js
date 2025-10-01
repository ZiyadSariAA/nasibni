import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { OnboardingQuestion } from '../../components/onboarding';
import { Text } from '../../components/main';

export default function OnboardingLocationScreen({ navigation }) {
  const { isArabic } = useLanguage();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [enableLocation, setEnableLocation] = useState(onboardingData.enableLocation);

  const questionText = isArabic 
    ? 'هل تريد تفعيل خدمات الموقع؟'
    : 'Do you want to enable location services?';

  const options = [
    { 
      id: true, 
      label: isArabic ? 'نعم، تفعيل الموقع' : 'Yes, enable location',
      description: isArabic ? 'للعثور على أشخاص قريبين منك' : 'To find people near you'
    },
    { 
      id: false, 
      label: isArabic ? 'لا، لاحقاً' : 'No, maybe later',
      description: isArabic ? 'يمكنك تفعيله لاحقاً من الإعدادات' : 'You can enable it later from settings'
    }
  ];

  const handleNext = () => {
    updateOnboardingData('enableLocation', enableLocation !== null ? enableLocation : false);
    navigation.navigate('OnboardingGender');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <OnboardingQuestion
      question={questionText}
      onNext={handleNext}
      onBack={handleBack}
      currentStep={2}
      totalSteps={23}
      isArabic={isArabic}
      nextDisabled={false}
      isOptional={true}
    >
      <View className="gap-3">
        {options.map((option) => (
          <TouchableOpacity
            key={option.id.toString()}
            className={`bg-white rounded-2xl border-2 p-4 ${
              enableLocation === option.id ? 'border-[#5B2C91] bg-[#5B2C91]/10' : 'border-[#E7E5EA]'
            }`}
            onPress={() => setEnableLocation(option.id)}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text 
                variant="body" 
                weight={enableLocation === option.id ? 'semibold' : 'regular'}
                className={`text-lg flex-1 ${enableLocation === option.id ? 'text-[#5B2C91]' : 'text-[#1A1A1A]'} ${
                  isArabic ? 'text-right' : 'text-left'
                }`}
              >
                {option.label}
              </Text>
              {enableLocation === option.id && (
                <View className="w-6 h-6 rounded-full bg-[#5B2C91] items-center justify-center">
                  <Text className="text-white text-base font-bold">✓</Text>
                </View>
              )}
            </View>
            <Text 
              variant="caption" 
              color="muted"
              className={isArabic ? 'text-right' : 'text-left'}
            >
              {option.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </OnboardingQuestion>
  );
}
