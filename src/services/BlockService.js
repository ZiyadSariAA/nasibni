import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * BlockService - Handle user blocking functionality
 *
 * Features:
 * - Block/unblock users
 * - Check block status
 * - Get blocked users list
 * - Enforce block relationships (bidirectional)
 */
class BlockService {
  /**
   * Block a user
   *
   * @param {string} fromUserId - User who is blocking
   * @param {string} toUserId - User being blocked
   * @param {string|null} reason - Optional reason for blocking
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async blockUser(fromUserId, toUserId, reason = null) {
    try {
      console.log(`🚫 Blocking: ${fromUserId} blocks ${toUserId}`);

      // Validate input
      if (!fromUserId || !toUserId) {
        throw new Error('Both user IDs are required');
      }

      if (fromUserId === toUserId) {
        throw new Error('Cannot block yourself');
      }

      // Check if already blocked
      const alreadyBlocked = await this.isUserBlocked(fromUserId, toUserId);
      if (alreadyBlocked) {
        console.log('⚠️ User already blocked');
        return { success: true }; // Idempotent
      }

      // 1. Create block document
      await addDoc(collection(db, 'blocks'), {
        blockerUserId: fromUserId,
        blockedUserId: toUserId,
        reason: reason,
        createdAt: serverTimestamp()
      });

      // 2. Update blocker's user document
      await updateDoc(doc(db, 'users', fromUserId), {
        blockedUsers: arrayUnion(toUserId),
        updatedAt: serverTimestamp()
      });

      // 3. Update blocked user's document
      await updateDoc(doc(db, 'users', toUserId), {
        blockedBy: arrayUnion(fromUserId),
        updatedAt: serverTimestamp()
      });

      // 4. Clean up relationship arrays (remove likes, views)
      await this.cleanupRelationships(fromUserId, toUserId);

      console.log('✅ User blocked successfully');
      return { success: true };
    } catch (error) {
      console.error('═══════════════════════════════════════');
      console.error('🔴 ERROR: BlockService.blockUser');
      console.error('═══════════════════════════════════════');
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
      console.error('From User ID:', fromUserId);
      console.error('To User ID:', toUserId);
      console.error('Timestamp:', new Date().toISOString());
      console.error('═══════════════════════════════════════');
      return { success: false, error: error.message };
    }
  }

  /**
   * Unblock a user
   *
   * @param {string} fromUserId - User who is unblocking
   * @param {string} toUserId - User being unblocked
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async unblockUser(fromUserId, toUserId) {
    try {
      console.log(`✅ Unblocking: ${fromUserId} unblocks ${toUserId}`);

      // Find and delete the block document
      const blocksRef = collection(db, 'blocks');
      const q = query(
        blocksRef,
        where('blockerUserId', '==', fromUserId),
        where('blockedUserId', '==', toUserId)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log('⚠️ No block found to remove');
        return { success: true }; // Idempotent
      }

      // Delete all matching block documents (should be only one)
      snapshot.forEach(async (document) => {
        await deleteDoc(doc(db, 'blocks', document.id));
      });

      // Update blocker's user document
      await updateDoc(doc(db, 'users', fromUserId), {
        blockedUsers: arrayRemove(toUserId),
        updatedAt: serverTimestamp()
      });

      // Update blocked user's document
      await updateDoc(doc(db, 'users', toUserId), {
        blockedBy: arrayRemove(fromUserId),
        updatedAt: serverTimestamp()
      });

      console.log('✅ User unblocked successfully');
      return { success: true };
    } catch (error) {
      console.error('═══════════════════════════════════════');
      console.error('🔴 ERROR: BlockService.unblockUser');
      console.error('═══════════════════════════════════════');
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
      console.error('From User ID:', fromUserId);
      console.error('To User ID:', toUserId);
      console.error('Timestamp:', new Date().toISOString());
      console.error('═══════════════════════════════════════');
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if a user is blocked (either direction)
   *
   * @param {string} userId1 - First user
   * @param {string} userId2 - Second user
   * @returns {Promise<boolean>} True if either user blocked the other
   */
  async isUserBlocked(userId1, userId2) {
    try {
      // Check if userId1 blocked userId2
      const blocksRef = collection(db, 'blocks');
      const q1 = query(
        blocksRef,
        where('blockerUserId', '==', userId1),
        where('blockedUserId', '==', userId2)
      );

      const snapshot1 = await getDocs(q1);
      if (!snapshot1.empty) {
        return true; // userId1 blocked userId2
      }

      // Check if userId2 blocked userId1
      const q2 = query(
        blocksRef,
        where('blockerUserId', '==', userId2),
        where('blockedUserId', '==', userId1)
      );

      const snapshot2 = await getDocs(q2);
      return !snapshot2.empty; // userId2 blocked userId1
    } catch (error) {
      console.error('Error checking block status:', error);
      return false; // Assume not blocked on error
    }
  }

  /**
   * Get list of users blocked by a user
   *
   * @param {string} userId - User ID
   * @returns {Promise<string[]>} Array of blocked user IDs
   */
  async getBlockedUsers(userId) {
    try {
      const blocksRef = collection(db, 'blocks');
      const q = query(
        blocksRef,
        where('blockerUserId', '==', userId)
      );

      const snapshot = await getDocs(q);

      const blockedUserIds = [];
      snapshot.forEach((document) => {
        blockedUserIds.push(document.data().blockedUserId);
      });

      console.log(`📋 Found ${blockedUserIds.length} blocked users for ${userId}`);
      return blockedUserIds;
    } catch (error) {
      console.error('Error getting blocked users:', error);
      return [];
    }
  }

  /**
   * Get list of users who blocked this user
   *
   * @param {string} userId - User ID
   * @returns {Promise<string[]>} Array of blocker user IDs
   */
  async getUsersWhoBlockedMe(userId) {
    try {
      const blocksRef = collection(db, 'blocks');
      const q = query(
        blocksRef,
        where('blockedUserId', '==', userId)
      );

      const snapshot = await getDocs(q);

      const blockerIds = [];
      snapshot.forEach((document) => {
        blockerIds.push(document.data().blockerUserId);
      });

      console.log(`📋 ${blockerIds.length} users blocked ${userId}`);
      return blockerIds;
    } catch (error) {
      console.error('Error getting blockers:', error);
      return [];
    }
  }

  /**
   * Clean up relationships when blocking
   * Remove user from all interaction arrays (likes, views)
   *
   * @param {string} fromUserId - User who is blocking
   * @param {string} toUserId - User being blocked
   * @returns {Promise<void>}
   * @private
   */
  async cleanupRelationships(fromUserId, toUserId) {
    try {
      console.log('🧹 Cleaning up relationships after block...');

      // Remove from blocker's arrays
      await updateDoc(doc(db, 'users', fromUserId), {
        likedProfiles: arrayRemove(toUserId),
        whoLikedMe: arrayRemove(toUserId),
        viewedProfiles: arrayRemove(toUserId),
        viewedBy: arrayRemove(toUserId)
      });

      // Remove from blocked user's arrays
      await updateDoc(doc(db, 'users', toUserId), {
        likedProfiles: arrayRemove(fromUserId),
        whoLikedMe: arrayRemove(fromUserId),
        viewedProfiles: arrayRemove(fromUserId),
        viewedBy: arrayRemove(fromUserId),
        // Decrement like count if they were in whoLikedMe
        totalLikes: increment(-1) // TODO: Check first if was actually liked
      });

      // Note: Consider also deleting like documents if needed
      // This keeps the arrays clean but preserves block audit trail

      console.log('✅ Relationships cleaned up');
    } catch (error) {
      console.error('Error cleaning up relationships:', error);
      // Non-critical error, don't throw
    }
  }

  /**
   * Filter out blocked users from a list of user IDs
   *
   * @param {string} currentUserId - Current user's ID
   * @param {string[]} userIds - Array of user IDs to filter
   * @returns {Promise<string[]>} Filtered array with blocked users removed
   */
  async filterBlockedUsers(currentUserId, userIds) {
    try {
      if (!userIds || userIds.length === 0) {
        return [];
      }

      // Get blocked users and blockers
      const [blockedUsers, blockers] = await Promise.all([
        this.getBlockedUsers(currentUserId),
        this.getUsersWhoBlockedMe(currentUserId)
      ]);

      // Combine both lists (users I blocked + users who blocked me)
      const allBlockedUsers = [...new Set([...blockedUsers, ...blockers])].filter(id => id); // Remove null/undefined

      // Filter out blocked users
      const filtered = userIds.filter(id => id && !allBlockedUsers.includes(id));

      console.log(`🔍 Filtered ${userIds.length} users → ${filtered.length} (removed ${userIds.length - filtered.length} blocked)`);

      return filtered;
    } catch (error) {
      console.error('Error filtering blocked users:', error);
      return userIds; // Return original list on error
    }
  }
}

export default new BlockService();
