import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, RefreshControl, TouchableOpacity, Platform, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { CompactProfileCard, Text, SmartStatusBar, LoadingState, EmptyState, ErrorState } from '../../../components/main';
import LikeService from '../../../services/LikeService';
import ProfileService from '../../../services/ProfileService';

export default function PeopleScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { isArabic } = useLanguage();

  // Tab state (0: Who Liked Me, 1: Who I Liked, 2: Profile Views)
  const [activeTab, setActiveTab] = useState(0);

  // Data for each tab
  const [whoLikedMe, setWhoLikedMe] = useState([]);
  const [whoILiked, setWhoILiked] = useState([]);
  const [profileViews, setProfileViews] = useState([]);

  // ========================================
  // LAZY LOADING: Track which tabs have been loaded
  // ========================================
  const [loadedTabs, setLoadedTabs] = useState(new Set([0])); // Tab 0 loads on mount
  const [tabLoading, setTabLoading] = useState({}); // Per-tab loading state

  // Loading states
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Ref to track if component is mounted
  const isMountedRef = React.useRef(true);

  // Cache current user data to avoid refetching (passed to services)
  const userDataRef = React.useRef(null);

  useEffect(() => {
    isMountedRef.current = true;

    if (user?.uid) {
      // LAZY LOADING: Only load active tab (Tab 0) on mount
      loadActiveTabData();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [user?.uid]);

  /**
   * Fetch current user document ONCE and cache it
   * This avoids the 3x duplicate fetch issue (was fetching user doc 3 times!)
   */
  const fetchUserData = async () => {
    if (userDataRef.current) {
      console.log('  - Using cached user document (0 reads)');
      return userDataRef.current;
    }

    console.log('  - Fetching user document (1 read)');
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    userDataRef.current = userData; // Cache for future use
    return userData;
  };

  /**
   * LAZY LOADING: Load only the active tab's data
   * Saves ~102 Firestore reads on initial load (only loads 1 tab instead of 3)
   */
  const loadActiveTabData = async () => {
    try {
      setError(null);
      setLoading(true);

      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      console.log('📥 LAZY LOADING: Loading only active tab data (Tab', activeTab, ')');
      const overallStartTime = Date.now();

      // Fetch user document ONCE
      const userData = await fetchUserData();

      // Load only the active tab
      await loadTabData(activeTab, userData);

      const totalTime = Date.now() - overallStartTime;
      console.log(`✅ Active tab loaded in ${totalTime}ms`);

    } catch (err) {
      if (!isMountedRef.current) return;
      console.error('Error loading active tab data:', err);
      setError(err.message);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  /**
   * Load data for a specific tab
   * Used for lazy loading when user switches tabs
   * 
   * @param {number} tabId - Tab ID (0, 1, or 2)
   * @param {Object} userData - Cached user document data
   */
  const loadTabData = async (tabId, userData = null) => {
    try {
      console.log(`📥 Loading Tab ${tabId} data...`);
      setTabLoading(prev => ({ ...prev, [tabId]: true }));

      // Fetch user data if not provided
      if (!userData) {
        userData = await fetchUserData();
      }

      // Load tab-specific data
      let result;
      switch (tabId) {
        case 0: // Who Liked Me
          result = await LikeService.getUsersWhoLikedMe(user.uid, userData, 50);
          if (isMountedRef.current) {
            setWhoLikedMe(result);
            console.log(`✅ Tab 0 loaded: ${result.length} profiles`);
          }
          break;

        case 1: // Who I Liked
          result = await LikeService.getUsersILiked(user.uid, userData, 50);
          if (isMountedRef.current) {
            setWhoILiked(result);
            console.log(`✅ Tab 1 loaded: ${result.length} profiles`);
          }
          break;

        case 2: // Profile Views
          result = await ProfileService.getProfileViewers(user.uid, userData, 50);
          if (isMountedRef.current) {
            setProfileViews(result);
            console.log(`✅ Tab 2 loaded: ${result.length} profiles`);
          }
          break;

        default:
          console.warn(`⚠️ Unknown tab ID: ${tabId}`);
      }

      // Mark tab as loaded
      if (isMountedRef.current) {
        setLoadedTabs(prev => new Set([...prev, tabId]));
      }

    } catch (err) {
      console.error(`Error loading tab ${tabId} data:`, err);
      setError(err.message);
    } finally {
      if (isMountedRef.current) {
        setTabLoading(prev => ({ ...prev, [tabId]: false }));
      }
    }
  };


  /**
   * Handle tab switch with lazy loading
   * Only loads tab data if not already cached
   */
  const handleTabChange = async (tabId) => {
    console.log(`🔄 Tab switch: ${activeTab} → ${tabId}`);
    setActiveTab(tabId);

    // Check if tab data already loaded
    if (loadedTabs.has(tabId)) {
      console.log(`  ✅ Tab ${tabId} already loaded (cached)`);
      return;
    }

    // Lazy load tab data
    console.log(`  📥 Tab ${tabId} not loaded yet, fetching...`);
    const userData = await fetchUserData();
    await loadTabData(tabId, userData);
  };

  /**
   * Pull to refresh - OPTIMIZED: Only refresh active tab
   * Before: Refreshed all 3 tabs (~153 reads)
   * After: Refreshes only active tab (~18 reads)
   */
  const onRefresh = useCallback(async () => {
    console.log('🔄 Pull-to-refresh: Refreshing active tab only');
    setRefreshing(true);

    try {
      // Clear cache for fresh data
      userDataRef.current = null;

      // Fetch fresh user data
      const userData = await fetchUserData();

      // Reload only the active tab
      await loadTabData(activeTab, userData);

      console.log('✅ Active tab refreshed');
    } catch (err) {
      console.error('Error refreshing:', err);
    } finally {
      setRefreshing(false);
    }
  }, [user?.uid, activeTab]);

  // Navigate to profile detail
  const handleProfilePress = useCallback((item) => {
    console.log('🟢 PeopleScreen: handleProfilePress called');
    console.log('  Item:', item?.displayName);
    console.log('  Item ID:', item?.id);

    if (!item?.id) {
      console.error('❌ Item ID is missing!');
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
  }, [navigation]);

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
        
        // Navigate to chat room - use parent navigator
        const parentNav = navigation.getParent();
        console.log('🔍 Parent navigator:', parentNav ? 'Found' : 'Not found');
        
        if (parentNav) {
          console.log('📍 Navigating to ChatRoom via parent...');
          parentNav.navigate('ChatRoom', {
            conversationId: result.conversationId,
            otherUser: otherUser // Pass user data to avoid re-fetching
          });
        } else {
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

  // Render profile card
  const renderProfile = useCallback(({ item }) => {
    return (
      <CompactProfileCard
        profile={item}
        onPress={() => handleProfilePress(item)}
        onChat={(profileId) => handleChatPress(profileId, item)}
      />
    );
  }, [handleProfilePress, handleChatPress]);

  // Get current tab data
  const getCurrentTabData = () => {
    switch (activeTab) {
      case 0:
        return whoLikedMe;
      case 1:
        return whoILiked;
      case 2:
        return profileViews;
      default:
        return [];
    }
  };

  // Get empty state config
  const getEmptyStateConfig = () => {
    switch (activeTab) {
      case 0:
        return {
          icon: 'heart-dislike-outline',
          title: isArabic ? 'لا يوجد إعجابات' : 'No Likes Yet',
          description: isArabic
            ? 'لم يعجب أحد بملفك الشخصي بعد'
            : 'No one has liked your profile yet'
        };
      case 1:
        return {
          icon: 'heart-outline',
          title: isArabic ? 'لم تعجب بأحد بعد' : 'No Likes Yet',
          description: isArabic
            ? 'لم تعجب بأي ملف شخصي بعد'
            : "You haven't liked any profiles yet"
        };
      case 2:
        return {
          icon: 'eye-outline',
          title: isArabic ? 'لا توجد مشاهدات' : 'No Profile Views',
          description: isArabic
            ? 'لم يشاهد أحد ملفك الشخصي بعد'
            : 'No one has viewed your profile yet'
        };
      default:
        return {
          icon: 'documents-outline',
          title: isArabic ? 'لا توجد بيانات' : 'No Data',
          description: ''
        };
    }
  };

  const renderEmpty = useCallback(() => {
    if (loading) return null;

    const config = getEmptyStateConfig();
    return (
      <EmptyState
        icon={config.icon}
        title={config.title}
        description={config.description}
      />
    );
  }, [loading, activeTab, isArabic]);

  // Tab labels
  const tabs = [
    {
      id: 0,
      labelEn: 'Liked You',
      labelAr: 'أعجبوا بك',
      count: whoLikedMe.length
    },
    {
      id: 1,
      labelEn: 'You Liked',
      labelAr: 'أعجبت بهم',
      count: whoILiked.length
    },
    {
      id: 2,
      labelEn: 'Viewed You',
      labelAr: 'شاهدوا ملفك',
      count: profileViews.length
    }
  ];

  const currentTabData = getCurrentTabData();

  if (loading && currentTabData.length === 0) {
    return (
      <LoadingState
        message={isArabic ? 'جاري التحميل...' : 'Loading...'}
      />
    );
  }

  if (error && currentTabData.length === 0) {
    return (
      <ErrorState
        title={isArabic ? 'حدث خطأ' : 'Error'}
        message={error}
        onRetry={loadActiveTabData}
      />
    );
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
        <View className={`${Platform.OS === 'ios' ? 'bg-transparent' : 'bg-gray-50'} px-4 py-3`}>
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-3">
              <Text variant="h4" weight="bold" className="text-text-primary">
                {isArabic ? 'الأشخاص' : 'People'}
              </Text>
              <View className="bg-primary/10 px-2 py-1 rounded-full">
                <Text variant="caption" weight="semibold" className="text-primary">
                  {currentTabData.length}
                </Text>
              </View>
            </View>
          </View>

          {/* Custom Tab Switcher */}
          <View className="flex-row gap-2">
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => handleTabChange(tab.id)}
                className={`flex-1 px-3 py-2 rounded-full ${
                  activeTab === tab.id
                    ? 'bg-primary'
                    : 'bg-white border border-gray-200'
                }`}
                activeOpacity={0.7}
                disabled={tabLoading[tab.id]}
              >
                <View className="flex-row items-center justify-center gap-1">
                  <Text
                    variant="caption"
                    weight="semibold"
                    style={{
                      color: activeTab === tab.id ? '#FFFFFF' : '#6B7280',
                      fontSize: 12
                    }}
                  >
                    {isArabic ? tab.labelAr : tab.labelEn}
                  </Text>
                  {tabLoading[tab.id] && activeTab === tab.id ? (
                    <Text style={{ color: '#FFFFFF', fontSize: 10 }}>⏳</Text>
                  ) : tab.count > 0 && (
                    <View
                      className={`px-1.5 py-0.5 rounded-full min-w-[18px] ${
                        activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100'
                      }`}
                    >
                      <Text
                        variant="small"
                        weight="semibold"
                        style={{
                          color: activeTab === tab.id ? '#FFFFFF' : '#6B7280',
                          fontSize: 10,
                          textAlign: 'center'
                        }}
                      >
                        {tab.count}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Profile Cards List */}
      <FlatList
        data={currentTabData}
        keyExtractor={(item) => item.id}
        renderItem={renderProfile}
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
        // Performance optimizations (same as HomeScreen)
        removeClippedSubviews={Platform.OS === 'android'}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
      />
    </View>
  );
}
