import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text from '../Text';
import { useTranslation } from '../../../contexts/TranslationContext';

/**
 * SelectInput Component
 *
 * SelectInput for onboarding
 * Maintains Nasibni brand identity with purple accent (#5B2C91)
 */
const AnimatedSelectInput = ({ options, value, onChange, isArabic }) => {
  const { getLabel } = useTranslation();

  return (
    <View className="gap-3">
      {options.map((option, index) => {
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
              <Text className="text-3xl mr-3">
                {option.icon}
              </Text>
            )}

            <Text
              variant="body"
              weight={isSelected ? 'semibold' : 'regular'}
              className={`text-lg flex-1 ${isSelected ? 'text-primary' : 'text-text-primary'} ${
                isArabic ? 'text-right' : 'text-left'
              }`}
            >
              {getLabel(option)}
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

export default AnimatedSelectInput;
