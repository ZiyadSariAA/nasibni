import React from 'react';
import { View, Image } from 'react-native';
import { Text } from '../index';

const DEFAULT_AVATARS = {
  male: require('../../../assets/AvatorsInages/manAvator.png'),
  female: require('../../../assets/AvatorsInages/womanAvator.png')
};

/**
 * ProfileHeader - Avatar and basic user info
 */
export default function ProfileHeader({ profileData, displayName, email, isArabic }) {
  const getDefaultAvatar = () => {
    return profileData?.gender === 'female' ? DEFAULT_AVATARS.female : DEFAULT_AVATARS.male;
  };

  return (
    <View className="bg-white mx-4 mt-2 rounded-2xl p-4 items-center">
      {/* Avatar */}
      <View className="relative mb-2">
        <Image
          source={profileData?.photos?.[0] ? { uri: profileData.photos[0] } : getDefaultAvatar()}
          style={{
            width: 85,
            height: 85,
            borderRadius: 42.5,
          }}
          resizeMode="cover"
        />
        {/* Online Status Dot */}
        <View style={{
          position: 'absolute',
          bottom: 1,
          right: 1,
          width: 14,
          height: 14,
          borderRadius: 7,
          backgroundColor: '#10b981',
          borderWidth: 2.5,
          borderColor: '#ffffff'
        }} />
      </View>

      {/* Name */}
      <Text variant="h3" weight="bold" className="text-text-primary mb-0.5">
        {displayName}
      </Text>

      {/* Age & Gender */}
      <View className="flex-row items-center gap-3 mb-1">
        {profileData?.age && (
          <Text variant="body" className="text-text-secondary">
            {profileData.age} {isArabic ? 'سنة' : 'years'}
          </Text>
        )}
        {profileData?.gender && (
          <Text className="text-base">
            {profileData.gender === 'female' ? '♀' : '♂'}
          </Text>
        )}
      </View>

      {/* Email */}
      <Text variant="caption" className="text-text-muted">
        {email}
      </Text>
    </View>
  );
}
