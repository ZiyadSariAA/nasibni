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

/**
 * ReportService - Handle user and message reporting
 *
 * Features:
 * - Report profiles
 * - Report messages
 * - Get report history
 * - Admin report management
 */
class ReportService {
  /**
   * Report a user profile
   *
   * @param {Object} reportData - Report data
   * @param {string} reportData.reporterId - User who is reporting
   * @param {string} reportData.reporterName - Reporter's display name
   * @param {string} reportData.reportedUserId - User being reported
   * @param {string} reportData.reason - Reason in English
   * @param {string} reportData.reasonArabic - Reason in Arabic
   * @param {string|null} reportData.description - Optional user description
   * @returns {Promise<{success: boolean, reportId?: string, error?: string}>}
   */
  async reportProfile(reportData) {
    try {
      const {
        reporterId,
        reporterName,
        reportedUserId,
        reason,
        reasonArabic,
        description = null
      } = reportData;

      console.log(`🚨 Profile Report: ${reporterId} reports ${reportedUserId}`);

      // Validate input
      if (!reporterId || !reportedUserId || !reason || !reasonArabic) {
        throw new Error('Missing required report fields');
      }

      if (reporterId === reportedUserId) {
        throw new Error('Cannot report yourself');
      }

      // Fetch reported user's profile data for snapshot
      const reportedUserDoc = await getDoc(doc(db, 'users', reportedUserId));

      if (!reportedUserDoc.exists()) {
        throw new Error('Reported user not found');
      }

      const reportedUserData = reportedUserDoc.data();
      const reportedProfileData = reportedUserData.profileData || {};

      // Create profile report document
      const reportDoc = await addDoc(collection(db, 'reports'), {
        reportType: 'profile',

        // Reporter info
        reporterId: reporterId,
        reporterName: reporterName,

        // Reported user info
        reportedUserId: reportedUserId,
        reportedUserName: reportedProfileData.displayName || reportedUserData.displayName || 'Unknown',

        // Profile snapshot
        reportedProfileData: {
          displayName: reportedProfileData.displayName || reportedUserData.displayName || 'Unknown',
          age: reportedProfileData.age || null,
          photos: reportedUserData.photos?.map(p => p.url) || [],
          aboutMe: reportedProfileData.aboutMe || ''
        },

        // Message data (null for profile reports)
        reportedMessageData: null,

        // Report details
        reason: reason,
        reasonArabic: reasonArabic,
        description: description,

        // Review status
        status: 'pending',
        reviewedBy: null,
        reviewedAt: null,
        adminNotes: null,
        actionTaken: null,

        // Timestamps
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Increment report count for reported user
      await updateDoc(doc(db, 'users', reportedUserId), {
        reportCount: increment(1),
        updatedAt: serverTimestamp()
      });

      console.log('✅ Profile report created:', reportDoc.id);
      return { success: true, reportId: reportDoc.id };
    } catch (error) {
      console.error('═══════════════════════════════════════');
      console.error('🔴 ERROR: ReportService.reportProfile');
      console.error('═══════════════════════════════════════');
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
      console.error('Report Data:', reportData);
      console.error('Timestamp:', new Date().toISOString());
      console.error('═══════════════════════════════════════');
      return { success: false, error: error.message };
    }
  }

  /**
   * Report a message
   *
   * @param {Object} reportData - Report data
   * @param {string} reportData.reporterId - User who is reporting
   * @param {string} reportData.reporterName - Reporter's display name
   * @param {string} reportData.reportedUserId - User being reported
   * @param {string} reportData.conversationId - Conversation ID
   * @param {string} reportData.messageId - Message ID
   * @param {string} reportData.messageText - Offensive message text
   * @param {string} reportData.reason - Reason in English
   * @param {string} reportData.reasonArabic - Reason in Arabic
   * @param {string|null} reportData.description - Optional user description
   * @param {Array} reportData.conversationContext - Last 5-10 messages for context
   * @returns {Promise<{success: boolean, reportId?: string, error?: string}>}
   */
  async reportMessage(reportData) {
    try {
      const {
        reporterId,
        reporterName,
        reportedUserId,
        conversationId,
        messageId,
        messageText,
        reason,
        reasonArabic,
        description = null,
        conversationContext = []
      } = reportData;

      console.log(`🚨 Message Report: ${reporterId} reports message from ${reportedUserId}`);

      // Validate input
      if (!reporterId || !reportedUserId || !conversationId || !messageId || !messageText) {
        throw new Error('Missing required report fields');
      }

      // Fetch reported user's name
      const reportedUserDoc = await getDoc(doc(db, 'users', reportedUserId));
      const reportedUserData = reportedUserDoc.exists() ? reportedUserDoc.data() : {};
      const reportedUserName = reportedUserData.profileData?.displayName || reportedUserData.displayName || 'Unknown';

      // Get message timestamp
      const messageDoc = await getDoc(doc(db, 'conversations', conversationId, 'messages', messageId));
      const messageTimestamp = messageDoc.exists() ? messageDoc.data().createdAt : serverTimestamp();

      // Create message report document
      const reportDoc = await addDoc(collection(db, 'reports'), {
        reportType: 'message',

        // Reporter info
        reporterId: reporterId,
        reporterName: reporterName,

        // Reported user info
        reportedUserId: reportedUserId,
        reportedUserName: reportedUserName,

        // Profile data (null for message reports)
        reportedProfileData: null,

        // Message snapshot
        reportedMessageData: {
          conversationId: conversationId,
          messageId: messageId,
          messageText: messageText,
          messageTimestamp: messageTimestamp,
          conversationContext: conversationContext // Last 5-10 messages
        },

        // Report details
        reason: reason,
        reasonArabic: reasonArabic,
        description: description,

        // Review status
        status: 'pending',
        reviewedBy: null,
        reviewedAt: null,
        adminNotes: null,
        actionTaken: null,

        // Timestamps
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Increment report count for reported user
      await updateDoc(doc(db, 'users', reportedUserId), {
        reportCount: increment(1),
        updatedAt: serverTimestamp()
      });

      console.log('✅ Message report created:', reportDoc.id);
      return { success: true, reportId: reportDoc.id };
    } catch (error) {
      console.error('═══════════════════════════════════════');
      console.error('🔴 ERROR: ReportService.reportMessage');
      console.error('═══════════════════════════════════════');
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
      console.error('Report Data:', reportData);
      console.error('Timestamp:', new Date().toISOString());
      console.error('═══════════════════════════════════════');
      return { success: false, error: error.message };
    }
  }

  /**
   * Get reports submitted by a user
   *
   * @param {string} userId - User ID
   * @param {number} limitCount - Max number of reports to fetch
   * @returns {Promise<Array>} Array of report documents
   */
  async getReportsByUser(userId, limitCount = 20) {
    try {
      const reportsRef = collection(db, 'reports');
      const q = query(
        reportsRef,
        where('reporterId', '==', userId),
        orderBy('createdAt', 'desc'),
        firestoreLimit(limitCount)
      );

      const snapshot = await getDocs(q);

      const reports = [];
      snapshot.forEach((document) => {
        reports.push({
          id: document.id,
          ...document.data()
        });
      });

      console.log(`📋 Found ${reports.length} reports by user ${userId}`);
      return reports;
    } catch (error) {
      console.error('Error getting user reports:', error);
      return [];
    }
  }

  /**
   * Get all reports against a user (Admin function)
   *
   * @param {string} userId - User ID
   * @param {number} limitCount - Max number of reports to fetch
   * @returns {Promise<Array>} Array of report documents
   */
  async getReportsAgainstUser(userId, limitCount = 50) {
    try {
      const reportsRef = collection(db, 'reports');
      const q = query(
        reportsRef,
        where('reportedUserId', '==', userId),
        orderBy('createdAt', 'desc'),
        firestoreLimit(limitCount)
      );

      const snapshot = await getDocs(q);

      const reports = [];
      snapshot.forEach((document) => {
        reports.push({
          id: document.id,
          ...document.data()
        });
      });

      console.log(`📋 Found ${reports.length} reports against user ${userId}`);
      return reports;
    } catch (error) {
      console.error('Error getting reports against user:', error);
      return [];
    }
  }

  /**
   * Get pending reports for admin review
   *
   * @param {number} limitCount - Max number of reports to fetch
   * @returns {Promise<Array>} Array of pending report documents
   */
  async getPendingReports(limitCount = 50) {
    try {
      const reportsRef = collection(db, 'reports');
      const q = query(
        reportsRef,
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc'),
        firestoreLimit(limitCount)
      );

      const snapshot = await getDocs(q);

      const reports = [];
      snapshot.forEach((document) => {
        reports.push({
          id: document.id,
          ...document.data()
        });
      });

      console.log(`📋 Found ${reports.length} pending reports`);
      return reports;
    } catch (error) {
      console.error('Error getting pending reports:', error);
      return [];
    }
  }

  /**
   * Update report status (Admin function)
   *
   * @param {string} reportId - Report ID
   * @param {string} status - New status: 'resolved' | 'dismissed'
   * @param {string} adminUserId - Admin user ID
   * @param {string|null} adminNotes - Admin notes
   * @param {string|null} actionTaken - Action taken: 'warning' | 'strike' | 'ban' | 'no_action'
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async updateReportStatus(reportId, status, adminUserId, adminNotes = null, actionTaken = null) {
    try {
      console.log(`📝 Updating report ${reportId} to ${status}`);

      await updateDoc(doc(db, 'reports', reportId), {
        status: status,
        reviewedBy: adminUserId,
        reviewedAt: serverTimestamp(),
        adminNotes: adminNotes,
        actionTaken: actionTaken,
        updatedAt: serverTimestamp()
      });

      console.log('✅ Report status updated');
      return { success: true };
    } catch (error) {
      console.error('═══════════════════════════════════════');
      console.error('🔴 ERROR: ReportService.updateReportStatus');
      console.error('═══════════════════════════════════════');
      console.error('Error Message:', error.message);
      console.error('Report ID:', reportId);
      console.error('Timestamp:', new Date().toISOString());
      console.error('═══════════════════════════════════════');
      return { success: false, error: error.message };
    }
  }

  /**
   * Get conversation context for message report
   * Fetches last N messages for context
   *
   * @param {string} conversationId - Conversation ID
   * @param {number} contextSize - Number of messages to fetch (default 10)
   * @returns {Promise<Array>} Array of recent messages
   */
  async getConversationContext(conversationId, contextSize = 10) {
    try {
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
      const q = query(
        messagesRef,
        orderBy('createdAt', 'desc'),
        firestoreLimit(contextSize)
      );

      const snapshot = await getDocs(q);

      const messages = [];
      snapshot.forEach((document) => {
        const data = document.data();
        messages.push({
          senderId: data.senderId,
          text: data.text,
          timestamp: data.createdAt
        });
      });

      // Reverse to get chronological order
      return messages.reverse();
    } catch (error) {
      console.error('Error getting conversation context:', error);
      return [];
    }
  }
}

export default new ReportService();
