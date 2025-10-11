import React, { useEffect, useRef } from 'react';
import { View, Animated, Image, Easing, I18nManager } from 'react-native';
import { SmartStatusBar } from '../../../components/main';
import { useLanguage } from '../../../contexts/LanguageContext';

/**
 * TransitionScreen - SLOW & ELEGANT animation between Welcome and SignIn
 *
 * DIFFERENT from SplashScreen approach:
 * Animation Timeline:
 * [0.0s] Screen fades in slowly
 * [0.4s] Logo slides from RIGHT + Word slides from LEFT (smooth, slower)
 * [1.6s] Both elements settle with subtle glow
 * [2.4s] Hold together (relaxed)
 * [2.9s] Fade out VERY SLOWLY
 * [3.9s] Navigate to SignIn (slower transition)
 *
 * Total: ~3.9 seconds (SLOWER, smoother transition to SignIn)
 */
export default function TransitionScreen({ navigation }) {
  const { isRTL, isArabic } = useLanguage();
  
  // Screen opacity
  const screenOpacity = useRef(new Animated.Value(0)).current;

  // Logo animations (slides from RIGHT for RTL, LEFT for LTR)
  const logoTranslateX = useRef(new Animated.Value(isRTL ? 150 : -150)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  // Word animations (slides from LEFT for RTL, RIGHT for LTR)
  const wordTranslateX = useRef(new Animated.Value(isRTL ? -150 : 150)).current;
  const wordOpacity = useRef(new Animated.Value(0)).current;

  // Subtle scale pulse for both
  const groupScale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    console.log('🎬 TransitionScreen: Starting NEW slide-in animation');
    console.log('🎵 Music from Welcome continues (no new music started)');

    // SLOW & ELEGANT animation sequence
    Animated.sequence([
      // 1. Fade in screen SLOWLY (400ms)
      Animated.timing(screenOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true
      }),

      // 2. Logo from RIGHT + Word from LEFT slide in SLOWLY (1200ms)
      Animated.parallel([
        // Logo slides from right - SLOWER
        Animated.timing(logoTranslateX, {
          toValue: 0,
          duration: 1200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true
        }),

        // Word slides from left - SLOWER
        Animated.timing(wordTranslateX, {
          toValue: 0,
          duration: 1200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true
        }),
        Animated.timing(wordOpacity, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true
        }),

        // Subtle scale up - SLOWER
        Animated.timing(groupScale, {
          toValue: 1.0,
          duration: 1200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true
        })
      ]),

      // 3. Hold LONGER for relaxed feel (800ms)
      Animated.delay(800),

      // 4. Fade out VERY SLOWLY for smooth transition to SignIn (1000ms)
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 1000,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true
      })
    ]).start(() => {
      console.log('✅ TransitionScreen: Animation complete, navigating to SignIn');
      navigation.replace('SignIn');
    });

    return () => {
      console.log('🧹 TransitionScreen: Cleaning up (music continues to SignIn/SignUp)');
    };
  }, [navigation, screenOpacity, logoTranslateX, logoOpacity, wordTranslateX, wordOpacity, groupScale]);

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: screenOpacity
      }}
    >
      <SmartStatusBar backgroundColor="#FFFFFF" />

      {/* Logo + Word container with scale */}
      <Animated.View
        style={{
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          transform: [{ scale: groupScale }],
        }}
      >
        {/* Logo */}
        <Animated.Image
          source={require('../../../assets/logos/Logo1.png')}
          style={{
            width: 120,
            height: 120,
            opacity: logoOpacity,
            transform: [{ translateX: logoTranslateX }],
            // Purple glow (brand color)
            shadowColor: '#4F2396',
            shadowOpacity: 0.4,
            shadowRadius: 25,
            shadowOffset: { width: 0, height: 0 }
          }}
          resizeMode="contain"
        />

        {/* App name (Arabic/English) */}
        <Animated.Text
          style={{
            fontFamily: 'Tajawal_900Black',
            fontSize: 40,
            color: '#4F2396',
            letterSpacing: 1,
            marginRight: isRTL ? 16 : 0,
            marginLeft: isRTL ? 0 : 16,
            opacity: wordOpacity,
            transform: [{ translateX: wordTranslateX }],
          }}
        >
          {isArabic ? 'ناسبني' : 'Nasibni'}
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
}
