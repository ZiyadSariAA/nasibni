import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { OnboardingQuestion, CountryPicker, CityPicker } from '../../../components/main';
import { Text } from '../../../components/main';
import {
  SelectInput,
  PickerInput,
  CityPickerInput,
  SelectWithDescriptionInput,
  SelectWithConditionalInput,
  NumberInput,
  TextInput,
  TextAreaInput,
  MultiSelectInput,
  NestedTextInput,
  PhotoUploadInput
} from '../../../components/main/onboarding';
import AnimatedSelectInput from '../../../components/main/onboarding/AnimatedSelectInput';
import AnimatedNumberInput from '../../../components/main/onboarding/AnimatedNumberInput';
import {
  ONBOARDING_QUESTIONS,
  getQuestionById,
  getNextQuestionId,
  getPreviousQuestionId,
  TOTAL_QUESTIONS
} from '../../../config/onboardingQuestions';

/**
 * DynamicOnboardingScreen
 *
 * ONE screen that renders ANY onboarding question dynamically
 * based on question configuration data
 */
export default function DynamicOnboardingScreen({ route, navigation }) {
  const { questionId } = route.params;
  const { isArabic, isLoading } = useLanguage();
  const { onboardingData, updateOnboardingData, updateNestedData } = useOnboarding();

  // Don't render until language is loaded
  if (isLoading) {
    return null;
  }

  // Get the current question from config
  const question = getQuestionById(questionId);
  const currentIndex = ONBOARDING_QUESTIONS.findIndex(q => q.id === questionId);

  // State for current answer
  const [value, setValue] = useState(() => {
    if (question.type === 'nested-text') {
      return onboardingData[question.field] || {};
    }
    if (question.type === 'multi-select') {
      return onboardingData[question.field] || [];
    }
    return onboardingData[question.field] || (question.defaultValue !== undefined ? question.defaultValue : null);
  });

  // State for conditional field (for marital status question)
  const [conditionalValue, setConditionalValue] = useState(() => {
    if (question.conditionalField) {
      return onboardingData[question.conditionalField.field] || null;
    }
    return null;
  });

  // Update state when navigating between questions
  useEffect(() => {
    if (question.type === 'nested-text') {
      setValue(onboardingData[question.field] || {});
    } else if (question.type === 'multi-select') {
      setValue(onboardingData[question.field] || []);
    } else {
      setValue(onboardingData[question.field] || (question.defaultValue !== undefined ? question.defaultValue : null));
    }

    if (question.conditionalField) {
      setConditionalValue(onboardingData[question.conditionalField.field] || null);
    }
  }, [questionId]);

  // Validation logic
  const isValid = () => {
    if (question.isOptional || !question.required) {
      return true;
    }

    switch (question.type) {
      case 'select':
      case 'select-with-description':
        return value !== null && value !== undefined;

      case 'country-picker':
        return value !== null && value !== undefined && value.countryCode;

      case 'city-picker':
        return value && value.trim().length > 0;

      case 'select-with-conditional':
        const hasMainValue = value !== null && value !== undefined;
        const showConditional = question.conditionalField && question.conditionalField.condition(value);
        if (showConditional) {
          return hasMainValue && conditionalValue !== null && conditionalValue !== undefined;
        }
        return hasMainValue;

      case 'number':
        if (!value) return false;
        const numValue = parseInt(value);
        if (question.validation) {
          const max = typeof question.validation.max === 'function'
            ? question.validation.max()
            : question.validation.max;
          return numValue >= question.validation.min && numValue <= max;
        }
        return true;

      case 'text':
        return value && value.trim().length > 0;

      case 'textarea':
        return value && value.trim().length > 0;

      case 'nested-text':
        return question.fields.every(field => value[field.key] && value[field.key].trim().length > 0);

      case 'multi-select':
        return value && value.length >= (question.minSelection || 1);

      case 'photo-upload':
        return true; // Photos are optional

      default:
        return true;
    }
  };

  // Handle next button
  const handleNext = () => {
    if (!isValid()) return;

    // Create updated onboarding data object
    let updatedData = { ...onboardingData };

    // Save current answer
    if (question.type === 'nested-text') {
      Object.keys(value).forEach(key => {
        updateNestedData(question.field, key, value[key]);
        if (!updatedData[question.field]) {
          updatedData[question.field] = {};
        }
        updatedData[question.field][key] = value[key];
      });
    } else {
      updateOnboardingData(question.field, value);
      updatedData[question.field] = value;
    }

    // Save conditional field if exists
    if (question.conditionalField && question.conditionalField.condition(value)) {
      updateOnboardingData(question.conditionalField.field, conditionalValue);
      updatedData[question.conditionalField.field] = conditionalValue;
    }

    // Navigate to next question with UPDATED data
    const nextQuestionId = getNextQuestionId(question, value, updatedData);

    if (nextQuestionId) {
      navigation.push('DynamicOnboarding', { questionId: nextQuestionId });
    } else {
      // No more questions, go to review
      navigation.navigate('OnboardingReview');
    }
  };

  // Handle back button
  const handleBack = () => {
    if (currentIndex === 0) {
      // First question, no back allowed
      return;
    }

    const prevQuestionId = getPreviousQuestionId(question, onboardingData);
    if (prevQuestionId) {
      navigation.goBack();
    }
  };

  // Render input based on question type (with animations!)
  const renderInput = () => {
    switch (question.type) {
      case 'select':
        // Use PickerInput for long lists (more than 10 options)
        if (question.options.length > 10) {
          return (
            <PickerInput
              options={question.options}
              value={value}
              onChange={setValue}
              isArabic={isArabic}
              placeholder={question.placeholder}
            />
          );
        }
        // Use regular SelectInput for short lists
        return (
          <AnimatedSelectInput
            options={question.options}
            value={value}
            onChange={setValue}
            isArabic={isArabic}
          />
        );

      case 'select-with-description':
        return (
          <SelectWithDescriptionInput
            options={question.options}
            value={value}
            onChange={setValue}
            isArabic={isArabic}
          />
        );

      case 'select-with-conditional':
        return (
          <SelectWithConditionalInput
            options={question.options}
            value={value}
            onChange={setValue}
            conditionalField={question.conditionalField}
            conditionalValue={conditionalValue}
            onConditionalChange={setConditionalValue}
            isArabic={isArabic}
          />
        );

      case 'number':
        return (
          <AnimatedNumberInput
            value={value}
            onChange={setValue}
            placeholder={question.placeholder}
            isArabic={isArabic}
            maxLength={question.maxLength}
            keyboardType={question.keyboardType}
            unit={question.unit}
            showAge={question.showAge}
            validation={question.validation}
          />
        );

      case 'text':
        return (
          <TextInput
            value={value}
            onChange={setValue}
            placeholder={question.placeholder}
            isArabic={isArabic}
            maxLength={question.maxLength}
          />
        );

      case 'textarea':
        return (
          <TextAreaInput
            value={value}
            onChange={setValue}
            placeholder={question.placeholder}
            isArabic={isArabic}
            maxLength={question.maxLength}
            minHeight={question.minHeight}
          />
        );

      case 'multi-select':
        return (
          <MultiSelectInput
            options={question.options}
            value={value}
            onChange={setValue}
            isArabic={isArabic}
          />
        );

      case 'nested-text':
        return (
          <NestedTextInput
            fields={question.fields}
            value={value}
            onChange={setValue}
            isArabic={isArabic}
          />
        );

      case 'country-picker':
        return (
          <CountryPicker
            value={value}
            onChange={setValue}
            isArabic={isArabic}
            placeholder={question.placeholder}
            showFlags={true}
          />
        );

      case 'city-picker':
        // Get the country code from residenceCountry or nationality
        const countryCode = onboardingData.residenceCountry?.countryCode || null;
        return (
          <CityPicker
            countryCode={countryCode}
            value={value}
            onChange={setValue}
            isArabic={isArabic}
            placeholder={question.placeholder}
          />
        );

      case 'photo-upload':
        return (
          <PhotoUploadInput
            value={value}
            onChange={setValue}
            isArabic={isArabic}
            maxPhotos={question.maxPhotos}
            skipText={question.skipText}
            onSkip={handleNext}
          />
        );

      default:
        return <Text>Unknown question type: {question.type}</Text>;
    }
  };

  // Get question text
  const getQuestionText = () => {
    const questionText = typeof question.question === 'object'
      ? (isArabic ? question.question.ar : question.question.en)
      : question.question;

    if (question.subtitle) {
      const subtitleText = typeof question.subtitle === 'object'
        ? (isArabic ? question.subtitle.ar : question.subtitle.en)
        : question.subtitle;
      return questionText + '\n' + subtitleText;
    }

    return questionText;
  };

  // Get help text
  const getHelpText = () => {
    if (!question.helpText) return null;
    return typeof question.helpText === 'object'
      ? (isArabic ? question.helpText.ar : question.helpText.en)
      : question.helpText;
  };

  return (
    <OnboardingQuestion
      question={getQuestionText()}
      onNext={handleNext}
      onBack={question.showBack === false ? null : handleBack}
      currentStep={currentIndex + 1}
      totalSteps={TOTAL_QUESTIONS}
      isArabic={isArabic}
      nextDisabled={!isValid()}
      isOptional={question.isOptional}
    >
      {renderInput()}

      {getHelpText() && (
        <View>
          <Text
            variant="caption"
            color="muted"
            className={`mt-2 ${isArabic ? 'text-right' : 'text-left'}`}
          >
            {getHelpText()}
          </Text>
        </View>
      )}
    </OnboardingQuestion>
  );
}