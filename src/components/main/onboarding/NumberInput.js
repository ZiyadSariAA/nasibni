import React from 'react';
import { View, TextInput } from 'react-native';
import Text from '../Text';
import { useLanguage } from '../../../contexts/LanguageContext';

/**
 * NumberInput Component
 *
 * Renders a number input with validation (for age, height, etc.)
 */
const NumberInput = ({
  value,
  onChange,
  placeholder,
  isArabic,
  maxLength,
  keyboardType = 'number-pad',
  unit,
  showAge,
  validation
}) => {
  const { isRTL } = useLanguage();
  
  const placeholderText = typeof placeholder === 'object'
    ? (isArabic ? placeholder.ar : placeholder.en)
    : placeholder;

  const unitText = unit && (typeof unit === 'object'
    ? (isArabic ? unit.ar : unit.en)
    : unit);

  // Calculate age if needed
  const getAge = () => {
    if (showAge && value) {
      const year = parseInt(value);
      if (year) {
        const currentYear = new Date().getFullYear();
        return currentYear - year;
      }
    }
    return null;
  };

  const age = getAge();

  return (
    <View className="gap-4">
      <TextInput
        className={`bg-white rounded-input border border-border p-4 h-input-height ${
          showAge ? 'text-2xl' : 'text-3xl'
        } font-bold text-text-primary`}
        style={{
          textAlign: 'center',
          textAlignVertical: 'center'
        }}
        value={value?.toString() || ''}
        onChangeText={onChange}
        placeholder={placeholderText}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
        maxLength={maxLength}
        textAlign="center"
        textAlignVertical="center"
      />

      {age && showAge && (
        <Text variant="body" color="secondary" className="text-center text-lg">
          {isArabic ? `العمر: ${age} سنة` : `Age: ${age} years`}
        </Text>
      )}

      {unitText && !showAge && (
        <Text variant="body" color="secondary" className="text-center text-lg">
          {unitText}
        </Text>
      )}
    </View>
  );
};

export default NumberInput;
