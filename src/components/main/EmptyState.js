import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from './Text';
import { useLanguage } from '../../contexts/LanguageContext';

/**
 * EmptyState Component
 * Reusable empty state with icon, title, description, and optional action button
 *
 * @param {string} icon - Ionicons icon name (optional)
 * @param {string} title - Main title text
 * @param {string} description - Description text (optional)
 * @param {string} actionText - Button text (optional)
 * @param {function} onAction - Button press handler (optional)
 * @param {string} iconColor - Icon color (default: gray)
 */
const EmptyState = ({
  icon = 'documents-outline',
  title,
  description,
  actionText,
  onAction,
  iconColor = '#9ca3af'
}) => {
  const { isArabic } = useLanguage();

  return (
    <View className="flex-1 items-center justify-center py-20 px-8">
      {icon && (
        <View className="w-24 h-24 rounded-full bg-gray-100 items-center justify-center mb-6">
          <Ionicons name={icon} size={48} color={iconColor} />
        </View>
      )}

      <Text
        variant="h3"
        weight="bold"
        className="text-gray-900 mb-2 text-center"
      >
        {title}
      </Text>

      {description && (
        <Text
          variant="body"
          className="text-gray-600 text-center mb-6"
        >
          {description}
        </Text>
      )}

      {actionText && onAction && (
        <TouchableOpacity
          onPress={onAction}
          className="bg-primary px-6 py-3 rounded-lg"
          activeOpacity={0.8}
        >
          <Text weight="semibold" className="text-white">
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EmptyState;
