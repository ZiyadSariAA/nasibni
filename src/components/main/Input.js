import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing } from '../../config/theme';

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

  const getContainerStyle = () => {
    const baseStyle = [styles.container];
    
    if (isFocused) {
      baseStyle.push(styles.focused);
    }
    
    if (error) {
      baseStyle.push(styles.error);
    }
    
    if (disabled) {
      baseStyle.push(styles.disabled);
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  const getInputStyle = () => {
    const baseStyle = [styles.input];
    
    if (multiline) {
      baseStyle.push(styles.multiline);
    }
    
    if (inputStyle) {
      baseStyle.push(inputStyle);
    }
    
    return baseStyle;
  };

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={getContainerStyle()}>
        <TextInput
          style={getInputStyle()}
          placeholder={placeholder}
          placeholderTextColor={colors.text.muted}
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
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.eyeText}>
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: spacing.sm,
    lineHeight: 24,
    includeFontPadding: true,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  focused: {
    borderColor: colors.primary,
  },
  error: {
    borderColor: colors.error,
  },
  disabled: {
    backgroundColor: colors.backgroundAlt,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    paddingVertical: spacing.sm,
    lineHeight: 24,
    includeFontPadding: true,
  },
  multiline: {
    textAlignVertical: 'top',
    paddingTop: spacing.sm,
  },
  eyeButton: {
    padding: spacing.sm,
  },
  eyeText: {
    fontSize: 18,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginTop: spacing.xs,
    lineHeight: 20,
    includeFontPadding: true,
  },
});

export default Input;
