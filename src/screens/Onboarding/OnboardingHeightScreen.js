import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { OnboardingQuestion } from '../../components/onboarding';
import { Text } from '../../components/main';

export default function OnboardingHeightScreen({ navigation }) {
  const { isArabic } = useLanguage();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [height, setHeight] = useState(onboardingData.height?.toString() || '');

  const questionText = isArabic ? 'ما هو طولك؟' : 'What is your height?';
  const placeholderText = isArabic ? 'مثال: 170' : 'Example: 170';

  const handleNext = () => {
    const heightValue = parseInt(height);
    if (heightValue && heightValue >= 140 && heightValue <= 230) {
      updateOnboardingData('height', heightValue);
      navigation.navigate('OnboardingResidence');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const isValid = () => {
    const heightValue = parseInt(height);
    return heightValue >= 140 && heightValue <= 230;
  };

  return (
    <OnboardingQuestion
      question={questionText}
      onNext={handleNext}
      onBack={handleBack}
      currentStep={5}
      totalSteps={23}
      isArabic={isArabic}
      nextDisabled={!isValid()}
    >
      <View className="gap-4">
        <TextInput
          className="bg-white rounded-2xl border-2 border-[#E7E5EA] p-4 text-3xl font-bold text-[#1A1A1A] text-center"
          value={height}
          onChangeText={setHeight}
          placeholder={placeholderText}
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
          maxLength={3}
        />
        
        <Text variant="body" color="secondary" className="text-center text-lg">
          {isArabic ? 'سنتيمتر' : 'centimeters'}
        </Text>

        <Text variant="caption" color="muted" className={`mt-2 ${isArabic ? 'text-right' : 'text-left'}`}>
          {isArabic 
            ? 'أدخل طولك بالسنتيمتر (140-230)'
            : 'Enter your height in centimeters (140-230)'
          }
        </Text>
      </View>
    </OnboardingQuestion>
  );
}
