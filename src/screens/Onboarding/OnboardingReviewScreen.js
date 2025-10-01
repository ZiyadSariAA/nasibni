import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { useAuth } from '../../contexts/AuthContext';
import { Text, Button } from '../../components/main';

export default function OnboardingReviewScreen({ navigation }) {
  const { isArabic } = useLanguage();
  const { onboardingData, completeOnboarding } = useOnboarding();
  const { updateProfileCompletion } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const title = isArabic ? 'مراجعة البيانات' : 'Review Your Information';
  const subtitle = isArabic 
    ? 'تأكد من صحة معلوماتك قبل المتابعة'
    : 'Make sure your information is correct before continuing';

  const handleComplete = async () => {
    try {
      setIsSubmitting(true);
      
      // Complete onboarding (saves to fake database)
      await completeOnboarding();
      
      Alert.alert(
        isArabic ? 'تم بنجاح!' : 'Success!',
        isArabic ? 'تم إنشاء ملفك الشخصي بنجاح' : 'Your profile has been created successfully',
        [{ text: isArabic ? 'حسناً' : 'OK' }]
      );

      console.log('✅ Onboarding completed and saved!');
      
    } catch (error) {
      console.error('Error completing onboarding:', error);
      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        isArabic ? 'حدث خطأ أثناء حفظ البيانات' : 'An error occurred while saving your data'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const InfoRow = ({ label, value }) => (
    <View className="py-3 border-b border-[#E7E5EA]">
      <Text variant="caption" color="muted" className={isArabic ? 'text-right mb-1' : 'text-left mb-1'}>
        {label}
      </Text>
      <Text variant="body" className={isArabic ? 'text-right' : 'text-left'}>
        {value || (isArabic ? 'غير محدد' : 'Not specified')}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-[#F8F8FB]">
      {/* Header */}
      <View className="bg-white px-6 pt-14 pb-6 border-b border-[#E7E5EA]">
        <Text variant="h2" weight="bold" className={`text-[#5B2C91] mb-2 ${isArabic ? 'text-right' : 'text-left'}`}>
          {title}
        </Text>
        <Text variant="body" color="secondary" className={isArabic ? 'text-right' : 'text-left'}>
          {subtitle}
        </Text>
        
        {/* Progress bar */}
        <View className="mt-4 h-2 bg-[#E7E5EA] rounded-full overflow-hidden">
          <View className="h-full bg-[#5B2C91] rounded-full" style={{ width: '100%' }} />
        </View>
        <Text variant="caption" color="muted" className={`mt-2 ${isArabic ? 'text-right' : 'text-left'}`}>
          {isArabic ? 'الخطوة 23 من 23' : 'Step 23 of 23'}
        </Text>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-2xl p-4 mb-4">
          <InfoRow 
            label={isArabic ? 'العمر' : 'Age'} 
            value={onboardingData.birthYear ? `${new Date().getFullYear() - onboardingData.birthYear} ${isArabic ? 'سنة' : 'years'}` : null} 
          />
          <InfoRow 
            label={isArabic ? 'الطول' : 'Height'} 
            value={onboardingData.height ? `${onboardingData.height} ${isArabic ? 'سم' : 'cm'}` : null} 
          />
          <InfoRow 
            label={isArabic ? 'الإقامة' : 'Residence'} 
            value={onboardingData.residence?.country && onboardingData.residence?.city 
              ? `${onboardingData.residence.city}, ${onboardingData.residence.country}` 
              : null
            } 
          />
          <InfoRow 
            label={isArabic ? 'الجنسية' : 'Nationality'} 
            value={onboardingData.nationality} 
          />
          <InfoRow 
            label={isArabic ? 'الحالة الاجتماعية' : 'Marital Status'} 
            value={onboardingData.maritalStatus} 
          />
          <InfoRow 
            label={isArabic ? 'الدين' : 'Religion'} 
            value={onboardingData.religion} 
          />
          <InfoRow 
            label={isArabic ? 'التعليم' : 'Education'} 
            value={onboardingData.educationLevel} 
          />
        </View>

        <TouchableOpacity 
          className="bg-white rounded-2xl p-4 mb-4 items-center"
          onPress={() => navigation.navigate('OnboardingLanguage')}
        >
          <Text variant="body" className="text-[#5B2C91]">
            {isArabic ? '✏️ تعديل البيانات' : '✏️ Edit Information'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Buttons */}
      <View className="bg-white px-6 py-4 border-t border-[#E7E5EA] flex-row gap-3">
        <TouchableOpacity
          className="flex-1 py-4 rounded-xl bg-[#E7E5EA] items-center justify-center"
          onPress={handleBack}
          disabled={isSubmitting}
        >
          <Text variant="body" weight="semibold" className="text-[#6B7280]">
            {isArabic ? 'رجوع' : 'Back'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-[2] py-4 rounded-xl bg-[#5B2C91] items-center justify-center"
          onPress={handleComplete}
          disabled={isSubmitting}
        >
          <Text variant="body" weight="bold" className="text-white">
            {isSubmitting 
              ? (isArabic ? 'جاري الحفظ...' : 'Saving...') 
              : (isArabic ? 'إكمال التسجيل' : 'Complete Registration')
            }
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

