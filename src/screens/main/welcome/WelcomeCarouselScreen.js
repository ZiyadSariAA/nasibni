import React, { useState, useRef } from 'react';
import { View, ScrollView, Dimensions, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useLanguage } from '../../../contexts/LanguageContext';
import { welcomeSlides } from './welcomeData';
import { WelcomeSlide, WelcomeDots, WelcomeNavigation, SmartStatusBar } from '../../../components/main';

const { width, height } = Dimensions.get('window');

export default function WelcomeCarouselScreen({ navigation }) {
  const { isArabic, isLoading } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const screenOpacity = useRef(new Animated.Value(1)).current;

  // Don't render until language is loaded
  if (isLoading) {
    return null;
  }

  const slides = isArabic ? welcomeSlides.arabic : welcomeSlides.english;

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    // Haptic feedback on button press
    if (currentIndex === slides.length - 1) {
      // Stronger feedback for "Get Started"
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      // Light feedback for "Next"
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (currentIndex < slides.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: width * (currentIndex + 1),
        animated: true,
      });
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    // Light haptic feedback for skip
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    handleGetStarted();
  };

  const handleGetStarted = () => {
    // Fade out animation before navigation
    Animated.timing(screenOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      navigation.replace('SignIn');
    });
  };

  return (
    <Animated.View 
      className="flex-1 bg-white"
      style={{ opacity: screenOpacity }}
    >
      <SmartStatusBar backgroundColor="#FFFFFF" />

      <WelcomeNavigation
        isArabic={isArabic}
        currentIndex={currentIndex}
        slidesLength={slides.length}
        onSkip={handleSkip}
        onNext={handleNext}
      />

      {/* Carousel */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
        contentContainerStyle={{ alignItems: 'center' }}
        inverted={isArabic}
      >
        {slides.map((slide) => (
          <View 
            key={slide.id} 
            style={{ width: width, height: height }}
          >
            <WelcomeSlide slide={slide} isArabic={isArabic} />
          </View>
        ))}
      </ScrollView>

      <WelcomeDots slides={slides} currentIndex={currentIndex} />
    </Animated.View>
  );
}
