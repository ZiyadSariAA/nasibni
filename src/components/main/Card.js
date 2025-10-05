import React from 'react';
import { View, TouchableOpacity } from 'react-native';

const Card = ({ 
  children, 
  style, 
  onPress, 
  variant = 'default',
  padding = 'medium',
  ...props 
}) => {
  const getCardClasses = () => {
    const baseClasses = 'bg-card-surface rounded-card';
    
    // Variant classes
    const variantClasses = {
      default: 'shadow-sm',
      elevated: 'shadow-lg',
      outlined: 'border border-border',
      flat: '',
    };
    
    // Padding classes
    const paddingClasses = {
      small: 'p-sm',
      medium: 'p-card-padding',
      large: 'p-lg',
    };
    
    return `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]}`;
  };

  if (onPress) {
    return (
      <TouchableOpacity
        className={getCardClasses()}
        style={style}
        onPress={onPress}
        activeOpacity={0.8}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View 
      className={getCardClasses()}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
};

export default Card;
