import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { Text } from './index';
import { FONTS, TEXT_STYLES } from '../../config/fonts';

const { width, height } = Dimensions.get('window');

export default function WelcomeSlide({ slide, isArabic }) {
  return (
    <View style={styles.slide}>
      <View style={styles.content}>
        <Image source={slide.image} style={styles.image} resizeMode="contain" />
        <Text 
          variant="h2" 
          weight="bold" 
          align="center"
          style={[styles.title, isArabic && styles.rtlText]}
        >
          {slide.title}
        </Text>
        <Text 
          variant="body" 
          color="secondary" 
          align="center"
          style={[styles.description, isArabic && styles.rtlText]}
        >
          {slide.description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  content: {
    alignItems: 'center',
    maxWidth: width * 0.85,
  },
  image: {
    width: Math.min(width * 0.7, 320),
    height: Math.min(height * 0.3, 240),
    marginBottom: 60,
  },
  title: {
    marginBottom: 30,
    fontSize: Math.min(width * 0.08, 36),
    color: '#5B2C91',
    lineHeight: Math.min(width * 0.1, 48),
    fontFamily: FONTS.bold,
    includeFontPadding: true,
  },
  description: {
    lineHeight: 32,
    fontSize: Math.min(width * 0.05, 22),
    color: '#6B7280',
    textAlign: 'center',
    fontFamily: FONTS.regular,
    includeFontPadding: true,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
