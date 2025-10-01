import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../../../config/theme';
import { APP_NAME_STYLE } from '../../../config/fonts';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 2500); // 2.5 seconds

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../../assets/logos/Group1.png')} 
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={[styles.logoText, APP_NAME_STYLE]}>ناسبني</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5B2C91',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  logoText: {
    fontSize: 40,
    color: '#FFFFFF',
  },
});