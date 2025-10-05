import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text from '../Text';

/**
 * SelectInput Component
 *
 * Renders a single-select list with options
 * Maintains Nasibni brand identity with purple accent (#5B2C91)
 */
const SelectInput = ({ options, value, onChange, isArabic }) => {
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
            className={`bg-white rounded-card border-2 p-card-padding flex-row items-center ${
              isSelected ? 'border-primary bg-primary/10' : 'border-border'
            }`}
            onPress={() => onChange(option.id)}
            activeOpacity={0.8}
          >
            {option.icon && (
              <Text className="text-3xl mr-3">{option.icon}</Text>
            )}

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
  );
};

export default SelectInput;
