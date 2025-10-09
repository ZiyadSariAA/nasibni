import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, Alert, RefreshControl, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../../contexts/AuthContext';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { Text, SmartStatusBar, LoadingState, EmptyState } from '../../../../components/main';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../config/firebase';
import BlockService from '../../../../services/BlockService';
import PeopleDataService from '../../../../services/PeopleDataService';

// Default avatars
const DEFAULT_AVATARS = {
  male: require('../../../../assets/AvatorsInages/manAvator.png'),
  female: require('../../../../assets/AvatorsInages/womanAvator.png')
};

// Blocked User Card Component
function BlockedUserCard({ user, onUnblock, isArabic }) {
  const [unblocking, setUnblocking] = useState(false);

  const handleUnblock = () => {
    Alert.alert(
      isArabic ? 'إلغاء الحظر' : 'Unblock User',
      isArabic
        ? `هل تريد إلغاء حظر ${user.displayName}؟`
        : `Do you want to unblock ${user.displayName}?`,
      [
        {
          text: isArabic ? 'إلغاء' : 'Cancel',
          style: 'cancel'
        },
        {
          text: isArabic ? 'إلغاء الحظر' : 'Unblock',
          onPress: async () => {
            setUnblocking(true);
            await onUnblock(user.id);
            setUnblocking(false);
          }
        }
      ]
    );
  };

  const getDefaultAvatar = () => {
    return user?.gender === 'female' ? DEFAULT_AVATARS.female : DEFAULT_AVATARS.male;
  };

  return (
    <View className="bg-white mb-2 mx-4 p-4 rounded-2xl flex-row items-center justify-between shadow-sm">
      {/* User Info */}
      <View className="flex-row items-center flex-1">
        <Image
          source={user?.photos?.[0] ? { uri: user.photos[0] } : getDefaultAvatar()}
          className="w-12 h-12 rounded-full mr-3"
          resizeMode="cover"
        />
        <View className="flex-1">
          <Text variant="body" weight="semibold" className="text-gray-900">
            {user.displayName}
          </Text>
          {user.age && (
            <Text variant="caption" className="text-gray-500">
              {user.age} {isArabic ? 'سنة' : 'years old'}
            </Text>
          )}
        </View>
      </View>

      {/* Unblock Button */}
      <TouchableOpacity
        onPress={handleUnblock}
        disabled={unblocking}
        className={`px-4 py-2 rounded-full ${unblocking ? 'bg-gray-100' : 'bg-red-50'}`}
        activeOpacity={0.7}
      >
        <Text
          variant="caption"
          weight="semibold"
          className={unblocking ? 'text-gray-400' : 'text-red-600'}
        >
          {unblocking
            ? (isArabic ? 'جاري...' : 'Unblocking...')
            : (isArabic ? 'إلغاء الحظر' : 'Unblock')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function BlockedUsersScreen({ navigation }) {
  const { user } = useAuth();
  const { isArabic } = useLanguage();

  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBlockedUsers();
  }, []);

  const loadBlockedUsers = async () => {
    const startTime = Date.now();
    let firestoreReads = 0;

    try {
      setError(null);
      setLoading(true);

      console.log('📥 BLOCKED USERS: Starting fetch...');

      // ========================================
      // STEP 1: Get list of blocked user IDs
      // ========================================
      const blockedUserIds = await BlockService.getBlockedUsers(user.uid);
      firestoreReads++; // 1 read for blocks query

      if (blockedUserIds.length === 0) {
        setBlockedUsers([]);
        console.log('📋 No blocked users found');
        return;
      }

      console.log(`📋 Found ${blockedUserIds.length} blocked user IDs`);

      // ========================================
      // STEP 2: Fetch current user data for blocking filter
      // ========================================
      const currentUserDoc = await getDoc(doc(db, 'users', user.uid));
      firestoreReads++; // 1 read for current user
      const currentUserData = currentUserDoc.exists() ? currentUserDoc.data() : {};

      // ========================================
      // STEP 3: Batch fetch all blocked user profiles
      // OPTIMIZATION: Was N+1 (1 + N queries), now 1 + ceil(N/10) queries
      // ========================================
      const batchStartTime = Date.now();

      const userProfiles = await PeopleDataService.getProfilesByIds(
        blockedUserIds,
        currentUserData,
        blockedUserIds.length
      );

      // Calculate batch reads: ceil(blockedUserIds / 10)
      const batchQueries = Math.ceil(blockedUserIds.length / 10);
      firestoreReads += batchQueries;

      const batchFetchTime = Date.now() - batchStartTime;

      setBlockedUsers(userProfiles);

      // ========================================
      // PERFORMANCE METRICS SUMMARY
      // ========================================
      const totalTime = Date.now() - startTime;
      const oldReadCount = 1 + blockedUserIds.length; // Old: 1 for IDs + 1 per user
      const reduction = Math.round((1 - firestoreReads / oldReadCount) * 100);

      console.log('📊 BLOCKED USERS PERFORMANCE:');
      console.log('  - Blocked users count:', blockedUserIds.length);
      console.log('  - Profiles fetched:', userProfiles.length);
      console.log('  - Firestore reads:', firestoreReads);
      console.log('  - Old method would use:', oldReadCount, 'reads');
      console.log('  - Reduction:', reduction + '%');
      console.log('  - Total time:', totalTime + 'ms');
      console.log('  - Batch fetch time:', batchFetchTime + 'ms');
      console.log('✅ Blocked users optimization: ' + reduction + '% fewer reads, ' + Math.round(oldReadCount / firestoreReads) + 'x faster');

    } catch (err) {
      console.error('Error loading blocked users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadBlockedUsers();
    setRefreshing(false);
  }, []);

  const handleUnblock = async (userId) => {
    try {
      console.log(`🔓 Unblocking user: ${userId}`);

      const result = await BlockService.unblockUser(user.uid, userId);

      if (result.success) {
        // Remove user from local state
        setBlockedUsers(prev => prev.filter(u => u.id !== userId));

        Alert.alert(
          isArabic ? 'تم إلغاء الحظر' : 'Unblocked',
          isArabic ? 'تم إلغاء حظر المستخدم بنجاح' : 'User has been unblocked successfully'
        );

        console.log('✅ User unblocked successfully');
      } else {
        throw new Error(result.error || 'Failed to unblock user');
      }
    } catch (err) {
      console.error('Error unblocking user:', err);
      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        isArabic ? 'فشل إلغاء حظر المستخدم' : 'Failed to unblock user'
      );
    }
  };

  if (loading) {
    return <LoadingState />;
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
          {isArabic ? 'المستخدمون المحظورون' : 'Blocked Users'}
        </Text>

        <View className="w-10" />
      </View>

      {/* Content */}
      {blockedUsers.length === 0 ? (
        <EmptyState
          icon="ban-outline"
          title={isArabic ? 'لا يوجد مستخدمون محظورون' : 'No Blocked Users'}
          message={isArabic ? 'لم تقم بحظر أي مستخدم بعد' : "You haven't blocked anyone yet"}
        />
      ) : (
        <FlatList
          data={blockedUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BlockedUserCard
              user={item}
              onUnblock={handleUnblock}
              isArabic={isArabic}
            />
          )}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          bounces={true}
          overScrollMode="auto"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#4F2396"
              colors={['#4F2396']}
              progressViewOffset={0}
            />
          }
          ListHeaderComponent={
            <View className="px-4 mb-4">
              <Text variant="caption" className="text-gray-500">
                {isArabic
                  ? `لديك ${blockedUsers.length} ${blockedUsers.length === 1 ? 'مستخدم محظور' : 'مستخدمين محظورين'}`
                  : `You have ${blockedUsers.length} blocked ${blockedUsers.length === 1 ? 'user' : 'users'}`}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
