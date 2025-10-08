import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from './Text';
import { useLanguage } from '../../contexts/LanguageContext';

/**
 * InfoRow Component
 * Reusable row component for displaying labeled information with an icon
 *
 * @param {string} icon - Ionicons icon name
 * @param {string} label - Label text (e.g., "Age", "Height")
 * @param {string|number} value - Value to display
 * @param {string} iconColor - Icon color (default: primary purple)
 * @param {string} iconBg - Icon background color (default: gray-50)
 */
const InfoRow = ({ icon, label, value, iconColor = '#4f2396', iconBg = 'bg-gray-50' }) => {
  const { isArabic } = useLanguage();

  // Don't render if no value
  if (!value) return null;

  return (
    <View className={`${isArabic ? 'flex-row-reverse' : 'flex-row'} items-center py-2.5 border-b border-gray-100`}>
      <View className={`w-9 h-9 rounded-full ${iconBg} justify-center items-center ${isArabic ? 'ml-3' : 'mr-3'}`}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text
          variant="caption"
          className="text-gray-400 mb-0.5"
          style={{ textAlign: isArabic ? 'right' : 'left' }}
        >
          {label}
        </Text>
        <Text
          variant="body"
          weight="semibold"
          className="text-gray-900"
          style={{ textAlign: isArabic ? 'right' : 'left' }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
};

export default InfoRow;
