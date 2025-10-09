import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, Switch, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../../contexts/AuthContext';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { Text, SmartStatusBar } from '../../../../components/main';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../config/firebase';
import { deleteUser } from 'firebase/auth';
import BlockService from '../../../../services/BlockService';

// Setting Row Component
function SettingRow({ icon, label, value, onPress, showArrow = false, isToggle = false, toggleValue = false, onToggleChange, isDestructive = false }) {
  return (
    <TouchableOpacity
      onPress={!isToggle ? onPress : null}
      className="flex-row items-center justify-between py-4 border-b border-gray-100"
      activeOpacity={isToggle ? 1 : 0.7}
      disabled={isToggle}
    >
      <View className="flex-row items-center flex-1">
        <View className={`w-9 h-9 rounded-full ${isDestructive ? 'bg-red-50' : 'bg-purple-50'} items-center justify-center mr-3`}>
          <Ionicons
            name={icon}
            size={20}
            color={isDestructive ? '#EF4444' : '#4F2396'}
          />
        </View>
        <View className="flex-1">
          <Text
            variant="body"
            weight="medium"
            className={isDestructive ? 'text-red-600' : 'text-gray-900'}
          >
            {label}
          </Text>
          {value && (
            <Text variant="caption" className="text-gray-500 mt-0.5">
              {value}
            </Text>
          )}
        </View>
      </View>

      {isToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggleChange}
          trackColor={{ false: '#E5E7EB', true: '#C4B5FD' }}
          thumbColor={toggleValue ? '#4F2396' : '#F3F4F6'}
          ios_backgroundColor="#E5E7EB"
        />
      ) : showArrow ? (
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      ) : null}
    </TouchableOpacity>
  );
}

// Section Header Component
function SectionHeader({ title }) {
  return (
    <Text variant="caption" weight="semibold" className="text-gray-500 px-4 pt-5 pb-2 uppercase tracking-wide">
      {title}
    </Text>
  );
}

export default function SettingsScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const { isArabic, changeLanguage, language } = useLanguage();

  // Privacy settings state
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showLastSeen, setShowLastSeen] = useState(true);
  const [gpsEnabled, setGpsEnabled] = useState(false);

  // UI state
  const [loading, setLoading] = useState(true);
  const [blockedUsersCount, setBlockedUsersCount] = useState(0);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadSettings();
    loadBlockedUsersCount();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (userDoc.exists()) {
        const data = userDoc.data();
        setShowOnlineStatus(data.showOnlineStatus ?? true);
        setShowLastSeen(data.showLastSeen ?? true);
        setGpsEnabled(data.gpsEnabled ?? false);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBlockedUsersCount = async () => {
    try {
      const blockedUsers = await BlockService.getBlockedUsers(user.uid);
      setBlockedUsersCount(blockedUsers.length);
    } catch (error) {
      console.error('Error loading blocked users count:', error);
    }
  };

  const updatePrivacySetting = async (field, value) => {
    try {
      setUpdating(true);
      await updateDoc(doc(db, 'users', user.uid), {
        [field]: value,
        updatedAt: new Date().toISOString()
      });
      console.log(`✅ Updated ${field} to ${value}`);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        isArabic ? 'فشل تحديث الإعدادات' : 'Failed to update settings'
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleShowOnlineStatusToggle = async (value) => {
    setShowOnlineStatus(value);
    await updatePrivacySetting('showOnlineStatus', value);
  };

  const handleShowLastSeenToggle = async (value) => {
    setShowLastSeen(value);
    await updatePrivacySetting('showLastSeen', value);
  };

  const handleGpsToggle = async (value) => {
    setGpsEnabled(value);
    await updatePrivacySetting('gpsEnabled', value);
  };

  const handleLanguageChange = () => {
    Alert.alert(
      isArabic ? 'تغيير اللغة' : 'Change Language',
      isArabic ? 'اختر لغة التطبيق' : 'Select app language',
      [
        {
          text: 'العربية',
          onPress: () => changeLanguage('ar')
        },
        {
          text: 'English',
          onPress: () => changeLanguage('en')
        },
        {
          text: isArabic ? 'إلغاء' : 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      isArabic ? 'حذف الحساب' : 'Delete Account',
      isArabic
        ? 'هل أنت متأكد من حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء.'
        : 'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: isArabic ? 'إلغاء' : 'Cancel',
          style: 'cancel'
        },
        {
          text: isArabic ? 'حذف' : 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete user from Firebase Auth
              await deleteUser(user);

              // Note: Firestore user document cleanup should be done via Cloud Functions
              // For now, we'll just delete the auth account

              Alert.alert(
                isArabic ? 'تم الحذف' : 'Deleted',
                isArabic ? 'تم حذف حسابك بنجاح' : 'Your account has been deleted successfully'
              );
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert(
                isArabic ? 'خطأ' : 'Error',
                isArabic
                  ? 'فشل حذف الحساب. الرجاء المحاولة لاحقاً.'
                  : 'Failed to delete account. Please try again later.'
              );
            }
          }
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      isArabic ? 'تسجيل الخروج' : 'Logout',
      isArabic ? 'هل أنت متأكد من تسجيل الخروج؟' : 'Are you sure you want to logout?',
      [
        {
          text: isArabic ? 'إلغاء' : 'Cancel',
          style: 'cancel'
        },
        {
          text: isArabic ? 'تسجيل خروج' : 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              console.error('Error logging out:', error);
            }
          }
        }
      ]
    );
  };

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
          {isArabic ? 'الإعدادات' : 'Settings'}
        </Text>

        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* ACCOUNT SECTION */}
        <SectionHeader title={isArabic ? 'الحساب' : 'ACCOUNT'} />
        <View className="bg-white px-4">
          <SettingRow
            icon="mail-outline"
            label={isArabic ? 'البريد الإلكتروني' : 'Email'}
            value={user?.email}
          />
          <SettingRow
            icon="trash-outline"
            label={isArabic ? 'حذف الحساب' : 'Delete Account'}
            onPress={handleDeleteAccount}
            showArrow
            isDestructive
          />
        </View>

        {/* PRIVACY SECTION */}
        <SectionHeader title={isArabic ? 'الخصوصية' : 'PRIVACY'} />
        <View className="bg-white px-4">
          <SettingRow
            icon="eye-outline"
            label={isArabic ? 'إظهار حالة الاتصال' : 'Show Online Status'}
            value={isArabic ? 'عرض "متصل الآن" للآخرين' : 'Show "online now" to others'}
            isToggle
            toggleValue={showOnlineStatus}
            onToggleChange={handleShowOnlineStatusToggle}
          />
          <SettingRow
            icon="time-outline"
            label={isArabic ? 'إظهار آخر ظهور' : 'Show Last Seen'}
            value={isArabic ? 'عرض "آخر ظهور" للآخرين' : 'Show "last seen" to others'}
            isToggle
            toggleValue={showLastSeen}
            onToggleChange={handleShowLastSeenToggle}
          />
          <SettingRow
            icon="location-outline"
            label={isArabic ? 'تفعيل الموقع' : 'Enable GPS Location'}
            value={isArabic ? 'لإيجاد أشخاص قريبين منك' : 'Find people near you'}
            isToggle
            toggleValue={gpsEnabled}
            onToggleChange={handleGpsToggle}
          />
        </View>

        {/* LANGUAGE SECTION */}
        <SectionHeader title={isArabic ? 'اللغة' : 'LANGUAGE'} />
        <View className="bg-white px-4">
          <SettingRow
            icon="language-outline"
            label={isArabic ? 'لغة التطبيق' : 'App Language'}
            value={language === 'ar' ? 'العربية' : 'English'}
            onPress={handleLanguageChange}
            showArrow
          />
        </View>

        {/* BLOCKED USERS SECTION */}
        <SectionHeader title={isArabic ? 'المحظورون' : 'BLOCKED USERS'} />
        <View className="bg-white px-4">
          <SettingRow
            icon="ban-outline"
            label={isArabic ? 'المستخدمون المحظورون' : 'Blocked Users'}
            value={
              blockedUsersCount > 0
                ? `${blockedUsersCount} ${isArabic ? 'محظور' : 'blocked'}`
                : isArabic ? 'لا يوجد مستخدمون محظورون' : 'No blocked users'
            }
            onPress={() => navigation.navigate('BlockedUsers')}
            showArrow
          />
        </View>

        {/* APP INFO SECTION */}
        <SectionHeader title={isArabic ? 'حول التطبيق' : 'APP INFO'} />
        <View className="bg-white px-4">
          <SettingRow
            icon="information-circle-outline"
            label={isArabic ? 'الإصدار' : 'Version'}
            value="1.0.0"
          />
          <SettingRow
            icon="heart-outline"
            label={isArabic ? 'حول ناسبني' : 'About Nasibni'}
            value={isArabic ? 'تطبيق زواج إسلامي' : 'Islamic Marriage App'}
          />
        </View>

        {/* LOGOUT SECTION */}
        <SectionHeader title={isArabic ? 'الخروج' : 'SESSION'} />
        <View className="bg-white px-4 mb-4">
          <SettingRow
            icon="log-out-outline"
            label={isArabic ? 'تسجيل الخروج' : 'Logout'}
            onPress={handleLogout}
            showArrow
            isDestructive
          />
        </View>

        {/* App Branding */}
        <View className="items-center py-8">
          <Text variant="caption" className="text-gray-400 mb-1">
            {isArabic ? 'صنع بـ ❤️ لربط القلوب' : 'Made with ❤️ to connect hearts'}
          </Text>
          <Text variant="small" className="text-gray-300">
            Nasibni © 2025
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
