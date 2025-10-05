import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Text, Header, Button } from '../../../components/main';

export default function ProfileScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const { isArabic } = useLanguage();

  const viewProfileText = isArabic ? 'عرض الملف الشخصي' : 'View Profile';
  const editProfileText = isArabic ? 'تعديل الملف الشخصي' : 'Edit Profile';
  const settingsText = isArabic ? 'الإعدادات' : 'Settings';
  const logoutText = isArabic ? 'تسجيل الخروج' : 'Logout';

  const handleViewProfile = () => {
    if (user?.uid) {
      navigation.navigate('ProfileDetail', { profileId: user.uid });
    }
  };

  const handleEditProfile = () => {
    // TODO: Navigate to edit profile screen
    console.log('Edit profile');
  };

  const handleSettings = () => {
    // TODO: Navigate to settings screen
    console.log('Settings');
  };

  const handleLogout = async () => {
    try {
      console.log('🚪 Logging out user...');
      await signOut();
      // Navigation will be handled by AppNavigator automatically
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  return (
    <View className="flex-1 bg-background-alt">
      <Header
        title={isArabic ? 'الملف الشخصي' : 'Profile'}
        showBackButton={false}
      />

      <View className="flex-1 px-6 py-8">
        {/* User Info Card */}
        <View className="bg-white rounded-2xl p-6 mb-6">
          <Text variant="h3" weight="bold" className="text-text-primary mb-2">
            {user?.displayName || user?.email?.split('@')[0] || 'User'}
          </Text>
          <Text variant="body" className="text-text-secondary mb-4">
            {user?.email}
          </Text>
          
          <View className="flex-row items-center gap-2">
            <Text className="text-lg">✅</Text>
            <Text variant="body" className="text-success">
              {isArabic ? 'الملف الشخصي مكتمل' : 'Profile Complete'}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="gap-4">
          <Button
            title={viewProfileText}
            variant="primary"
            size="large"
            onPress={handleViewProfile}
          />

          <Button
            title={editProfileText}
            variant="secondary"
            size="large"
            onPress={handleEditProfile}
          />

          <Button
            title={settingsText}
            variant="outline"
            size="large"
            onPress={handleSettings}
          />

          <Button
            title={logoutText}
            variant="ghost"
            size="large"
            onPress={handleLogout}
          />
        </View>
      </View>
    </View>
  );
}
