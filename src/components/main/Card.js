import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing } from '../../config/theme';

const Card = ({ 
  children, 
  style, 
  onPress, 
  variant = 'default',
  padding = 'medium',
  ...props 
}) => {
  const getCardStyle = () => {
    const baseStyle = [styles.card];
    
    switch (variant) {
      case 'elevated':
        baseStyle.push(styles.elevated);
        break;
      case 'outlined':
        baseStyle.push(styles.outlined);
        break;
      case 'flat':
        baseStyle.push(styles.flat);
        break;
      default:
        baseStyle.push(styles.default);
    }
    
    switch (padding) {
      case 'small':
        baseStyle.push(styles.paddingSmall);
        break;
      case 'large':
        baseStyle.push(styles.paddingLarge);
        break;
      default:
        baseStyle.push(styles.paddingMedium);
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={getCardStyle()}
        onPress={onPress}
        activeOpacity={0.8}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={getCardStyle()} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardSurface,
    borderRadius: 16,
  },
  
  // Variants
  default: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  flat: {
    shadowOpacity: 0,
    elevation: 0,
  },
  
  // Padding
  paddingSmall: {
    padding: spacing.sm,
  },
  paddingMedium: {
    padding: spacing.md,
  },
  paddingLarge: {
    padding: spacing.lg,
  },
});

export default Card;
