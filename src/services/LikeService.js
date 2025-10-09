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
import PeopleDataService from './PeopleDataService';

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
   * OPTIMIZED: Uses batched fetching via PeopleDataService
   * - Reduced from ~51 Firestore reads to ~6 reads (90% reduction!)
   *
   * @param {string} userId - User ID
   * @param {Object|null} userData - Optional: User's Firestore document data (to avoid refetch)
   * @param {number} limitCount - Max number of users to fetch
   * @returns {Promise<Array>} Array of user profile objects
   */
  async getUsersWhoLikedMe(userId, userData = null, limitCount = 50) {
    const startTime = Date.now();
    let firestoreReads = 0;

    try {
      console.log(`💕 Fetching users who liked ${userId} (OPTIMIZED)`);

      // Fetch user document if not provided
      if (!userData) {
        console.log('  - Fetching user document...');
        const userDoc = await getDoc(doc(db, 'users', userId));
        firestoreReads++;

        if (!userDoc.exists()) {
          throw new Error('User not found');
        }

        userData = userDoc.data();
      } else {
        console.log('  - Using provided userData (0 reads)');
      }

      const whoLikedMe = userData.whoLikedMe || [];

      if (whoLikedMe.length === 0) {
        console.log('📋 No users have liked this user');
        console.log(`📊 PERFORMANCE: getUsersWhoLikedMe - ${firestoreReads} reads, ${Date.now() - startTime}ms`);
        return [];
      }

      console.log(`  - Found ${whoLikedMe.length} likers in array`);

      // ========================================
      // OPTIMIZATION: Use PeopleDataService for batched fetching
      // ========================================
      const profiles = await PeopleDataService.getProfilesByIds(
        whoLikedMe,
        userData,
        limitCount
      );

      // Calculate batch queries: ceil(profiles.length / 10)
      const batchQueries = Math.ceil(Math.min(whoLikedMe.length, limitCount) / 10);
      firestoreReads += batchQueries;

      const timeTaken = Date.now() - startTime;

      console.log('📊 PERFORMANCE: getUsersWhoLikedMe Complete');
      console.log(`  - Firestore reads: ${firestoreReads} (vs ${whoLikedMe.length + 1} with old method)`);
      console.log(`  - Time taken: ${timeTaken}ms`);
      console.log(`  - Profiles fetched: ${profiles.length}`);
      console.log(`  - Reduction: ${Math.round((1 - firestoreReads / (whoLikedMe.length + 1)) * 100)}%`);

      return profiles;
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
   * OPTIMIZED: Uses batched fetching via PeopleDataService
   * - Reduced from ~51 Firestore reads to ~6 reads (90% reduction!)
   *
   * @param {string} userId - User ID
   * @param {Object|null} userData - Optional: User's Firestore document data (to avoid refetch)
   * @param {number} limitCount - Max number of users to fetch
   * @returns {Promise<Array>} Array of user profile objects
   */
  async getUsersILiked(userId, userData = null, limitCount = 50) {
    const startTime = Date.now();
    let firestoreReads = 0;

    try {
      console.log(`💖 Fetching users ${userId} liked (OPTIMIZED)`);

      // Fetch user document if not provided
      if (!userData) {
        console.log('  - Fetching user document...');
        const userDoc = await getDoc(doc(db, 'users', userId));
        firestoreReads++;

        if (!userDoc.exists()) {
          throw new Error('User not found');
        }

        userData = userDoc.data();
      } else {
        console.log('  - Using provided userData (0 reads)');
      }

      const likedProfiles = userData.likedProfiles || [];

      if (likedProfiles.length === 0) {
        console.log('📋 User has not liked anyone');
        console.log(`📊 PERFORMANCE: getUsersILiked - ${firestoreReads} reads, ${Date.now() - startTime}ms`);
        return [];
      }

      console.log(`  - Found ${likedProfiles.length} liked users in array`);

      // ========================================
      // OPTIMIZATION: Use PeopleDataService for batched fetching
      // ========================================
      const profiles = await PeopleDataService.getProfilesByIds(
        likedProfiles,
        userData,
        limitCount
      );

      // Calculate batch queries: ceil(profiles.length / 10)
      const batchQueries = Math.ceil(Math.min(likedProfiles.length, limitCount) / 10);
      firestoreReads += batchQueries;

      const timeTaken = Date.now() - startTime;

      console.log('📊 PERFORMANCE: getUsersILiked Complete');
      console.log(`  - Firestore reads: ${firestoreReads} (vs ${likedProfiles.length + 1} with old method)`);
      console.log(`  - Time taken: ${timeTaken}ms`);
      console.log(`  - Profiles fetched: ${profiles.length}`);
      console.log(`  - Reduction: ${Math.round((1 - firestoreReads / (likedProfiles.length + 1)) * 100)}%`);

      return profiles;
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
