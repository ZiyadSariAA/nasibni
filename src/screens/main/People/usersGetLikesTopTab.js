import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, RefreshControl, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { CompactProfileCard, LoadingState, EmptyState, ErrorState } from '../../../components/main';
import LikeService from '../../../services/LikeService';

/**
 * Tab: "Who Liked You" (EF #9,(H' (C)
 * Shows users who liked the current user's profile
 */
export default function UsersGetLikesTopTab() {
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

      console.log('=å Loading users who liked you...');

      const result = await LikeService.getUsersWhoLikedMe(user.uid, 50);

      if (!isMountedRef.current) return;

      setProfiles(result);

      console.log(' Loaded users who liked you:', result.length);
    } catch (err) {
      if (!isMountedRef.current) return;
      console.error('Error loading users who liked you:', err);
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
    console.log('=â UsersGetLikesTopTab: handleProfilePress called');
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
        icon="=”"
        title={isArabic ? 'D' JH,/ %9,'('*' : 'No Likes Yet'}
        description={isArabic
          ? 'DE J9,( #-/ (EDAC 'D4.5J (9/'
          : 'No one has liked your profile yet'}
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
