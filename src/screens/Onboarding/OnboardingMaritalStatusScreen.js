import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { OnboardingQuestion } from '../../components/onboarding';
import { Text } from '../../components/main';

export default function OnboardingMaritalStatusScreen({ navigation }) {
  const { isArabic } = useLanguage();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [maritalStatus, setMaritalStatus] = useState(onboardingData.maritalStatus);
  const [hasChildren, setHasChildren] = useState(onboardingData.hasChildren);

  const questionText = isArabic ? 'ما هي حالتك الاجتماعية؟' : 'What is your marital status?';

  const options = [
    { id: 'single', label: isArabic ? 'أعزب/عزباء' : 'Single' },
    { id: 'divorced', label: isArabic ? 'مطلق/مطلقة' : 'Divorced' },
    { id: 'widowed', label: isArabic ? 'أرمل/أرملة' : 'Widowed' },
  ];

  const childrenOptions = [
    { id: true, label: isArabic ? 'نعم' : 'Yes' },
    { id: false, label: isArabic ? 'لا' : 'No' },
  ];

  const handleNext = () => {
    if (maritalStatus) {
      updateOnboardingData('maritalStatus', maritalStatus);
      if (maritalStatus !== 'single') {
        updateOnboardingData('hasChildren', hasChildren);
      }
      navigation.navigate('OnboardingReligion');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const showChildrenQuestion = maritalStatus === 'divorced' || maritalStatus === 'widowed';

  return (
    <OnboardingQuestion
      question={questionText}
      onNext={handleNext}
      onBack={handleBack}
      currentStep={8}
      totalSteps={23}
      isArabic={isArabic}
      nextDisabled={!maritalStatus || (showChildrenQuestion && hasChildren === null)}
    >
      <View className="gap-6">
        <View className="gap-3">
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              className={`bg-white rounded-2xl border-2 p-4 flex-row items-center justify-between ${
                maritalStatus === option.id ? 'border-[#5B2C91] bg-[#5B2C91]/10' : 'border-[#E7E5EA]'
              }`}
              onPress={() => setMaritalStatus(option.id)}
              activeOpacity={0.8}
            >
              <Text 
                variant="body" 
                weight={maritalStatus === option.id ? 'semibold' : 'regular'}
                className={`text-lg flex-1 ${maritalStatus === option.id ? 'text-[#5B2C91]' : 'text-[#1A1A1A]'} ${
                  isArabic ? 'text-right' : 'text-left'
                }`}
              >
                {option.label}
              </Text>
              {maritalStatus === option.id && (
                <View className="w-6 h-6 rounded-full bg-[#5B2C91] items-center justify-center">
                  <Text className="text-white text-base font-bold">✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {showChildrenQuestion && (
          <View className="gap-3">
            <Text variant="body" weight="semibold" className={`text-lg text-[#1A1A1A] ${isArabic ? 'text-right' : 'text-left'}`}>
              {isArabic ? 'هل لديك أطفال؟' : 'Do you have children?'}
            </Text>
            <View className="flex-row gap-3">
              {childrenOptions.map((option) => (
                <TouchableOpacity
                  key={option.id.toString()}
                  className={`flex-1 bg-white rounded-2xl border-2 p-4 flex-row items-center justify-between ${
                    hasChildren === option.id ? 'border-[#5B2C91] bg-[#5B2C91]/10' : 'border-[#E7E5EA]'
                  }`}
                  onPress={() => setHasChildren(option.id)}
                  activeOpacity={0.8}
                >
                  <Text 
                    variant="body" 
                    weight={hasChildren === option.id ? 'semibold' : 'regular'}
                    className={`text-lg flex-1 ${hasChildren === option.id ? 'text-[#5B2C91]' : 'text-[#1A1A1A]'} ${
                      isArabic ? 'text-right' : 'text-left'
                    }`}
                  >
                    {option.label}
                  </Text>
                  {hasChildren === option.id && (
                    <View className="w-6 h-6 rounded-full bg-[#5B2C91] items-center justify-center">
                      <Text className="text-white text-base font-bold">✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    </OnboardingQuestion>
  );
}
