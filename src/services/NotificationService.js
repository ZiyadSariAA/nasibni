import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
  limit as firestoreLimit
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * NotificationService - Handle user notifications
 *
 * Features:
 * - Create notifications (like, view, message, match, etc.)
 * - Get unread notifications
 * - Mark as read
 * - Delete notifications
 */
class NotificationService {
  /**
   * Create a notification for a user
   *
   * @param {Object} notificationData - Notification data
   * @param {string} notificationData.userId - User who receives notification
   * @param {string} notificationData.type - Notification type (like, view, message, match, etc.)
   * @param {Object} notificationData.title - Bilingual title {ar: string, en: string}
   * @param {Object} notificationData.body - Bilingual body {ar: string, en: string}
   * @param {Object} notificationData.data - Additional data (fromUserId, actionType, etc.)
   * @returns {Promise<{success: boolean, notificationId?: string, error?: string}>}
   */
  async createNotification(notificationData) {
    try {
      const { userId, type, title, body, data = {} } = notificationData;

      console.log(`🔔 Creating notification for user ${userId}: ${type}`);

      // Validate input
      if (!userId || !type || !title || !body) {
        throw new Error('Missing required notification fields');
      }

      // Create notification document
      const notificationDoc = await addDoc(collection(db, 'notifications'), {
        userId: userId,
        type: type,
        title: title,
        body: body,
        data: data,
        isRead: false,
        createdAt: serverTimestamp(),
        readAt: null
      });

      console.log('✅ Notification created:', notificationDoc.id);
      return { success: true, notificationId: notificationDoc.id };
    } catch (error) {
      console.error('═══════════════════════════════════════');
      console.error('🔴 ERROR: NotificationService.createNotification');
      console.error('═══════════════════════════════════════');
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
      console.error('Notification Data:', notificationData);
      console.error('Timestamp:', new Date().toISOString());
      console.error('═══════════════════════════════════════');
      return { success: false, error: error.message };
    }
  }

  /**
   * Create a "like" notification
   *
   * @param {string} toUserId - User who receives notification
   * @param {string} fromUserId - User who liked
   * @param {string} fromUserName - Name of user who liked
   * @returns {Promise<{success: boolean, notificationId?: string}>}
   */
  async notifyLike(toUserId, fromUserId, fromUserName) {
    return this.createNotification({
      userId: toUserId,
      type: 'like',
      title: {
        ar: 'إعجاب جديد',
        en: 'New Like'
      },
      body: {
        ar: `${fromUserName} أعجب بملفك الشخصي`,
        en: `${fromUserName} liked your profile`
      },
      data: {
        fromUserId: fromUserId,
        actionType: 'liked_you',
        relatedId: null
      }
    });
  }

  /**
   * Create a "profile view" notification
   *
   * @param {string} toUserId - User who receives notification
   * @param {string} fromUserId - User who viewed
   * @param {string} fromUserName - Name of user who viewed
   * @returns {Promise<{success: boolean, notificationId?: string}>}
   */
  async notifyProfileView(toUserId, fromUserId, fromUserName) {
    return this.createNotification({
      userId: toUserId,
      type: 'view',
      title: {
        ar: 'زيارة جديدة',
        en: 'New Visit'
      },
      body: {
        ar: `${fromUserName} شاهد ملفك الشخصي`,
        en: `${fromUserName} viewed your profile`
      },
      data: {
        fromUserId: fromUserId,
        actionType: 'viewed_profile',
        relatedId: null
      }
    });
  }

  /**
   * Create a "new message" notification
   *
   * @param {string} toUserId - User who receives notification
   * @param {string} fromUserId - User who sent message
   * @param {string} fromUserName - Name of user who sent message
   * @param {string} conversationId - Conversation ID
   * @param {string} messagePreview - First 50 chars of message
   * @returns {Promise<{success: boolean, notificationId?: string}>}
   */
  async notifyNewMessage(toUserId, fromUserId, fromUserName, conversationId, messagePreview) {
    return this.createNotification({
      userId: toUserId,
      type: 'message',
      title: {
        ar: 'رسالة جديدة',
        en: 'New Message'
      },
      body: {
        ar: `${fromUserName}: ${messagePreview}`,
        en: `${fromUserName}: ${messagePreview}`
      },
      data: {
        fromUserId: fromUserId,
        actionType: 'new_message',
        relatedId: conversationId
      }
    });
  }

  /**
   * Create a "match" notification (mutual like)
   *
   * @param {string} toUserId - User who receives notification
   * @param {string} fromUserId - User who also liked
   * @param {string} fromUserName - Name of user
   * @returns {Promise<{success: boolean, notificationId?: string}>}
   */
  async notifyMatch(toUserId, fromUserId, fromUserName) {
    return this.createNotification({
      userId: toUserId,
      type: 'match',
      title: {
        ar: 'تطابق جديد! 💕',
        en: "It's a Match! 💕"
      },
      body: {
        ar: `لديك تطابق مع ${fromUserName}!`,
        en: `You matched with ${fromUserName}!`
      },
      data: {
        fromUserId: fromUserId,
        actionType: 'mutual_like',
        relatedId: null
      }
    });
  }

  /**
   * Create a "conversation accepted" notification
   *
   * @param {string} toUserId - User who receives notification
   * @param {string} fromUserId - User who accepted
   * @param {string} fromUserName - Name of user who accepted
   * @param {string} conversationId - Conversation ID
   * @returns {Promise<{success: boolean, notificationId?: string}>}
   */
  async notifyConversationAccepted(toUserId, fromUserId, fromUserName, conversationId) {
    return this.createNotification({
      userId: toUserId,
      type: 'conversation_accepted',
      title: {
        ar: 'تم قبول المحادثة',
        en: 'Conversation Accepted'
      },
      body: {
        ar: `${fromUserName} قبل طلب المحادثة`,
        en: `${fromUserName} accepted your conversation request`
      },
      data: {
        fromUserId: fromUserId,
        actionType: 'conversation_accepted',
        relatedId: conversationId
      }
    });
  }

  /**
   * Create a system notification (warning, ban, etc.)
   *
   * @param {string} userId - User who receives notification
   * @param {string} titleAr - Arabic title
   * @param {string} titleEn - English title
   * @param {string} bodyAr - Arabic body
   * @param {string} bodyEn - English body
   * @returns {Promise<{success: boolean, notificationId?: string}>}
   */
  async notifySystem(userId, titleAr, titleEn, bodyAr, bodyEn) {
    return this.createNotification({
      userId: userId,
      type: 'system',
      title: {
        ar: titleAr,
        en: titleEn
      },
      body: {
        ar: bodyAr,
        en: bodyEn
      },
      data: {
        fromUserId: null,
        actionType: 'system_message',
        relatedId: null
      }
    });
  }

  /**
   * Get unread notifications for a user
   *
   * @param {string} userId - User ID
   * @param {number} limitCount - Max number of notifications to fetch
   * @returns {Promise<Array>} Array of notification documents
   */
  async getUnreadNotifications(userId, limitCount = 50) {
    try {
      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef,
        where('userId', '==', userId),
        where('isRead', '==', false),
        orderBy('createdAt', 'desc'),
        firestoreLimit(limitCount)
      );

      const snapshot = await getDocs(q);

      const notifications = [];
      snapshot.forEach((document) => {
        notifications.push({
          id: document.id,
          ...document.data()
        });
      });

      console.log(`📋 Found ${notifications.length} unread notifications for user ${userId}`);
      return notifications;
    } catch (error) {
      console.error('Error getting unread notifications:', error);
      return [];
    }
  }

  /**
   * Get all notifications for a user
   *
   * @param {string} userId - User ID
   * @param {number} limitCount - Max number of notifications to fetch
   * @returns {Promise<Array>} Array of notification documents
   */
  async getAllNotifications(userId, limitCount = 100) {
    try {
      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        firestoreLimit(limitCount)
      );

      const snapshot = await getDocs(q);

      const notifications = [];
      snapshot.forEach((document) => {
        notifications.push({
          id: document.id,
          ...document.data()
        });
      });

      console.log(`📋 Found ${notifications.length} notifications for user ${userId}`);
      return notifications;
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }

  /**
   * Get notifications by type
   *
   * @param {string} userId - User ID
   * @param {string} type - Notification type (like, view, message, etc.)
   * @param {number} limitCount - Max number to fetch
   * @returns {Promise<Array>} Array of notification documents
   */
  async getNotificationsByType(userId, type, limitCount = 50) {
    try {
      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef,
        where('userId', '==', userId),
        where('type', '==', type),
        orderBy('createdAt', 'desc'),
        firestoreLimit(limitCount)
      );

      const snapshot = await getDocs(q);

      const notifications = [];
      snapshot.forEach((document) => {
        notifications.push({
          id: document.id,
          ...document.data()
        });
      });

      console.log(`📋 Found ${notifications.length} ${type} notifications for user ${userId}`);
      return notifications;
    } catch (error) {
      console.error(`Error getting ${type} notifications:`, error);
      return [];
    }
  }

  /**
   * Mark a notification as read
   *
   * @param {string} notificationId - Notification ID
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async markAsRead(notificationId) {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        isRead: true,
        readAt: serverTimestamp()
      });

      console.log('✅ Notification marked as read:', notificationId);
      return { success: true };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mark all notifications as read for a user
   *
   * @param {string} userId - User ID
   * @returns {Promise<{success: boolean, count?: number, error?: string}>}
   */
  async markAllAsRead(userId) {
    try {
      const unreadNotifications = await this.getUnreadNotifications(userId);

      // Update all unread notifications
      const updatePromises = unreadNotifications.map(notification =>
        updateDoc(doc(db, 'notifications', notification.id), {
          isRead: true,
          readAt: serverTimestamp()
        })
      );

      await Promise.all(updatePromises);

      console.log(`✅ Marked ${unreadNotifications.length} notifications as read`);
      return { success: true, count: unreadNotifications.length };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete a notification
   *
   * @param {string} notificationId - Notification ID
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async deleteNotification(notificationId) {
    try {
      await deleteDoc(doc(db, 'notifications', notificationId));

      console.log('✅ Notification deleted:', notificationId);
      return { success: true };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete all notifications for a user
   *
   * @param {string} userId - User ID
   * @returns {Promise<{success: boolean, count?: number, error?: string}>}
   */
  async deleteAllNotifications(userId) {
    try {
      const allNotifications = await this.getAllNotifications(userId, 1000);

      // Delete all notifications
      const deletePromises = allNotifications.map(notification =>
        deleteDoc(doc(db, 'notifications', notification.id))
      );

      await Promise.all(deletePromises);

      console.log(`✅ Deleted ${allNotifications.length} notifications`);
      return { success: true, count: allNotifications.length };
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get unread count for a user
   *
   * @param {string} userId - User ID
   * @returns {Promise<number>} Count of unread notifications
   */
  async getUnreadCount(userId) {
    try {
      const unreadNotifications = await this.getUnreadNotifications(userId);
      return unreadNotifications.length;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }
}

export default new NotificationService();
