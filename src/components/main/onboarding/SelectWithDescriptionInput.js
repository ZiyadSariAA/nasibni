import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text from '../Text';

/**
 * SelectWithDescriptionInput Component
 *
 * Renders options with descriptions (like location permission screen)
 */
const SelectWithDescriptionInput = ({ options, value, onChange, isArabic }) => {
  // Don't render until isArabic is properly set
  if (typeof isArabic === 'undefined') {
    return null;
  }

  return (
    <View className="gap-3">
      {options.map((option) => {
        const isSelected = value === option.id;

        return (
          <TouchableOpacity
            key={option.id.toString()}
            className={`bg-white rounded-card border-2 p-card-padding ${
              isSelected ? 'border-primary bg-primary/10' : 'border-border'
            }`}
            onPress={() => onChange(option.id)}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center justify-between mb-2">
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
            </View>

            {option.description && (
              <Text
                variant="caption"
                color="muted"
                className={isArabic ? 'text-right' : 'text-left'}
              >
                {typeof option.description === 'object'
                  ? (isArabic ? option.description.ar : option.description.en)
                  : option.description
                }
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default SelectWithDescriptionInput;
