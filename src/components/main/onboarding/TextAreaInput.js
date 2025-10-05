import React from 'react';
import { View, TextInput } from 'react-native';
import Text from '../Text';

/**
 * TextAreaInput Component
 *
 * Multi-line text input with character counter
 */
const TextAreaInput = ({
  value,
  onChange,
  placeholder,
  isArabic,
  maxLength = 500,
  minHeight = 150
}) => {
  const placeholderText = typeof placeholder === 'object'
    ? (isArabic ? placeholder.ar : placeholder.en)
    : placeholder;

  const charCount = value ? value.length : 0;

  return (
    <View className="gap-2">
      <TextInput
        className={`bg-white rounded-input border border-border p-4 text-base text-text-primary ${
          isArabic ? 'text-right' : 'text-left'
        }`}
        style={{ minHeight }}
        value={value || ''}
        onChangeText={onChange}
        placeholder={placeholderText}
        placeholderTextColor="#9CA3AF"
        multiline
        textAlignVertical="top"
        maxLength={maxLength}
      />

      <Text variant="caption" color="muted" className={isArabic ? 'text-right' : 'text-left'}>
        {charCount}/{maxLength} {isArabic ? 'حرف' : 'characters'}
      </Text>
    </View>
  );
};

export default TextAreaInput;
