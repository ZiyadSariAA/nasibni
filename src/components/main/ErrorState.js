import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from './Text';
import { useLanguage } from '../../contexts/LanguageContext';

/**
 * ErrorState Component
 * Reusable error state with icon, message, and retry button
 *
 * @param {string} title - Error title (optional, defaults to "Error")
 * @param {string} message - Error message
 * @param {function} onRetry - Retry button handler (optional)
 * @param {string} retryText - Retry button text (optional)
 * @param {string} icon - Ionicons icon name (default: 'alert-circle-outline')
 */
const ErrorState = ({
  title,
  message,
  onRetry,
  retryText,
  icon = 'alert-circle-outline',
  error // Optional: full error object for logging
}) => {
  const { isArabic } = useLanguage();

  const defaultTitle = isArabic ? 'خطأ' : 'Error';
  const defaultRetryText = isArabic ? 'إعادة المحاولة' : 'Retry';

  // Log error to console for debugging
  React.useEffect(() => {
    console.error('═══════════════════════════════════════');
    console.error('🔴 ERROR STATE DISPLAYED');
    console.error('═══════════════════════════════════════');
    console.error('Title:', title || defaultTitle);
    console.error('Message:', message);
    if (error) {
      console.error('Full Error Object:', error);
      console.error('Error Stack:', error?.stack);
    }
    console.error('Timestamp:', new Date().toISOString());
    console.error('═══════════════════════════════════════');
  }, [title, message, error, defaultTitle]);

  return (
    <View className="flex-1 items-center justify-center py-20 px-8">
      <View className="w-24 h-24 rounded-full bg-red-50 items-center justify-center mb-6">
        <Ionicons name={icon} size={48} color="#ef4444" />
      </View>

      <Text
        variant="h3"
        weight="bold"
        className="text-red-500 mb-2 text-center"
      >
        {title || defaultTitle}
      </Text>

      <Text
        variant="body"
        className="text-gray-600 text-center mb-6"
      >
        {message}
      </Text>

      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          className="bg-primary px-6 py-3 rounded-lg"
          activeOpacity={0.8}
        >
          <Text weight="semibold" className="text-white">
            {retryText || defaultRetryText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ErrorState;
