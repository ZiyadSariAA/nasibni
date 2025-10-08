import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, RefreshControl, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { CompactProfileCard, Text, SmartStatusBar, LoadingState, EmptyState, ErrorState } from '../../../components/main';
import LikeService from '../../../services/LikeService';

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

  // Loading states
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Ref to track if component is mounted
  const isMountedRef = React.useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    if (user?.uid) {
      loadAllData();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [user?.uid]);

  // Load all tab data
  const loadAllData = async () => {
    try {
      setError(null);

      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      console.log('📥 Loading People screen data...');

      // Load all tabs in parallel
      const [likedMeResult, iLikedResult, viewersResult] = await Promise.all([
        LikeService.getUsersWhoLikedMe(user.uid, 50),
        LikeService.getUsersILiked(user.uid, 50),
        loadProfileViewers(user.uid)
      ]);

      if (!isMountedRef.current) return;

      setWhoLikedMe(likedMeResult);
      setWhoILiked(iLikedResult);
      setProfileViews(viewersResult);

      console.log('✅ People data loaded:', {
        whoLikedMe: likedMeResult.length,
        whoILiked: iLikedResult.length,
        profileViews: viewersResult.length
      });
    } catch (err) {
      if (!isMountedRef.current) return;
      console.error('Error loading people data:', err);
      setError(err.message);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  // Load profile viewers
  const loadProfileViewers = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));

      if (!userDoc.exists()) {
        return [];
      }

      const userData = userDoc.data();
      const viewedByIds = userData.viewedBy || [];

      if (viewedByIds.length === 0) {
        return [];
      }

      // Get blocked users
      const blockedUsers = Array.isArray(userData.blockedUsers) ? userData.blockedUsers : [];
      const blockedBy = Array.isArray(userData.blockedBy) ? userData.blockedBy : [];
      const allBlockedUsers = [...new Set([...blockedUsers, ...blockedBy])].filter(id => id);

      // Filter blocked users
      const filteredViewerIds = viewedByIds.filter(id => id && !allBlockedUsers.includes(id));

      // Fetch viewer profiles (limit 50)
      const limitedViewerIds = filteredViewerIds.slice(0, 50);
      const viewerProfiles = [];

      for (const viewerId of limitedViewerIds) {
        try {
          const viewerDoc = await getDoc(doc(db, 'users', viewerId));

          if (viewerDoc.exists()) {
            const viewerData = viewerDoc.data();

            if (viewerData.accountStatus === 'active' && viewerData.profileCompleted) {
              const profileData = viewerData.profileData || {};

              viewerProfiles.push({
                id: viewerDoc.id,
                displayName: profileData.displayName || viewerData.displayName || 'Unknown',
                age: profileData.age || null,
                gender: profileData.gender || null,
                nationality: profileData.nationality || null,
                height: profileData.height || null,
                weight: profileData.weight || null,
                photos: viewerData.photos || [],
                firstPhoto: (viewerData.photos && viewerData.photos[0]?.url) || null,
                residenceCountry: profileData.residenceCountry || null,
                residenceCity: profileData.residenceCity || null,
                aboutMe: profileData.aboutMe || null
              });
            }
          }
        } catch (viewerError) {
          console.error(`Error fetching viewer ${viewerId}:`, viewerError);
        }
      }

      return viewerProfiles;
    } catch (error) {
      console.error('Error loading viewers:', error);
      return [];
    }
  };

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAllData();
  }, [user?.uid]);

  // Navigate to profile detail
  const handleProfilePress = useCallback((item) => {
    navigation.navigate('DetailedUser', {
      profileId: item.id,
      profileData: item // Pass full profile data to avoid re-fetching
    });
  }, [navigation]);

  // Memoized chat handler
  const handleChatPress = useCallback((profileId) => {
    console.log('Chat:', profileId);
    // TODO: Implement chat navigation
  }, []);

  // Render profile card
  const renderProfile = useCallback(({ item }) => {
    return (
      <CompactProfileCard
        profile={item}
        onPress={() => handleProfilePress(item)}
        onChat={handleChatPress}
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
          icon: '💔',
          title: isArabic ? 'لا يوجد إعجابات' : 'No Likes Yet',
          description: isArabic
            ? 'لم يعجب أحد بملفك الشخصي بعد'
            : 'No one has liked your profile yet'
        };
      case 1:
        return {
          icon: '💙',
          title: isArabic ? 'لم تعجب بأحد بعد' : 'No Likes Yet',
          description: isArabic
            ? 'لم تعجب بأي ملف شخصي بعد'
            : "You haven't liked any profiles yet"
        };
      case 2:
        return {
          icon: '👀',
          title: isArabic ? 'لا توجد مشاهدات' : 'No Profile Views',
          description: isArabic
            ? 'لم يشاهد أحد ملفك الشخصي بعد'
            : 'No one has viewed your profile yet'
        };
      default:
        return {
          icon: '📋',
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
        onRetry={loadAllData}
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
                onPress={() => setActiveTab(tab.id)}
                className={`flex-1 px-3 py-2 rounded-full ${
                  activeTab === tab.id
                    ? 'bg-primary'
                    : 'bg-white border border-gray-200'
                }`}
                activeOpacity={0.7}
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
                  {tab.count > 0 && (
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
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
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
