import React, { useEffect, useRef } from 'react';
import { View, Image, Dimensions, Animated } from 'react-native';
import Text from './Text';
import { FONTS } from '../../config/fonts';

const { width, height } = Dimensions.get('window');

export default function WelcomeSlide({ slide, isArabic }) {
  const imageWidth = Math.min(width * 0.75, 300); // Slightly smaller for balance
  const imageHeight = Math.min(height * 0.32, 240); // Proportional height

  const imageOpacity = useRef(new Animated.Value(0)).current;
  const imageScale = useRef(new Animated.Value(0.8)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(20)).current;
  const descriptionOpacity = useRef(new Animated.Value(0)).current;
  const descriptionTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Reset animations
    imageOpacity.setValue(0);
    imageScale.setValue(0.8);
    titleOpacity.setValue(0);
    titleTranslateY.setValue(20);
    descriptionOpacity.setValue(0);
    descriptionTranslateY.setValue(20);

    // Animate image
    Animated.parallel([
      Animated.spring(imageOpacity, {
        toValue: 1,
        useNativeDriver: true,
        damping: 15,
      }),
      Animated.spring(imageScale, {
        toValue: 1,
        useNativeDriver: true,
        damping: 15,
      }),
    ]).start();

    // Animate title with delay
    Animated.parallel([
      Animated.spring(titleOpacity, {
        toValue: 1,
        delay: 150,
        useNativeDriver: true,
        damping: 15,
      }),
      Animated.spring(titleTranslateY, {
        toValue: 0,
        delay: 150,
        useNativeDriver: true,
        damping: 15,
      }),
    ]).start();

    // Animate description with delay
    Animated.parallel([
      Animated.spring(descriptionOpacity, {
        toValue: 1,
        delay: 300,
        useNativeDriver: true,
        damping: 15,
      }),
      Animated.spring(descriptionTranslateY, {
        toValue: 0,
        delay: 300,
        useNativeDriver: true,
        damping: 15,
      }),
    ]).start();
  }, [slide.id]);

  return (
    <View className="flex-1 justify-center items-center px-6 pb-20">
      <View
        className="items-center"
        style={{ maxWidth: width * 0.9 }}
      >
        <Animated.View
          style={{
            opacity: imageOpacity,
            transform: [{ scale: imageScale }],
            marginBottom: 32,
            alignItems: 'center',
          }}
        >
          {/* Icon above the image */}
          {slide.icon && (
            <View style={{ marginBottom: 24 }}>
              {slide.icon}
            </View>
          )}

          <Image
            source={slide.image}
            style={{
              width: imageWidth,
              height: imageHeight,
            }}
            resizeMode="contain"
            accessibilityLabel={isArabic ? 'صورة توضيحية' : 'Illustration'}
            accessible={true}
          />
        </Animated.View>

        <Animated.View
          style={{
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslateY }],
            marginBottom: 16,
          }}
        >
          <Text
            variant="h2"
            weight="bold"
            style={{
              color: '#4F2396',
              fontFamily: FONTS.bold,
              textAlign: 'center',
              fontSize: 28,
              lineHeight: 38,
            }}
          >
            {slide.title}
          </Text>
        </Animated.View>

        <Animated.View
          style={{
            opacity: descriptionOpacity,
            transform: [{ translateY: descriptionTranslateY }],
            paddingHorizontal: 16,
          }}
        >
          <Text
            variant="body"
            style={{
              color: '#6B7280',
              fontFamily: FONTS.regular,
              textAlign: 'center',
              fontSize: 17,
              lineHeight: 26,
            }}
          >
            {slide.description}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

