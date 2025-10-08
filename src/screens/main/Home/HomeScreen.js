import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, RefreshControl, Platform, Alert, InteractionManager } from 'react-native';
import { BlurView } from 'expo-blur';
import { CompactProfileCard, Text, SmartStatusBar, LoadingState, EmptyState, ErrorState } from '../../../components/main';
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
  const [errorObject, setErrorObject] = useState(null);

  // Ref to track if component is mounted (prevent setState on unmounted component)
  const isMountedRef = React.useRef(true);

  // Track viewable items AND extended range for smart image loading/unloading
  const [viewableItemIds, setViewableItemIds] = useState(new Set());
  const [extendedRangeIds, setExtendedRangeIds] = useState(new Set());

  // Cache for profiles to avoid reloading on refresh
  const profilesCacheRef = React.useRef([]);

  useEffect(() => {
    // Set mounted flag
    isMountedRef.current = true;

    // Only load profiles if user is available and has profile data
    if (user && user.profile && user.profile.data) {
      loadInitialProfiles();
    } else {
      console.log('⚠️ User or profile data not ready yet, skipping profile load');
      setLoading(false);
    }

    // Cleanup on unmount
    return () => {
      isMountedRef.current = false;
      console.log('🧹 HomeScreen unmounting - cleaning up');
    };
  }, [user]);

  const loadInitialProfiles = async () => {
    try {
      if (!isMountedRef.current) return; // Abort if unmounted
      setLoading(true);
      setError(null);

      // Debug user data structure
      console.log('👤 Current user:', user);
      console.log('👤 User profile:', user?.profile);
      console.log('👤 User profile data:', user?.profile?.data);

      const userGender = user?.profile?.data?.gender || 'male';
      console.log('🔍 Loading initial profiles for gender:', userGender);

      const result = await ProfileService.getInitialProfiles(userGender);

      if (!isMountedRef.current) return; // Abort if unmounted during async operation

      console.log('📊 Loaded initial profiles:', result.profiles.length);
      if (result.profiles.length > 0) {
        console.log('📝 First profile:', JSON.stringify(result.profiles[0], null, 2));
      }

      // Cache profiles for future refresh
      profilesCacheRef.current = result.profiles;

      setProfiles(result.profiles);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (error) {
      if (!isMountedRef.current) return; // Abort if unmounted

      console.error('═══════════════════════════════════════');
      console.error('🔴 ERROR: Loading Initial Profiles');
      console.error('═══════════════════════════════════════');
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
      console.error('Error Object:', error);
      console.error('User Gender:', user?.profile?.data?.gender);
      console.error('Timestamp:', new Date().toISOString());
      console.error('═══════════════════════════════════════');

      setError(isArabic ? 'خطأ في تحميل الملفات الشخصية' : 'Error loading profiles');
      setErrorObject(error);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  // Ref to prevent double pagination
  const isLoadingMoreRef = React.useRef(false);

  const loadMoreProfiles = useCallback(async () => {
    // DEBOUNCE: Prevent double/triple calls to onEndReached
    if (isLoadingMoreRef.current || loadingMore || !hasMore || !lastDoc || !isMountedRef.current) {
      console.log('⏸️ Skipping loadMore - already loading or no more data');
      return;
    }

    isLoadingMoreRef.current = true;

    try {
      setLoadingMore(true);
      const userGender = user?.profile?.data?.gender || 'male';
      console.log('🔄 Loading more profiles for gender:', userGender);

      const result = await ProfileService.getMoreProfiles(userGender, lastDoc);

      if (!isMountedRef.current) return; // Abort if unmounted during async operation

      console.log('📊 Loaded more profiles:', result.profiles.length);
      if (result.profiles.length > 0) {
        console.log('📝 First new profile:', result.profiles[0]);
      }

      // CRITICAL: Use InteractionManager to defer state update until scroll animation finishes
      // This prevents the "jump" when new items are added during fast scroll
      InteractionManager.runAfterInteractions(() => {
        if (!isMountedRef.current) return;

        // BATCH ALL STATE UPDATES TOGETHER to prevent multiple re-renders
        const existingIds = new Set(profiles.map(p => p.id));
        const uniqueNewProfiles = result.profiles.filter(p => !existingIds.has(p.id));
        const newProfiles = [...profiles, ...uniqueNewProfiles];
        console.log('📊 Total profiles after loadMore:', newProfiles.length);

        // Update cache with all loaded profiles
        profilesCacheRef.current = newProfiles;

        // Single batched state update
        setProfiles(newProfiles);
        setLastDoc(result.lastDoc);
        setHasMore(result.hasMore);
      });
    } catch (error) {
      if (!isMountedRef.current) return; // Abort if unmounted

      console.error('═══════════════════════════════════════');
      console.error('🔴 ERROR: Loading More Profiles');
      console.error('═══════════════════════════════════════');
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
      console.error('Error Object:', error);
      console.error('Current Profiles Count:', profiles.length);
      console.error('Has More:', hasMore);
      console.error('Timestamp:', new Date().toISOString());
      console.error('═══════════════════════════════════════');
    } finally {
      if (isMountedRef.current) {
        setLoadingMore(false);
      }
      // Reset debounce flag
      isLoadingMoreRef.current = false;
    }
  }, [loadingMore, hasMore, lastDoc, user?.profile?.data?.gender, profiles.length]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    // BIG APP BEHAVIOR: Use cached data while fetching new data in background
    // This prevents flickering and saves Firebase reads
    if (profilesCacheRef.current.length > 0) {
      console.log('💾 Using cached profiles during refresh (Instagram/TikTok behavior)');
      // Keep current profiles visible while loading new ones
      // Don't clear the list - just refresh in background
    }

    try {
      const userGender = user?.profile?.data?.gender || 'male';
      const result = await ProfileService.getInitialProfiles(userGender);

      if (!isMountedRef.current) return;

      // Only update if we got NEW data
      if (result.profiles.length > 0) {
        console.log('✅ Refresh completed - updating with', result.profiles.length, 'profiles');
        profilesCacheRef.current = result.profiles;
        setProfiles(result.profiles);
        setLastDoc(result.lastDoc);
        setHasMore(result.hasMore);
      } else {
        console.log('📋 No new profiles - keeping cached data');
      }
    } catch (error) {
      console.error('❌ Refresh error:', error);
      // Keep showing cached data on error
    } finally {
      setRefreshing(false);
    }
  }, [user, isMountedRef]);

  // Memoized navigation handler - prevents ProfileCard re-renders
  const handleProfilePress = useCallback((item) => {
    console.log('🟢 HomeScreen: handleProfilePress called');
    console.log('  Item:', item?.displayName);
    console.log('  Item ID:', item?.id);
    console.log('  Navigation:', navigation);

    if (!navigation) {
      console.error('❌ Navigation prop is missing!');
      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        isArabic ? 'خطأ في التنقل' : 'Navigation error'
      );
      return;
    }

    if (!item?.id) {
      console.error('❌ Item ID is missing!');
      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        isArabic ? 'معرف الملف الشخصي مفقود' : 'Profile ID missing'
      );
      return;
    }

    console.log('✅ Navigating to DetailedUser...');
    // Use parent navigation to access Stack screens from Tab screen
    const parentNav = navigation.getParent();
    if (parentNav) {
      console.log('✅ Using parent navigator');
      parentNav.navigate('DetailedUser', {
        profileId: item.id,
        profileData: item // Pass full profile data to avoid re-fetching
      });
    } else {
      // Fallback to direct navigation
      console.log('⚠️ No parent navigator, using direct navigation');
      navigation.navigate('DetailedUser', {
        profileId: item.id,
        profileData: item
      });
    }
  }, [navigation, isArabic]);

  // Memoized chat handler
  const handleChatPress = useCallback((profileId) => {
    console.log('Chat:', profileId);
  }, []);

  const renderProfile = useCallback(({ item }) => {
    if (!item) {
      console.error('❌ FlatList renderItem: item is undefined!');
      return null;
    }

    return (
      <CompactProfileCard
        profile={item}
        onPress={() => handleProfilePress(item)}
        onChat={handleChatPress}
      />
    );
  }, [handleProfilePress, handleChatPress]);

  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;

    return (
      <LoadingState
        message={isArabic ? 'جاري التحميل...' : 'Loading more...'}
        size="small"
        fullScreen={false}
      />
    );
  }, [loadingMore, isArabic]);

  const renderEmpty = useCallback(() => {
    if (loading) return null;

    return (
      <EmptyState
        icon="people-outline"
        title={isArabic ? 'لا توجد ملفات شخصية' : 'No profiles available'}
        description={isArabic ? 'تحقق مرة أخرى لاحقاً للملفات الشخصية الجديدة' : 'Check back later for new profiles'}
      />
    );
  }, [loading, isArabic]);

  const renderError = useCallback(() => {
    return (
      <ErrorState
        message={error}
        error={errorObject}
        onRetry={loadInitialProfiles}
      />
    );
  }, [error, errorObject, loadInitialProfiles]);

  // Optimized keyExtractor - simple and fast
  const keyExtractor = useCallback((item, index) => {
    return item?.id || `profile-${index}`;
  }, []);

  // Optimized getItemLayout for instant scrolling
  // CompactProfileCard height: 12 (padding) + 100 (minHeight) + 12 (marginBottom) = 124px
  // Actual measured height is approximately 112px per card
  const ITEM_HEIGHT = 112;
  const getItemLayout = useCallback((data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  // Track viewable items for lazy image loading
  const onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
    // Create a Set of viewable item IDs for fast lookup
    const viewableIds = new Set(
      viewableItems
        .filter(item => item.item && item.item.id)
        .map(item => item.item.id)
    );

    // Create extended range: viewable items + their neighbors (windowSize range)
    // INCREASED range to keep more images loaded for smooth UP scrolling
    const extendedIds = new Set(viewableIds);

    viewableItems.forEach((item, index) => {
      // Add 4 items before and after each viewable item (increased from 2)
      // This keeps ~20 images in memory for smooth bidirectional scrolling
      const itemIndex = item.index;
      if (itemIndex !== null && itemIndex !== undefined) {
        // Add neighbors within range
        for (let i = Math.max(0, itemIndex - 4); i <= itemIndex + 4; i++) {
          if (profiles[i]) {
            extendedIds.add(profiles[i].id);
          }
        }
      }
    });

    console.log('👁️ Viewable:', viewableIds.size, 'Extended range:', extendedIds.size);
    setViewableItemIds(viewableIds);
    setExtendedRangeIds(extendedIds);
  }, [profiles]);

  // CRITICAL: Stable viewability config to prevent FlatList re-renders
  const viewabilityConfigRef = React.useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 100
  });

  // CRITICAL: Maintain scroll position when adding new items at bottom
  // Prevents the "jump" when pagination loads
  const maintainVisibleContentPositionConfig = React.useRef({
    minIndexForVisible: 0,
    autoscrollToTopThreshold: 10
  });

  if (loading && profiles.length === 0) {
    return <LoadingState message={isArabic ? 'جاري تحميل الملفات الشخصية...' : 'Loading profiles...'} />;
  }

  if (error && profiles.length === 0) {
    return renderError();
  }

  return (
    <View className="flex-1 bg-gray-50">
      <SmartStatusBar backgroundColor="#F9FAFB" />
      {/* Safe Area Top */}
      <View className="h-12 bg-gray-50" />

      {/* Header with Blur */}
      <View className="relative">
        {Platform.OS === 'ios' && (
          <BlurView
            intensity={60}
            tint="light"
            className="absolute top-0 left-0 bottom-0 right-0"
          />
        )}
        <View className={`${Platform.OS === 'ios' ? 'bg-transparent' : 'bg-gray-50'} px-4 py-3 flex-row items-center justify-between`}>
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
      </View>

      {/* Profile Cards with Lazy Loading & Optimizations */}
      <FlatList
        data={profiles}
        keyExtractor={keyExtractor}
        renderItem={renderProfile}
        onEndReached={loadMoreProfiles}
        onEndReachedThreshold={0.5} // Trigger when 50% from bottom (early trigger prevents bottom-edge jank)
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
        // =========================================
        // OPTIMIZED Performance Settings for 60+ Cards
        // =========================================
        removeClippedSubviews={Platform.OS === 'ios'} // Only on iOS (Android causes flickering)
        maxToRenderPerBatch={4} // Render 4 items per batch (matches pagination)
        updateCellsBatchingPeriod={100} // Batch updates every 100ms
        initialNumToRender={5} // Render first 5 items (matches initial Firebase load)
        windowSize={4} // Keep 4 screens in memory (12-16 cards max - optimized for 60+ cards)
        getItemLayout={getItemLayout} // Pre-calculated layout for instant scrolling

        // Additional optimizations
        disableVirtualization={false} // Enable virtualization
        legacyImplementation={false} // Use new FlatList implementation
        onViewableItemsChanged={onViewableItemsChanged} // Track viewable items (memoized)
        viewabilityConfig={viewabilityConfigRef.current} // STABLE ref - prevents re-renders

        // CRITICAL: Prevent scroll jump when adding items at bottom during pagination
        maintainVisibleContentPosition={maintainVisibleContentPositionConfig.current}
      />
    </View>
  );
}
