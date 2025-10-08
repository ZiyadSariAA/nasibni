import React, { useState, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import LikeButton from './LikeButton';
import Text from './Text';
import { useLanguage } from '../../contexts/LanguageContext';

// Preload default avatars
const DEFAULT_AVATARS = {
  male: require('../../assets/AvatorsInages/manAvator.png'),
  female: require('../../assets/AvatorsInages/womanAvator.png')
};

// Get default avatar based on gender
const getDefaultAvatar = (gender) => {
  return gender === 'female' ? DEFAULT_AVATARS.female : DEFAULT_AVATARS.male;
};

// Helper function to safely get country name
const getCountryName = (countryObj, isArabic) => {
  if (!countryObj) return null;
  if (typeof countryObj === 'string') return countryObj;

  if (isArabic) {
    return countryObj.nameAr || countryObj.countryName || countryObj.nameEn || null;
  } else {
    return countryObj.nameEn || countryObj.countryName || countryObj.nameAr || null;
  }
};

/**
 * CompactProfileCard - Smaller card for People tab
 *
 * More compact than regular ProfileCard:
 * - Horizontal layout (avatar left, info right)
 * - Smaller height (~100px vs 172px)
 * - Essential info only (name, age, location)
 * - Perfect for lists in People tab
 */
const CompactProfileCard = ({ profile, onPress, onChat }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { isArabic } = useLanguage();

  // Early return if profile is not provided
  if (!profile) {
    return null;
  }

  // Additional safety check
  if (!profile.displayName && !profile.name) {
    return null;
  }

  // Memoize computed values
  const displayName = useMemo(() =>
    profile.displayName || profile.name || (isArabic ? 'غير معروف' : 'Unknown'),
    [profile.displayName, profile.name, isArabic]
  );

  const residenceCountryName = useMemo(() =>
    getCountryName(profile.residenceCountry, isArabic),
    [profile.residenceCountry, isArabic]
  );

  const nationalityName = useMemo(() =>
    getCountryName(profile.nationality, isArabic),
    [profile.nationality, isArabic]
  );

  // Determine image source
  const photoUrl = profile?.photos?.[0] || profile?.firstPhoto;
  const hasRemoteImage = !!photoUrl;

  const imageSource = useMemo(() => {
    if (hasRemoteImage) {
      return { uri: photoUrl };
    }
    return getDefaultAvatar(profile?.gender);
  }, [photoUrl, hasRemoteImage, profile?.gender]);

  const handleCardPress = () => {
    if (!onPress) {
      console.error('❌ No onPress handler provided!');
      return;
    }
    if (!profile?.id) {
      console.error('❌ Profile ID is missing!');
      return;
    }
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handleCardPress}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        minHeight: 100
      }}
      activeOpacity={0.95}
    >
      {/* Horizontal Layout */}
      <View style={{ flexDirection: 'row-reverse', gap: 12, alignItems: 'center' }}>

        {/* RIGHT SIDE - Avatar (Compact) */}
        <View style={{ position: 'relative' }}>
          {/* Placeholder */}
          <View style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: '#f3f4f6',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Ionicons
              name={profile?.gender === 'female' ? 'person' : 'person-outline'}
              size={30}
              color="#d1d5db"
            />
          </View>

          {/* Avatar Image */}
          <Image
            source={imageSource}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 60,
              height: 60,
              borderRadius: 30,
              opacity: imageLoaded ? 1 : 0,
              backgroundColor: 'transparent'
            }}
            contentFit="cover"
            transition={150}
            cachePolicy="memory-disk"
            priority="high"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(false)}
          />

          {/* Online Status Dot */}
          {imageLoaded && (
            <View style={{
              position: 'absolute',
              bottom: 2,
              right: 2,
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: '#10b981',
              borderWidth: 2,
              borderColor: '#ffffff'
            }} />
          )}
        </View>

        {/* LEFT SIDE - Info (Flexible) */}
        <View style={{ flex: 1, justifyContent: 'center' }}>
          {/* Name & Age */}
          <View style={{ flexDirection: 'row-reverse', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
            <Text variant="body" weight="bold" color="primary" numberOfLines={1}>
              {displayName}
            </Text>
            {profile?.age && (
              <Text variant="caption" weight="semibold" color="muted">
                {profile.age} {isArabic ? 'سنة' : 'yrs'}
              </Text>
            )}
          </View>

          {/* Residence Location */}
          {residenceCountryName && (
            <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 4, marginBottom: 2 }}>
              <Ionicons name="location-outline" size={12} color="#9ca3af" />
              <Text variant="small" weight="medium" color="muted" numberOfLines={1}>
                {profile?.residenceCity ? `${profile.residenceCity}, ` : ''}{residenceCountryName}
              </Text>
            </View>
          )}

          {/* Nationality */}
          {nationalityName && (
            <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 4, marginBottom: 2 }}>
              <Ionicons name="flag-outline" size={12} color="#9ca3af" />
              <Text variant="small" weight="medium" color="muted" numberOfLines={1}>
                {nationalityName}
              </Text>
            </View>
          )}

          {/* Physical Info (Compact - Single Line) */}
          {(profile?.height || profile?.weight) && (
            <View style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 10,
              marginTop: 2
            }}>
              {profile?.height && (
                <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 3 }}>
                  <Ionicons name="resize-outline" size={12} color="#9ca3af" />
                  <Text variant="small" weight="medium" color="muted">
                    {profile.height} {isArabic ? 'سم' : 'cm'}
                  </Text>
                </View>
              )}
              {profile?.weight && (
                <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 3 }}>
                  <Ionicons name="fitness-outline" size={12} color="#9ca3af" />
                  <Text variant="small" weight="medium" color="muted">
                    {profile.weight} {isArabic ? 'كجم' : 'kg'}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* FAR LEFT - Action Buttons (Vertical Stack) */}
        <View style={{ gap: 6, alignItems: 'center' }}>
          {/* Like Button */}
          <LikeButton profileId={profile.id} variant="small" />

          {/* Chat Button */}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onChat?.(profile.id);
            }}
            style={{
              width: 32,
              height: 32,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#ede9fe',
              borderRadius: 16
            }}
          >
            <Ionicons
              name="chatbubble-outline"
              size={16}
              color="#4f2396"
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Custom comparison function for React.memo
const arePropsEqual = (prevProps, nextProps) => {
  if (prevProps.profile?.id !== nextProps.profile?.id) {
    return false;
  }

  if (prevProps.onPress !== nextProps.onPress || prevProps.onChat !== nextProps.onChat) {
    return false;
  }

  if (prevProps.profile === nextProps.profile) {
    return true;
  }

  const prev = prevProps.profile;
  const next = nextProps.profile;

  return (
    prev.displayName === next.displayName &&
    prev.name === next.name &&
    prev.age === next.age &&
    prev.height === next.height &&
    prev.weight === next.weight &&
    prev.gender === next.gender &&
    prev.residenceCountry === next.residenceCountry &&
    prev.residenceCity === next.residenceCity &&
    prev.nationality === next.nationality &&
    prev.photos?.[0] === next.photos?.[0] &&
    prev.firstPhoto === next.firstPhoto
  );
};

CompactProfileCard.displayName = 'CompactProfileCard';

export default React.memo(CompactProfileCard, arePropsEqual);
