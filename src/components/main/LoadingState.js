import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import Text from './Text';
import SmartStatusBar from './SmartStatusBar';
import { useLanguage } from '../../contexts/LanguageContext';

/**
 * LoadingState Component
 * Reusable loading state with spinner and optional message
 *
 * @param {string} message - Custom loading message (optional)
 * @param {string} size - Spinner size: 'small' | 'large' (default: 'large')
 * @param {string} color - Spinner color (default: primary purple)
 * @param {boolean} fullScreen - Show as full screen (default: true)
 * @param {string} statusBarColor - Status bar background color (default: white)
 */
const LoadingState = ({
  message,
  size = 'large',
  color = '#4f2396',
  fullScreen = true,
  statusBarColor = '#FFFFFF'
}) => {
  const { isArabic } = useLanguage();

  const defaultMessage = isArabic ? 'جاري التحميل...' : 'Loading...';

  if (fullScreen) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <SmartStatusBar backgroundColor={statusBarColor} />
        <ActivityIndicator size={size} color={color} />
        <Text variant="body" className="text-gray-600 mt-4">
          {message || defaultMessage}
        </Text>
      </View>
    );
  }

  return (
    <View className="py-4 items-center">
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text variant="caption" className="text-gray-500 mt-2">
          {message}
        </Text>
      )}
    </View>
  );
};

export default LoadingState;
