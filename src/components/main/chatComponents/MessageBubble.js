import React from 'react';
import { View } from 'react-native';
import Text from '../Text';
import { useLanguage } from '../../../contexts/LanguageContext';

/**
 * MessageBubble - Display a chat message
 */
const MessageBubble = ({ message, isCurrentUser, isSystemMessage }) => {
  const { isArabic } = useLanguage();

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString(isArabic ? 'ar' : 'en', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // System message (centered, gray)
  if (isSystemMessage || message.isSystemMessage) {
    return (
      <View style={{
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16
      }}>
        <View style={{
          backgroundColor: '#F8F8FB',
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#E7E5EA'
        }}>
          <Text variant="small" style={{ color: '#6B7280', textAlign: 'center' }}>
            {message.text}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{
      flexDirection: isArabic ? 'row-reverse' : 'row',
      paddingHorizontal: 16,
      paddingVertical: 4,
      justifyContent: isCurrentUser ? 'flex-start' : 'flex-end'
    }}>
      <View style={{
        maxWidth: '75%',
        flexDirection: 'column',
        alignItems: isCurrentUser ? 'flex-end' : 'flex-start'
      }}>
        {/* Message Bubble */}
        <View style={{
          backgroundColor: isCurrentUser ? '#4F2396' : '#F8F8FB',
          borderRadius: 16,
          borderTopRightRadius: isCurrentUser ? 4 : 16,
          borderTopLeftRadius: isCurrentUser ? 16 : 4,
          paddingHorizontal: 14,
          paddingVertical: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
          borderWidth: isCurrentUser ? 0 : 1,
          borderColor: '#E7E5EA'
        }}>
          <Text
            variant="body"
            style={{
              color: isCurrentUser ? '#FFFFFF' : '#1A1A1A',
              textAlign: 'left',
              lineHeight: 20,
              writingDirection: isArabic ? 'rtl' : 'ltr'
            }}
          >
            {message.text}
          </Text>
        </View>

        {/* Timestamp */}
        <Text
          variant="small"
          style={{
            marginTop: 2,
            marginHorizontal: 4,
            fontSize: 10,
            color: '#6B7280',
            textAlign: isCurrentUser ? 'left' : 'right'
          }}
        >
          {formatTime(message.createdAt)}
        </Text>
      </View>
    </View>
  );
};

export default MessageBubble;
