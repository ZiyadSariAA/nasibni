import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Image, TouchableOpacity, Alert, Platform, Animated } from 'react-native';
import { Text, SmartStatusBar, LikeButton, InfoRow, LoadingState } from '../../../../components/main';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useAuth } from '../../../../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../config/firebase';

// Default avatars
const DEFAULT_AVATARS = {
  male: require('../../../../assets/AvatorsInages/manAvator.png'),
  female: require('../../../../assets/AvatorsInages/womanAvator.png')
};

export default function DetailedUserScreen({ route, navigation }) {
  const { profileId, profileData } = route.params;
  const { isArabic } = useLanguage();
  const { user } = useAuth();
  const [profile, setProfile] = useState(profileData || null); // Use passed data if available
  const [loading, setLoading] = useState(!profileData); // Skip loading if data already passed

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Only fetch from Firebase if profile data wasn't passed
    if (!profileData) {
      loadProfile();
    } else {
      console.log('✅ Using cached profile data - no Firebase read needed!');
      console.log('📊 Profile:', profileData.displayName);
      // Trigger animations immediately since we already have data
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [profileId, profileData]);

  useEffect(() => {
    // Only trigger animations if data was fetched (not cached)
    if (profile && !loading && !profileData) {
      // Trigger fade-in and slide-up animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [profile, loading, profileData]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      console.log('📥 Loading profile from Firebase:', profileId);
      console.log('⚠️  This is a Firebase read - costs money and is slower');

      const docRef = doc(db, 'users', profileId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('📄 Document data:', data);

        const profileData = data.profileData;

        // Check if profileData exists
        if (!profileData) {
          console.error('❌ profileData is undefined for user:', profileId);
          Alert.alert(
            isArabic ? 'خطأ' : 'Error',
            isArabic ? 'الملف الشخصي غير مكتمل' : 'Profile is incomplete'
          );
          navigation.goBack();
          return;
        }

        console.log('✅ Profile loaded:', profileData.displayName);

        setProfile({
          id: profileId,
          ...profileData
        });
      } else {
        console.error('❌ Document does not exist:', profileId);
        Alert.alert(
          isArabic ? 'خطأ' : 'Error',
          isArabic ? 'لم يتم العثور على الملف الشخصي' : 'Profile not found'
        );
        navigation.goBack();
      }
    } catch (error) {
      console.error('═══════════════════════════════════════');
      console.error('🔴 ERROR: Loading Profile Details');
      console.error('═══════════════════════════════════════');
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
      console.error('Error Object:', error);
      console.error('Profile ID:', profileId);
      console.error('Timestamp:', new Date().toISOString());
      console.error('═══════════════════════════════════════');

      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        isArabic ? 'حدث خطأ أثناء تحميل الملف الشخصي' : 'Error loading profile'
      );
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const getDefaultAvatar = () => {
    return profile?.gender === 'female' ? DEFAULT_AVATARS.female : DEFAULT_AVATARS.male;
  };

  // Helper function to safely get country name
  const getCountryName = (countryObj) => {
    if (!countryObj) return null;
    if (typeof countryObj === 'string') return countryObj;
    // Return Arabic name if isArabic, otherwise English
    if (isArabic) {
      return countryObj.nameAr || countryObj.countryName || countryObj.nameEn || null;
    }
    return countryObj.nameEn || countryObj.countryName || countryObj.nameAr || null;
  };

  // Translation mappings for profile data (SAME AS PROFILE SCREEN)
  const TRANSLATIONS = {
    maritalStatus: {
      single: { ar: 'أعزب', en: 'Single' },
      divorced_no_children: { ar: 'مطلق من دون أطفال', en: 'Divorced without children' },
      divorced_with_children: { ar: 'مطلق مع أطفال', en: 'Divorced with children' },
      widowed_no_children: { ar: 'أرمل من دون أطفال', en: 'Widowed without children' },
      widowed_with_children: { ar: 'أرمل مع أطفال', en: 'Widowed with children' },
      married: { ar: 'متزوج', en: 'Married' }
    },
    religion: {
      muslim: { ar: 'مسلم', en: 'Muslim' },
      muslim_sunni: { ar: 'مسلم سني', en: 'Muslim Sunni' },
      muslim_shia: { ar: 'مسلم شيعي', en: 'Muslim Shia' },
      other: { ar: 'دين آخر', en: 'Other Religion' }
    },
    madhhab: {
      hanafi: { ar: 'حنفي', en: 'Hanafi' },
      maliki: { ar: 'مالكي', en: 'Maliki' },
      shafii: { ar: 'شافعي', en: 'Shafi\'i' },
      hanbali: { ar: 'حنبلي', en: 'Hanbali' },
      jafari: { ar: 'جعفري', en: 'Ja\'fari' },
      no_specific: { ar: 'لا أتبع مذهبًا محددًا', en: 'No specific madhab' }
    },
    religiosityLevel: {
      very_religious: { ar: 'متدين جدًا', en: 'Very Religious' },
      religious: { ar: 'متدين', en: 'Religious' },
      moderate: { ar: 'معتدل', en: 'Moderate' },
      not_very_religious: { ar: 'غير متدين كثيرًا', en: 'Not Very Religious' }
    },
    prayerHabit: {
      always: { ar: 'دائمًا', en: 'Always' },
      mostly: { ar: 'غالبًا', en: 'Mostly' },
      sometimes: { ar: 'أحيانًا', en: 'Sometimes' },
      rarely: { ar: 'نادرًا', en: 'Rarely' },
      never: { ar: 'أبدًا', en: 'Never' }
    },
    educationLevel: {
      below_high_school: { ar: 'أقل من الثانوية العامة', en: 'Below High School' },
      diploma: { ar: 'تعليم متوسط/معهد', en: 'Diploma/Institute' },
      bachelors: { ar: 'شهادة جامعية', en: "Bachelor's" },
      masters: { ar: 'ماجستير', en: "Master's" },
      phd: { ar: 'دكتوراه', en: 'PhD' }
    },
    workStatus: {
      employee: { ar: 'موظف', en: 'Employee' },
      senior_employee: { ar: 'موظف برتبة عالية', en: 'Senior Employee' },
      manager: { ar: 'مدير', en: 'Manager' },
      unemployed: { ar: 'عاطل عن العمل', en: 'Unemployed' },
      retired: { ar: 'متقاعد', en: 'Retired' },
      prefer_not_say: { ar: 'أفضل عدم الإجابة', en: 'Prefer not to say' }
    },
    marriageType: {
      traditional: { ar: 'عادي', en: 'Traditional' },
      polygamy: { ar: 'تعدد زوجات', en: 'Polygamy' },
      misyar: { ar: 'مسيار', en: 'Misyar' }
    },
    marriageTypes: {
      traditional: { ar: 'عادي', en: 'Traditional' },
      civil: { ar: 'مدني (غير ديني)', en: 'Civil (non-religious)' },
      polygamy: { ar: 'تعدد', en: 'Polygamy' },
      misyar: { ar: 'مسيار', en: 'Misyar' },
      doesnt_matter: { ar: 'لا يهمني', en: "Doesn't matter" }
    },
    marriagePlan: {
      asap: { ar: 'أرغب بالزواج بأسرع ما يمكن', en: 'As soon as possible' },
      need_time: { ar: 'أحتاج لبعض الوقت', en: 'I need some time' },
      no_hurry: { ar: 'لست في عجلة من أمري', en: "I'm not in a hurry" }
    },
    residenceAfterMarriage: {
      own_home: { ar: 'في منزلي الخاص', en: 'My own home' },
      parents_home: { ar: 'في منزل أهلي', en: 'With my parents' },
      parents_temporary: { ar: 'في منزل أهلي مؤقتًا', en: 'With my parents (temporary)' },
      undecided: { ar: 'لم أقرر بعد', en: 'Undecided' }
    },
    kidsPreference: {
      want_kids: { ar: 'أريد أطفالاً', en: 'Want kids' },
      no_kids: { ar: 'لا أريد أطفالاً', en: "Don't want kids" },
      open: { ar: 'منفتح', en: 'Open to discussion' }
    },
    skinTone: {
      white: { ar: 'أبيض', en: 'White' },
      light_wheat: { ar: 'قمحي فاتح', en: 'Light Wheat' },
      wheat: { ar: 'قمحي', en: 'Wheat' },
      bronze: { ar: 'برونزي', en: 'Bronze' },
      light_brown: { ar: 'أسمر فاتح', en: 'Light Brown' },
      brown: { ar: 'أسمر', en: 'Brown' },
      dark_brown: { ar: 'أسمر غامق', en: 'Dark Brown' }
    },
    incomeLevel: {
      high: { ar: 'مرتفع', en: 'High' },
      medium: { ar: 'متوسط', en: 'Medium' },
      low: { ar: 'منخفض', en: 'Low' },
      no_income: { ar: 'لا دخل مادي', en: 'No income' }
    },
    childrenTiming: {
      asap: { ar: 'في أقرب وقت', en: 'As soon as possible' },
      after_two_years: { ar: 'بعد سنتين على الأقل', en: 'After at least two years' },
      depends: { ar: 'حسب الظروف', en: 'Depends on circumstances' },
      no_children: { ar: 'لا أريد الإنجاب', en: "I don't want children" }
    },
    allowWifeWorkStudy: {
      yes: { ar: 'نعم', en: 'Yes' },
      yes_from_home: { ar: 'نعم، ولكن من المنزل', en: 'Yes, but from home' },
      depends: { ar: 'حسب الظروف', en: 'Depends' },
      no: { ar: 'لا', en: 'No' }
    },
    healthStatus: {
      chronic_illness: { ar: 'أعاني من مرض مزمن', en: 'Chronic illness' },
      special_needs: { ar: 'من ذوي الاحتياجات الخاصة', en: 'Special needs' },
      infertile: { ar: 'عقيم', en: 'Infertile' },
      good_health: { ar: 'بصحة جيدة', en: 'Good health' }
    },
    tribeAffiliation: {
      yes: { ar: 'نعم', en: 'Yes' },
      no: { ar: 'لا', en: 'No' }
    },
    chatLanguages: {
      arabic: { ar: 'العربية', en: 'Arabic' },
      english: { ar: 'الإنجليزية', en: 'English' },
      french: { ar: 'الفرنسية', en: 'French' },
      spanish: { ar: 'الإسبانية', en: 'Spanish' },
      turkish: { ar: 'التركية', en: 'Turkish' },
      indonesian: { ar: 'الإندونيسية', en: 'Indonesian' },
      urdu: { ar: 'الأردية', en: 'Urdu' },
      malay: { ar: 'الماليزية', en: 'Malay' }
    },
    smoking: {
      yes: { ar: 'نعم', en: 'Yes' },
      no: { ar: 'لا', en: 'No' },
      sometimes: { ar: 'أحيانًا', en: 'Sometimes' }
    }
  };

  // Helper to translate field values
  const translateValue = (field, value) => {
    if (!value) return null;
    const translation = TRANSLATIONS[field]?.[value];
    if (!translation) return value; // Return original if no translation found
    return isArabic ? translation.ar : translation.en;
  };

  // Helper to translate array values (for multi-select fields)
  const translateArray = (field, values) => {
    if (!values || !Array.isArray(values) || values.length === 0) return null;
    const translated = values
      .map(value => translateValue(field, value))
      .filter(Boolean);
    return translated.length > 0 ? translated.join(isArabic ? ' • ' : ' • ') : null;
  };


  if (loading) {
    return <LoadingState />;
  }

  if (!profile) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <SmartStatusBar backgroundColor="#FFFFFF" />
        <Text variant="body" className="text-gray-600">
          {isArabic ? 'لم يتم العثور على الملف الشخصي' : 'Profile not found'}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <SmartStatusBar backgroundColor="#FFFFFF" />

      {/* Header */}
      <View className="pt-12 pb-4 px-4 bg-white flex-row items-center justify-between border-b border-gray-100">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-gray-50 justify-center items-center"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#1f2937" />
        </TouchableOpacity>

        <Text variant="h4" weight="bold" className="text-gray-900">
          {isArabic ? 'الملف الشخصي' : 'Profile'}
        </Text>

        <View className="w-10" />
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }}
      >
        {/* Profile Header - Compact */}
        <View className="bg-white items-center py-6 mb-3">
          {/* Avatar */}
          <Image
            source={profile?.photos?.[0] ? { uri: profile.photos[0] } : getDefaultAvatar()}
            className="w-28 h-28 rounded-full mb-3"
            resizeMode="cover"
          />

          {/* Name and Age */}
          <Text variant="h2" weight="bold" className="text-gray-900 mb-1">
            {profile?.displayName || profile?.name || (isArabic ? 'غير معروف' : 'Unknown')}
          </Text>

          {profile?.age && (
            <Text variant="body" className="text-gray-600">
              {profile.age} {isArabic ? 'سنة' : 'years old'}
            </Text>
          )}
        </View>

        {/* About Me */}
        {profile?.aboutMe && (
          <View className="bg-white mb-3 p-4">
            <Text variant="h4" weight="bold" className="text-gray-900 mb-3" style={{ textAlign: isArabic ? 'right' : 'left' }}>
              {isArabic ? 'نبذة عني' : 'About Me'}
            </Text>
            <Text variant="body" className="text-gray-700 leading-6" style={{ textAlign: isArabic ? 'right' : 'left' }}>
              {profile.aboutMe}
            </Text>
          </View>
        )}

        {/* Ideal Partner */}
        {profile?.idealPartner && (
          <View className="bg-white mb-3 p-4">
            <Text variant="h4" weight="bold" className="text-gray-900 mb-3" style={{ textAlign: isArabic ? 'right' : 'left' }}>
              {isArabic ? 'الشريك المثالي' : 'Ideal Partner'}
            </Text>
            <Text variant="body" className="text-gray-700 leading-6" style={{ textAlign: isArabic ? 'right' : 'left' }}>
              {profile.idealPartner}
            </Text>
          </View>
        )}

        {/* 1. PERSONAL INFORMATION */}
        <View className="bg-white mb-3 px-4">
          <Text variant="h4" weight="bold" className="text-gray-900 py-4" style={{ textAlign: isArabic ? 'right' : 'left' }}>
            {isArabic ? 'المعلومات الشخصية' : 'Personal Information'}
          </Text>

          <InfoRow
            icon="person-outline"
            label={isArabic ? 'الجنس' : 'Gender'}
            value={profile?.gender === 'male' ? (isArabic ? 'ذكر' : 'Male') : profile?.gender === 'female' ? (isArabic ? 'أنثى' : 'Female') : null}
          />

          <InfoRow
            icon="calendar-outline"
            label={isArabic ? 'العمر' : 'Age'}
            value={profile?.age ? `${profile.age} ${isArabic ? 'سنة' : 'years'}` : null}
          />

          <InfoRow
            icon="resize-outline"
            label={isArabic ? 'الطول' : 'Height'}
            value={profile?.height ? `${profile.height} ${isArabic ? 'سم' : 'cm'}` : null}
          />

          <InfoRow
            icon="fitness-outline"
            label={isArabic ? 'الوزن' : 'Weight'}
            value={profile?.weight ? `${profile.weight} ${isArabic ? 'كجم' : 'kg'}` : null}
          />
        </View>

        {/* 2. LOCATION & NATIONALITY */}
        <View className="bg-white mb-3 px-4">
          <Text variant="h4" weight="bold" className="text-gray-900 py-4" style={{ textAlign: isArabic ? 'right' : 'left' }}>
            {isArabic ? 'الموقع والجنسية' : 'Location & Nationality'}
          </Text>

          <InfoRow
            icon="location-outline"
            label={isArabic ? 'بلد الإقامة' : 'Residence Country'}
            value={getCountryName(profile?.residenceCountry)}
          />

          <InfoRow
            icon="business-outline"
            label={isArabic ? 'مدينة الإقامة' : 'Residence City'}
            value={profile?.residenceCity}
          />

          <InfoRow
            icon="flag-outline"
            label={isArabic ? 'الجنسية' : 'Nationality'}
            value={getCountryName(profile?.nationality)}
          />
        </View>

        {/* 3. MARITAL & FAMILY */}
        <View className="bg-white mb-3 px-4">
          <Text variant="h4" weight="bold" className="text-gray-900 py-4" style={{ textAlign: isArabic ? 'right' : 'left' }}>
            {isArabic ? 'الحالة الاجتماعية' : 'Marital & Family'}
          </Text>

          <InfoRow
            icon="heart-outline"
            label={isArabic ? 'الحالة الاجتماعية' : 'Marital Status'}
            value={translateValue('maritalStatus', profile?.maritalStatus)}
          />

          <InfoRow
            icon="people-outline"
            label={isArabic ? 'لديه أطفال' : 'Has Children'}
            value={profile?.hasChildren === true ? (isArabic ? 'نعم' : 'Yes') : profile?.hasChildren === false ? (isArabic ? 'لا' : 'No') : null}
          />

          <InfoRow
            icon="happy-outline"
            label={isArabic ? 'تفضيل الأطفال' : 'Kids Preference'}
            value={translateValue('kidsPreference', profile?.kidsPreference)}
          />
        </View>

        {/* 4. RELIGION & PRACTICE */}
        <View className="bg-white mb-3 px-4">
          <Text variant="h4" weight="bold" className="text-gray-900 py-4" style={{ textAlign: isArabic ? 'right' : 'left' }}>
            {isArabic ? 'الدين والممارسة' : 'Religion & Practice'}
          </Text>

          <InfoRow
            icon="book-outline"
            label={isArabic ? 'الدين' : 'Religion'}
            value={translateValue('religion', profile?.religion)}
          />

          <InfoRow
            icon="library-outline"
            label={isArabic ? 'المذهب' : 'Madhhab'}
            value={translateValue('madhhab', profile?.madhhab)}
          />

          <InfoRow
            icon="star-outline"
            label={isArabic ? 'مستوى التدين' : 'Religiosity Level'}
            value={translateValue('religiosityLevel', profile?.religiosityLevel)}
          />

          <InfoRow
            icon="time-outline"
            label={isArabic ? 'عادة الصلاة' : 'Prayer Habit'}
            value={translateValue('prayerHabit', profile?.prayerHabit)}
          />
        </View>

        {/* 5. EDUCATION & WORK */}
        <View className="bg-white mb-3 px-4">
          <Text variant="h4" weight="bold" className="text-gray-900 py-4" style={{ textAlign: isArabic ? 'right' : 'left' }}>
            {isArabic ? 'التعليم والعمل' : 'Education & Work'}
          </Text>

          <InfoRow
            icon="school-outline"
            label={isArabic ? 'المستوى التعليمي' : 'Education Level'}
            value={translateValue('educationLevel', profile?.educationLevel)}
          />

          <InfoRow
            icon="briefcase-outline"
            label={isArabic ? 'حالة العمل' : 'Work Status'}
            value={translateValue('workStatus', profile?.workStatus)}
          />
        </View>

        {/* 6. MARRIAGE PREFERENCES */}
        <View className="bg-white mb-3 px-4">
          <Text variant="h4" weight="bold" className="text-gray-900 py-4" style={{ textAlign: isArabic ? 'right' : 'left' }}>
            {isArabic ? 'تفضيلات الزواج' : 'Marriage Preferences'}
          </Text>

          <InfoRow
            icon="heart-outline"
            label={isArabic ? 'أنواع الزواج المقبولة' : 'Marriage Types'}
            value={translateArray('marriageTypes', profile?.marriageTypes) || translateValue('marriageType', profile?.marriageType)}
          />

          <InfoRow
            icon="calendar-outline"
            label={isArabic ? 'خطة الزواج' : 'Marriage Plan'}
            value={translateValue('marriagePlan', profile?.marriagePlan)}
          />

          <InfoRow
            icon="home-outline"
            label={isArabic ? 'السكن بعد الزواج' : 'Residence After Marriage'}
            value={translateValue('residenceAfterMarriage', profile?.residenceAfterMarriage)}
          />
        </View>

        {/* 7. FAMILY & CHILDREN */}
        <View className="bg-white mb-3 px-4">
          <Text variant="h4" weight="bold" className="text-gray-900 py-4" style={{ textAlign: isArabic ? 'right' : 'left' }}>
            {isArabic ? 'الأسرة والأطفال' : 'Family & Children'}
          </Text>

          <InfoRow
            icon="time-outline"
            label={isArabic ? 'توقيت الإنجاب' : 'Children Timing'}
            value={translateValue('childrenTiming', profile?.childrenTiming)}
          />

          {profile?.gender === 'male' && (
            <InfoRow
              icon="woman-outline"
              label={isArabic ? 'السماح للزوجة بالعمل/الدراسة' : 'Allow Wife to Work/Study'}
              value={translateValue('allowWifeWorkStudy', profile?.allowWifeWorkStudy)}
            />
          )}
        </View>

        {/* 8. FINANCIAL & HEALTH */}
        <View className="bg-white mb-3 px-4">
          <Text variant="h4" weight="bold" className="text-gray-900 py-4" style={{ textAlign: isArabic ? 'right' : 'left' }}>
            {isArabic ? 'المعلومات المالية والصحية' : 'Financial & Health'}
          </Text>

          <InfoRow
            icon="wallet-outline"
            label={isArabic ? 'مستوى الدخل' : 'Income Level'}
            value={translateValue('incomeLevel', profile?.incomeLevel)}
          />

          <InfoRow
            icon="fitness-outline"
            label={isArabic ? 'الحالة الصحية' : 'Health Status'}
            value={translateArray('healthStatus', profile?.healthStatus)}
          />
        </View>

        {/* 9. ADDITIONAL INFORMATION */}
        <View className="bg-white mb-3 px-4">
          <Text variant="h4" weight="bold" className="text-gray-900 py-4" style={{ textAlign: isArabic ? 'right' : 'left' }}>
            {isArabic ? 'معلومات إضافية' : 'Additional Information'}
          </Text>

          <InfoRow
            icon="color-palette-outline"
            label={isArabic ? 'لون البشرة' : 'Skin Tone'}
            value={translateValue('skinTone', profile?.skinTone)}
          />

          <InfoRow
            icon="people-outline"
            label={isArabic ? 'الانتماء القبلي' : 'Tribe Affiliation'}
            value={translateValue('tribeAffiliation', profile?.tribeAffiliation)}
          />
        </View>

        {/* 10. LIFESTYLE */}
        <View className="bg-white mb-3 px-4">
          <Text variant="h4" weight="bold" className="text-gray-900 py-4" style={{ textAlign: isArabic ? 'right' : 'left' }}>
            {isArabic ? 'نمط الحياة' : 'Lifestyle'}
          </Text>

          <InfoRow
            icon="chatbubbles-outline"
            label={isArabic ? 'لغات التواصل' : 'Chat Languages'}
            value={translateArray('chatLanguages', profile?.chatLanguages)}
          />

          <InfoRow
            icon="cloud-outline"
            label={isArabic ? 'التدخين' : 'Smoking'}
            value={translateValue('smoking', profile?.smoking)}
          />
        </View>

        <View className="h-24" />
      </Animated.ScrollView>

      {/* Bottom Action Buttons */}
      <View className="absolute bottom-0 left-0 right-0 bg-white px-4 py-4 pb-8 border-t border-gray-100 flex-row-reverse gap-3">
        {/* Like Button */}
        <LikeButton profileId={profileId} variant="large" showText={true} />

        {/* Chat Button */}
        <TouchableOpacity
          onPress={() => console.log('Open chat with:', profileId)}
          className="flex-1 flex-row-reverse items-center justify-center gap-2 py-3.5 bg-purple-50 rounded-xl"
        >
          <Ionicons name="chatbubble-outline" size={20} color="#4f2396" />
          <Text variant="body" weight="semibold" className="text-primary">
            {isArabic ? 'محادثة' : 'Chat'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
