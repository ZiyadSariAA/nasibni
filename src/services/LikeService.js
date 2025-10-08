import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  arrayUnion,
  arrayRemove,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import NotificationService from './NotificationService';

class LikeService {
  /**
   * Like a user - save to Firebase and update user arrays
   * Updates likedProfiles array on liker and whoLikedMe array on liked user
   * Checks for mutual like and sends notifications
   *
   * @param {string} fromUserId - User who is liking
   * @param {string} toUserId - User being liked
   * @returns {Promise<{success: boolean, likeId?: string, isMutual?: boolean, error?: string}>}
   */
  async likeUser(fromUserId, toUserId) {
    try {
      console.log(`👍 Liking: ${fromUserId} -> ${toUserId}`);

      // Validate input
      if (!fromUserId || !toUserId) {
        throw new Error('Both user IDs are required');
      }

      if (fromUserId === toUserId) {
        throw new Error('Cannot like yourself');
      }

      // Check for mutual like (did toUser already like fromUser?)
      const isMutual = await this.checkMutualLike(fromUserId, toUserId);

      // Create like document
      const likeDoc = await addDoc(collection(db, 'likes'), {
        fromUserId: fromUserId,
        toUserId: toUserId,
        createdAt: serverTimestamp(),
        isMutual: isMutual,
        viewedByReceiver: false
      });

      // Update fromUser's likedProfiles array
      await updateDoc(doc(db, 'users', fromUserId), {
        likedProfiles: arrayUnion(toUserId),
        updatedAt: serverTimestamp()
      });

      // Update toUser's whoLikedMe array and totalLikes counter
      await updateDoc(doc(db, 'users', toUserId), {
        whoLikedMe: arrayUnion(fromUserId),
        totalLikes: increment(1),
        updatedAt: serverTimestamp()
      });

      // Get liker's name for notification
      const fromUserDoc = await getDoc(doc(db, 'users', fromUserId));
      const fromUserData = fromUserDoc.exists() ? fromUserDoc.data() : {};
      const fromUserName = fromUserData.profileData?.displayName || fromUserData.displayName || 'Someone';

      // Send notification
      if (isMutual) {
        // It's a match! Send match notification to both users
        await NotificationService.notifyMatch(toUserId, fromUserId, fromUserName);

        // Also send match notification to fromUser
        const toUserDoc = await getDoc(doc(db, 'users', toUserId));
        const toUserData = toUserDoc.exists() ? toUserDoc.data() : {};
        const toUserName = toUserData.profileData?.displayName || toUserData.displayName || 'Someone';
        await NotificationService.notifyMatch(fromUserId, toUserId, toUserName);

        // Update the existing like document (if exists) to mark as mutual
        const existingLikeQuery = query(
          collection(db, 'likes'),
          where('fromUserId', '==', toUserId),
          where('toUserId', '==', fromUserId)
        );
        const existingLikeSnapshot = await getDocs(existingLikeQuery);
        if (!existingLikeSnapshot.empty) {
          await updateDoc(doc(db, 'likes', existingLikeSnapshot.docs[0].id), {
            isMutual: true
          });
        }

        console.log('✅ Like saved - IT\'S A MATCH! 💕');
      } else {
        // Regular like notification
        await NotificationService.notifyLike(toUserId, fromUserId, fromUserName);
        console.log('✅ Like saved to Firebase');
      }

      return { success: true, likeId: likeDoc.id, isMutual: isMutual };
    } catch (error) {
      console.error('═══════════════════════════════════════');
      console.error('🔴 ERROR: LikeService.likeUser');
      console.error('═══════════════════════════════════════');
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
      console.error('Error Object:', error);
      console.error('From User ID:', fromUserId);
      console.error('To User ID:', toUserId);
      console.error('Timestamp:', new Date().toISOString());
      console.error('═══════════════════════════════════════');
      return { success: false, error: error.message };
    }
  }

  /**
   * Unlike a user - remove from Firebase and update user arrays
   * Removes from likedProfiles and whoLikedMe arrays
   * Decrements totalLikes counter
   *
   * @param {string} fromUserId - User who is unliking
   * @param {string} toUserId - User being unliked
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async unlikeUser(fromUserId, toUserId) {
    try {
      console.log(`💔 Unliking: ${fromUserId} -> ${toUserId}`);

      // Validate input
      if (!fromUserId || !toUserId) {
        throw new Error('Both user IDs are required');
      }

      // Find and delete the like
      const likesRef = collection(db, 'likes');
      const q = query(
        likesRef,
        where('fromUserId', '==', fromUserId),
        where('toUserId', '==', toUserId)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log('⚠️ No like found to remove');
        return { success: true };
      }

      // Delete all matching like documents
      const deletePromises = snapshot.docs.map(document =>
        deleteDoc(doc(db, 'likes', document.id))
      );
      await Promise.all(deletePromises);

      // Remove fromUser from toUser's likedProfiles array
      await updateDoc(doc(db, 'users', fromUserId), {
        likedProfiles: arrayRemove(toUserId),
        updatedAt: serverTimestamp()
      });

      // Remove toUser from fromUser's whoLikedMe array and decrement totalLikes
      await updateDoc(doc(db, 'users', toUserId), {
        whoLikedMe: arrayRemove(fromUserId),
        totalLikes: increment(-1),
        updatedAt: serverTimestamp()
      });

      console.log('✅ Unlike completed');
      return { success: true };
    } catch (error) {
      console.error('═══════════════════════════════════════');
      console.error('🔴 ERROR: LikeService.unlikeUser');
      console.error('═══════════════════════════════════════');
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
      console.error('Error Object:', error);
      console.error('From User ID:', fromUserId);
      console.error('To User ID:', toUserId);
      console.error('Timestamp:', new Date().toISOString());
      console.error('═══════════════════════════════════════');
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if already liked
   */
  async checkIfLiked(fromUserId, toUserId) {
    try {
      const likesRef = collection(db, 'likes');
      const q = query(
        likesRef,
        where('fromUserId', '==', fromUserId),
        where('toUserId', '==', toUserId)
      );

      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      console.error('Error checking like:', error);
      return false;
    }
  }

  /**
   * Check if two users have mutually liked each other
   * Used to detect matches
   *
   * @param {string} userId1 - First user ID
   * @param {string} userId2 - Second user ID
   * @returns {Promise<boolean>} True if mutual like exists
   */
  async checkMutualLike(userId1, userId2) {
    try {
      // Check if userId2 already liked userId1
      const likesRef = collection(db, 'likes');
      const q = query(
        likesRef,
        where('fromUserId', '==', userId2),
        where('toUserId', '==', userId1)
      );

      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      console.error('Error checking mutual like:', error);
      return false;
    }
  }

  /**
   * Get users who liked this user
   * Used for "Who Liked You" tab in People screen
   *
   * @param {string} userId - User ID
   * @param {number} limitCount - Max number of users to fetch
   * @returns {Promise<Array>} Array of user profile objects
   */
  async getUsersWhoLikedMe(userId, limitCount = 50) {
    try {
      console.log(`💕 Fetching users who liked ${userId}`);

      // Get current user document to get whoLikedMe array
      const userDoc = await getDoc(doc(db, 'users', userId));

      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      const whoLikedMe = userData.whoLikedMe || [];

      if (whoLikedMe.length === 0) {
        console.log('📋 No users have liked this user');
        return [];
      }

      // Get current user's blocked users to filter them out
      const blockedUsers = Array.isArray(userData.blockedUsers) ? userData.blockedUsers : [];
      const blockedBy = Array.isArray(userData.blockedBy) ? userData.blockedBy : [];
      const allBlockedUsers = [...new Set([...blockedUsers, ...blockedBy])].filter(id => id); // Remove null/undefined

      // Filter out blocked users from whoLikedMe array
      const likerIds = whoLikedMe.filter(id => id && !allBlockedUsers.includes(id));

      if (likerIds.length === 0) {
        console.log('📋 No non-blocked users have liked this user');
        return [];
      }

      // Fetch liker profiles (limit to first N to avoid large queries)
      const limitedLikerIds = likerIds.slice(0, limitCount);

      // Fetch all liker documents
      const likerProfiles = [];
      for (const likerId of limitedLikerIds) {
        try {
          const likerDoc = await getDoc(doc(db, 'users', likerId));

          if (likerDoc.exists()) {
            const likerData = likerDoc.data();

            // Only include active users with completed profiles
            if (likerData.accountStatus === 'active' && likerData.profileCompleted) {
              const profileData = likerData.profileData || {};

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

              likerProfiles.push({
                id: likerDoc.id,
                // Core identity
                displayName: profileData.displayName || likerData.displayName || 'Unknown',
                name: profileData.displayName || likerData.displayName || 'Unknown',
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
                createdAt: likerData.createdAt || profileData.completedAt || new Date().toISOString(),
              });
            }
          }
        } catch (likerError) {
          console.error(`Error fetching liker ${likerId}:`, likerError);
          // Continue with other likers
        }
      }

      console.log(`📋 Found ${likerProfiles.length} users who liked this user`);
      return likerProfiles;
    } catch (error) {
      console.error('═══════════════════════════════════════');
      console.error('🔴 ERROR: LikeService.getUsersWhoLikedMe');
      console.error('═══════════════════════════════════════');
      console.error('Error Message:', error.message);
      console.error('User ID:', userId);
      console.error('Timestamp:', new Date().toISOString());
      console.error('═══════════════════════════════════════');
      return [];
    }
  }

  /**
   * Get users this user liked
   * Used for "Who You Liked" tab in People screen
   *
   * @param {string} userId - User ID
   * @param {number} limitCount - Max number of users to fetch
   * @returns {Promise<Array>} Array of user profile objects
   */
  async getUsersILiked(userId, limitCount = 50) {
    try {
      console.log(`💖 Fetching users ${userId} liked`);

      // Get current user document to get likedProfiles array
      const userDoc = await getDoc(doc(db, 'users', userId));

      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      const likedProfiles = userData.likedProfiles || [];

      if (likedProfiles.length === 0) {
        console.log('📋 User has not liked anyone');
        return [];
      }

      // Get current user's blocked users to filter them out
      const blockedUsers = Array.isArray(userData.blockedUsers) ? userData.blockedUsers : [];
      const blockedBy = Array.isArray(userData.blockedBy) ? userData.blockedBy : [];
      const allBlockedUsers = [...new Set([...blockedUsers, ...blockedBy])].filter(id => id); // Remove null/undefined

      // Filter out blocked users from likedProfiles array
      const likedUserIds = likedProfiles.filter(id => id && !allBlockedUsers.includes(id));

      if (likedUserIds.length === 0) {
        console.log('📋 No non-blocked users in liked list');
        return [];
      }

      // Fetch liked profiles (limit to first N to avoid large queries)
      const limitedLikedIds = likedUserIds.slice(0, limitCount);

      // Fetch all liked user documents
      const likedUserProfiles = [];
      for (const likedUserId of limitedLikedIds) {
        try {
          const likedUserDoc = await getDoc(doc(db, 'users', likedUserId));

          if (likedUserDoc.exists()) {
            const likedUserData = likedUserDoc.data();

            // Only include active users with completed profiles
            if (likedUserData.accountStatus === 'active' && likedUserData.profileCompleted) {
              const profileData = likedUserData.profileData || {};

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

              likedUserProfiles.push({
                id: likedUserDoc.id,
                // Core identity
                displayName: profileData.displayName || likedUserData.displayName || 'Unknown',
                name: profileData.displayName || likedUserData.displayName || 'Unknown',
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
                createdAt: likedUserData.createdAt || profileData.completedAt || new Date().toISOString(),
              });
            }
          }
        } catch (likedUserError) {
          console.error(`Error fetching liked user ${likedUserId}:`, likedUserError);
          // Continue with other users
        }
      }

      console.log(`📋 Found ${likedUserProfiles.length} users this user liked`);
      return likedUserProfiles;
    } catch (error) {
      console.error('═══════════════════════════════════════');
      console.error('🔴 ERROR: LikeService.getUsersILiked');
      console.error('═══════════════════════════════════════');
      console.error('Error Message:', error.message);
      console.error('User ID:', userId);
      console.error('Timestamp:', new Date().toISOString());
      console.error('═══════════════════════════════════════');
      return [];
    }
  }
}

export default new LikeService();
