import React from 'react';
import { TextInput as RNTextInput } from 'react-native';

/**
 * TextInput Component
 *
 * Single-line text input for simple text fields
 */
const TextInput = ({
  value,
  onChange,
  placeholder,
  isArabic,
  maxLength
}) => {
  const placeholderText = typeof placeholder === 'object'
    ? (isArabic ? placeholder.ar : placeholder.en)
    : placeholder;

  return (
    <RNTextInput
      className={`bg-white rounded-input border border-border p-4 text-lg text-text-primary h-input-height ${
        isArabic ? 'text-right' : 'text-left'
      }`}
      value={value || ''}
      onChangeText={onChange}
      placeholder={placeholderText}
      placeholderTextColor="#9CA3AF"
      maxLength={maxLength}
    />
  );
};

export default TextInput;
