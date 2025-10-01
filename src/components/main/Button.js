import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing } from '../../config/theme';
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
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primary);
        break;
      case 'secondary':
        baseStyle.push(styles.secondary);
        break;
      case 'outline':
        baseStyle.push(styles.outline);
        break;
      case 'ghost':
        baseStyle.push(styles.ghost);
        break;
      default:
        baseStyle.push(styles.primary);
    }
    
    if (disabled) {
      baseStyle.push(styles.disabled);
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.text, styles[`${size}Text`]];
    
    switch (variant) {
      case 'primary':
        baseTextStyle.push(styles.primaryText);
        break;
      case 'secondary':
        baseTextStyle.push(styles.secondaryText);
        break;
      case 'outline':
        baseTextStyle.push(styles.outlineText);
        break;
      case 'ghost':
        baseTextStyle.push(styles.ghostText);
        break;
      default:
        baseTextStyle.push(styles.primaryText);
    }
    
    if (disabled) {
      baseTextStyle.push(styles.disabledText);
    }
    
    if (textStyle) {
      baseTextStyle.push(textStyle);
    }
    
    return baseTextStyle;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? '#FFFFFF' : '#5B2C91'} 
          size="small" 
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  
  // Sizes
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    minHeight: 44,
  },
  large: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    minHeight: 52,
  },
  
  // Variants
  primary: {
    backgroundColor: '#5B2C91',
  },
  secondary: {
    backgroundColor: colors.accent,
  },
  outline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  
  // States
  disabled: {
    backgroundColor: '#E0E0E0',
    opacity: 0.6,
  },
  
  // Text styles
  text: {
    fontFamily: FONTS.semibold,
    textAlign: 'center',
    includeFontPadding: true,
  },
  smallText: {
    fontSize: 14,
    lineHeight: 20,
  },
  mediumText: {
    fontSize: 16,
    lineHeight: 24,
  },
  largeText: {
    fontSize: 16,
    lineHeight: 24,
  },
  
  // Text colors
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: colors.text.primary,
  },
  outlineText: {
    color: '#333333',
  },
  ghostText: {
    color: '#999999',
  },
  disabledText: {
    color: '#999999',
  },
});

export default Button;