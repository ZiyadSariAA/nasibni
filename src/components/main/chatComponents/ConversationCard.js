import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Text from '../Text';
import { useLanguage } from '../../../contexts/LanguageContext';

// Default avatars
const DEFAULT_AVATARS = {
  male: require('../../../assets/AvatorsInages/manAvator.png'),
  female: require('../../../assets/AvatorsInages/womanAvator.png')
};

/**
 * ConversationCard - Display a conversation in the chat list
 * 
 * OPTIMIZED: No longer fetches other user data (passed as prop)
 * - Before: Each card fetched user individually (N+1 problem)
 * - After: Receives pre-fetched user data from parent
 * - Immediate render, no loading state needed!
 */
const ConversationCard = ({ conversation, currentUserId, otherUser, onPress }) => {
  const { isArabic } = useLanguage();

  // If no other user data yet (shouldn't happen with batch fetch), show placeholder
  if (!otherUser) {
    return (
      <View style={{
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        marginHorizontal: 16,
        minHeight: 80,
        justifyContent: 'center'
      }}>
        <Text variant="caption" style={{ color: '#6B7280' }}>
          {isArabic ? 'جاري التحميل...' : 'Loading...'}
        </Text>
      </View>
    );
  }

  // Get unread count for current user
  const unreadCount = conversation.participantsMap?.[currentUserId]?.unreadCount || 0;

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return isArabic ? 'الآن' : 'Now';
    if (diffMins < 60) return `${diffMins}${isArabic ? ' د' : 'm'}`;
    if (diffHours < 24) return `${diffHours}${isArabic ? ' س' : 'h'}`;
    if (diffDays < 7) return `${diffDays}${isArabic ? ' ي' : 'd'}`;
    return date.toLocaleDateString(isArabic ? 'ar' : 'en');
  };

  // Get photo URL
  const photoUrl = otherUser.firstPhoto;
  const defaultAvatar = otherUser.gender === 'female' ? DEFAULT_AVATARS.female : DEFAULT_AVATARS.male;

  return (
    <TouchableOpacity
      onPress={() => onPress(conversation, otherUser)}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2
      }}
      activeOpacity={0.7}
    >
      <View style={{ flexDirection: isArabic ? 'row-reverse' : 'row', gap: 12, alignItems: 'center' }}>

        {/* Avatar */}
        <View style={{ position: 'relative' }}>
          <Image
            source={photoUrl ? { uri: photoUrl } : defaultAvatar}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28
            }}
            contentFit="cover"
            cachePolicy="memory-disk"
          />

          {/* Unread Badge */}
          {unreadCount > 0 && (
            <View style={{
              position: 'absolute',
              top: -2,
              right: -2,
              backgroundColor: '#f43f5e',
              borderRadius: 10,
              minWidth: 20,
              height: 20,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 6,
              borderWidth: 2,
              borderColor: '#ffffff'
            }}>
              <Text variant="small" weight="bold" style={{ color: '#ffffff', fontSize: 11 }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={{ flex: 1 }}>
          {/* Name & Time */}
          <View style={{ flexDirection: isArabic ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <Text variant="body" weight="semibold" style={{ color: '#1A1A1A' }} numberOfLines={1}>
              {otherUser.displayName}
            </Text>
            <Text variant="small" style={{ color: '#6B7280' }}>
              {formatTime(conversation.lastMessageAt)}
            </Text>
          </View>

          {/* Last Message */}
          <View style={{ flexDirection: isArabic ? 'row-reverse' : 'row', alignItems: 'center', gap: 4 }}>
            {/* Sent by current user indicator */}
            {conversation.lastMessageBy === currentUserId && (
              <Ionicons
                name="checkmark-done"
                size={14}
                color={unreadCount > 0 ? '#6B7280' : '#4F2396'}
              />
            )}

            <Text
              variant="caption"
              style={{ 
                color: unreadCount > 0 ? '#1A1A1A' : '#6B7280',
                flex: 1, 
                textAlign: isArabic ? 'right' : 'left' 
              }}
              weight={unreadCount > 0 ? 'semibold' : 'regular'}
              numberOfLines={1}
            >
              {conversation.lastMessage || (isArabic ? 'لا توجد رسائل' : 'No messages')}
            </Text>
          </View>

          {/* Status Indicator (Pending/Active) */}
          {conversation.status === 'pending' && (
            <View style={{
              flexDirection: isArabic ? 'row-reverse' : 'row',
              alignItems: 'center',
              gap: 4,
              marginTop: 4,
              backgroundColor: '#FFD8C2',
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 6,
              alignSelf: 'flex-start',
              borderWidth: 1,
              borderColor: '#F69554'
            }}>
              <Ionicons name="time-outline" size={12} color="#D97F45" />
              <Text variant="small" style={{ color: '#D97F45', fontSize: 10 }}>
                {isArabic ? 'في انتظار القبول' : 'Pending'}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ConversationCard;
