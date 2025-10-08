import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useTranslation } from '../../../contexts/TranslationContext';
import { Text, Header, Button, InfoRow } from '../../../components/main';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';

// Preload default avatars for better performance
const DEFAULT_AVATARS = {
  male: require('../../../assets/AvatorsInages/manAvator.png'),
  female: require('../../../assets/AvatorsInages/womanAvator.png')
};

export default function ProfileDetailScreen({ route, navigation }) {
  const { profileId } = route.params;
  const { isArabic, isLoading } = useLanguage();
  const { user } = useAuth();
  const { getText } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get default avatar based on gender
  const getDefaultAvatar = (gender) => {
    return gender === 'female' ? DEFAULT_AVATARS.female : DEFAULT_AVATARS.male;
  };

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

      // Always get from users collection
      const docRef = doc(db, 'users', profileId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        // Get profileData from users collection
        const profileData = data.profileData;

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
            source={profile?.photos?.[0] ? { uri: profile.photos[0] } : getDefaultAvatar(profile?.gender)}
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
          {(profile?.residenceCountry?.countryName || profile?.residenceCountry) && (
            <View className="flex-row items-center gap-1">
              <Ionicons name="location-outline" size={16} color="#6B7280" />
              <Text variant="body" className="text-text-muted">
                {profile.residenceCountry?.countryName || profile.residenceCountry}
              </Text>
            </View>
          )}
        </View>

        {/* Profile Details */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6">
          <Text variant="h3" weight="bold" className="text-text-primary mb-4">
            {isArabic ? 'التفاصيل' : 'Details'}
          </Text>

          <InfoRow
            icon="flag-outline"
            label={isArabic ? 'الجنسية' : 'Nationality'}
            value={profile?.nationality?.countryName || profile?.nationality}
          />

          <InfoRow
            icon="heart-circle-outline"
            label={isArabic ? 'الحالة الاجتماعية' : 'Marital Status'}
            value={getDisplayValue('maritalStatus', profile?.maritalStatus)}
          />

          <InfoRow
            icon="moon-outline"
            label={isArabic ? 'الدين' : 'Religion'}
            value={getDisplayValue('religion', profile?.religion)}
          />

          {profile?.madhhab && (
            <InfoRow
              icon="book-outline"
              label={isArabic ? 'المذهب' : 'Madhhab'}
              value={getDisplayValue('madhhab', profile?.madhhab)}
            />
          )}

          <InfoRow
            icon="school-outline"
            label={isArabic ? 'التعليم' : 'Education'}
            value={getDisplayValue('educationLevel', profile?.educationLevel)}
          />

          {profile?.workStatus && (
            <InfoRow
              icon="briefcase-outline"
              label={isArabic ? 'الوظيفة' : 'Work'}
              value={profile.workStatus}
            />
          )}

          {profile?.chatLanguages && profile.chatLanguages.length > 0 && (
            <InfoRow
              icon="chatbubbles-outline"
              label={isArabic ? 'اللغات' : 'Languages'}
              value={profile.chatLanguages.join(', ')}
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
