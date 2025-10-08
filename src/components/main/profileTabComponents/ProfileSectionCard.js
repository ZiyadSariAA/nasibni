import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../index';

/**
 * ProfileSectionCard - Reusable card with icon header and content
 */
export default function ProfileSectionCard({
  icon,
  iconColor = '#4F2396',
  title,
  children
}) {
  return (
    <View className="bg-white mx-4 mt-2 rounded-2xl p-3.5">
      {/* Section Header */}
      <View className="flex-row items-center gap-2 mb-2.5">
        <Ionicons name={icon} size={20} color={iconColor} />
        <Text variant="h4" weight="bold" className="text-text-primary">
          {title}
        </Text>
      </View>

      {/* Section Content */}
      {children}
    </View>
  );
}
