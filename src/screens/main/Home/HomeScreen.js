import React, { useState, useEffect, useCallback } from 'react';
import { View, ActivityIndicator, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { ProfileCard, Text } from '../../../components/main';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import ProfileService from '../../../services/ProfileService';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const { isArabic } = useLanguage();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only load profiles if user is available and has profile data
    if (user && user.profile && user.profile.data) {
      loadInitialProfiles();
    } else {
      console.log('⚠️ User or profile data not ready yet, skipping profile load');
      setLoading(false);
    }
  }, [user]);

  const loadInitialProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Debug user data structure
      console.log('👤 Current user:', user);
      console.log('👤 User profile:', user?.profile);
      console.log('👤 User profile data:', user?.profile?.data);
      
      const userGender = user?.profile?.data?.gender || 'male';
      console.log('🔍 Loading initial profiles for gender:', userGender);
      
      const result = await ProfileService.getInitialProfiles(userGender);
      
      console.log('📊 Loaded initial profiles:', result.profiles.length);
      if (result.profiles.length > 0) {
        console.log('📝 First profile:', JSON.stringify(result.profiles[0], null, 2));
      }
      
      setProfiles(result.profiles);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Error loading initial profiles:', error);
      setError(isArabic ? 'خطأ في تحميل الملفات الشخصية' : 'Error loading profiles');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreProfiles = useCallback(async () => {
    if (loadingMore || !hasMore || !lastDoc) return;

    try {
      setLoadingMore(true);
      const userGender = user?.profile?.data?.gender || 'male';
      console.log('🔄 Loading more profiles for gender:', userGender);
      
      const result = await ProfileService.getMoreProfiles(userGender, lastDoc);
      
      console.log('📊 Loaded more profiles:', result.profiles.length);
      if (result.profiles.length > 0) {
        console.log('📝 First new profile:', result.profiles[0]);
      }

      setProfiles(prev => {
        const newProfiles = [...prev, ...result.profiles];
        console.log('📊 Total profiles after loadMore:', newProfiles.length);
        return newProfiles;
      });
      
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Error loading more profiles:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, lastDoc, user?.profile?.data?.gender]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadInitialProfiles();
    setRefreshing(false);
  }, []);

  const renderProfile = useCallback(({ item }) => {
    if (!item) {
      console.error('❌ FlatList renderItem: item is undefined!');
      return null;
    }
    console.log('🎴 Rendering profile:', item?.id, 'displayName:', item?.displayName, 'name:', item?.name);
    return (
      <ProfileCard
        profile={item}
        onPress={() => navigation?.navigate('ProfileDetail', { profileId: item.id })}
        onAdd={() => console.log('Add:', item.id)}
      />
    );
  }, [navigation]);

  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;
    
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color="#4F2396" />
        <Text variant="caption" className="text-gray-500 mt-2">
          {isArabic ? 'جاري التحميل...' : 'Loading more...'}
        </Text>
      </View>
    );
  }, [loadingMore, isArabic]);

  const renderEmpty = useCallback(() => {
    if (loading) return null;
    
    return (
      <View className="flex-1 items-center justify-center py-20">
        <Text variant="h3" weight="bold" className="text-gray-900 mb-2">
          {isArabic ? 'لا توجد ملفات شخصية' : 'No profiles available'}
        </Text>
        <Text variant="body" className="text-gray-600 text-center px-8">
          {isArabic ? 'تحقق مرة أخرى لاحقاً للملفات الشخصية الجديدة' : 'Check back later for new profiles'}
        </Text>
      </View>
    );
  }, [loading, isArabic]);

  const renderError = useCallback(() => {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <Text variant="h3" weight="bold" className="text-red-500 mb-2">
          {isArabic ? 'خطأ' : 'Error'}
        </Text>
        <Text variant="body" className="text-gray-600 text-center px-8 mb-4">
          {error}
        </Text>
        <TouchableOpacity
          className="bg-primary px-6 py-3 rounded-lg"
          onPress={loadInitialProfiles}
        >
          <Text className="text-white font-semibold">
            {isArabic ? 'إعادة المحاولة' : 'Retry'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }, [error, isArabic]);

  if (loading && profiles.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4F2396" />
        <Text variant="body" className="text-gray-600 mt-4">
          {isArabic ? 'جاري التحميل...' : 'Loading profiles...'}
        </Text>
      </View>
    );
  }

  if (error && profiles.length === 0) {
    return renderError();
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Safe Area Top */}
      <View className="h-12 bg-white" />

      {/* Header */}
      <View className="bg-white px-4 py-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Text variant="h4" weight="bold" className="text-text-primary">
            {isArabic ? 'اكتشف الأشخاص' : 'Discover People'}
          </Text>
          <View className="bg-primary/10 px-2 py-1 rounded-full">
            <Text variant="caption" className="text-primary font-semibold">
              {profiles.length}
            </Text>
          </View>
        </View>

        {/* Search Icon */}
        <TouchableOpacity className="w-10 h-10 items-center justify-center">
          <Text className="text-2xl text-gray-600">🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Cards with Lazy Loading */}
      <FlatList
        data={profiles}
        keyExtractor={(item, index) => {
          if (!item || !item.id) {
            console.error('❌ FlatList keyExtractor: item or item.id is undefined!', item);
            return `fallback-${index}`;
          }
          return item.id;
        }}
        renderItem={renderProfile}
        onEndReached={loadMoreProfiles}
        onEndReachedThreshold={0.3} // Trigger when 30% from bottom
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4F2396']}
            tintColor="#4F2396"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
          flexGrow: 1
        }}
      />
    </View>
  );
}
