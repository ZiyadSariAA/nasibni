import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../main';

const OnboardingQuestion = ({
  question,
  children,
  onNext,
  onBack,
  currentStep,
  totalSteps,
  isArabic,
  nextDisabled = false,
  isOptional = false,
}) => {
  const nextText = isArabic ? 'التالي' : 'Next';
  const backText = isArabic ? 'رجوع' : 'Back';
  const skipText = isArabic ? 'تخطي' : 'Skip';

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8FB]" edges={['top', 'bottom']}>
      {/* Progress Bar */}
      <View className="px-6 pt-4 pb-6">
        <View className="h-2 bg-[#E7E5EA] rounded-full overflow-hidden mb-2">
          <View 
            className="h-full bg-[#5B2C91] rounded-full"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </View>
        <Text variant="caption" color="muted" className="text-center">
          {isArabic ? `الخطوة ${currentStep} من ${totalSteps}` : `Step ${currentStep} of ${totalSteps}`}
        </Text>
      </View>

      {/* Question */}
      <View className="px-6 mb-6">
        <Text 
          variant="h2" 
          weight="bold" 
          className={`text-[#1A1A1A] text-2xl ${isArabic ? 'text-right' : 'text-left'}`}
        >
          {question}
        </Text>
      </View>

      {/* Content - Scrollable */}
      <ScrollView 
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {children}
      </ScrollView>

      {/* Navigation Buttons */}
      <View className="bg-white px-6 py-4 border-t border-[#E7E5EA] flex-row justify-between items-center">
        {onBack ? (
          <TouchableOpacity
            onPress={onBack}
            className="py-3 px-4"
          >
            <Text variant="body" className="text-[#6B7280]">
              {backText}
            </Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        <View className="flex-row gap-2">
          {isOptional && (
            <TouchableOpacity
              onPress={onNext}
              className="py-3 px-4"
            >
              <Text variant="body" className="text-[#6B7280]">
                {skipText}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={onNext}
            disabled={nextDisabled}
            className={`py-3 px-6 rounded-xl ${
              nextDisabled ? 'bg-[#E7E5EA]' : 'bg-[#5B2C91]'
            }`}
          >
            <Text 
              variant="body" 
              weight="bold" 
              className={nextDisabled ? 'text-[#9CA3AF]' : 'text-white'}
            >
              {nextText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingQuestion;
