import React from 'react';
import { Text as RNText } from 'react-native';
import { FONTS } from '../../config/fonts';

const Text = ({ 
  children, 
  variant = 'body', 
  color = 'primary', 
  align = 'left',
  weight = 'normal',
  style,
  ...props 
}) => {
  const getTextClasses = () => {
    const baseClasses = '';
    
    // Variant classes
    const variantClasses = {
      h1: 'text-heading-xl',
      h2: 'text-heading-lg',
      h3: 'text-heading-md',
      h4: 'text-heading-sm',
      body: 'text-base',
      caption: 'text-sm',
      small: 'text-xs',
    };
    
    // Color classes
    const colorClasses = {
      primary: 'text-text-primary',
      secondary: 'text-text-secondary',
      muted: 'text-text-muted',
      inverted: 'text-text-inverted',
      success: 'text-success',
      warning: 'text-warning',
      error: 'text-error',
    };
    
    // Weight classes
    const weightClasses = {
      light: '',
      normal: '',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    };
    
    // Alignment classes
    const alignClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    };
    
    return `${baseClasses} ${variantClasses[variant]} ${colorClasses[color]} ${weightClasses[weight]} ${alignClasses[align]}`;
  };

  const getFontFamily = () => {
    switch (weight) {
      case 'light':
      case 'normal':
        return FONTS.regular;
      case 'medium':
      case 'semibold':
        return FONTS.semibold;
      case 'bold':
        return FONTS.bold;
      default:
        return FONTS.regular;
    }
  };

  return (
    <RNText 
      className={getTextClasses()}
      style={[{ fontFamily: getFontFamily() }, style]}
      allowFontScaling={false}
      {...props}
    >
      {children}
    </RNText>
  );
};

export default Text;
