import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { OnboardingQuestion } from '../../components/onboarding';
import { Text } from '../../components/main';

export default function OnboardingResidenceScreen({ navigation }) {
  const { isArabic } = useLanguage();
  const { onboardingData, updateNestedData } = useOnboarding();
  const [country, setCountry] = useState(onboardingData.residence?.country || '');
  const [city, setCity] = useState(onboardingData.residence?.city || '');

  const questionText = isArabic ? 'أين تعيش حالياً؟' : 'Where do you currently live?';
  const countryPlaceholder = isArabic ? 'الدولة' : 'Country';
  const cityPlaceholder = isArabic ? 'المدينة' : 'City';

  const handleNext = () => {
    if (country.trim() && city.trim()) {
      updateNestedData('residence', 'country', country.trim());
      updateNestedData('residence', 'city', city.trim());
      navigation.navigate('OnboardingNationality');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const isValid = () => {
    return country.trim().length > 0 && city.trim().length > 0;
  };

  return (
    <OnboardingQuestion
      question={questionText}
      onNext={handleNext}
      onBack={handleBack}
      currentStep={6}
      totalSteps={23}
      isArabic={isArabic}
      nextDisabled={!isValid()}
    >
      <View className="gap-4">
        <View className="gap-2">
          <Text variant="body" weight="semibold" className={`text-[#1A1A1A] ${isArabic ? 'text-right' : 'text-left'}`}>
            {countryPlaceholder}
          </Text>
          <TextInput
            className={`bg-white rounded-2xl border-2 border-[#E7E5EA] p-4 text-lg text-[#1A1A1A] ${
              isArabic ? 'text-right' : 'text-left'
            }`}
            value={country}
            onChangeText={setCountry}
            placeholder={countryPlaceholder}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View className="gap-2">
          <Text variant="body" weight="semibold" className={`text-[#1A1A1A] ${isArabic ? 'text-right' : 'text-left'}`}>
            {cityPlaceholder}
          </Text>
          <TextInput
            className={`bg-white rounded-2xl border-2 border-[#E7E5EA] p-4 text-lg text-[#1A1A1A] ${
              isArabic ? 'text-right' : 'text-left'
            }`}
            value={city}
            onChangeText={setCity}
            placeholder={cityPlaceholder}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>
    </OnboardingQuestion>
  );
}
