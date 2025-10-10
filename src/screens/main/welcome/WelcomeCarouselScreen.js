import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Dimensions, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { useLanguage } from '../../../contexts/LanguageContext';
import { welcomeSlides } from './welcomeData';
import { WelcomeSlide, WelcomeDots, WelcomeNavigation, SmartStatusBar } from '../../../components/main';

const { width, height } = Dimensions.get('window');

export default function WelcomeCarouselScreen({ navigation }) {
  const { isArabic, isLoading } = useLanguage();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const screenOpacity = useRef(new Animated.Value(0)).current; // Start invisible

  // Start background music when mounting (right after splash)
  useEffect(() => {
    // Fade in the screen
    Animated.timing(screenOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Start background music على طول بعد السبلاش
    if (!global.splashBackgroundMusic) {
      try {
        console.log('🎵 Starting background music on Welcome (right after splash)');
        Audio.Sound.createAsync(
          require('../../../assets/sounds/after the app logo apreas and like the wolcome screens like before the signinupscreens.mp3'),
          { shouldPlay: true, volume: 0.3, isLooping: false }
        ).then(({ sound }) => {
          global.splashBackgroundMusic = sound;
        }).catch(error => {
          console.log('⚠️ Could not play background music:', error.message);
        });
      } catch (error) {
        console.log('⚠️ Background music error:', error.message);
      }
    } else {
      console.log('📱 Background music already playing from splash');
    }
  }, []);

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
    try {
      if (currentIndex === slides.length - 1) {
        // Stronger feedback for "Get Started"
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        // Light feedback for "Next"
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      console.log('⚠️ Haptics not supported');
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
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.log('⚠️ Haptics not supported');
    }
    handleGetStarted();
  };

  const handleGetStarted = () => {
    // Fade out animation before navigation to Transition
    Animated.timing(screenOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Navigate to transition screen (music continues)
      navigation.replace('Transition');
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
