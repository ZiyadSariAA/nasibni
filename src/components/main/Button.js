import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, Pressable } from 'react-native';
import { FONTS } from '../../config/fonts';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  ...props
}) => {
  const getButtonClasses = () => {
    const baseClasses = 'rounded-button items-center justify-center flex-row';
    
    // Size classes - using consistent heights
    const sizeClasses = {
      small: 'px-4 h-button-height-sm',
      medium: 'px-5 h-button-height-md',
      large: 'px-6 h-button-height-lg',
    };
    
    // Variant classes
    const variantClasses = {
      primary: 'bg-primary',
      secondary: 'bg-accent',
      outline: 'bg-white border border-border',
      ghost: 'bg-transparent',
    };
    
    // State classes
    const stateClasses = disabled ? 'bg-gray-300 opacity-60' : '';
    
    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${stateClasses}`;
  };

  const getTextClasses = () => {
    const baseClasses = 'text-center';
    
    // Size classes - using consistent font sizes
    const sizeClasses = {
      small: 'text-button-sm',
      medium: 'text-button-md',
      large: 'text-button-lg',
    };
    
    // Variant classes
    const variantClasses = {
      primary: 'text-white',
      secondary: 'text-text-primary',
      outline: 'text-text-primary',
      ghost: 'text-text-muted',
    };
    
    // State classes
    const stateClasses = disabled ? 'text-gray-500' : '';
    
    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${stateClasses}`;
  };

  return (
    <Pressable
      className={getButtonClasses()}
      style={style}
      onPress={onPress}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#FFFFFF' : '#4F2396'}
          size="small"
        />
      ) : (
        <Text
          className={getTextClasses()}
          style={[{ fontFamily: FONTS.semibold }, textStyle]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
};

export default Button;