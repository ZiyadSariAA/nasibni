import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text from '../Text';

/**
 * SelectWithConditionalInput Component
 *
 * Shows additional question based on selection (like marital status → children)
 */
const SelectWithConditionalInput = ({
  options,
  value,
  onChange,
  conditionalField,
  conditionalValue,
  onConditionalChange,
  isArabic
}) => {
  // Don't render until isArabic is properly set
  if (typeof isArabic === 'undefined') {
    return null;
  }

  const showConditional = conditionalField && conditionalField.condition(value);

  return (
    <View className="gap-6">
      {/* Main Selection */}
      <View className="gap-3">
        {options.map((option) => {
          const isSelected = value === option.id;

          return (
            <TouchableOpacity
              key={option.id}
              className={`bg-white rounded-card border-2 p-card-padding flex-row items-center justify-between ${
                isSelected ? 'border-primary bg-primary/10' : 'border-border'
              }`}
              onPress={() => onChange(option.id)}
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

      {/* Conditional Question */}
      {showConditional && (
        <View className="gap-3">
          <Text
            variant="body"
            weight="semibold"
            className={`text-lg text-[#1A1A1A] ${isArabic ? 'text-right' : 'text-left'}`}
          >
            {typeof conditionalField.question === 'object'
              ? (isArabic ? conditionalField.question.ar : conditionalField.question.en)
              : conditionalField.question
            }
          </Text>

          <View className="flex-row gap-3">
            {conditionalField.options.map((option) => {
              const isSelected = conditionalValue === option.id;

              return (
                <TouchableOpacity
                  key={option.id.toString()}
                  className={`flex-1 bg-white rounded-2xl border-2 p-4 flex-row items-center justify-between ${
                    isSelected ? 'border-[#4F2396] bg-[#4F2396]/10' : 'border-[#E7E5EA]'
                  }`}
                  onPress={() => onConditionalChange(option.id)}
                  activeOpacity={0.8}
                >
                  <Text
                    variant="body"
                    weight={isSelected ? 'semibold' : 'regular'}
                    className={`text-lg flex-1 ${isSelected ? 'text-[#4F2396]' : 'text-[#1A1A1A]'} ${
                      isArabic ? 'text-right' : 'text-left'
                    }`}
                  >
                    {typeof option.label === 'object'
                      ? (isArabic ? option.label.ar : option.label.en)
                      : option.label
                    }
                  </Text>

                  {isSelected && (
                    <View className="w-6 h-6 rounded-full bg-[#4F2396] items-center justify-center">
                      <Text className="text-white text-base font-bold">✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

export default SelectWithConditionalInput;
