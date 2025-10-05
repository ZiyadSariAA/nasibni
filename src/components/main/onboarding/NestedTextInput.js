import React from 'react';
import { View, TextInput } from 'react-native';
import Text from '../Text';

/**
 * NestedTextInput Component
 *
 * Multiple text fields in one question (like country + city for residence)
 */
const NestedTextInput = ({ fields, value = {}, onChange, isArabic }) => {
  const handleFieldChange = (key, newValue) => {
    onChange({
      ...value,
      [key]: newValue
    });
  };

  return (
    <View className="gap-4">
      {fields.map((field) => {
        const label = typeof field.label === 'object'
          ? (isArabic ? field.label.ar : field.label.en)
          : field.label;

        const placeholder = typeof field.placeholder === 'object'
          ? (isArabic ? field.placeholder.ar : field.placeholder.en)
          : field.placeholder;

        return (
          <View key={field.key} className="gap-2">
            <Text
              variant="body"
              weight="semibold"
              className={`text-text-primary ${isArabic ? 'text-right' : 'text-left'}`}
            >
              {label}
            </Text>

            <TextInput
              className={`bg-white rounded-input border border-border p-4 text-lg text-text-primary h-input-height ${
                isArabic ? 'text-right' : 'text-left'
              }`}
              value={value[field.key] || ''}
              onChangeText={(text) => handleFieldChange(field.key, text)}
              placeholder={placeholder}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        );
      })}
    </View>
  );
};

export default NestedTextInput;
