import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import Constants from 'expo-constants';
import { SmartStatusBar } from '../../../components/main';

const { width } = Dimensions.get('window');

export default function SplashScreen({ onComplete }) {
  // Tagline words "من" "جدة،" "إلى" "العالم"
  const word1Opacity = useRef(new Animated.Value(0)).current;
  const word2Opacity = useRef(new Animated.Value(0)).current;
  const word3Opacity = useRef(new Animated.Value(0)).current;
  const word4Opacity = useRef(new Animated.Value(0)).current;

  // Logo + "ناسبني" (appear together)
  const logoGroupOpacity = useRef(new Animated.Value(0)).current;
  const logoGroupScale = useRef(new Animated.Value(0.8)).current;

  // Loading bar
  const loadingBarWidth = useRef(new Animated.Value(0)).current;

  // Container fade out
  const containerOpacity = useRef(new Animated.Value(1)).current;

  // Responsive sizes (consistent spacing system)
  const smallLogoSize = Math.min(width * 0.14, 56); // Logo صغير (56px for icon consistency)
  const appNameSize = Math.min(width * 0.1, 40); // "ناسبني" كبير
  const loadingBarWidthValue = width * 0.7;

  useEffect(() => {
    const runSplashSequence = async () => {
      try {
        // ========================================
        // SEQUENCE 1: Word 1 "من" (1.0s)
        // ========================================
        setTimeout(() => {
          try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          } catch (error) {
            console.log('⚠️ Haptics not supported');
          }
          Animated.timing(word1Opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }).start();
        }, 1000);

        // ========================================
        // SEQUENCE 2: Word 2 "جدة،" (1.6s)
        // ========================================
        setTimeout(() => {
          Animated.timing(word2Opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }).start();
        }, 1600);

        // ========================================
        // SEQUENCE 3: Word 3 "إلى" (2.2s)
        // ========================================
        setTimeout(() => {
          Animated.timing(word3Opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }).start();
        }, 2200);

        // ========================================
        // SEQUENCE 4: Word 4 "العالم" (2.8s)
        // ========================================
        setTimeout(() => {
          Animated.timing(word4Opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }).start();
        }, 2800);

        // ========================================
        // SEQUENCE 5: Logo + "ناسبني" appear TOGETHER (4.0s)
        // ========================================
        setTimeout(() => {
          try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          } catch (error) {
            console.log('⚠️ Haptics not supported');
          }
          Animated.parallel([
            Animated.timing(logoGroupOpacity, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.spring(logoGroupScale, {
              toValue: 1,
              useNativeDriver: true,
              damping: 18,
            }),
          ]).start();
        }, 4000);

        // ========================================
        // SEQUENCE 6: Loading bar (5.5s)
        // ========================================
        setTimeout(() => {
          Animated.timing(loadingBarWidth, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
          }).start();
        }, 5500);

        // ========================================
        // SEQUENCE 7: Fade Out & Complete (8.0s)
        // ========================================
        setTimeout(() => {
          Animated.timing(containerOpacity, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }).start(() => {
            if (onComplete) {
              onComplete();
            }
          });
        }, 8000);

      } catch (error) {
        console.error('❌ Error in splash sequence:', error);
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          }
        }, 8500);
      }
    };

    runSplashSequence();

    return () => {
      // Cleanup if needed
    };
  }, [onComplete]);

  return (
    <Animated.View 
      style={{ 
        flex: 1, 
        backgroundColor: '#FFFFFF',  // White background
        alignItems: 'center', 
        justifyContent: 'center',
        opacity: containerOpacity 
      }}
    >
      <SmartStatusBar backgroundColor="#FFFFFF" />
      
      {/* TOP: "من جدة، إلى العالم" - Word by word (RTL) */}
      <View style={{ marginBottom: 48, flexDirection: 'row-reverse', gap: 8 }}>
        <Animated.Text
          style={{
            fontFamily: 'Tajawal_500Medium',
            fontSize: 24,
            color: '#F69554',
            letterSpacing: 2,
            opacity: word1Opacity,
          }}
        >
          من
        </Animated.Text>
        <Animated.Text
          style={{
            fontFamily: 'Tajawal_500Medium',
            fontSize: 24,
            color: '#F69554',
            letterSpacing: 2,
            opacity: word2Opacity,
          }}
        >
          جدة،
        </Animated.Text>
        <Animated.Text
          style={{
            fontFamily: 'Tajawal_500Medium',
            fontSize: 24,
            color: '#F69554',
            letterSpacing: 2,
            opacity: word3Opacity,
          }}
        >
          إلى
        </Animated.Text>
        <Animated.Text
          style={{
            fontFamily: 'Tajawal_500Medium',
            fontSize: 24,
            color: '#F69554',
            letterSpacing: 2,
            opacity: word4Opacity,
          }}
        >
          العالم
        </Animated.Text>
      </View>

      {/* CENTER: Logo (RIGHT) + "ناسبني" (LEFT) - Appear TOGETHER */}
      <Animated.View
        style={{
          opacity: logoGroupOpacity,
          transform: [{ scale: logoGroupScale }],
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 64,
        }}
      >
        {/* "ناسبني" (LEFT side) - BIG & EXTRA BOLD */}
        <Text
          style={{
            fontFamily: 'Tajawal_900Black',
            fontSize: appNameSize,
            color: '#4F2396',
            letterSpacing: 10,
            fontWeight: '900',
            marginRight: 16,
          }}
        >
          ناسبني
        </Text>

        {/* Logo (RIGHT side) - SMALL */}
        <Image
          source={require('../../../assets/logos/Logo1.png')}
          style={{ width: smallLogoSize, height: smallLogoSize }}
          resizeMode="contain"
          accessibilityLabel="Nasibni logo"
          accessible={true}
        />
      </Animated.View>

      {/* Loading Bar */}
      <View
        style={{
          position: 'absolute',
          bottom: 64,
          width: loadingBarWidthValue,
          height: 3,
          backgroundColor: 'rgba(79, 35, 150, 0.2)',  // Light purple background
          borderRadius: 1.5,
          overflow: 'hidden',
        }}
      >
        <Animated.View
          style={{
            height: '100%',
            backgroundColor: '#4F2396',  // Royal purple
            width: loadingBarWidth.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          }}
        />
      </View>

      {/* Version Number */}
      <View style={{ position: 'absolute', bottom: 40 }}>
        <Text 
          style={{ 
            color: '#9CA3AF',  // Gray on white background
            opacity: 0.8, 
            fontSize: 12,
            fontFamily: 'Tajawal_400Regular'
          }}
        >
          v{Constants.expoConfig?.version || '1.0.0'}
        </Text>
      </View>
    </Animated.View>
  );
}
