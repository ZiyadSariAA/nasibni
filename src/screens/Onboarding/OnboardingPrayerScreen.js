import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { OnboardingQuestion } from '../../components/onboarding';
import { Text } from '../../components/main';

export default function OnboardingPrayerScreen({ navigation }) {
  const { isArabic } = useLanguage();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [prayer, setPrayer] = useState(onboardingData.prayerHabit);

  const questionText = isArabic ? 'ما مدى محافظتك على الصلاة؟' : 'How often do you pray?';
  const optional = isArabic ? '(اختياري)' : '(Optional)';

  const options = [
    { id: 'always', label: isArabic ? 'أصلي الخمس فروض' : 'I pray 5 times' },
    { id: 'mostly', label: isArabic ? 'أصلي معظم الأوقات' : 'I pray mostly' },
    { id: 'sometimes', label: isArabic ? 'أصلي أحياناً' : 'Sometimes' },
    { id: 'rarely', label: isArabic ? 'نادراً' : 'Rarely' },
    { id: 'skip', label: isArabic ? 'تخطي' : 'Skip' },
  ];

  const handleNext = () => {
    if (prayer === 'skip') {
      updateOnboardingData('prayerHabit', null);
    } else if (prayer) {
      updateOnboardingData('prayerHabit', prayer);
    }
    navigation.navigate('OnboardingEducation');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <OnboardingQuestion
      question={`${questionText} ${optional}`}
      onNext={handleNext}
      onBack={handleBack}
      currentStep={12}
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
              prayer === option.id ? 'border-[#5B2C91] bg-[#5B2C91]/10' : 'border-[#E7E5EA]'
            }`}
            onPress={() => setPrayer(option.id)}
            activeOpacity={0.8}
          >
            <Text 
              variant="body" 
              weight={prayer === option.id ? 'semibold' : 'regular'}
              className={`text-lg flex-1 ${prayer === option.id ? 'text-[#5B2C91]' : 'text-[#1A1A1A]'} ${
                isArabic ? 'text-right' : 'text-left'
              }`}
            >
              {option.label}
            </Text>
            {prayer === option.id && option.id !== 'skip' && (
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

