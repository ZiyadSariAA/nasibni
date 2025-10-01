import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { colors } from '../../config/theme';
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
  const getTextStyle = () => {
    const baseStyle = [styles.text];
    
    // Variant styles
    switch (variant) {
      case 'h1':
        baseStyle.push(styles.h1);
        break;
      case 'h2':
        baseStyle.push(styles.h2);
        break;
      case 'h3':
        baseStyle.push(styles.h3);
        break;
      case 'h4':
        baseStyle.push(styles.h4);
        break;
      case 'body':
        baseStyle.push(styles.body);
        break;
      case 'caption':
        baseStyle.push(styles.caption);
        break;
      case 'small':
        baseStyle.push(styles.small);
        break;
      default:
        baseStyle.push(styles.body);
    }
    
    // Color styles
    switch (color) {
      case 'primary':
        baseStyle.push(styles.primaryColor);
        break;
      case 'secondary':
        baseStyle.push(styles.secondaryColor);
        break;
      case 'muted':
        baseStyle.push(styles.mutedColor);
        break;
      case 'inverted':
        baseStyle.push(styles.invertedColor);
        break;
      case 'success':
        baseStyle.push(styles.successColor);
        break;
      case 'warning':
        baseStyle.push(styles.warningColor);
        break;
      case 'error':
        baseStyle.push(styles.errorColor);
        break;
      default:
        baseStyle.push(styles.primaryColor);
    }
    
    // Weight styles
    switch (weight) {
      case 'light':
        baseStyle.push(styles.lightWeight);
        break;
      case 'normal':
        baseStyle.push(styles.normalWeight);
        break;
      case 'medium':
        baseStyle.push(styles.mediumWeight);
        break;
      case 'semibold':
        baseStyle.push(styles.semiboldWeight);
        break;
      case 'bold':
        baseStyle.push(styles.boldWeight);
        break;
      default:
        baseStyle.push(styles.normalWeight);
    }
    
    // Alignment
    switch (align) {
      case 'center':
        baseStyle.push(styles.centerAlign);
        break;
      case 'right':
        baseStyle.push(styles.rightAlign);
        break;
      case 'justify':
        baseStyle.push(styles.justifyAlign);
        break;
      default:
        baseStyle.push(styles.leftAlign);
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  return (
    <RNText 
      style={getTextStyle()} 
      allowFontScaling={false}
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: FONTS.regular,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  
  // Variants
  h1: {
    fontSize: 32,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    lineHeight: 16,
  },
  
  // Colors
  primaryColor: {
    color: colors.text.primary,
  },
  secondaryColor: {
    color: colors.text.secondary,
  },
  mutedColor: {
    color: colors.text.muted,
  },
  invertedColor: {
    color: colors.text.inverted,
  },
  successColor: {
    color: colors.success,
  },
  warningColor: {
    color: colors.warning,
  },
  errorColor: {
    color: colors.error,
  },
  
  // Weights
  lightWeight: {
    fontFamily: FONTS.regular,
  },
  normalWeight: {
    fontFamily: FONTS.regular,
  },
  mediumWeight: {
    fontFamily: FONTS.semibold,
  },
  semiboldWeight: {
    fontFamily: FONTS.semibold,
  },
  boldWeight: {
    fontFamily: FONTS.bold,
  },
  
  // Alignment
  leftAlign: {
    textAlign: 'left',
  },
  centerAlign: {
    textAlign: 'center',
  },
  rightAlign: {
    textAlign: 'right',
  },
  justifyAlign: {
    textAlign: 'justify',
  },
});

export default Text;
