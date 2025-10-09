import Constants from 'expo-constants';
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ========================================
// FIREBASE DATA STRUCTURE TYPE DEFINITIONS
// ========================================

/**
 * @typedef {Object} UserDocument
 * @property {string} userId - Firebase Auth UID
 * @property {string} email - User email
 * @property {string|null} phoneNumber - Optional phone number
 * @property {Date} createdAt - Account creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 * @property {boolean} profileCompleted - Has completed onboarding
 * @property {Object} profileData - Onboarding data (27 fields)
 * @property {"active"|"banned"|"suspended"} accountStatus - Account status
 * @property {boolean} isVerified - Email/phone verified
 * @property {Date|null} suspendedUntil - Auto-unsuspend time
 * @property {string|null} banReason - Reason for ban
 * @property {string|null} moderationNotes - Admin notes
 * @property {Date} lastActive - Last app activity
 * @property {boolean} isOnline - Currently online
 * @property {string|null} deviceToken - FCM push token
 * @property {number} profileViews - Total view count
 * @property {string[]} viewedBy - UserIds who viewed this profile
 * @property {string[]} viewedProfiles - UserIds this user viewed
 * @property {number} totalLikes - Total likes received
 * @property {string[]} likedProfiles - UserIds this user liked
 * @property {string[]} whoLikedMe - UserIds who liked this user
 * @property {string[]} blockedUsers - Users this user blocked
 * @property {string[]} blockedBy - Users who blocked this user
 * @property {number} reportCount - Times reported
 * @property {number} warningCount - Admin warnings
 * @property {number} strikeCount - Admin strikes
 * @property {string[]} conversations - Conversation IDs
 * @property {number} unreadMessagesCount - Total unread messages
 * @property {Date|null} lastMessageTime - Last message sent/received
 * @property {Object|null} location - GPS location data
 * @property {boolean} gpsEnabled - User enabled GPS
 * @property {boolean} showOnlineStatus - Show online indicator
 * @property {boolean} showLastSeen - Show last seen time
 * @property {Array<Object>} photos - Photo objects with URLs
 * @property {string|null} profilePhotoUrl - Main profile photo URL
 * @property {number} popularity - Algorithm score (default 5.0)
 * @property {boolean} isPremium - Premium subscription status
 */

/**
 * @typedef {Object} ReportDocument
 * @property {string} reportId - Auto-generated ID
 * @property {"profile"|"message"} reportType - What was reported
 * @property {string} reporterId - User who reported
 * @property {string} reporterName - Reporter's display name
 * @property {string} reportedUserId - User being reported
 * @property {string} reportedUserName - Their display name
 * @property {Object|null} reportedProfileData - Profile snapshot
 * @property {Object|null} reportedMessageData - Message snapshot
 * @property {string} reason - Reason in English
 * @property {string} reasonArabic - Reason in Arabic
 * @property {string|null} description - Optional user description
 * @property {"pending"|"resolved"|"dismissed"} status - Review status
 * @property {string|null} reviewedBy - Admin userId
 * @property {Date|null} reviewedAt - When reviewed
 * @property {string|null} adminNotes - Admin notes
 * @property {string|null} actionTaken - Action taken by admin
 * @property {Date} createdAt - Report creation time
 * @property {Date} updatedAt - Last update time
 */

/**
 * @typedef {Object} LikeDocument
 * @property {string} likeId - Auto-generated ID
 * @property {string} fromUserId - User who liked
 * @property {string} toUserId - User who was liked
 * @property {Date} createdAt - When like was created
 * @property {boolean} isMutual - Both users liked each other
 * @property {boolean} viewedByReceiver - Did receiver see notification
 */

/**
 * @typedef {Object} BlockDocument
 * @property {string} blockId - Auto-generated ID
 * @property {string} blockerUserId - User who blocked
 * @property {string} blockedUserId - User who was blocked
 * @property {Date} createdAt - When block was created
 * @property {string|null} reason - Optional reason
 */

/**
 * @typedef {Object} ConversationDocument
 * @property {string} conversationId - Auto-generated ID
 * @property {string[]} participants - [userId1, userId2] - sorted
 * @property {Object} participantsMap - Map of participant data
 * @property {"pending"|"active"|"declined"|"blocked"} status - Conversation status
 * @property {Date} lastMessageAt - Last message timestamp
 * @property {string} lastMessage - Last message text (preview)
 * @property {string} lastMessageBy - UserId of sender
 * @property {Date} createdAt - Conversation creation time
 * @property {Date} updatedAt - Last update time
 */

/**
 * @typedef {Object} MessageDocument
 * @property {string} messageId - Auto-generated ID
 * @property {string} conversationId - Parent conversation
 * @property {string} senderId - User who sent message
 * @property {string} text - Message content
 * @property {Date} createdAt - When sent
 * @property {Date|null} readAt - When read by receiver
 * @property {boolean} isSystemMessage - Auto-generated message
 */

/**
 * @typedef {Object} NotificationDocument
 * @property {string} notificationId - Auto-generated ID
 * @property {string} userId - Who receives this notification
 * @property {"like"|"view"|"message"|"match"|"conversation_accepted"|"system"} type - Notification type
 * @property {Object} title - Bilingual title {ar: string, en: string}
 * @property {Object} body - Bilingual body {ar: string, en: string}
 * @property {Object} data - Action data (fromUserId, actionType, relatedId)
 * @property {boolean} isRead - Read status
 * @property {Date} createdAt - Notification creation time
 * @property {Date|null} readAt - When read
 */

/**
 * @typedef {Object} ModerationActionDocument
 * @property {string} actionId - Auto-generated ID
 * @property {string} userId - User being moderated
 * @property {string} moderatorId - Admin who took action
 * @property {"warning"|"strike"|"suspension"|"ban"|"photo_removal"} actionType - Action type
 * @property {string} reason - Why action was taken
 * @property {number|null} duration - For suspensions (days)
 * @property {Date} createdAt - Action creation time
 * @property {Date|null} expiresAt - Auto-unsuspend time
 * @property {string} notes - Admin notes
 */

// Firebase configuration using environment variables from .env
const firebaseConfig = {
  apiKey: Constants.expoConfig.extra.firebaseApiKey,
  authDomain: Constants.expoConfig.extra.firebaseAuthDomain,
  projectId: Constants.expoConfig.extra.firebaseProjectId,
  storageBucket: Constants.expoConfig.extra.firebaseStorageBucket,
  messagingSenderId: Constants.expoConfig.extra.firebaseMessagingSenderId,
  appId: Constants.expoConfig.extra.firebaseAppId,
  measurementId: Constants.expoConfig.extra.firebaseMeasurementId,
};

// Validate that all required config values are present
const validateFirebaseConfig = () => {
  const requiredKeys = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];

  const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);

  if (missingKeys.length > 0) {
    console.warn('⚠️ Missing Firebase configuration keys:', missingKeys);
    console.warn('Please check your .env file and make sure all Firebase keys are set.');
    return false;
  }

  console.log('✅ Firebase configuration loaded successfully');
  return true;
};

// Validate configuration before initializing
validateFirebaseConfig();

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// ========================================
// Initialize Firestore with Persistent Cache
// ========================================
// This enables offline support and real-time updates
// - persistentLocalCache: Works with React Native (NOT web-only)
// - Caches data locally for offline access
// - Syncs automatically when back online
// - Improves performance with instant cache reads
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

// Initialize Firebase Storage
const storage = getStorage(app);

// Note: Analytics is not available in React Native
// Use Firebase Console for analytics instead

export { app, auth, db, storage, firebaseConfig, validateFirebaseConfig };
