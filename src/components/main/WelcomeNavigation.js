import React, { useEffect, useRef } from 'react';
import { View, Dimensions, Animated } from 'react-native';
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
    ? (isArabic ? 'ابدأ الآن' : 'Get Started')
    : (isArabic ? 'التالي' : 'Next');

  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation when changing slides
    Animated.sequence([
      Animated.spring(buttonScale, {
        toValue: 0.95,
        useNativeDriver: true,
        damping: 15,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        useNativeDriver: true,
        damping: 15,
      }),
    ]).start();
  }, [currentIndex]);

  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 z-10 pointer-events-box-none">
      {/* Skip Button */}
      <View
        className={`absolute ${isArabic ? 'left-4' : 'right-4'}`}
        style={{ top: 50 }}
      >
        <Button
          title={skipText}
          variant="ghost"
          size="small"
          onPress={onSkip}
          style={{
            backgroundColor: 'transparent',
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
          textStyle={{
            color: '#9CA3AF',
            fontFamily: FONTS.semibold,
            fontSize: 16,
          }}
        />
      </View>

      {/* Next/Get Started Button */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 100,
          left: 20,
          right: 20,
          transform: [{ scale: buttonScale }],
        }}
      >
        <Button
          title={nextButtonText}
          variant="primary"
          size="large"
          onPress={onNext}
          style={{
            backgroundColor: '#4F2396',
            borderRadius: 12,
            height: 56,
            shadowColor: '#4F2396',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
          textStyle={{
            fontFamily: FONTS.bold,
            color: '#FFFFFF',
            fontSize: 18,
          }}
        />
      </Animated.View>
    </View>
  );
}

