import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useTranslation } from '../../../contexts/TranslationContext';
import { Text, Button, SmartStatusBar } from '../../../components/main';
import { ONBOARDING_QUESTIONS } from '../../../config/onboardingQuestions';

export default function OnboardingReviewScreen({ navigation }) {
  const { isArabic, isLoading } = useLanguage();
  const { onboardingData, completeOnboarding } = useOnboarding();
  const { updateProfileCompletion } = useAuth();
  const { getText } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Don't render until language is loaded
  if (isLoading) {
    return null;
  }

  // Safety check for onboardingData
  if (!onboardingData) {
    console.error('❌ OnboardingReviewScreen: onboardingData is undefined!');
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text variant="h3" className="text-red-500 mb-4">
          {isArabic ? 'خطأ في البيانات' : 'Data Error'}
        </Text>
        <Text variant="body" className="text-gray-600 text-center">
          {isArabic ? 'يرجى المحاولة مرة أخرى' : 'Please try again'}
        </Text>
      </View>
    );
  }

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

  // Helper function to get display value for a field
  const getDisplayValue = (fieldName, value) => {
    if (!value) return null;

    // If value is an object with en/ar properties, extract the correct language
    if (typeof value === 'object' && (value.en || value.ar)) {
      return getText(value);
    }

    // If value is a string ID, look up the label from the question config
    if (typeof value === 'string') {
      const question = ONBOARDING_QUESTIONS.find(q => q.field === fieldName);
      if (question && question.options) {
        const option = question.options.find(opt => opt.id === value);
        if (option && option.label) {
          return getText(option.label);
        }
      }
      // If no match found in options, return the value as-is
      return value;
    }

    // If value is a number, convert to string
    if (typeof value === 'number') {
      return value.toString();
    }

    return null;
  };

  const InfoRow = ({ label, value }) => (
    <View className="py-3 border-b border-border">
      <Text variant="caption" color="muted" className={isArabic ? 'text-right mb-1' : 'text-left mb-1'}>
        {label}
      </Text>
      <Text variant="body" className={isArabic ? 'text-right' : 'text-left'}>
        {value || (isArabic ? 'غير محدد' : 'Not specified')}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-background-alt">
      <SmartStatusBar backgroundColor="#FFFFFF" />
      {/* Header */}
      <View className="bg-white px-screen-padding pt-safe-top pb-8 border-b border-border">
        <Text variant="h2" weight="bold" className={`text-primary mb-3 ${isArabic ? 'text-right' : 'text-left'}`}>
          {title}
        </Text>
        <Text variant="body" color="secondary" className={isArabic ? 'text-right' : 'text-left'}>
          {subtitle}
        </Text>
        
        {/* Progress bar - Hidden for better UX */}
        {/* <View className="mt-4 h-2 bg-border rounded-full overflow-hidden">
          <View className="h-full bg-primary rounded-full" style={{ width: '100%' }} />
        </View>
        <Text variant="caption" color="muted" className={`mt-2 ${isArabic ? 'text-right' : 'text-left'}`}>
          {isArabic ? 'الخطوة 23 من 23' : 'Step 23 of 23'}
        </Text> */}
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-2xl p-4 mb-4">
          <InfoRow
            label={isArabic ? 'الاسم' : 'Name'}
            value={onboardingData?.displayName}
          />
          <InfoRow
            label={isArabic ? 'العمر' : 'Age'}
            value={onboardingData?.age ? `${onboardingData.age} ${isArabic ? 'سنة' : 'years'}` : null}
          />
          <InfoRow
            label={isArabic ? 'الطول' : 'Height'}
            value={onboardingData?.height ? `${onboardingData.height} ${isArabic ? 'سم' : 'cm'}` : null}
          />
          <InfoRow
            label={isArabic ? 'الوزن' : 'Weight'}
            value={onboardingData?.weight ? `${onboardingData.weight} ${isArabic ? 'كجم' : 'kg'}` : null}
          />
          <InfoRow
            label={isArabic ? 'الإقامة' : 'Residence'}
            value={
              onboardingData?.residenceCountry?.countryName
                ? `${onboardingData?.residenceCity || ''}, ${onboardingData.residenceCountry?.countryName}`
                : onboardingData?.residenceCity || null
            }
          />
          <InfoRow
            label={isArabic ? 'الجنسية' : 'Nationality'}
            value={onboardingData?.nationality?.countryName || getDisplayValue('nationality', onboardingData?.nationality)}
          />
          <InfoRow
            label={isArabic ? 'الحالة الاجتماعية' : 'Marital Status'}
            value={getDisplayValue('maritalStatus', onboardingData?.maritalStatus)}
          />
          <InfoRow
            label={isArabic ? 'الدين' : 'Religion'}
            value={getDisplayValue('religion', onboardingData?.religion)}
          />
          <InfoRow
            label={isArabic ? 'المذهب' : 'Madhhab'}
            value={getDisplayValue('madhhab', onboardingData?.madhhab)}
          />
          <InfoRow
            label={isArabic ? 'التعليم' : 'Education'}
            value={getDisplayValue('educationLevel', onboardingData?.educationLevel)}
          />
        </View>

        <TouchableOpacity
          className="bg-white rounded-2xl p-4 mb-4 items-center flex-row"
          onPress={() => navigation.navigate('OnboardingLanguage')}
        >
          <Ionicons name="pencil" size={20} color="#4F2396" style={{ marginRight: 8 }} />
          <Text variant="body" className="text-[#4F2396]">
            {isArabic ? 'تعديل البيانات' : 'Edit Information'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Buttons */}
      <View className="bg-white px-6 py-6 border-t border-[#E7E5EA] flex-row gap-3">
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
          className="flex-[2] py-4 rounded-xl bg-[#4F2396] items-center justify-center"
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

