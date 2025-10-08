import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import Text from '../Text';

/**
 * MultiSelectInput Component
 *
 * Allows selecting multiple options (for languages, interests, etc.)
 */
const MultiSelectInput = ({ options, value = [], onChange, isArabic }) => {
  // Don't render until isArabic is properly set
  if (typeof isArabic === 'undefined') {
    return null;
  }

  // Ensure value is always an array (fix for null values)
  const selectedValues = Array.isArray(value) ? value : [];

  const toggleOption = (optionId) => {
    if (selectedValues.includes(optionId)) {
      onChange(selectedValues.filter(id => id !== optionId));
    } else {
      onChange([...selectedValues, optionId]);
    }
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-3">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.id);

          return (
            <TouchableOpacity
              key={option.id}
              className={`bg-white rounded-card border-2 p-card-padding flex-row items-center justify-between ${
                isSelected ? 'border-primary bg-primary/10' : 'border-border'
              }`}
              onPress={() => toggleOption(option.id)}
              activeOpacity={0.8}
            >
              <Text
                variant="body"
                weight={isSelected ? 'semibold' : 'regular'}
                className={`text-lg flex-1 ${isSelected ? 'text-primary' : 'text-text-primary'} ${
                  isArabic ? 'text-right' : 'text-left'
                }`}
              >
                {typeof option.label === 'object'
                  ? (isArabic ? option.label.ar : option.label.en)
                  : option.label
                }
              </Text>

              {isSelected && (
                <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                  <Text className="text-white text-base font-bold">✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default MultiSelectInput;
