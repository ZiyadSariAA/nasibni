import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useTranslation } from '../../../contexts/TranslationContext';
import { Text, Header, Button } from '../../../components/main';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';

export default function ProfileDetailScreen({ route, navigation }) {
  const { profileId } = route.params;
  const { isArabic, isLoading } = useLanguage();
  const { user } = useAuth();
  const { getText } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Don't render until language is loaded
  if (isLoading) {
    return null;
  }

  useEffect(() => {
    loadProfile();
  }, [profileId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      
      // If profileId is the current user's ID, get from users collection
      // Otherwise, get from publicProfiles collection
      const collection = profileId === user?.uid ? 'users' : 'publicProfiles';
      const docRef = doc(db, collection, profileId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // If it's from users collection, get profileData
        const profileData = collection === 'users' ? data.profileData : data;
        
        setProfile({
          id: profileId,
          ...profileData,
          displayName: profileData?.displayName || profileData?.name || 'Unknown',
          name: profileData?.name || profileData?.displayName || 'Unknown'
        });
      } else {
        Alert.alert(
          isArabic ? 'خطأ' : 'Error',
          isArabic ? 'لم يتم العثور على الملف الشخصي' : 'Profile not found'
        );
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        isArabic ? 'حدث خطأ أثناء تحميل الملف الشخصي' : 'Error loading profile'
      );
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const InfoRow = ({ label, value, icon }) => (
    <View className="py-4 border-b border-border">
      <View className="flex-row items-center mb-2">
        {icon && (
          <Text className="text-lg mr-3">{icon}</Text>
        )}
        <Text variant="caption" color="muted" className={isArabic ? 'text-right flex-1' : 'text-left flex-1'}>
          {label}
        </Text>
      </View>
      <Text variant="body" className={isArabic ? 'text-right' : 'text-left'}>
        {value || (isArabic ? 'غير محدد' : 'Not specified')}
      </Text>
    </View>
  );

  const getDisplayValue = (fieldName, value) => {
    if (!value) return null;

    // If value is an object with en/ar properties, extract the correct language
    if (typeof value === 'object' && (value.en || value.ar)) {
      return getText(value);
    }

    // If value is a string ID, look up the label from onboarding questions
    if (typeof value === 'string') {
      // Common mappings for display values
      const mappings = {
        'male': { en: 'Male', ar: 'ذكر' },
        'female': { en: 'Female', ar: 'أنثى' },
        'single': { en: 'Single', ar: 'أعزب/عزباء' },
        'divorced': { en: 'Divorced', ar: 'مطلق/مطلقة' },
        'widowed': { en: 'Widowed', ar: 'أرمل/أرملة' },
        'muslim': { en: 'Muslim', ar: 'مسلم/مسلمة' },
        'christian': { en: 'Christian', ar: 'مسيحي/مسيحية' },
        'sunni': { en: 'Sunni', ar: 'سني' },
        'shia': { en: 'Shia', ar: 'شيعي' },
        'bachelors': { en: "Bachelor's Degree", ar: 'بكالوريوس' },
        'masters': { en: "Master's Degree", ar: 'ماجستير' },
        'phd': { en: 'PhD', ar: 'دكتوراه' },
        'high_school': { en: 'High School', ar: 'ثانوية عامة' },
        'diploma': { en: 'Diploma', ar: 'دبلوم' },
      };

      const mapping = mappings[value];
      if (mapping) {
        return isArabic ? mapping.ar : mapping.en;
      }

      return value;
    }

    // If value is a number, convert to string
    if (typeof value === 'number') {
      return value.toString();
    }

    return null;
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4F2396" />
        <Text variant="body" className="text-gray-600 mt-4">
          {isArabic ? 'جاري التحميل...' : 'Loading...'}
        </Text>
      </View>
    );
  }

  if (!profile) {
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

  const title = isArabic ? 'الملف الشخصي' : 'Profile';
  const editText = isArabic ? 'تعديل' : 'Edit';
  const messageText = isArabic ? 'إرسال رسالة' : 'Send Message';

  return (
    <View className="flex-1 bg-background-alt">
      <Header
        title={title}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 items-center">
          {/* Profile Image */}
          <Image
            source={{ uri: profile?.firstPhoto || 'https://via.placeholder.com/120' }}
            className="w-30 h-30 rounded-full mb-4"
            resizeMode="cover"
          />

          {/* Name and Basic Info */}
          <Text variant="h2" weight="bold" className="text-text-primary mb-2">
            {profile.displayName || profile.name || 'Unknown'}
          </Text>

          <View className="flex-row items-center gap-4 mb-4">
            <Text variant="body" className="text-text-secondary">
              {profile?.age ? `${profile.age} ${isArabic ? 'سنة' : 'years'}` : ''}
            </Text>
            <Text variant="body" className="text-text-secondary">
              {profile?.height ? `${profile.height} ${isArabic ? 'سم' : 'cm'}` : ''}
            </Text>
            {profile?.gender && (
              <Text className="text-lg">
                {profile.gender === 'female' ? '♀' : '♂'}
              </Text>
            )}
          </View>

          {/* Location */}
          {profile?.country && (
            <Text variant="body" className="text-text-muted">
              📍 {profile.country}
            </Text>
          )}
        </View>

        {/* Profile Details */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6">
          <Text variant="h3" weight="bold" className="text-text-primary mb-4">
            {isArabic ? 'التفاصيل' : 'Details'}
          </Text>

          <InfoRow
            label={isArabic ? 'الجنسية' : 'Nationality'}
            value={profile?.nationality?.countryName || profile?.nationality}
            icon="🏳️"
          />

          <InfoRow
            label={isArabic ? 'الحالة الاجتماعية' : 'Marital Status'}
            value={getDisplayValue('maritalStatus', profile?.maritalStatus)}
            icon="💍"
          />

          <InfoRow
            label={isArabic ? 'الدين' : 'Religion'}
            value={getDisplayValue('religion', profile?.religion)}
            icon="🕌"
          />

          {profile?.madhhab && (
            <InfoRow
              label={isArabic ? 'المذهب' : 'Madhhab'}
              value={getDisplayValue('madhhab', profile?.madhhab)}
              icon="📖"
            />
          )}

          <InfoRow
            label={isArabic ? 'التعليم' : 'Education'}
            value={getDisplayValue('educationLevel', profile?.educationLevel)}
            icon="🎓"
          />

          {profile?.workStatus && (
            <InfoRow
              label={isArabic ? 'الوظيفة' : 'Work'}
              value={profile.workStatus}
              icon="💼"
            />
          )}

          {profile?.chatLanguages && profile.chatLanguages.length > 0 && (
            <InfoRow
              label={isArabic ? 'اللغات' : 'Languages'}
              value={profile.chatLanguages.join(', ')}
              icon="🗣️"
            />
          )}
        </View>

        {/* About Me */}
        {profile?.aboutMe && (
          <View className="bg-white mx-4 mt-4 rounded-2xl p-6">
            <Text variant="h3" weight="bold" className="text-text-primary mb-4">
              {isArabic ? 'نبذة عني' : 'About Me'}
            </Text>
            <Text variant="body" className={isArabic ? 'text-right' : 'text-left'}>
              {profile.aboutMe}
            </Text>
          </View>
        )}

        {/* Ideal Partner */}
        {profile?.idealPartner && (
          <View className="bg-white mx-4 mt-4 rounded-2xl p-6">
            <Text variant="h3" weight="bold" className="text-text-primary mb-4">
              {isArabic ? 'الشريك المثالي' : 'Ideal Partner'}
            </Text>
            <Text variant="body" className={isArabic ? 'text-right' : 'text-left'}>
              {profile.idealPartner}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View className="mx-4 mt-4 mb-8 flex-row gap-3">
          {profileId !== user?.uid && (
            <Button
              title={messageText}
              variant="primary"
              size="large"
              onPress={() => {
                // TODO: Navigate to chat
                console.log('Start chat with:', profileId);
              }}
              style={{ flex: 1 }}
            />
          )}
          
          {profileId === user?.uid && (
            <Button
              title={editText}
              variant="secondary"
              size="large"
              onPress={() => {
                // TODO: Navigate to edit profile
                console.log('Edit profile');
              }}
              style={{ flex: 1 }}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
