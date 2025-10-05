import React from 'react';
import { View, Image, TouchableOpacity, I18nManager } from 'react-native';
import { Text } from './Text';

export default function ProfileCard({ profile, onPress, onAdd }) {
  const isRTL = I18nManager.isRTL;

  try {
    // Debug logging
    console.log('🎴 ProfileCard received profile:', profile);

    if (!profile) {
      console.error('❌ ProfileCard: profile is undefined!');
      return null;
    }

    // Additional safety check for profile properties
    if (!profile.displayName && !profile.name) {
      console.error('❌ ProfileCard: profile has no displayName or name!', profile);
      return null;
    }

    // Additional safety check for displayName specifically
    if (profile.displayName === undefined) {
      console.error('❌ ProfileCard: profile.displayName is undefined!', profile);
      return null;
    }

    return (
      <TouchableOpacity
        onPress={onPress}
        className="bg-white rounded-2xl p-4 mb-3 mx-4 shadow-sm"
      >
        <View className={`flex-row items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>

          {/* Profile Image - Circular */}
          <View className="flex-shrink-0">
            <Image
              source={{ uri: profile?.firstPhoto || 'https://via.placeholder.com/80' }}
              className="w-20 h-20 rounded-full"
              resizeMode="cover"
            />
          </View>

          {/* Profile Info */}
          <View className="flex-1">
            {/* Name with Gender Icon */}
            <View className="flex-row items-center gap-2 mb-1">
              <Text className="text-lg font-semibold text-gray-800">
                {profile.displayName || profile.name || 'Unknown'}
              </Text>
              {profile?.gender === 'female' && (
                <Text className="text-pink-500">♀</Text>
              )}
              {profile?.gender === 'male' && (
                <Text className="text-blue-500">♂</Text>
              )}
            </View>

            {/* Age & Location */}
            <View className="flex-row items-center gap-3 mb-2">
              <Text className="text-sm text-gray-600">
                {profile?.age || 'غير محدد'} سنة
              </Text>
              <Text className="text-sm text-gray-600">
                📍 {profile?.country || 'غير محدد'}
              </Text>
            </View>

            {/* Details: Nationality, Height, Weight */}
            <Text className="text-xs text-gray-500 mb-2">
              {profile?.nationality || 'غير محدد'} • الطول: {profile?.height || 'غير محدد'} سم
            </Text>

            {/* Description (if exists) */}
            {profile?.description && (
              <Text className="text-sm text-gray-700">
                {profile.description}
              </Text>
            )}
          </View>

          {/* Add Button */}
          <TouchableOpacity
            onPress={onAdd}
            className="flex-shrink-0 w-20 h-9 bg-gray-100 active:bg-gray-200 rounded-full flex-row items-center justify-center"
          >
            <Text className="text-gray-600 text-sm">+ إضافة</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  } catch (error) {
    console.error('❌ ProfileCard Error:', error);
    console.error('❌ ProfileCard Error Stack:', error.stack);
    return (
      <View className="bg-red-100 rounded-2xl p-4 mb-3 mx-4">
        <Text className="text-red-600">Error rendering profile card</Text>
      </View>
    );
  }
}
