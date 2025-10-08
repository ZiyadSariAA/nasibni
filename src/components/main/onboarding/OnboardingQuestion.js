import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../Text';
import SmartStatusBar from '../SmartStatusBar';
import AnimatedProgressBar from './AnimatedProgressBar';

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
    <SafeAreaView className="flex-1 bg-background-alt" edges={['top', 'bottom']}>
      <SmartStatusBar backgroundColor="#F9FAFB" />
      {/* Progress Bar - Hidden for better UX */}
      {/* <View className="px-screen-padding pt-4 pb-6">
        <AnimatedProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        <View>
          <Text variant="caption" color="muted" className="text-center mt-2">
            {isArabic ? `الخطوة ${currentStep} من ${totalSteps}` : `Step ${currentStep} of ${totalSteps}`}
          </Text>
        </View>
      </View> */}

      {/* Question - Animated */}
      <View className="px-screen-padding pt-4 pb-8">
        <Text
          variant="h2"
          weight="bold"
          className={`text-text-primary text-heading-md ${isArabic ? 'text-right' : 'text-left'}`}
        >
          {question}
        </Text>
      </View>

      {/* Content - Scrollable */}
      <ScrollView 
        className="flex-1 px-screen-padding"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {children}
      </ScrollView>

      {/* Navigation Buttons */}
      <View className="bg-white px-screen-padding py-6 border-t border-border flex-row justify-between items-center">
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
              <Text variant="body" className="text-text-muted">
                {skipText}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={onNext}
            disabled={nextDisabled}
            className={`h-button-height-md px-6 rounded-button items-center justify-center ${
              nextDisabled ? 'bg-gray-300' : 'bg-primary'
            }`}
          >
            <Text 
              variant="body" 
              weight="bold" 
              className={nextDisabled ? 'text-gray-500' : 'text-white'}
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
