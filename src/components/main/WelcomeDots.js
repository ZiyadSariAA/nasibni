import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function WelcomeDots({ slides, currentIndex }) {
  return (
    <View style={styles.dotsContainer}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            currentIndex === index && styles.activeDot,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dotsContainer: {
    position: 'absolute',
    bottom: 200,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  dot: {
    width: Math.min(width * 0.03, 14),
    height: Math.min(width * 0.03, 14),
    borderRadius: Math.min(width * 0.015, 7),
    backgroundColor: '#E0E0E0',
    marginHorizontal: Math.min(width * 0.02, 8),
  },
  activeDot: {
    backgroundColor: '#5B2C91',
    width: Math.min(width * 0.06, 30),
    height: Math.min(width * 0.02, 10),
    borderRadius: Math.min(width * 0.01, 5),
  },
});
