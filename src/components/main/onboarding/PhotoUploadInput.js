import React from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import Text from '../Text';

/**
 * PhotoUploadInput Component
 *
 * Photo upload interface (placeholder for now)
 */
const PhotoUploadInput = ({
  value = [],
  onChange,
  isArabic,
  maxPhotos = 6,
  skipText,
  onSkip
}) => {
  const handleAddPhoto = () => {
    // TODO: Implement photo picker
    Alert.alert(
      isArabic ? 'إضافة صورة' : 'Add Photo',
      isArabic ? 'سيتم تفعيل هذه الميزة قريباً' : 'This feature will be available soon',
      [{ text: isArabic ? 'حسناً' : 'OK' }]
    );
  };

  const skipButtonText = typeof skipText === 'object'
    ? (isArabic ? skipText.ar : skipText.en)
    : skipText;

  return (
    <View className="gap-4">
      <TouchableOpacity
        className="bg-white rounded-card border-2 border-dashed border-primary p-8 items-center justify-center"
        onPress={handleAddPhoto}
        activeOpacity={0.8}
      >
        <Text className="text-5xl mb-2">📷</Text>
        <Text variant="body" weight="semibold" className="text-primary mb-1">
          {isArabic ? 'إضافة صورة' : 'Add Photo'}
        </Text>
        <Text variant="caption" color="muted">
          {isArabic ? 'اضغط هنا لإضافة صورة' : 'Tap here to add a photo'}
        </Text>
      </TouchableOpacity>

      {value.length === 0 && onSkip && (
        <TouchableOpacity onPress={onSkip} className="py-2">
          <Text variant="body" className="text-primary text-center">
            {skipButtonText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PhotoUploadInput;
