import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Text, SmartStatusBar, InfoRow } from '../../../components/main';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';

// Default avatars
const DEFAULT_AVATARS = {
  male: require('../../../assets/AvatorsInages/manAvator.png'),
  female: require('../../../assets/AvatorsInages/womanAvator.png')
};

export default function ProfileScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const { isArabic } = useLanguage();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      loadProfile();
    }
  }, [user?.uid]);

  const loadProfile = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setProfileData(data.profileData || {});
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettings = () => {
    console.log('⚙️ Opening Settings...');
    // Use parent navigation to access Stack screens from Tab screen
    const parentNav = navigation.getParent();
    if (parentNav) {
      console.log('✅ Using parent navigator');
      parentNav.navigate('Settings');
    } else {
      // Fallback to direct navigation
      console.log('⚠️ No parent navigator, using direct navigation');
      navigation.navigate('Settings');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      isArabic ? 'تسجيل الخروج' : 'Logout',
      isArabic ? 'هل أنت متأكد من تسجيل الخروج؟' : 'Are you sure you want to logout?',
      [
        { text: isArabic ? 'إلغاء' : 'Cancel', style: 'cancel' },
        {
          text: isArabic ? 'تسجيل خروج' : 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              console.error('❌ Logout error:', error);
            }
          }
        }
      ]
    );
  };

  // Get default avatar
  const getDefaultAvatar = () => {
    return profileData?.gender === 'female' ? DEFAULT_AVATARS.female : DEFAULT_AVATARS.male;
  };

  // Translation mappings for profile data
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
      daily: { ar: 'يوميًا', en: 'Daily' },
      weekly: { ar: 'أسبوعيًا', en: 'Weekly' },
      sometimes: { ar: 'أحيانًا', en: 'Sometimes' },
      religious_occasions: { ar: 'في المناسبات الدينية', en: 'On religious occasions' },
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
    marriageTypes: {
      traditional: { ar: 'عادي', en: 'Traditional' },
      civil: { ar: 'مدني (غير ديني)', en: 'Civil (non-religious)' },
      polygamy: { ar: 'تعدد', en: 'Polygamy' },
      misyar: { ar: 'مسيار', en: 'Misyar' },
      doesnt_matter: { ar: 'لا يهمني', en: "Doesn't matter" }
    },
    marriagePlan: {
      asap: { ar: 'في أقرب وقت ممكن', en: 'As soon as possible' },
      need_time: { ar: 'أحتاج لبعض الوقت', en: 'I need some time' },
      no_hurry: { ar: 'لست في عجلة من أمري', en: "I'm not in a hurry" }
    },
    childrenTiming: {
      asap: { ar: 'في أقرب وقت', en: 'As soon as possible' },
      after_two_years: { ar: 'بعد سنتين على الأقل', en: 'After at least two years' },
      depends: { ar: 'حسب الظروف', en: 'Depends on circumstances' },
      no_children: { ar: 'لا أريد الإنجاب', en: "I don't want children" }
    },
    chatLanguages: {
      arabic: { ar: 'العربية', en: 'Arabic' },
      english: { ar: 'الإنجليزية', en: 'English' },
      french: { ar: 'الفرنسية', en: 'French' },
      spanish: { ar: 'الإسبانية', en: 'Spanish' },
      turkish: { ar: 'التركية', en: 'Turkish' },
      urdu: { ar: 'الأردية', en: 'Urdu' },
      indonesian: { ar: 'الإندونيسية', en: 'Indonesian' },
      malay: { ar: 'الماليزية', en: 'Malay' }
    },
    smoking: {
      yes: { ar: 'نعم', en: 'Yes' },
      no: { ar: 'لا', en: 'No' },
      sometimes: { ar: 'أحيانًا', en: 'Sometimes' }
    },
    skinTone: {
      white: { ar: 'أبيض', en: 'White' },
      light_wheat: { ar: 'قمحي فاتح', en: 'Light Wheat' },
      wheat: { ar: 'قمحي', en: 'Wheat' },
      bronze: { ar: 'برونزي', en: 'Bronze' },
      light_brown: { ar: 'أسمر فاتح', en: 'Light Brown' },
      dark_brown: { ar: 'أسمر غامق', en: 'Dark Brown' }
    },
    incomeLevel: {
      high: { ar: 'مرتفع', en: 'High' },
      medium: { ar: 'متوسط', en: 'Medium' },
      low: { ar: 'منخفض', en: 'Low' },
      no_income: { ar: 'لا دخل مادي', en: 'No income' }
    },
    healthStatus: {
      chronic_illness: { ar: 'أعاني من مرض مزمن', en: 'Chronic illness' },
      special_needs: { ar: 'من ذوي الاحتياجات الخاصة', en: 'Special needs' },
      infertile: { ar: 'عقيم', en: 'Infertile' },
      good_health: { ar: 'بصحة جيدة', en: 'Good health' }
    },
    residenceAfterMarriage: {
      own_home: { ar: 'في منزلي الخاص', en: 'My own home' },
      parents_home: { ar: 'في منزل أهلي', en: 'With my parents' },
      parents_temporary: { ar: 'في منزل أهلي مؤقتًا', en: 'With my parents (temporary)' },
      undecided: { ar: 'لم أقرر بعد', en: 'Undecided' }
    },
    allowWifeWorkStudy: {
      yes: { ar: 'نعم', en: 'Yes' },
      yes_from_home: { ar: 'نعم، ولكن من المنزل', en: 'Yes, but from home' },
      depends: { ar: 'حسب الظروف', en: 'Depends' },
      no: { ar: 'لا', en: 'No' }
    }
  };

  // Helper to get country name
  const getCountryName = (countryObj) => {
    if (!countryObj) return null;
    if (typeof countryObj === 'string') return countryObj;
    return isArabic
      ? (countryObj.nameAr || countryObj.countryName || countryObj.nameEn || null)
      : (countryObj.nameEn || countryObj.countryName || countryObj.nameAr || null);
  };

  // Helper to translate field values
  const translateValue = (field, value) => {
    if (!value) return null;

    // Try exact match first
    let translation = TRANSLATIONS[field]?.[value];

    // If no exact match, try lowercase
    if (!translation && typeof value === 'string') {
      translation = TRANSLATIONS[field]?.[value.toLowerCase()];
    }

    // If still no translation, log and return original value
    if (!translation) {
      console.log(`⚠️ Missing translation for ${field}: ${value}`);
      return value;
    }

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

  const displayName = user?.displayName || profileData?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <View className="flex-1 bg-gray-50">
      <SmartStatusBar backgroundColor="#FFFFFF" />

      {/* Safe Area Top */}
      <View className="h-10 bg-gray-50" />

      {/* Header */}
      <View className="pt-2 pb-4 px-4 bg-white flex-row items-center justify-between border-b border-gray-100">
        {/* Settings Button */}
        <TouchableOpacity
          onPress={handleSettings}
          className="w-10 h-10 rounded-full bg-gray-50 justify-center items-center"
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={20} color="#4F2396" />
        </TouchableOpacity>

        {/* Title */}
        <Text variant="h4" weight="bold" className="text-gray-900">
          {isArabic ? 'ملفي الشخصي' : 'My Profile'}
        </Text>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="w-10 h-10 rounded-full bg-red-50 justify-center items-center"
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        bounces={true}
        overScrollMode="auto"
        contentContainerStyle={{ paddingBottom: 100 }} // Fixed: Match other tabs (Home/People/Chats)
      >
        {/* Profile Header - Compact */}
        <View className="bg-white items-center py-6 mb-3">
          {/* Avatar */}
          <Image
            source={profileData?.photos?.[0] ? { uri: profileData.photos[0] } : getDefaultAvatar()}
            className="w-28 h-28 rounded-full mb-3"
            resizeMode="cover"
          />

          {/* Name and Age */}
          <Text variant="h2" weight="bold" className="text-gray-900 mb-1">
            {displayName}
          </Text>

          {profileData?.age && (
            <Text variant="body" className="text-gray-600">
              {profileData.age} {isArabic ? 'سنة' : 'years old'}
            </Text>
          )}

          {/* Email */}
          <Text variant="caption" className="text-gray-400 mt-1">
            {user?.email}
          </Text>
        </View>

        {/* About Me */}
        {profileData?.aboutMe && (
          <View className="bg-white mb-3 p-4">
            <Text variant="h4" weight="bold" className="text-gray-900 mb-3" style={{ textAlign: isArabic ? 'right' : 'left' }}>
              {isArabic ? 'نبذة عني' : 'About Me'}
            </Text>
            <Text variant="body" className="text-gray-700 leading-6" style={{ textAlign: isArabic ? 'right' : 'left' }}>
              {profileData.aboutMe}
            </Text>
          </View>
        )}

        {/* Ideal Partner */}
        {profileData?.idealPartner && (
          <View className="bg-white mb-3 p-4">
            <Text variant="h4" weight="bold" className="text-gray-900 mb-3" style={{ textAlign: isArabic ? 'right' : 'left' }}>
              {isArabic ? 'الشريك المثالي' : 'Ideal Partner'}
            </Text>
            <Text variant="body" className="text-gray-700 leading-6" style={{ textAlign: isArabic ? 'right' : 'left' }}>
              {profileData.idealPartner}
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
            value={profileData?.gender === 'male' ? (isArabic ? 'ذكر' : 'Male') : profileData?.gender === 'female' ? (isArabic ? 'أنثى' : 'Female') : null}
          />
          <InfoRow
            icon="calendar-outline"
            label={isArabic ? 'العمر' : 'Age'}
            value={profileData?.age ? `${profileData.age} ${isArabic ? 'سنة' : 'years'}` : null}
          />
          <InfoRow
            icon="resize-outline"
            label={isArabic ? 'الطول' : 'Height'}
            value={profileData?.height ? `${profileData.height} ${isArabic ? 'سم' : 'cm'}` : null}
          />
          <InfoRow
            icon="fitness-outline"
            label={isArabic ? 'الوزن' : 'Weight'}
            value={profileData?.weight ? `${profileData.weight} ${isArabic ? 'كجم' : 'kg'}` : null}
          />
          {profileData?.skinTone && (
            <InfoRow
              icon="color-palette-outline"
              label={isArabic ? 'لون البشرة' : 'Skin Tone'}
              value={translateValue('skinTone', profileData?.skinTone)}
            />
          )}
          {profileData?.tribeAffiliation !== undefined && (
            <InfoRow
              icon="people-outline"
              label={isArabic ? 'الانتماء القبلي' : 'Tribe Affiliation'}
              value={profileData?.tribeAffiliation ? 
                (isArabic ? 'نعم' : 'Yes') : 
                (isArabic ? 'لا' : 'No')}
            />
          )}
        </View>

        {/* 2. LOCATION & NATIONALITY */}
        <View className="bg-white mb-3 px-4">
          <Text variant="h4" weight="bold" className="text-gray-900 py-4" style={{ textAlign: isArabic ? 'right' : 'left' }}>
            {isArabic ? 'الموقع والجنسية' : 'Location & Nationality'}
          </Text>

          <InfoRow
            icon="location-outline"
            label={isArabic ? 'بلد الإقامة' : 'Residence Country'}
            value={getCountryName(profileData?.residenceCountry)}
          />
          <InfoRow
            icon="business-outline"
            label={isArabic ? 'مدينة الإقامة' : 'Residence City'}
            value={profileData?.residenceCity}
          />
          <InfoRow
            icon="flag-outline"
            label={isArabic ? 'الجنسية' : 'Nationality'}
            value={getCountryName(profileData?.nationality)}
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
            value={translateValue('maritalStatus', profileData?.maritalStatus)}
          />
          <InfoRow
            icon="people-outline"
            label={isArabic ? 'لديه أطفال' : 'Has Children'}
            value={profileData?.hasChildren === true ? (isArabic ? 'نعم' : 'Yes') : profileData?.hasChildren === false ? (isArabic ? 'لا' : 'No') : null}
          />
          {profileData?.childrenTiming && (
            <InfoRow
              icon="time-outline"
              label={isArabic ? 'وقت الإنجاب' : 'Children Timing'}
              value={translateValue('childrenTiming', profileData?.childrenTiming)}
            />
          )}
        </View>

        {/* 4. RELIGION & PRACTICE */}
        <View className="bg-white mb-3 px-4">
          <Text variant="h4" weight="bold" className="text-gray-900 py-4" style={{ textAlign: isArabic ? 'right' : 'left' }}>
            {isArabic ? 'الدين والممارسة' : 'Religion & Practice'}
          </Text>

          <InfoRow
            icon="book-outline"
            label={isArabic ? 'الدين' : 'Religion'}
            value={translateValue('religion', profileData?.religion)}
          />
          <InfoRow
            icon="documents-outline"
            label={isArabic ? 'المذهب' : 'Madhhab'}
            value={translateValue('madhhab', profileData?.madhhab)}
          />
          <InfoRow
            icon="star-outline"
            label={isArabic ? 'مستوى التدين' : 'Religiosity Level'}
            value={translateValue('religiosityLevel', profileData?.religiosityLevel)}
          />
          <InfoRow
            icon="moon-outline"
            label={isArabic ? 'عادة الصلاة' : 'Prayer Habit'}
            value={translateValue('prayerHabit', profileData?.prayerHabit)}
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
            value={translateValue('educationLevel', profileData?.educationLevel)}
          />
          <InfoRow
            icon="briefcase-outline"
            label={isArabic ? 'حالة العمل' : 'Work Status'}
            value={translateValue('workStatus', profileData?.workStatus)}
          />
        </View>

        {/* 6. FINANCIAL INFORMATION */}
        {profileData?.incomeLevel && (
          <View className="bg-white mb-3 px-4">
            <Text variant="h4" weight="bold" className="text-gray-900 py-4" style={{ textAlign: isArabic ? 'right' : 'left' }}>
              {isArabic ? 'المعلومات المالية' : 'Financial Information'}
            </Text>
            
            <InfoRow
              icon="wallet-outline"
              label={isArabic ? 'مستوى الدخل' : 'Income Level'}
              value={translateValue('incomeLevel', profileData?.incomeLevel)}
            />
          </View>
        )}

        {/* 7. HEALTH & WELLNESS */}
        {profileData?.healthStatus && (
          <View className="bg-white mb-3 px-4">
            <Text variant="h4" weight="bold" className="text-gray-900 py-4" style={{ textAlign: isArabic ? 'right' : 'left' }}>
              {isArabic ? 'الصحة' : 'Health & Wellness'}
            </Text>
            
            <InfoRow
              icon="medkit-outline"
              label={isArabic ? 'الحالة الصحية' : 'Health Status'}
              value={translateArray('healthStatus', profileData?.healthStatus)}
            />
          </View>
        )}

        {/* 8. MARRIAGE PREFERENCES */}
        <View className="bg-white mb-3 px-4">
          <Text variant="h4" weight="bold" className="text-gray-900 py-4" style={{ textAlign: isArabic ? 'right' : 'left' }}>
            {isArabic ? 'تفضيلات الزواج' : 'Marriage Preferences'}
          </Text>

          {profileData?.marriageTypes && (
            <InfoRow
              icon="heart-outline"
              label={isArabic ? 'أنواع الزواج المقبولة' : 'Accepted Marriage Types'}
              value={translateArray('marriageTypes', profileData?.marriageTypes)}
            />
          )}
          {profileData?.marriagePlan && (
            <InfoRow
              icon="calendar-outline"
              label={isArabic ? 'خطة الزواج' : 'Marriage Plan'}
              value={translateValue('marriagePlan', profileData?.marriagePlan)}
            />
          )}
          {profileData?.residenceAfterMarriage && (
            <InfoRow
              icon="home-outline"
              label={isArabic ? 'مكان السكن بعد الزواج' : 'Residence After Marriage'}
              value={translateValue('residenceAfterMarriage', profileData?.residenceAfterMarriage)}
            />
          )}
          {profileData?.allowWifeWorkStudy && (
            <InfoRow
              icon="briefcase-outline"
              label={isArabic ? 'عمل أو دراسة الزوجة' : 'Wife Work/Study'}
              value={translateValue('allowWifeWorkStudy', profileData?.allowWifeWorkStudy)}
            />
          )}
        </View>

        {/* 9. LIFESTYLE */}
        <View className="bg-white mb-3 px-4">
          <Text variant="h4" weight="bold" className="text-gray-900 py-4" style={{ textAlign: isArabic ? 'right' : 'left' }}>
            {isArabic ? 'نمط الحياة' : 'Lifestyle'}
          </Text>

          <InfoRow
            icon="chatbubbles-outline"
            label={isArabic ? 'لغات التواصل' : 'Chat Languages'}
            value={translateArray('chatLanguages', profileData?.chatLanguages)}
          />
          {profileData?.smoking && (
            <InfoRow
              icon="medkit-outline"
              label={isArabic ? 'التدخين' : 'Smoking'}
              value={translateValue('smoking', profileData?.smoking)}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
