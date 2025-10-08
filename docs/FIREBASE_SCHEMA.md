# Firebase Schema Documentation - Nasibni App

**Last Updated:** 2025-10-07
**Version:** 1.0.0

This document defines the complete Firebase Firestore data structure for the Nasibni matrimonial app.

---

## Collections Overview

1. **`users`** - User profiles and account data
2. **`reports`** - User and message reports
3. **`likes`** - Like tracking (enhanced)
4. **`blocks`** - Block relationships
5. **`conversations`** - Chat conversations
6. **`messages`** - Chat messages (subcollection)
7. **`notifications`** - User notifications
8. **`moderationActions`** - Admin moderation log
9. **`profileViews`** - Detailed view tracking (optional)

---

## 1. Users Collection

**Collection Path:** `users/{userId}`
**Document ID:** Auto-generated Firebase Auth UID

### Complete Field Structure

```javascript
{
  // ========================================
  // ACCOUNT & AUTHENTICATION
  // ========================================
  userId: string,                    // Firebase Auth UID
  email: string,                     // User email
  phoneNumber: string | null,        // Optional phone (future)
  createdAt: timestamp,              // Account creation time
  updatedAt: timestamp,              // Last profile update
  profileCompleted: boolean,         // Has completed onboarding

  // ========================================
  // EXISTING 27 ONBOARDING FIELDS
  // ========================================
  profileData: {
    // Question 1: Display Name
    displayName: string,             // 3-14 chars, no spaces

    // Question 2: Gender
    gender: "male" | "female",

    // Question 3: Age
    age: number,                     // 18-77

    // Question 4: Weight
    weight: number,                  // 30-200 kg

    // Question 5: Height
    height: number,                  // 100-230 cm

    // Question 6: Education Level
    educationLevel: "below_high_school" | "diploma" | "bachelors" | "masters" | "phd",

    // Question 7: Work Status
    workStatus: "employee" | "senior_employee" | "manager" | "unemployed" | "retired" | "prefer_not_say",

    // Question 8: Enable Location (Optional)
    enableLocation: boolean,

    // Question 9: Nationality
    nationality: {
      nameAr: string,
      nameEn: string,
      countryName: string,
      code: string                   // Alpha-2 code
    },

    // Question 10: Residence Country
    residenceCountry: {
      nameAr: string,
      nameEn: string,
      countryName: string,
      code: string
    },

    // Question 11: Religion
    religion: "muslim" | "muslim_sunni" | "muslim_shia" | "other",

    // Question 12: Prayer Habit (Optional)
    prayerHabit: "daily" | "weekly" | "sometimes" | "religious_occasions" | "never" | null,

    // Question 13: Marital Status
    maritalStatus: "single" | "divorced_no_children" | "divorced_with_children" | "widowed_no_children" | "widowed_with_children" | "married",

    // Question 14: Marriage Types (Multi-select, max 3)
    marriageTypes: string[],         // ["traditional", "civil", "polygamy", "misyar", "doesnt_matter"]

    // Question 15: Marriage Plan
    marriagePlan: "asap" | "need_time" | "no_hurry",

    // Question 16: Residence After Marriage
    residenceAfterMarriage: "own_home" | "parents_home" | "parents_temporary" | "undecided",

    // Question 17: Smoking (Optional)
    smoking: "yes" | "sometimes" | "no" | null,

    // Question 18: Tribe Affiliation (Optional)
    tribeAffiliation: "yes" | "no" | null,

    // Question 19: Skin Tone
    skinTone: "white" | "light_wheat" | "wheat" | "bronze" | "light_brown" | "dark_brown",

    // Question 20: Chat Languages (Multi-select, max 3)
    chatLanguages: string[],         // ["arabic", "english", "french", etc.]

    // Question 21: Income Level
    incomeLevel: "high" | "medium" | "low" | "no_income",

    // Question 22: Children Timing
    childrenTiming: "asap" | "after_two_years" | "depends" | "no_children",

    // Question 23: Allow Wife to Work/Study (Men only)
    allowWifeWorkStudy: "yes" | "yes_from_home" | "depends" | "no" | null,

    // Question 24: Health Status (Multi-select, max 2)
    healthStatus: string[],          // ["chronic_illness", "special_needs", "infertile", "good_health"]

    // Question 25: Photos (Optional)
    // Photos stored separately in photos array

    // Question 26: About Me
    aboutMe: string,                 // 80-250 chars

    // Question 27: Ideal Partner
    idealPartner: string,            // 80-250 chars

    completedAt: timestamp
  },

  // ========================================
  // ACCOUNT STATUS & MODERATION
  // ========================================
  accountStatus: "active" | "banned" | "suspended",
  isVerified: boolean,               // Email/phone verified
  suspendedUntil: timestamp | null,  // Auto-unsuspend time
  banReason: string | null,          // Reason for ban
  moderationNotes: string | null,    // Admin notes

  // ========================================
  // ACTIVITY TRACKING
  // ========================================
  lastActive: timestamp,             // Last app activity
  isOnline: boolean,                 // Currently online
  deviceToken: string | null,        // FCM push token

  // ========================================
  // PROFILE VIEWS
  // ========================================
  profileViews: number,              // Total view count
  viewedBy: string[],                // UserIds who viewed this profile
  viewedProfiles: string[],          // UserIds this user viewed

  // ========================================
  // LIKES
  // ========================================
  totalLikes: number,                // Total likes received
  likedProfiles: string[],           // UserIds this user liked
  whoLikedMe: string[],              // UserIds who liked this user

  // ========================================
  // BLOCKING & SAFETY
  // ========================================
  blockedUsers: string[],            // Users this user blocked
  blockedBy: string[],               // Users who blocked this user
  reportCount: number,               // Times reported by others
  warningCount: number,              // Admin warnings
  strikeCount: number,               // Admin strikes

  // ========================================
  // CHAT
  // ========================================
  conversations: string[],           // Conversation IDs
  unreadMessagesCount: number,       // Total unread messages
  lastMessageTime: timestamp | null, // Last message sent/received

  // ========================================
  // LOCATION (GPS - for search only)
  // ========================================
  location: {
    latitude: number,
    longitude: number,
    city: string,
    country: string
  } | null,
  gpsEnabled: boolean,               // User enabled GPS

  // ========================================
  // PRIVACY SETTINGS
  // ========================================
  showOnlineStatus: boolean,         // Show "online" indicator
  showLastSeen: boolean,             // Show "last seen" time

  // ========================================
  // PHOTOS
  // ========================================
  photos: Array<{
    url: string,                     // Firebase Storage URL
    uploadedAt: timestamp,
    isProfilePhoto: boolean,         // Main profile photo
    order: number                    // Display order 0-5
  }>,
  profilePhotoUrl: string | null,    // Quick access to main photo

  // ========================================
  // STATS
  // ========================================
  popularity: number,                // Algorithm score (default 5.0)

  // ========================================
  // PREMIUM
  // ========================================
  isPremium: boolean                 // Premium subscription status
}
```

### Default Values for New Users

When creating a new user (in `signUpWithEmail`), initialize with:

```javascript
{
  email: firebaseUser.email,
  displayName: displayName || "",
  profileCompleted: false,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),

  // Status & Moderation
  accountStatus: "active",
  isVerified: false,
  suspendedUntil: null,
  banReason: null,
  moderationNotes: null,

  // Activity
  lastActive: serverTimestamp(),
  isOnline: false,
  deviceToken: null,

  // Views
  profileViews: 0,
  viewedBy: [],
  viewedProfiles: [],

  // Likes
  totalLikes: 0,
  likedProfiles: [],
  whoLikedMe: [],

  // Blocking
  blockedUsers: [],
  blockedBy: [],
  reportCount: 0,
  warningCount: 0,
  strikeCount: 0,

  // Chat
  conversations: [],
  unreadMessagesCount: 0,
  lastMessageTime: null,

  // Location
  location: null,
  gpsEnabled: false,

  // Privacy
  showOnlineStatus: true,
  showLastSeen: true,

  // Photos
  photos: [],
  profilePhotoUrl: null,

  // Stats
  popularity: 5.0,

  // Premium
  isPremium: false
}
```

---

## 2. Reports Collection

**Collection Path:** `reports/{reportId}`
**Document ID:** Auto-generated

### Purpose
Store user reports for profiles or messages for admin review.

### Field Structure

```javascript
{
  reportId: string,                  // Auto-generated ID
  reportType: "profile" | "message", // What was reported

  // ========================================
  // REPORTER INFORMATION
  // ========================================
  reporterId: string,                // User who reported
  reporterName: string,              // Reporter's display name

  // ========================================
  // REPORTED USER INFORMATION
  // ========================================
  reportedUserId: string,            // User being reported
  reportedUserName: string,          // Their display name

  // ========================================
  // FOR PROFILE REPORTS
  // ========================================
  reportedProfileData: {
    displayName: string,
    age: number,
    photos: string[],                // URLs of photos
    aboutMe: string
  } | null,                          // Null if message report

  // ========================================
  // FOR MESSAGE REPORTS
  // ========================================
  reportedMessageData: {
    conversationId: string,
    messageId: string,
    messageText: string,             // The offensive message
    messageTimestamp: timestamp,
    conversationContext: Array<{     // Last 5-10 messages for context
      senderId: string,
      text: string,
      timestamp: timestamp
    }>
  } | null,                          // Null if profile report

  // ========================================
  // REPORT DETAILS
  // ========================================
  reason: string,                    // English reason
  reasonArabic: string,              // Arabic reason (translated)
  description: string | null,        // Optional user description

  // ========================================
  // REVIEW STATUS
  // ========================================
  status: "pending" | "resolved" | "dismissed",
  reviewedBy: string | null,         // Admin userId who reviewed
  reviewedAt: timestamp | null,      // When reviewed
  adminNotes: string | null,         // Admin's internal notes
  actionTaken: string | null,        // "warning" | "strike" | "ban" | "no_action" | "photo_removed"

  // ========================================
  // TIMESTAMPS
  // ========================================
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Report Reasons

**Profile Reports:**
- Fake profile
- Inappropriate photos
- Harassment
- Scam/fraud
- Inappropriate content
- Other

**Message Reports:**
- Harassment
- Inappropriate content
- Spam
- Scam/fraud
- Hate speech
- Other

---

## 3. Likes Collection (Enhanced)

**Collection Path:** `likes/{likeId}`
**Document ID:** Auto-generated

### Purpose
Track likes with mutual like detection.

### Field Structure

```javascript
{
  likeId: string,                    // Auto-generated ID
  fromUserId: string,                // User who liked
  toUserId: string,                  // User who was liked
  createdAt: timestamp,              // When like was created
  isMutual: boolean,                 // Both users liked each other
  viewedByReceiver: boolean          // Did receiver see notification
}
```

### Indexes Required
- Composite: `toUserId` ASC + `createdAt` DESC
- Composite: `fromUserId` ASC + `createdAt` DESC

---

## 4. Blocks Collection

**Collection Path:** `blocks/{blockId}`
**Document ID:** Auto-generated

### Purpose
Track user blocks for filtering.

### Field Structure

```javascript
{
  blockId: string,                   // Auto-generated ID
  blockerUserId: string,             // User who blocked
  blockedUserId: string,             // User who was blocked
  createdAt: timestamp,              // When block was created
  reason: string | null              // Optional reason
}
```

### Indexes Required
- Composite: `blockerUserId` ASC + `createdAt` DESC
- Single: `blockedUserId` ASC

---

## 5. Conversations Collection

**Collection Path:** `conversations/{conversationId}`
**Document ID:** Auto-generated

### Purpose
Manage chat conversations with 2-message limit before acceptance.

### Field Structure

```javascript
{
  conversationId: string,            // Auto-generated ID
  participants: [string, string],    // [userId1, userId2] - always sorted

  // Participant details map
  participantsMap: {
    "userId1": {
      unreadCount: number,           // Unread messages count
      lastReadAt: timestamp,         // Last time user read messages
      messagesAllowed: number,       // 2 per person before accept
      hasAccepted: boolean           // Accepted conversation
    },
    "userId2": {
      unreadCount: number,
      lastReadAt: timestamp,
      messagesAllowed: number,
      hasAccepted: boolean
    }
  },

  status: "pending" | "active" | "declined" | "blocked",

  // Last message preview
  lastMessageAt: timestamp,
  lastMessage: string,               // Last message text
  lastMessageBy: string,             // UserId of sender

  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Logic
- Each user can send max 2 messages before other accepts
- After acceptance, unlimited messages
- If declined, conversation archived
- If blocked, conversation closed

---

## 6. Messages Subcollection

**Collection Path:** `conversations/{conversationId}/messages/{messageId}`
**Document ID:** Auto-generated

### Purpose
Store individual chat messages.

### Field Structure

```javascript
{
  messageId: string,                 // Auto-generated ID
  conversationId: string,            // Parent conversation
  senderId: string,                  // User who sent message
  text: string,                      // Message content
  createdAt: timestamp,              // When sent
  readAt: timestamp | null,          // When read by receiver
  isSystemMessage: boolean           // Auto-generated message (e.g. "accepted")
}
```

### System Messages
- "Conversation started"
- "X accepted the conversation"
- "You can now send unlimited messages"

---

## 7. Notifications Collection

**Collection Path:** `notifications/{notificationId}`
**Document ID:** Auto-generated

### Purpose
User notifications for likes, views, messages, matches.

### Field Structure

```javascript
{
  notificationId: string,            // Auto-generated ID
  userId: string,                    // Who receives this notification

  type: "like" | "view" | "message" | "match" | "conversation_accepted" | "system",

  // Bilingual content
  title: {
    ar: string,
    en: string
  },
  body: {
    ar: string,
    en: string
  },

  // Action data
  data: {
    fromUserId: string | null,       // Who triggered notification
    actionType: string,              // "liked_you", "viewed_profile", etc.
    relatedId: string | null         // conversationId, messageId, etc.
  },

  isRead: boolean,
  createdAt: timestamp,
  readAt: timestamp | null
}
```

### Notification Types

**Like:** "X liked your profile"
**View:** "X viewed your profile"
**Message:** "You have a new message from X"
**Match:** "It's a match! You and X liked each other"
**Conversation Accepted:** "X accepted your conversation request"
**System:** Admin messages, warnings, etc.

---

## 8. Moderation Actions Collection

**Collection Path:** `moderationActions/{actionId}`
**Document ID:** Auto-generated

### Purpose
Log all admin moderation actions for audit trail.

### Field Structure

```javascript
{
  actionId: string,                  // Auto-generated ID
  userId: string,                    // User being moderated
  moderatorId: string,               // Admin who took action

  actionType: "warning" | "strike" | "suspension" | "ban" | "photo_removal",

  reason: string,                    // Why action was taken
  duration: number | null,           // For suspensions (days)

  createdAt: timestamp,
  expiresAt: timestamp | null,       // Auto-unsuspend time

  notes: string                      // Admin notes
}
```

### Moderation Levels
1. **Warning** - Friendly reminder, no restrictions
2. **Strike** - Serious warning, counted
3. **Suspension** - Temporary account disable (1-30 days)
4. **Ban** - Permanent account disable

---

## 9. Profile Views Collection (Optional)

**Collection Path:** `profileViews/{viewId}`
**Document ID:** Auto-generated

### Purpose
Detailed view tracking (alternative to array-based tracking).

### Field Structure

```javascript
{
  viewId: string,                    // Auto-generated ID
  viewerId: string,                  // Who viewed
  viewedUserId: string,              // Whose profile was viewed
  viewedAt: timestamp,               // When viewed
  isRead: boolean                    // Did viewed user check notification
}
```

**Note:** Can use either this collection OR the `viewedBy`/`viewedProfiles` arrays in user documents. Arrays are simpler for small scale, collection is better for large scale.

---

## Data Relationships

### User → Likes
- User document has `likedProfiles[]` and `whoLikedMe[]` arrays
- Separate `likes` collection for detailed tracking
- Use arrays for quick queries, collection for history

### User → Views
- User document has `viewedBy[]` and `viewedProfiles[]` arrays
- Optional `profileViews` collection for detailed analytics

### User → Blocks
- User document has `blockedUsers[]` and `blockedBy[]` arrays
- Separate `blocks` collection for audit trail

### User → Conversations
- User document has `conversations[]` array of IDs
- Conversation document has `participants[]` array

### Conversation → Messages
- Messages stored as subcollection under conversation
- Last message preview stored in conversation doc

---

## People Tab Queries (Future Implementation)

The People screen will have 3 top tabs showing different user interactions:

### Tab 1: "Likes" - من أعجبت بهم (Who You Liked)
Shows users that the current user has given likes to.
```javascript
// Query: Fetch users where userId is IN current_user.likedProfiles[]
const likedIds = currentUser.likedProfiles;
const liked = await getDocs(
  query(
    collection(db, 'users'),
    where('userId', 'in', likedIds),
    where('accountStatus', '==', 'active'),
    where('profileCompleted', '==', true)
  )
);

// Filter out blocked users client-side
const filtered = liked.filter(user =>
  !currentUser.blockedUsers.includes(user.userId) &&
  !currentUser.blockedBy.includes(user.userId)
);
```

### Tab 2: "Profile Views" - من شاهد ملفك (Who Viewed Your Profile)
Shows users who viewed the current user's profile (clicked/pressed on card and saw full profile).
```javascript
// Query: Fetch users where userId is IN current_user.viewedBy[]
const viewerIds = currentUser.viewedBy;
const viewers = await getDocs(
  query(
    collection(db, 'users'),
    where('userId', 'in', viewerIds),
    where('accountStatus', '==', 'active'),
    where('profileCompleted', '==', true)
  )
);

// Filter out blocked users client-side
const filtered = viewers.filter(user =>
  !currentUser.blockedUsers.includes(user.userId) &&
  !currentUser.blockedBy.includes(user.userId)
);
```

### Tab 3: "Liked You" - من أعجبوا بك (Who Liked You)
Shows users who gave the current user a like.
```javascript
// Query: Fetch users where userId is IN current_user.whoLikedMe[]
const likerIds = currentUser.whoLikedMe;
const likers = await getDocs(
  query(
    collection(db, 'users'),
    where('userId', 'in', likerIds),
    where('accountStatus', '==', 'active'),
    where('profileCompleted', '==', true)
  )
);

// Filter out blocked users client-side
const filtered = likers.filter(user =>
  !currentUser.blockedUsers.includes(user.userId) &&
  !currentUser.blockedBy.includes(user.userId)
);
```

---

## Array Update Logic

### When User Opens Profile
```javascript
// 1. Add viewer to viewed user's array
await updateDoc(doc(db, 'users', viewedUserId), {
  viewedBy: arrayUnion(currentUserId),
  profileViews: increment(1)
});

// 2. Add viewed user to viewer's array
await updateDoc(doc(db, 'users', currentUserId), {
  viewedProfiles: arrayUnion(viewedUserId)
});
```

### When User Likes Profile
```javascript
// 1. Add to liker's array
await updateDoc(doc(db, 'users', currentUserId), {
  likedProfiles: arrayUnion(likedUserId)
});

// 2. Add to liked user's array and increment counter
await updateDoc(doc(db, 'users', likedUserId), {
  whoLikedMe: arrayUnion(currentUserId),
  totalLikes: increment(1)
});

// 3. Check if mutual like
const likedUserDoc = await getDoc(doc(db, 'users', likedUserId));
const isMutual = likedUserDoc.data().likedProfiles.includes(currentUserId);

if (isMutual) {
  // Create match notification for both users
}
```

### When User Blocks Someone
```javascript
// 1. Add to blocker's array
await updateDoc(doc(db, 'users', currentUserId), {
  blockedUsers: arrayUnion(blockedUserId)
});

// 2. Add to blocked user's array
await updateDoc(doc(db, 'users', blockedUserId), {
  blockedBy: arrayUnion(currentUserId)
});

// 3. Remove from all relationship arrays
await updateDoc(doc(db, 'users', currentUserId), {
  likedProfiles: arrayRemove(blockedUserId),
  whoLikedMe: arrayRemove(blockedUserId),
  viewedProfiles: arrayRemove(blockedUserId),
  viewedBy: arrayRemove(blockedUserId)
});

await updateDoc(doc(db, 'users', blockedUserId), {
  likedProfiles: arrayRemove(currentUserId),
  whoLikedMe: arrayRemove(currentUserId),
  viewedProfiles: arrayRemove(currentUserId),
  viewedBy: arrayRemove(currentUserId)
});
```

---

## Performance Considerations

### Array Limitations
- Firestore `where('field', 'in', array)` supports max 10 items
- If arrays exceed 10 items, use chunking or switch to collection-based queries
- Consider pagination for large result sets

### Recommended Approach
- Use arrays for recent/frequent data (last 100 items)
- Use collections for complete history
- Implement hybrid approach as needed

---

**End of Schema Documentation**
