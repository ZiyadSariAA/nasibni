import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  increment,
  serverTimestamp,
  orderBy,
  limit as firestoreLimit
} from 'firebase/firestore';
import { db } from '../config/firebase';
import NotificationService from './NotificationService';

/**
 * ModerationService - Handle admin moderation actions
 *
 * Features:
 * - Warn users
 * - Strike users
 * - Suspend users (temporary)
 * - Ban users (permanent)
 * - Remove photos
 * - Get moderation history
 */
class ModerationService {
  /**
   * Issue a warning to a user
   *
   * @param {string} userId - User to warn
   * @param {string} moderatorId - Admin issuing warning
   * @param {string} reason - Reason for warning
   * @param {string} notes - Admin notes
   * @returns {Promise<{success: boolean, actionId?: string, error?: string}>}
   */
  async warnUser(userId, moderatorId, reason, notes = '') {
    try {
      console.log(`⚠️ Warning user ${userId} by moderator ${moderatorId}`);

      // Create moderation action record
      const actionDoc = await addDoc(collection(db, 'moderationActions'), {
        userId: userId,
        moderatorId: moderatorId,
        actionType: 'warning',
        reason: reason,
        duration: null,
        createdAt: serverTimestamp(),
        expiresAt: null,
        notes: notes
      });

      // Increment user's warning count
      await updateDoc(doc(db, 'users', userId), {
        warningCount: increment(1),
        moderationNotes: notes,
        updatedAt: serverTimestamp()
      });

      // Send notification to user
      await NotificationService.notifySystem(
        userId,
        'تحذير من الإدارة',
        'Warning from Admin',
        `تم إصدار تحذير لحسابك. السبب: ${reason}`,
        `A warning has been issued to your account. Reason: ${reason}`
      );

      console.log('✅ Warning issued:', actionDoc.id);
      return { success: true, actionId: actionDoc.id };
    } catch (error) {
      console.error('═══════════════════════════════════════');
      console.error('🔴 ERROR: ModerationService.warnUser');
      console.error('═══════════════════════════════════════');
      console.error('Error Message:', error.message);
      console.error('User ID:', userId);
      console.error('Moderator ID:', moderatorId);
      console.error('Timestamp:', new Date().toISOString());
      console.error('═══════════════════════════════════════');
      return { success: false, error: error.message };
    }
  }

  /**
   * Issue a strike to a user
   * Strikes are more serious than warnings
   *
   * @param {string} userId - User to strike
   * @param {string} moderatorId - Admin issuing strike
   * @param {string} reason - Reason for strike
   * @param {string} notes - Admin notes
   * @returns {Promise<{success: boolean, actionId?: string, error?: string}>}
   */
  async strikeUser(userId, moderatorId, reason, notes = '') {
    try {
      console.log(`🔴 Striking user ${userId} by moderator ${moderatorId}`);

      // Create moderation action record
      const actionDoc = await addDoc(collection(db, 'moderationActions'), {
        userId: userId,
        moderatorId: moderatorId,
        actionType: 'strike',
        reason: reason,
        duration: null,
        createdAt: serverTimestamp(),
        expiresAt: null,
        notes: notes
      });

      // Increment user's strike count
      await updateDoc(doc(db, 'users', userId), {
        strikeCount: increment(1),
        moderationNotes: notes,
        updatedAt: serverTimestamp()
      });

      // Send notification to user
      await NotificationService.notifySystem(
        userId,
        'مخالفة من الإدارة',
        'Strike from Admin',
        `تم إصدار مخالفة لحسابك. السبب: ${reason}. تراكم المخالفات قد يؤدي إلى تعليق الحساب.`,
        `A strike has been issued to your account. Reason: ${reason}. Multiple strikes may lead to suspension.`
      );

      console.log('✅ Strike issued:', actionDoc.id);
      return { success: true, actionId: actionDoc.id };
    } catch (error) {
      console.error('Error issuing strike:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Suspend a user temporarily
   *
   * @param {string} userId - User to suspend
   * @param {string} moderatorId - Admin issuing suspension
   * @param {string} reason - Reason for suspension
   * @param {number} days - Duration in days
   * @param {string} notes - Admin notes
   * @returns {Promise<{success: boolean, actionId?: string, error?: string}>}
   */
  async suspendUser(userId, moderatorId, reason, days, notes = '') {
    try {
      console.log(`⏸️ Suspending user ${userId} for ${days} days by moderator ${moderatorId}`);

      // Calculate expiration date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + days);

      // Create moderation action record
      const actionDoc = await addDoc(collection(db, 'moderationActions'), {
        userId: userId,
        moderatorId: moderatorId,
        actionType: 'suspension',
        reason: reason,
        duration: days,
        createdAt: serverTimestamp(),
        expiresAt: expiresAt,
        notes: notes
      });

      // Update user account status
      await updateDoc(doc(db, 'users', userId), {
        accountStatus: 'suspended',
        suspendedUntil: expiresAt,
        moderationNotes: notes,
        updatedAt: serverTimestamp()
      });

      // Send notification to user
      await NotificationService.notifySystem(
        userId,
        'تم تعليق حسابك',
        'Account Suspended',
        `تم تعليق حسابك لمدة ${days} يوم. السبب: ${reason}`,
        `Your account has been suspended for ${days} days. Reason: ${reason}`
      );

      console.log('✅ User suspended:', actionDoc.id);
      return { success: true, actionId: actionDoc.id };
    } catch (error) {
      console.error('Error suspending user:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Ban a user permanently
   *
   * @param {string} userId - User to ban
   * @param {string} moderatorId - Admin issuing ban
   * @param {string} reason - Reason for ban
   * @param {string} notes - Admin notes
   * @returns {Promise<{success: boolean, actionId?: string, error?: string}>}
   */
  async banUser(userId, moderatorId, reason, notes = '') {
    try {
      console.log(`🚫 Banning user ${userId} permanently by moderator ${moderatorId}`);

      // Create moderation action record
      const actionDoc = await addDoc(collection(db, 'moderationActions'), {
        userId: userId,
        moderatorId: moderatorId,
        actionType: 'ban',
        reason: reason,
        duration: null,
        createdAt: serverTimestamp(),
        expiresAt: null,
        notes: notes
      });

      // Update user account status
      await updateDoc(doc(db, 'users', userId), {
        accountStatus: 'banned',
        banReason: reason,
        moderationNotes: notes,
        updatedAt: serverTimestamp()
      });

      // Send notification to user
      await NotificationService.notifySystem(
        userId,
        'تم حظر حسابك',
        'Account Banned',
        `تم حظر حسابك بشكل دائم. السبب: ${reason}`,
        `Your account has been permanently banned. Reason: ${reason}`
      );

      console.log('✅ User banned:', actionDoc.id);
      return { success: true, actionId: actionDoc.id };
    } catch (error) {
      console.error('Error banning user:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Unban/unsuspend a user
   *
   * @param {string} userId - User to unban
   * @param {string} moderatorId - Admin unbanning user
   * @param {string} notes - Admin notes
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async unbanUser(userId, moderatorId, notes = '') {
    try {
      console.log(`✅ Unbanning user ${userId} by moderator ${moderatorId}`);

      // Update user account status
      await updateDoc(doc(db, 'users', userId), {
        accountStatus: 'active',
        suspendedUntil: null,
        banReason: null,
        moderationNotes: notes,
        updatedAt: serverTimestamp()
      });

      // Send notification to user
      await NotificationService.notifySystem(
        userId,
        'تم تفعيل حسابك',
        'Account Reactivated',
        'تم تفعيل حسابك مرة أخرى. يرجى الالتزام بقواعد المجتمع.',
        'Your account has been reactivated. Please follow community guidelines.'
      );

      console.log('✅ User unbanned/unsuspended');
      return { success: true };
    } catch (error) {
      console.error('Error unbanning user:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Remove a photo from user profile
   *
   * @param {string} userId - User ID
   * @param {string} photoUrl - Photo URL to remove
   * @param {string} moderatorId - Admin removing photo
   * @param {string} reason - Reason for removal
   * @returns {Promise<{success: boolean, actionId?: string, error?: string}>}
   */
  async removeUserPhoto(userId, photoUrl, moderatorId, reason) {
    try {
      console.log(`🖼️ Removing photo for user ${userId} by moderator ${moderatorId}`);

      // Create moderation action record
      const actionDoc = await addDoc(collection(db, 'moderationActions'), {
        userId: userId,
        moderatorId: moderatorId,
        actionType: 'photo_removal',
        reason: reason,
        duration: null,
        createdAt: serverTimestamp(),
        expiresAt: null,
        notes: `Removed photo: ${photoUrl}`
      });

      // Get user document
      const userDoc = await getDoc(doc(db, 'users', userId));
      const userData = userDoc.data();

      // Filter out the removed photo
      const updatedPhotos = userData.photos.filter(photo => photo.url !== photoUrl);

      // Update user photos
      await updateDoc(doc(db, 'users', userId), {
        photos: updatedPhotos,
        // If it was profile photo, clear it
        ...(userData.profilePhotoUrl === photoUrl && { profilePhotoUrl: null }),
        updatedAt: serverTimestamp()
      });

      // Send notification to user
      await NotificationService.notifySystem(
        userId,
        'تم إزالة صورة',
        'Photo Removed',
        `تم إزالة إحدى صورك من قبل الإدارة. السبب: ${reason}`,
        `One of your photos has been removed by admin. Reason: ${reason}`
      );

      console.log('✅ Photo removed:', actionDoc.id);
      return { success: true, actionId: actionDoc.id };
    } catch (error) {
      console.error('Error removing photo:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get moderation history for a user
   *
   * @param {string} userId - User ID
   * @param {number} limitCount - Max number of actions to fetch
   * @returns {Promise<Array>} Array of moderation actions
   */
  async getModerationHistory(userId, limitCount = 50) {
    try {
      const actionsRef = collection(db, 'moderationActions');
      const q = query(
        actionsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        firestoreLimit(limitCount)
      );

      const snapshot = await getDocs(q);

      const actions = [];
      snapshot.forEach((document) => {
        actions.push({
          id: document.id,
          ...document.data()
        });
      });

      console.log(`📋 Found ${actions.length} moderation actions for user ${userId}`);
      return actions;
    } catch (error) {
      console.error('Error getting moderation history:', error);
      return [];
    }
  }

  /**
   * Get all moderation actions of a specific type
   *
   * @param {string} actionType - Action type (warning, strike, suspension, ban, photo_removal)
   * @param {number} limitCount - Max number to fetch
   * @returns {Promise<Array>} Array of moderation actions
   */
  async getActionsByType(actionType, limitCount = 100) {
    try {
      const actionsRef = collection(db, 'moderationActions');
      const q = query(
        actionsRef,
        where('actionType', '==', actionType),
        orderBy('createdAt', 'desc'),
        firestoreLimit(limitCount)
      );

      const snapshot = await getDocs(q);

      const actions = [];
      snapshot.forEach((document) => {
        actions.push({
          id: document.id,
          ...document.data()
        });
      });

      console.log(`📋 Found ${actions.length} ${actionType} actions`);
      return actions;
    } catch (error) {
      console.error(`Error getting ${actionType} actions:`, error);
      return [];
    }
  }

  /**
   * Get moderation stats for a user
   *
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Stats object with counts
   */
  async getUserModerationStats(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));

      if (!userDoc.exists()) {
        return {
          warningCount: 0,
          strikeCount: 0,
          reportCount: 0,
          accountStatus: 'unknown'
        };
      }

      const userData = userDoc.data();

      return {
        warningCount: userData.warningCount || 0,
        strikeCount: userData.strikeCount || 0,
        reportCount: userData.reportCount || 0,
        accountStatus: userData.accountStatus || 'active',
        suspendedUntil: userData.suspendedUntil || null,
        banReason: userData.banReason || null
      };
    } catch (error) {
      console.error('Error getting moderation stats:', error);
      return {
        warningCount: 0,
        strikeCount: 0,
        reportCount: 0,
        accountStatus: 'unknown'
      };
    }
  }

  /**
   * Auto-unsuspend users whose suspension has expired
   * (This should be run as a scheduled cloud function or cron job)
   *
   * @returns {Promise<{success: boolean, count?: number, error?: string}>}
   */
  async autoUnsuspendExpiredAccounts() {
    try {
      console.log('🔄 Checking for expired suspensions...');

      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('accountStatus', '==', 'suspended')
      );

      const snapshot = await getDocs(q);

      const now = new Date();
      let unsuspendedCount = 0;

      const promises = [];
      snapshot.forEach((document) => {
        const userData = document.data();
        const suspendedUntil = userData.suspendedUntil?.toDate();

        if (suspendedUntil && suspendedUntil <= now) {
          // Suspension expired - unsuspend
          promises.push(
            updateDoc(doc(db, 'users', document.id), {
              accountStatus: 'active',
              suspendedUntil: null,
              moderationNotes: 'Auto-unsuspended after suspension period ended',
              updatedAt: serverTimestamp()
            })
          );
          unsuspendedCount++;
        }
      });

      await Promise.all(promises);

      console.log(`✅ Auto-unsuspended ${unsuspendedCount} users`);
      return { success: true, count: unsuspendedCount };
    } catch (error) {
      console.error('Error auto-unsuspending accounts:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new ModerationService();
