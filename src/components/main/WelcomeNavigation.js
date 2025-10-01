import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Button from './Button';
import { FONTS } from '../../config/fonts';

const { width } = Dimensions.get('window');

export default function WelcomeNavigation({ 
  isArabic, 
  currentIndex, 
  slidesLength, 
  onSkip, 
  onNext 
}) {
  const skipText = isArabic ? 'تخطي' : 'Skip';
  const nextButtonText = currentIndex === slidesLength - 1 
    ? (isArabic ? 'ابدأ' : 'Get Started')
    : (isArabic ? 'التالي' : 'Next');

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      <Button
        title={skipText}
        variant="ghost"
        size="small"
        onPress={onSkip}
        style={[styles.skipButton, isArabic && styles.skipButtonRTL]}
        textStyle={[styles.skipText, isArabic && styles.rtlText]}
      />

      {/* Next/Get Started Button */}
      <Button
        title={nextButtonText}
        variant="primary"
        size="large"
        onPress={onNext}
        style={styles.nextButton}
        textStyle={[styles.nextButtonText, isArabic && styles.rtlText]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    pointerEvents: 'box-none',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  skipButtonRTL: {
    right: 20,
    left: undefined,
  },
  skipText: {
    fontSize: 18,
    color: '#6B7280',
    fontFamily: FONTS.semibold,
    lineHeight: 26,
    includeFontPadding: true,
  },
  nextButton: {
    position: 'absolute',
    bottom: 100,
    left: 32,
    right: 32,
    height: 64,
    backgroundColor: '#5B2C91',
    borderRadius: 32,
  },
  nextButtonText: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: '#FFFFFF',
    lineHeight: 28,
    includeFontPadding: true,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
