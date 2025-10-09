import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../Text';
import { useLanguage } from '../../../contexts/LanguageContext';

/**
 * ChatInput - Message input with send button
 */
const ChatInput = ({ onSend, disabled, messagesLeft, placeholder }) => {
  const { isArabic } = useLanguage();
  const [message, setMessage] = useState('');

  const handleSend = () => {
    const trimmed = message.trim();
    if (trimmed && onSend) {
      onSend(trimmed);
      setMessage('');
    }
  };

  const defaultPlaceholder = isArabic ? 'اكتب رسالة...' : 'Type a message...';

  return (
    <View style={{
      backgroundColor: '#ffffff',
      paddingHorizontal: 16,
      paddingVertical: 12,
      paddingBottom: Platform.OS === 'ios' ? 32 : 12,
      borderTopWidth: 1,
      borderTopColor: '#f3f4f6'
    }}>
      {/* Message Limit Warning */}
      {messagesLeft !== undefined && messagesLeft <= 2 && messagesLeft > 0 && (
        <View style={{
          backgroundColor: '#FFD8C2',
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 8,
          marginBottom: 8,
          flexDirection: isArabic ? 'row-reverse' : 'row',
          alignItems: 'center',
          gap: 6,
          borderWidth: 1,
          borderColor: '#F69554'
        }}>
          <Ionicons name="warning-outline" size={16} color="#D97F45" />
          <Text style={{ color: '#D97F45', fontSize: 12 }}>
            {isArabic
              ? `${messagesLeft} ${messagesLeft === 1 ? 'رسالة متبقية' : 'رسائل متبقية'} قبل القبول`
              : `${messagesLeft} message${messagesLeft === 1 ? '' : 's'} left before acceptance`
            }
          </Text>
        </View>
      )}

      <View style={{
        flexDirection: isArabic ? 'row-reverse' : 'row',
        alignItems: 'center',
        gap: 8
      }}>
        {/* Send Button */}
        <TouchableOpacity
          onPress={handleSend}
          disabled={disabled || !message.trim()}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: (disabled || !message.trim()) ? '#E7E5EA' : '#4F2396',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name="send"
            size={20}
            color={(disabled || !message.trim()) ? '#6B7280' : '#FFFFFF'}
          />
        </TouchableOpacity>

        {/* Text Input */}
        <View style={{
          flex: 1,
          backgroundColor: '#F8F8FB',
          borderRadius: 22,
          borderWidth: 1,
          borderColor: '#E7E5EA',
          paddingHorizontal: 16,
          minHeight: 44,
          justifyContent: 'center'
        }}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder={placeholder || defaultPlaceholder}
            placeholderTextColor="#6B7280"
            multiline
            maxLength={500}
            editable={!disabled}
            style={{
              fontSize: 15,
              color: '#1A1A1A',
              textAlign: isArabic ? 'right' : 'left',
              writingDirection: isArabic ? 'rtl' : 'ltr',
              maxHeight: 100,
              paddingTop: Platform.OS === 'ios' ? 12 : 8,
              paddingBottom: Platform.OS === 'ios' ? 12 : 8
            }}
            onSubmitEditing={handleSend}
          />
        </View>
      </View>
    </View>
  );
};

export default ChatInput;
