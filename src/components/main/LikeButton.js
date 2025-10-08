import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import LikeService from '../../services/LikeService';
import Text from './Text';

/**
 * Reusable LikeButton component
 * @param {string} profileId - The ID of the profile to like/unlike
 * @param {boolean} showText - Whether to show text label (default: false)
 * @param {string} variant - 'small' (icon only) or 'large' (with text) (default: 'small')
 * @param {function} onLikeChange - Callback when like state changes (optional)
 */
export default function LikeButton({
  profileId,
  showText = false,
  variant = 'small',
  onLikeChange
}) {
  const { user } = useAuth();
  const { isArabic } = useLanguage();
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if already liked on mount
  useEffect(() => {
    checkIfLiked();
  }, [profileId, user?.uid]);

  const checkIfLiked = async () => {
    if (!user?.uid || !profileId) return;

    try {
      const liked = await LikeService.checkIfLiked(user.uid, profileId);
      setIsLiked(liked);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const handleLike = async (e) => {
    // Stop event propagation to prevent parent onClick
    if (e?.stopPropagation) {
      e.stopPropagation();
    }

    console.log('🔵 LikeButton clicked!');
    console.log('  User:', user);
    console.log('  User UID:', user?.uid);
    console.log('  Profile ID:', profileId);

    if (!user || !user.uid) {
      console.error('❌ No user or UID found');
      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        isArabic ? 'يجب تسجيل الدخول أولاً' : 'Please sign in first'
      );
      return;
    }

    if (!profileId) {
      console.error('❌ No profileId provided');
      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        isArabic ? 'معرف الملف الشخصي مفقود' : 'Profile ID is missing'
      );
      return;
    }

    if (loading) {
      console.log('⏳ Already loading, skipping...');
      return;
    }

    // Store previous state for rollback on error
    const previousState = isLiked;
    const newLikeState = !isLiked;

    try {
      // 1️⃣ OPTIMISTIC UPDATE - Update UI immediately (instant feedback!)
      setIsLiked(newLikeState);
      onLikeChange?.(profileId, newLikeState);
      console.log(`⚡ Optimistic update: Like = ${newLikeState}`);

      // 🔔 HAPTIC FEEDBACK - Instant tactile response
      if (newLikeState) {
        // Medium buzz for liking (satisfying feedback)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        // Light buzz for unliking (subtle feedback)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      // 2️⃣ BACKGROUND FIREBASE SYNC - Don't block UI
      setLoading(true);
      let result;

      if (newLikeState) {
        result = await LikeService.likeUser(user.uid, profileId);
      } else {
        result = await LikeService.unlikeUser(user.uid, profileId);
      }

      // 3️⃣ ERROR HANDLING - Revert if Firebase failed
      if (!result.success) {
        console.error('❌ Firebase sync failed, reverting UI');
        setIsLiked(previousState);
        onLikeChange?.(profileId, previousState);

        Alert.alert(
          isArabic ? 'خطأ' : 'Error',
          isArabic ? 'فشل في حفظ الإعجاب' : 'Failed to save like'
        );
      } else {
        console.log('✅ Firebase sync successful');
      }
    } catch (error) {
      console.error('Error handling like:', error);
      // Revert to previous state on error
      setIsLiked(previousState);
      onLikeChange?.(profileId, previousState);
    } finally {
      setLoading(false);
    }
  };

  // Small variant (icon only) - for ProfileCard
  if (variant === 'small') {
    return (
      <TouchableOpacity
        onPress={handleLike}
        disabled={loading}
        className={`w-9 h-9 items-center justify-center rounded-full ${
          isLiked ? 'bg-pink-500' : 'bg-pink-50'
        }`}
        style={{ opacity: loading ? 0.6 : 1 }}
      >
        <Ionicons
          name={isLiked ? 'heart' : 'heart-outline'}
          size={18}
          color={isLiked ? '#ffffff' : '#ec4899'}
        />
      </TouchableOpacity>
    );
  }

  // Large variant (with text) - for DetailedUserScreen
  return (
    <TouchableOpacity
      onPress={handleLike}
      disabled={loading}
      className={`flex-1 flex-row-reverse items-center justify-center gap-2 py-3.5 rounded-xl ${
        isLiked ? 'bg-pink-500' : 'bg-pink-50'
      }`}
      style={{ opacity: loading ? 0.6 : 1 }}
    >
      <Ionicons
        name={isLiked ? 'heart' : 'heart-outline'}
        size={20}
        color={isLiked ? '#ffffff' : '#ec4899'}
      />
      {showText && (
        <Text
          variant="body"
          weight="semibold"
          className={isLiked ? 'text-white' : 'text-pink-500'}
        >
          {isArabic ? (isLiked ? 'تم الإعجاب' : 'إعجاب') : (isLiked ? 'Liked' : 'Like')}
        </Text>
      )}
    </TouchableOpacity>
  );
}
