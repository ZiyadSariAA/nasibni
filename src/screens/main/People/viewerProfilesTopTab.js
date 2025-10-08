import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, RefreshControl, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { CompactProfileCard, LoadingState, EmptyState, ErrorState } from '../../../components/main';

/**
 * Tab: "Who Viewed You" (EF 4'G/ EDAC)
 * Shows users who viewed the current user's profile
 */
export default function ViewerProfilesTopTab() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { isArabic } = useLanguage();

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Ref to track if component is mounted
  const isMountedRef = React.useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    if (user?.uid) {
      loadProfiles();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [user?.uid]);

  const loadProfiles = async () => {
    try {
      setError(null);

      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      console.log('=å Loading profile viewers...');

      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (!userDoc.exists()) {
        setProfiles([]);
        return;
      }

      const userData = userDoc.data();
      const viewedByIds = userData.viewedBy || [];

      if (viewedByIds.length === 0) {
        setProfiles([]);
        return;
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

              // Normalize country data - KEEP BOTH ARABIC AND ENGLISH NAMES
              const normalizeCountry = (countryObj) => {
                if (!countryObj) return null;
                if (typeof countryObj === 'string') return countryObj;

                return {
                  nameAr: countryObj.nameAr || countryObj.countryName || '',
                  nameEn: countryObj.nameEn || countryObj.countryName || '',
                  countryName: countryObj.countryName || countryObj.nameEn || '',
                  code: countryObj.alpha2 || countryObj.code || ''
                };
              };

              // Pre-process photos array
              const normalizedPhotos = profileData.photos && Array.isArray(profileData.photos)
                ? profileData.photos.filter(photo => photo && typeof photo === 'string')
                : [];

              viewerProfiles.push({
                id: viewerDoc.id,
                // Core identity
                displayName: profileData.displayName || viewerData.displayName || 'Unknown',
                name: profileData.displayName || viewerData.displayName || 'Unknown',
                age: profileData.age || null,
                gender: profileData.gender || null,

                // Physical attributes
                height: profileData.height || null,
                weight: profileData.weight || null,
                skinTone: profileData.skinTone || null,

                // Location (pre-normalized)
                nationality: normalizeCountry(profileData.nationality),
                residenceCountry: normalizeCountry(profileData.residenceCountry),
                residenceCity: profileData.residenceCity || null,
                country: profileData.residenceCountry?.countryName ||
                         profileData.residenceCountry?.nameEn || '',
                city: profileData.residenceCity || '',

                // Background & Social
                maritalStatus: profileData.maritalStatus || null,
                religion: profileData.religion || null,
                prayerHabit: profileData.prayerHabit || null,
                educationLevel: profileData.educationLevel || null,
                workStatus: profileData.workStatus || null,
                tribeAffiliation: profileData.tribeAffiliation || null,

                // Marriage Preferences
                marriageTypes: profileData.marriageTypes || [],
                marriagePlan: profileData.marriagePlan || null,
                residenceAfterMarriage: profileData.residenceAfterMarriage || null,

                // Family & Children
                childrenTiming: profileData.childrenTiming || null,
                allowWifeWorkStudy: profileData.allowWifeWorkStudy || null,

                // Financial & Health
                incomeLevel: profileData.incomeLevel || null,
                healthStatus: profileData.healthStatus || [],

                // Lifestyle
                smoking: profileData.smoking || null,
                chatLanguages: profileData.chatLanguages || [],

                // Descriptions
                aboutMe: profileData.aboutMe || null,
                idealPartner: profileData.idealPartner || null,
                description: profileData.aboutMe || '',
                about: profileData.aboutMe || '',

                // Photos (pre-processed)
                photos: normalizedPhotos,
                firstPhoto: normalizedPhotos[0] || null,

                // Metadata
                createdAt: viewerData.createdAt || profileData.completedAt || new Date().toISOString(),
              });
            }
          }
        } catch (viewerError) {
          console.error(`Error fetching viewer ${viewerId}:`, viewerError);
        }
      }

      if (!isMountedRef.current) return;

      setProfiles(viewerProfiles);

      console.log(' Loaded profile viewers:', viewerProfiles.length);
    } catch (err) {
      if (!isMountedRef.current) return;
      console.error('Error loading profile viewers:', err);
      setError(err.message);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProfiles();
  }, [user?.uid]);

  // Navigate to profile detail
  const handleProfilePress = useCallback((item) => {
    console.log('=â ViewerProfilesTopTab: handleProfilePress called');
    console.log('  Item:', item?.displayName);
    console.log('  Item ID:', item?.id);

    if (!item?.id) {
      console.error('L Item ID is missing!');
      return;
    }

    console.log(' Navigating to DetailedUser...');
    // Use parent navigation to access Stack screens from Tab screen
    const parentNav = navigation.getParent();
    if (parentNav) {
      console.log(' Using parent navigator');
      parentNav.navigate('DetailedUser', {
        profileId: item.id,
        profileData: item // Pass full profile data to avoid re-fetching
      });
    } else {
      // Fallback to direct navigation
      console.log('  No parent navigator, using direct navigation');
      navigation.navigate('DetailedUser', {
        profileId: item.id,
        profileData: item
      });
    }
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

  const renderEmpty = useCallback(() => {
    if (loading) return null;

    return (
      <EmptyState
        icon="=@"
        title={isArabic ? 'D' *H,/ E4'G/'*' : 'No Profile Views'}
        description={isArabic
          ? 'DE J4'G/ #-/ EDAC 'D4.5J (9/'
          : 'No one has viewed your profile yet'}
      />
    );
  }, [loading, isArabic]);

  if (loading && profiles.length === 0) {
    return (
      <LoadingState
        message={isArabic ? ','1J 'D*-EJD...' : 'Loading...'}
      />
    );
  }

  if (error && profiles.length === 0) {
    return (
      <ErrorState
        title={isArabic ? '-/+ .7#' : 'Error'}
        message={error}
        onRetry={loadProfiles}
      />
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={profiles}
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
        // Performance optimizations
        removeClippedSubviews={Platform.OS === 'android'}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
      />
    </View>
  );
}
