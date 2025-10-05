import React, { useEffect, useRef } from 'react';
import { View, Dimensions, Animated } from 'react-native';

const { width } = Dimensions.get('window');

function AnimatedDot({ isActive, index }) {
  const dotScale = useRef(new Animated.Value(isActive ? 1 : 1)).current;
  const dotOpacity = useRef(new Animated.Value(isActive ? 1 : 0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(dotScale, {
        toValue: isActive ? 3 : 1,
        useNativeDriver: true,
        damping: 15,
      }),
      Animated.spring(dotOpacity, {
        toValue: isActive ? 1 : 0.5,
        useNativeDriver: true,
        damping: 15,
      }),
    ]).start();
  }, [isActive]);

  return (
    <Animated.View
      className={`mx-2 ${isActive ? 'bg-primary' : 'bg-border'}`}
      style={{
        height: 8,
        width: 8,
        borderRadius: 4,
        opacity: dotOpacity,
        transform: [{ scaleX: dotScale }],
      }}
    />
  );
}

export default function WelcomeDots({ slides, currentIndex }) {
  return (
    <View
      className="absolute left-0 right-0 flex-row justify-center items-center"
      style={{ bottom: 180 }}
    >
      {slides.map((_, index) => (
        <AnimatedDot
          key={index}
          isActive={currentIndex === index}
          index={index}
        />
      ))}
    </View>
  );
}

