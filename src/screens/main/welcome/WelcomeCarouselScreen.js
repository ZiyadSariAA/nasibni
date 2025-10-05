import React, { useState, useRef } from 'react';
import { View, ScrollView, Dimensions, StatusBar } from 'react-native';
import { useLanguage } from '../../../contexts/LanguageContext';
import { welcomeSlides } from './welcomeData';
import { WelcomeSlide, WelcomeDots, WelcomeNavigation } from '../../../components/main';

const { width, height } = Dimensions.get('window');

export default function WelcomeCarouselScreen({ navigation }) {
  const { isArabic, isLoading } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

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
    handleGetStarted();
  };

  const handleGetStarted = () => {
    navigation.replace('SignIn');
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
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
    </View>
  );
}
