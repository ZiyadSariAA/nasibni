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

  // ========================================
  // REAL-TIME LISTENER MANAGEMENT
  // ========================================
  // Store unsubscribe function for initial load (only 1 listener needed)
  const initialListenerUnsubscribeRef = React.useRef(null);

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
      console.log('🧹 HomeScreen unmounting - cleaning up listener');

      // Unsubscribe from initial listener
      if (initialListenerUnsubscribeRef.current) {
        console.log('🔌 Unsubscribing from initial profiles listener');
        initialListenerUnsubscribeRef.current();
        initialListenerUnsubscribeRef.current = null;
      }
    };
  }, [user]);

  const loadInitialProfiles = () => {
    try {
      if (!isMountedRef.current) return; // Abort if unmounted

      // Cleanup existing listener before creating new one
      if (initialListenerUnsubscribeRef.current) {
        console.log('🔌 Cleaning up existing initial listener before reload');
        initialListenerUnsubscribeRef.current();
        initialListenerUnsubscribeRef.current = null;
      }

      setLoading(true);
      setError(null);

      // Debug user data structure
      console.log('👤 Current user:', user);
      console.log('👤 User profile:', user?.profile);
      console.log('👤 User profile data:', user?.profile?.data);

      const userGender = user?.profile?.data?.gender || 'male';
      console.log('🔍 Setting up real-time listener for initial profiles, gender:', userGender);

      // Set up real-time listener with callback
      const unsubscribe = ProfileService.getInitialProfiles(
        userGender,
        // onUpdate callback
        (result) => {
          if (!isMountedRef.current) return; // Abort if unmounted

          console.log('📊 Real-time update received for initial profiles');
          console.log('  - Profiles:', result.profiles.length);
          console.log('  - From Cache:', result.fromCache);
          console.log('  - Has Pending Writes:', result.hasPendingWrites);

          if (result.profiles.length > 0) {
            console.log('📝 First profile:', result.profiles[0].displayName);
          }

          // CRITICAL DEBUG: Log pagination state before update
          console.log('🔑 BEFORE state update:');
          console.log('  - lastDoc from result:', result.lastDoc?.id || 'NULL');
          console.log('  - hasMore from result:', result.hasMore);

          // Cache profiles for future refresh
          profilesCacheRef.current = result.profiles;

          // Update state
          setProfiles(result.profiles);
          setLastDoc(result.lastDoc);
          setHasMore(result.hasMore);

          // CRITICAL DEBUG: Log after state update (will show in next render)
          setTimeout(() => {
            console.log('🔑 AFTER state update (async):');
            console.log('  - lastDoc state:', lastDoc?.id || 'NULL');
            console.log('  - hasMore state:', hasMore);
            console.log('  - isLoadingMore ref:', isLoadingMoreRef.current);
            console.log('  - Can paginate:', !!(lastDoc && hasMore && !isLoadingMoreRef.current));
          }, 100);

          // Only set loading false after first data (cache or server)
          if (loading) {
            setLoading(false);
          }
        },
        // onError callback
        (error) => {
          if (!isMountedRef.current) return; // Abort if unmounted

          console.error('═══════════════════════════════════════');
          console.error('🔴 ERROR: Real-time Initial Profiles');
          console.error('═══════════════════════════════════════');
          console.error('Error Message:', error.message);
          console.error('Error Stack:', error.stack);
          console.error('Error Object:', error);
          console.error('User Gender:', userGender);
          console.error('Timestamp:', new Date().toISOString());
          console.error('═══════════════════════════════════════');

          setError(isArabic ? 'خطأ في تحميل الملفات الشخصية' : 'Error loading profiles');
          setErrorObject(error);
          setLoading(false);
        }
      );

      // Store unsubscribe function for cleanup
      initialListenerUnsubscribeRef.current = unsubscribe;
      console.log('✅ Initial profiles listener created and stored');

    } catch (error) {
      if (!isMountedRef.current) return;

      console.error('═══════════════════════════════════════');
      console.error('🔴 ERROR: Setting up Initial Profiles Listener');
      console.error('═══════════════════════════════════════');
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
      console.error('Timestamp:', new Date().toISOString());
      console.error('═══════════════════════════════════════');

      setError(isArabic ? 'خطأ في تحميل الملفات الشخصية' : 'Error loading profiles');
      setErrorObject(error);
      setLoading(false);
    }
  };

  // Ref to prevent double pagination
  const isLoadingMoreRef = React.useRef(false);

  const loadMoreProfiles = useCallback(async () => {
    // ========================================
    // DEBUG: Log guard conditions BEFORE checks
    // ========================================
    console.log('🎯 loadMoreProfiles called!');
    console.log('  - isLoadingMoreRef.current:', isLoadingMoreRef.current);
    console.log('  - loadingMore state:', loadingMore);
    console.log('  - hasMore:', hasMore);
    console.log('  - lastDoc exists:', !!lastDoc);
    console.log('  - lastDoc ID:', lastDoc?.id);
    console.log('  - isMounted:', isMountedRef.current);
    console.log('  - Current profiles count:', profiles.length);

    // DEBOUNCE: Prevent double/triple calls to onEndReached
    if (isLoadingMoreRef.current || loadingMore || !hasMore || !lastDoc || !isMountedRef.current) {
      console.log('⏸️ Skipping loadMore - Reason:');
      console.log('  - isLoadingMore:', isLoadingMoreRef.current);
      console.log('  - loadingMore:', loadingMore);
      console.log('  - !hasMore:', !hasMore);
      console.log('  - !lastDoc:', !lastDoc);
      console.log('  - !isMounted:', !isMountedRef.current);
      return;
    }

    // Set loading flag
    isLoadingMoreRef.current = true;
    console.log('🔒 Set isLoadingMoreRef.current = true');

    try {
      setLoadingMore(true);
      const userGender = user?.profile?.data?.gender || 'male';
      console.log('🔄 Fetching more profiles with getDocs (Option A)');
      console.log('  - Gender:', userGender);
      console.log('  - Last Doc ID:', lastDoc?.id);

      // ========================================
      // OPTION A: Use getDocs for pagination (NO listener, simpler)
      // ========================================
      const result = await ProfileService.getMoreProfiles(userGender, lastDoc);

      if (!isMountedRef.current) {
        console.log('⚠️ Component unmounted during pagination fetch, aborting');
        return; // Abort if unmounted during async operation
      }

      console.log('📊 Pagination result received:');
      console.log('  - New Profiles:', result.profiles.length);
      console.log('  - New lastDoc ID:', result.lastDoc?.id);
      console.log('  - Has More:', result.hasMore);

      if (result.profiles.length > 0) {
        console.log('📝 First new profile:', result.profiles[0].displayName);
      }

      // CRITICAL: Use InteractionManager to defer state update until scroll animation finishes
      // This prevents the "jump" when new items are added during fast scroll
      InteractionManager.runAfterInteractions(() => {
        if (!isMountedRef.current) return;

        // BATCH ALL STATE UPDATES TOGETHER to prevent multiple re-renders
        const existingIds = new Set(profiles.map(p => p.id));
        const uniqueNewProfiles = result.profiles.filter(p => !existingIds.has(p.id));
        const newProfiles = [...profiles, ...uniqueNewProfiles];
        
        console.log('📊 After deduplication:');
        console.log('  - Existing profiles:', profiles.length);
        console.log('  - New unique profiles:', uniqueNewProfiles.length);
        console.log('  - Total profiles:', newProfiles.length);

        // Update cache with all loaded profiles
        profilesCacheRef.current = newProfiles;

        // Single batched state update
        setProfiles(newProfiles);
        setLastDoc(result.lastDoc);
        setHasMore(result.hasMore);
        setLoadingMore(false);

        console.log('✅ State updated successfully');
        console.log('  - New lastDoc ID:', result.lastDoc?.id);
        console.log('  - New hasMore:', result.hasMore);
        console.log('  - Total profiles in state:', newProfiles.length);
      });

    } catch (error) {
      if (!isMountedRef.current) return;

      console.error('═══════════════════════════════════════');
      console.error('🔴 ERROR: Loading More Profiles');
      console.error('═══════════════════════════════════════');
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
      console.error('Current Profiles Count:', profiles.length);
      console.error('Has More:', hasMore);
      console.error('Last Doc ID:', lastDoc?.id);
      console.error('Timestamp:', new Date().toISOString());
      console.error('═══════════════════════════════════════');

      setLoadingMore(false);
    } finally {
      // Reset debounce flag
      isLoadingMoreRef.current = false;
      console.log('🔓 Reset isLoadingMoreRef.current = false');
    }
  }, [loadingMore, hasMore, lastDoc, user?.profile?.data?.gender, profiles]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // BIG APP BEHAVIOR: Use cached data while fetching new data in background
    // This prevents flickering and saves Firebase reads
    if (profilesCacheRef.current.length > 0) {
      console.log('💾 Using cached profiles during refresh (Instagram/TikTok behavior)');
      // Keep current profiles visible while loading new ones
      // Don't clear the list - just refresh in background
    }

    try {
      // Note: No pagination listeners to clean up (using getDocs, not onSnapshot)
      // Only initial load uses onSnapshot, which is cleaned up in loadInitialProfiles

      // Reload initial profiles (will clean up and recreate listener)
      loadInitialProfiles();

      console.log('✅ Refresh initiated - real-time listener will provide updates');
    } catch (error) {
      console.error('❌ Refresh error:', error);
      // Keep showing cached data on error
    } finally {
      // Set refreshing false after a short delay to show refresh animation
      setTimeout(() => {
        if (isMountedRef.current) {
          setRefreshing(false);
        }
      }, 500);
    }
  }, [user, loadInitialProfiles]);

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
  const handleChatPress = useCallback(async (profileId, profileData) => {
    try {
      console.log('💬 Starting chat with:', profileId);

      // Create or get existing conversation
      const ConversationService = require('../../../services/ConversationService').default;
      const result = await ConversationService.createConversation(user.uid, profileId);

      if (result.success) {
        console.log('✅ Conversation ready:', result.conversationId);
        
        // Prepare other user data for ChatRoom
        const otherUser = profileData ? {
          id: profileId,
          displayName: profileData.displayName || profileData.name || 'Unknown',
          gender: profileData.gender || 'male',
          firstPhoto: profileData.photos?.[0] || profileData.firstPhoto
        } : null;
        
        // Navigate to chat room using parent navigator
        const parentNav = navigation.getParent();
        console.log('🔍 Parent navigator:', parentNav ? 'Found' : 'Not found');
        
        if (parentNav) {
          console.log('📍 Navigating to ChatRoom via parent...');
          parentNav.navigate('ChatRoom', {
            conversationId: result.conversationId,
            otherUser: otherUser // Pass user data to avoid re-fetching
          });
        } else {
          // Fallback to direct navigation
          console.log('📍 Navigating to ChatRoom directly...');
          navigation.navigate('ChatRoom', {
            conversationId: result.conversationId,
            otherUser: otherUser // Pass user data to avoid re-fetching
          });
        }
      } else {
        console.error('Failed to create conversation:', result.error);
        Alert.alert(
          isArabic ? 'خطأ' : 'Error',
          result.error || (isArabic ? 'فشل بدء المحادثة' : 'Failed to start conversation')
        );
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        isArabic ? 'فشل بدء المحادثة' : 'Failed to start conversation'
      );
    }
  }, [user?.uid, navigation, isArabic]);

  const renderProfile = useCallback(({ item }) => {
    if (!item) {
      console.error('❌ FlatList renderItem: item is undefined!');
      return null;
    }

    return (
      <CompactProfileCard
        profile={item}
        onPress={() => handleProfilePress(item)}
        onChat={(profileId) => handleChatPress(profileId, item)}
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
            progressViewOffset={0}
          />
        }
        scrollEventThrottle={16}
        bounces={true}
        overScrollMode="auto"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100, // Extra padding for bottom tab bar (60px) + safe area
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
