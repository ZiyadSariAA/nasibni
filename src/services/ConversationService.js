import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  serverTimestamp,
  orderBy,
  limit as firestoreLimit,
  arrayUnion,
  increment
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * ConversationService - Handle chat conversations
 *
 * Features:
 * - Create conversations
 * - Send messages (with 2-message limit before acceptance)
 * - Accept/decline conversations
 * - Get conversation list
 * - Fetch messages
 */
class ConversationService {
  /**
   * Create a new conversation between two users
   *
   * @param {string} user1Id - First user ID
   * @param {string} user2Id - Second user ID
   * @returns {Promise<{success: boolean, conversationId?: string, error?: string}>}
   */
  async createConversation(user1Id, user2Id) {
    try {
      console.log(`💬 Creating conversation: ${user1Id} <-> ${user2Id}`);

      // Validate input
      if (!user1Id || !user2Id) {
        throw new Error('Both user IDs are required');
      }

      if (user1Id === user2Id) {
        throw new Error('Cannot create conversation with yourself');
      }

      // Check if conversation already exists
      const existingConversation = await this.findConversation(user1Id, user2Id);
      if (existingConversation) {
        console.log('⚠️ Conversation already exists:', existingConversation.id);
        return { success: true, conversationId: existingConversation.id, existing: true };
      }

      // Sort participant IDs for consistent ordering
      const participants = [user1Id, user2Id].sort();

      // Create conversation document
      const conversationDoc = await addDoc(collection(db, 'conversations'), {
        participants: participants,
        participantsMap: {
          [user1Id]: {
            unreadCount: 0,
            lastReadAt: serverTimestamp(),
            messagesAllowed: 2,        // Can send 2 messages before accept
            hasAccepted: false
          },
          [user2Id]: {
            unreadCount: 0,
            lastReadAt: serverTimestamp(),
            messagesAllowed: 2,        // Can send 2 messages before accept
            hasAccepted: false
          }
        },
        status: 'pending',               // pending | active | declined | blocked
        lastMessageAt: serverTimestamp(),
        lastMessage: '',
        lastMessageBy: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Add conversation ID to both users' arrays
      await updateDoc(doc(db, 'users', user1Id), {
        conversations: arrayUnion(conversationDoc.id),
        updatedAt: serverTimestamp()
      });

      await updateDoc(doc(db, 'users', user2Id), {
        conversations: arrayUnion(conversationDoc.id),
        updatedAt: serverTimestamp()
      });

      console.log('✅ Conversation created:', conversationDoc.id);
      return { success: true, conversationId: conversationDoc.id };
    } catch (error) {
      console.error('═══════════════════════════════════════');
      console.error('🔴 ERROR: ConversationService.createConversation');
      console.error('═══════════════════════════════════════');
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
      console.error('User 1 ID:', user1Id);
      console.error('User 2 ID:', user2Id);
      console.error('Timestamp:', new Date().toISOString());
      console.error('═══════════════════════════════════════');
      return { success: false, error: error.message };
    }
  }

  /**
   * Find existing conversation between two users
   *
   * @param {string} user1Id - First user ID
   * @param {string} user2Id - Second user ID
   * @returns {Promise<Object|null>} Conversation document or null
   * @private
   */
  async findConversation(user1Id, user2Id) {
    try {
      const participants = [user1Id, user2Id].sort();

      const conversationsRef = collection(db, 'conversations');
      const q = query(
        conversationsRef,
        where('participants', '==', participants)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return null;
      }

      // Return first matching conversation
      const document = snapshot.docs[0];
      return {
        id: document.id,
        ...document.data()
      };
    } catch (error) {
      console.error('Error finding conversation:', error);
      return null;
    }
  }

  /**
   * Send a message in a conversation
   * Enforces 2-message limit before acceptance
   *
   * @param {string} conversationId - Conversation ID
   * @param {string} senderId - User sending the message
   * @param {string} text - Message text
   * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
   */
  async sendMessage(conversationId, senderId, text) {
    try {
      console.log(`💬 Sending message in conversation ${conversationId}`);

      // Validate input
      if (!conversationId || !senderId || !text) {
        throw new Error('Conversation ID, sender ID, and text are required');
      }

      // Get conversation
      const conversationDoc = await getDoc(doc(db, 'conversations', conversationId));

      if (!conversationDoc.exists()) {
        throw new Error('Conversation not found');
      }

      const conversation = conversationDoc.data();

      // Check if sender is participant
      if (!conversation.participants.includes(senderId)) {
        throw new Error('User is not a participant in this conversation');
      }

      // Check if conversation is blocked or declined
      if (conversation.status === 'blocked' || conversation.status === 'declined') {
        throw new Error(`Cannot send message - conversation is ${conversation.status}`);
      }

      // Get sender's participant data
      const senderData = conversation.participantsMap[senderId];

      // Check message limit (only if not accepted)
      if (!senderData.hasAccepted && conversation.status !== 'active') {
        if (senderData.messagesAllowed <= 0) {
          throw new Error('Message limit reached. Wait for other user to accept conversation.');
        }
      }

      // Create message document
      const messageDoc = await addDoc(
        collection(db, 'conversations', conversationId, 'messages'),
        {
          senderId: senderId,
          text: text,
          createdAt: serverTimestamp(),
          readAt: null,
          isSystemMessage: false
        }
      );

      // Update conversation
      const otherUserId = conversation.participants.find(id => id !== senderId);

      await updateDoc(doc(db, 'conversations', conversationId), {
        lastMessageAt: serverTimestamp(),
        lastMessage: text.substring(0, 100), // Preview (max 100 chars)
        lastMessageBy: senderId,
        updatedAt: serverTimestamp(),
        // Decrement sender's message allowance if not accepted
        ...((!senderData.hasAccepted && conversation.status !== 'active') && {
          [`participantsMap.${senderId}.messagesAllowed`]: increment(-1)
        }),
        // Increment other user's unread count
        [`participantsMap.${otherUserId}.unreadCount`]: increment(1)
      });

      // Update sender's lastMessageTime
      await updateDoc(doc(db, 'users', senderId), {
        lastMessageTime: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Increment receiver's unreadMessagesCount
      await updateDoc(doc(db, 'users', otherUserId), {
        unreadMessagesCount: increment(1),
        updatedAt: serverTimestamp()
      });

      console.log('✅ Message sent:', messageDoc.id);
      return { success: true, messageId: messageDoc.id };
    } catch (error) {
      console.error('═══════════════════════════════════════');
      console.error('🔴 ERROR: ConversationService.sendMessage');
      console.error('═══════════════════════════════════════');
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
      console.error('Conversation ID:', conversationId);
      console.error('Sender ID:', senderId);
      console.error('Timestamp:', new Date().toISOString());
      console.error('═══════════════════════════════════════');
      return { success: false, error: error.message };
    }
  }

  /**
   * Accept a conversation request
   * Removes message limit and sets conversation to active
   *
   * @param {string} conversationId - Conversation ID
   * @param {string} userId - User accepting the conversation
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async acceptConversation(conversationId, userId) {
    try {
      console.log(`✅ Accepting conversation ${conversationId} by ${userId}`);

      // Update conversation status and user's acceptance
      await updateDoc(doc(db, 'conversations', conversationId), {
        status: 'active',
        [`participantsMap.${userId}.hasAccepted`]: true,
        [`participantsMap.${userId}.messagesAllowed`]: 999999, // Unlimited
        updatedAt: serverTimestamp()
      });

      // Add system message
      await addDoc(
        collection(db, 'conversations', conversationId, 'messages'),
        {
          senderId: userId,
          text: 'Conversation accepted. You can now send unlimited messages.',
          createdAt: serverTimestamp(),
          readAt: null,
          isSystemMessage: true
        }
      );

      console.log('✅ Conversation accepted');
      return { success: true };
    } catch (error) {
      console.error('Error accepting conversation:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Decline a conversation request
   *
   * @param {string} conversationId - Conversation ID
   * @param {string} userId - User declining the conversation
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async declineConversation(conversationId, userId) {
    try {
      console.log(`❌ Declining conversation ${conversationId} by ${userId}`);

      // Update conversation status
      await updateDoc(doc(db, 'conversations', conversationId), {
        status: 'declined',
        updatedAt: serverTimestamp()
      });

      console.log('✅ Conversation declined');
      return { success: true };
    } catch (error) {
      console.error('Error declining conversation:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user's conversations
   *
   * @param {string} userId - User ID
   * @param {number} limitCount - Max number of conversations to fetch
   * @returns {Promise<Array>} Array of conversation documents
   */
  async getUserConversations(userId, limitCount = 50) {
    try {
      const conversationsRef = collection(db, 'conversations');
      const q = query(
        conversationsRef,
        where('participants', 'array-contains', userId),
        orderBy('lastMessageAt', 'desc'),
        firestoreLimit(limitCount)
      );

      const snapshot = await getDocs(q);

      const conversations = [];
      snapshot.forEach((document) => {
        conversations.push({
          id: document.id,
          ...document.data()
        });
      });

      console.log(`📋 Found ${conversations.length} conversations for user ${userId}`);
      return conversations;
    } catch (error) {
      console.error('Error getting user conversations:', error);
      return [];
    }
  }

  /**
   * Get messages in a conversation
   *
   * @param {string} conversationId - Conversation ID
   * @param {number} limitCount - Max number of messages to fetch
   * @returns {Promise<Array>} Array of message documents
   */
  async getMessages(conversationId, limitCount = 50) {
    try {
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
      const q = query(
        messagesRef,
        orderBy('createdAt', 'asc'),
        firestoreLimit(limitCount)
      );

      const snapshot = await getDocs(q);

      const messages = [];
      snapshot.forEach((document) => {
        messages.push({
          id: document.id,
          ...document.data()
        });
      });

      console.log(`📋 Found ${messages.length} messages in conversation ${conversationId}`);
      return messages;
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  }

  /**
   * Mark conversation as read (reset unread count)
   *
   * @param {string} conversationId - Conversation ID
   * @param {string} userId - User ID
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async markConversationAsRead(conversationId, userId) {
    try {
      const conversationDoc = await getDoc(doc(db, 'conversations', conversationId));

      if (!conversationDoc.exists()) {
        throw new Error('Conversation not found');
      }

      const conversation = conversationDoc.data();
      const previousUnreadCount = conversation.participantsMap[userId].unreadCount || 0;

      // Update conversation
      await updateDoc(doc(db, 'conversations', conversationId), {
        [`participantsMap.${userId}.unreadCount`]: 0,
        [`participantsMap.${userId}.lastReadAt`]: serverTimestamp()
      });

      // Decrement user's total unread count
      if (previousUnreadCount > 0) {
        await updateDoc(doc(db, 'users', userId), {
          unreadMessagesCount: increment(-previousUnreadCount)
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if user can send message (message limit check)
   *
   * @param {string} conversationId - Conversation ID
   * @param {string} userId - User ID
   * @returns {Promise<{canSend: boolean, messagesLeft?: number, reason?: string}>}
   */
  async checkMessageLimit(conversationId, userId) {
    try {
      const conversationDoc = await getDoc(doc(db, 'conversations', conversationId));

      if (!conversationDoc.exists()) {
        return { canSend: false, reason: 'Conversation not found' };
      }

      const conversation = conversationDoc.data();

      // Check status
      if (conversation.status === 'blocked' || conversation.status === 'declined') {
        return { canSend: false, reason: `Conversation is ${conversation.status}` };
      }

      // If conversation is active, can send
      if (conversation.status === 'active') {
        return { canSend: true, messagesLeft: 999999 };
      }

      // Check user's message allowance
      const userData = conversation.participantsMap[userId];

      if (userData.hasAccepted) {
        return { canSend: true, messagesLeft: 999999 };
      }

      if (userData.messagesAllowed <= 0) {
        return { canSend: false, reason: 'Message limit reached. Wait for acceptance.', messagesLeft: 0 };
      }

      return { canSend: true, messagesLeft: userData.messagesAllowed };
    } catch (error) {
      console.error('Error checking message limit:', error);
      return { canSend: false, reason: 'Error checking limit' };
    }
  }
}

export default new ConversationService();
