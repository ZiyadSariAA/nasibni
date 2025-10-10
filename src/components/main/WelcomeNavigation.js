import React, { useEffect, useRef } from 'react';
import { View, Dimensions, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();

  const skipText = isArabic ? 'تخطي' : 'Skip';
  const nextButtonText = currentIndex === slidesLength - 1
    ? (isArabic ? 'ابدأ الآن' : 'Get Started')
    : (isArabic ? 'التالي' : 'Next');

  // Consistent purple color for all buttons
  const buttonColor = '#4F2396';

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
        style={{ top: Math.max(insets.top + 16, 50) }}
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
          bottom: Math.max(insets.bottom + 32, 48),
          left: 24,
          right: 24,
          transform: [{ scale: buttonScale }],
        }}
      >
        <Button
          title={nextButtonText}
          variant="primary"
          size="large"
          onPress={onNext}
          style={{
            backgroundColor: buttonColor,
            borderRadius: 16,
            height: 56,
            shadowColor: buttonColor,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 10,
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

