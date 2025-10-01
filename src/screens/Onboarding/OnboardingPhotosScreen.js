import React, { useState } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { OnboardingQuestion } from '../../components/onboarding';
import { Text } from '../../components/main';

export default function OnboardingPhotosScreen({ navigation }) {
  const { isArabic } = useLanguage();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [photos, setPhotos] = useState(onboardingData.photos || []);

  const questionText = isArabic ? 'أضف صورك الشخصية' : 'Add your photos';
  const subtitle = isArabic ? '(اختياري - يمكنك إضافة حتى 6 صور)' : '(Optional - You can add up to 6 photos)';

  const handleAddPhoto = () => {
    // TODO: Implement photo picker
    Alert.alert(
      isArabic ? 'إضافة صورة' : 'Add Photo',
      isArabic ? 'سيتم تفعيل هذه الميزة قريباً' : 'This feature will be available soon',
      [{ text: isArabic ? 'حسناً' : 'OK' }]
    );
  };

  const handleNext = () => {
    updateOnboardingData('photos', photos);
    navigation.navigate('OnboardingAbout');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <OnboardingQuestion
      question={`${questionText} ${subtitle}`}
      onNext={handleNext}
      onBack={handleBack}
      currentStep={20}
      totalSteps={23}
      isArabic={isArabic}
      nextDisabled={false}
      isOptional={true}
    >
      <View className="gap-4">
        <TouchableOpacity
          className="bg-white rounded-2xl border-2 border-dashed border-[#5B2C91] p-8 items-center justify-center"
          onPress={handleAddPhoto}
          activeOpacity={0.8}
        >
          <Text className="text-5xl mb-2">📷</Text>
          <Text variant="body" weight="semibold" className="text-[#5B2C91] mb-1">
            {isArabic ? 'إضافة صورة' : 'Add Photo'}
          </Text>
          <Text variant="caption" color="muted">
            {isArabic ? 'اضغط هنا لإضافة صورة' : 'Tap here to add a photo'}
          </Text>
        </TouchableOpacity>

        <Text variant="caption" color="muted" className={`${isArabic ? 'text-right' : 'text-left'}`}>
          {isArabic 
            ? 'ملاحظة: الصور الشخصية تساعد في زيادة فرص التوافق'
            : 'Note: Profile photos help increase your matching chances'
          }
        </Text>

        {photos.length === 0 && (
          <TouchableOpacity 
            onPress={handleNext}
            className="py-2"
          >
            <Text variant="body" className="text-[#5B2C91] text-center">
              {isArabic ? 'تخطي الآن وإضافة الصور لاحقاً' : 'Skip for now, add photos later'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </OnboardingQuestion>
  );
}

