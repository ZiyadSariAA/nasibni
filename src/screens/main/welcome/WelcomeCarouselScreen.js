import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, StatusBar } from 'react-native';
import { colors } from '../../../config/theme';
import { useLanguage } from '../../../contexts/LanguageContext';
import { welcomeSlides } from './welcomeData';
import { WelcomeSlide, WelcomeDots, WelcomeNavigation } from '../../../components/main';

const { width, height } = Dimensions.get('window');

export default function WelcomeCarouselScreen({ navigation }) {
  const { isArabic } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
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
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={styles.slideContainer}>
            <WelcomeSlide slide={slide} isArabic={isArabic} />
          </View>
        ))}
      </ScrollView>

      <WelcomeDots slides={slides} currentIndex={currentIndex} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
  },
  slideContainer: {
    width: width,
    height: height,
  },
});