import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  style,
  inputStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getContainerClasses = () => {
    const baseClasses = 'flex-row items-center border border-border rounded-input bg-background px-4 h-input-height';
    
    if (isFocused) {
      return `${baseClasses} border-primary`;
    }
    
    if (error) {
      return `${baseClasses} border-error`;
    }
    
    if (disabled) {
      return `${baseClasses} bg-background-alt opacity-60`;
    }
    
    return baseClasses;
  };

  const getInputClasses = () => {
    const baseClasses = 'flex-1 text-base text-text-primary py-2';
    
    if (multiline) {
      return `${baseClasses} text-top`;
    }
    
    return baseClasses;
  };

  return (
    <View className="mb-4" style={style}>
      {label && (
        <Text className="text-sm font-semibold text-text-primary mb-2">
          {label}
        </Text>
      )}
      
      <View className={getContainerClasses()}>
        <TextInput
          className={getInputClasses()}
          style={inputStyle}
          placeholder={placeholder}
          placeholderTextColor="#6B7280"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            className="p-2"
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text className="text-lg">
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text className="text-sm text-error mt-1 leading-5">
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;
