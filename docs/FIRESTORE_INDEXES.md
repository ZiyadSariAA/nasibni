# Firestore Indexes - Nasibni App

**Last Updated:** 2025-10-07
**Version:** 1.0.0

This document lists all required Firestore indexes for optimal query performance in the Nasibni app.

---

## Index Types

### Single-Field Indexes
Firestore automatically creates single-field indexes for all fields. No action needed.

### Composite Indexes
Must be manually created for queries with multiple filter/sort conditions.

---

## How to Create Indexes

### Method 1: Via Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** → **Indexes**
4. Click **Create Index**
5. Add fields and sort orders as specified below

### Method 2: Via Error Messages
Firebase will suggest indexes when you run queries that need them. Click the provided link to auto-create.

### Method 3: Via firestore.indexes.json
Create a `firestore.indexes.json` file and deploy with Firebase CLI:
```bash
firebase deploy --only firestore:indexes
```

---

## Required Composite Indexes

### 1. Users Collection - Profile Discovery

#### Index 1: Gender + Status + Completed (Primary matching query)
```javascript
Collection: users
Fields:
  - profileData.gender (Ascending)
  - accountStatus (Ascending)
  - profileCompleted (Ascending)
  - createdAt (Descending)

Query Example:
where('profileData.gender', '==', 'female')
where('accountStatus', '==', 'active')
where('profileCompleted', '==', true)
orderBy('createdAt', 'desc')
```

**Purpose:** Fetch opposite gender profiles for matching

---

#### Index 2: Gender + Status + Popularity (Premium feature)
```javascript
Collection: users
Fields:
  - profileData.gender (Ascending)
  - accountStatus (Ascending)
  - profileCompleted (Ascending)
  - popularity (Descending)

Query Example:
where('profileData.gender', '==', 'male')
where('accountStatus', '==', 'active')
where('profileCompleted', '==', true)
orderBy('popularity', 'desc')
```

**Purpose:** Sort profiles by popularity score

---

#### Index 3: Active + Location (GPS-based matching)
```javascript
Collection: users
Fields:
  - accountStatus (Ascending)
  - profileCompleted (Ascending)
  - location.country (Ascending)
  - createdAt (Descending)

Query Example:
where('accountStatus', '==', 'active')
where('profileCompleted', '==', true)
where('location.country', '==', 'Saudi Arabia')
orderBy('createdAt', 'desc')
```

**Purpose:** Find nearby users in same country

---

### 2. Likes Collection

#### Index 1: To User + Created (Who liked me)
```javascript
Collection: likes
Fields:
  - toUserId (Ascending)
  - createdAt (Descending)

Query Example:
where('toUserId', '==', currentUserId)
orderBy('createdAt', 'desc')
```

**Purpose:** Fetch who liked me, sorted by most recent

---

#### Index 2: From User + Created (Who I liked)
```javascript
Collection: likes
Fields:
  - fromUserId (Ascending)
  - createdAt (Descending)

Query Example:
where('fromUserId', '==', currentUserId)
orderBy('createdAt', 'desc')
```

**Purpose:** Fetch profiles I liked, sorted by most recent

---

#### Index 3: Mutual Likes
```javascript
Collection: likes
Fields:
  - toUserId (Ascending)
  - isMutual (Ascending)
  - createdAt (Descending)

Query Example:
where('toUserId', '==', currentUserId)
where('isMutual', '==', true)
orderBy('createdAt', 'desc')
```

**Purpose:** Fetch mutual matches

---

### 3. Reports Collection

#### Index 1: Status + Created (Admin review queue)
```javascript
Collection: reports
Fields:
  - status (Ascending)
  - createdAt (Descending)

Query Example:
where('status', '==', 'pending')
orderBy('createdAt', 'desc')
```

**Purpose:** Admin review queue, newest first

---

#### Index 2: Reported User + Status (User report history)
```javascript
Collection: reports
Fields:
  - reportedUserId (Ascending)
  - status (Ascending)
  - createdAt (Descending)

Query Example:
where('reportedUserId', '==', userId)
where('status', '==', 'resolved')
orderBy('createdAt', 'desc')
```

**Purpose:** Get all reports against a specific user

---

#### Index 3: Reporter + Type (User's report history)
```javascript
Collection: reports
Fields:
  - reporterId (Ascending)
  - reportType (Ascending)
  - createdAt (Descending)

Query Example:
where('reporterId', '==', currentUserId)
where('reportType', '==', 'profile')
orderBy('createdAt', 'desc')
```

**Purpose:** Get reports submitted by a user

---

### 4. Blocks Collection

#### Index 1: Blocker + Created (My blocks)
```javascript
Collection: blocks
Fields:
  - blockerUserId (Ascending)
  - createdAt (Descending)

Query Example:
where('blockerUserId', '==', currentUserId)
orderBy('createdAt', 'desc')
```

**Purpose:** Get users I blocked

---

### 5. Conversations Collection

#### Index 1: Participants + Last Message (Chat list)
```javascript
Collection: conversations
Fields:
  - participants (Array contains)
  - lastMessageAt (Descending)

Query Example:
where('participants', 'array-contains', currentUserId)
orderBy('lastMessageAt', 'desc')
```

**Purpose:** Get user's conversations sorted by recent activity

---

#### Index 2: Participants + Status (Active chats)
```javascript
Collection: conversations
Fields:
  - participants (Array contains)
  - status (Ascending)
  - lastMessageAt (Descending)

Query Example:
where('participants', 'array-contains', currentUserId)
where('status', '==', 'active')
orderBy('lastMessageAt', 'desc')
```

**Purpose:** Get only active conversations

---

### 6. Messages Subcollection

#### Index 1: Conversation + Created (Message history)
```javascript
Collection: conversations/{conversationId}/messages
Fields:
  - createdAt (Ascending)

Query Example:
where('conversationId', '==', conversationId)
orderBy('createdAt', 'asc')
```

**Purpose:** Fetch messages in chronological order

**Note:** This may be auto-created by Firestore for subcollections

---

### 7. Notifications Collection

#### Index 1: User + Read Status + Created (Unread notifications)
```javascript
Collection: notifications
Fields:
  - userId (Ascending)
  - isRead (Ascending)
  - createdAt (Descending)

Query Example:
where('userId', '==', currentUserId)
where('isRead', '==', false)
orderBy('createdAt', 'desc')
```

**Purpose:** Fetch unread notifications, newest first

---

#### Index 2: User + Type + Created (Notification by type)
```javascript
Collection: notifications
Fields:
  - userId (Ascending)
  - type (Ascending)
  - createdAt (Descending)

Query Example:
where('userId', '==', currentUserId)
where('type', '==', 'like')
orderBy('createdAt', 'desc')
```

**Purpose:** Filter notifications by type (likes, messages, etc.)

---

### 8. Moderation Actions Collection

#### Index 1: User + Created (User moderation history)
```javascript
Collection: moderationActions
Fields:
  - userId (Ascending)
  - createdAt (Descending)

Query Example:
where('userId', '==', userId)
orderBy('createdAt', 'desc')
```

**Purpose:** Admin view of all actions taken against a user

---

#### Index 2: Action Type + Created (Action type filter)
```javascript
Collection: moderationActions
Fields:
  - actionType (Ascending)
  - createdAt (Descending)

Query Example:
where('actionType', '==', 'ban')
orderBy('createdAt', 'desc')
```

**Purpose:** View all bans, strikes, etc.

---

### 9. Profile Views Collection (Optional)

#### Index 1: Viewed User + Created (Who viewed me)
```javascript
Collection: profileViews
Fields:
  - viewedUserId (Ascending)
  - createdAt (Descending)

Query Example:
where('viewedUserId', '==', currentUserId)
orderBy('createdAt', 'desc')
```

**Purpose:** Get who viewed my profile, sorted by recent

---

#### Index 2: Viewer + Created (My view history)
```javascript
Collection: profileViews
Fields:
  - viewerId (Ascending)
  - createdAt (Descending)

Query Example:
where('viewerId', '==', currentUserId)
orderBy('createdAt', 'desc')
```

**Purpose:** Get profiles I viewed

---

## firestore.indexes.json File

For automated deployment, create this file in your project root:

```json
{
  "indexes": [
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "profileData.gender", "order": "ASCENDING" },
        { "fieldPath": "accountStatus", "order": "ASCENDING" },
        { "fieldPath": "profileCompleted", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "profileData.gender", "order": "ASCENDING" },
        { "fieldPath": "accountStatus", "order": "ASCENDING" },
        { "fieldPath": "profileCompleted", "order": "ASCENDING" },
        { "fieldPath": "popularity", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "accountStatus", "order": "ASCENDING" },
        { "fieldPath": "profileCompleted", "order": "ASCENDING" },
        { "fieldPath": "location.country", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "likes",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "toUserId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "likes",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "fromUserId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "likes",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "toUserId", "order": "ASCENDING" },
        { "fieldPath": "isMutual", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "reports",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "reports",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "reportedUserId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "reports",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "reporterId", "order": "ASCENDING" },
        { "fieldPath": "reportType", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "blocks",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "blockerUserId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "conversations",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "participants", "arrayConfig": "CONTAINS" },
        { "fieldPath": "lastMessageAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "conversations",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "participants", "arrayConfig": "CONTAINS" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "lastMessageAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "notifications",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "isRead", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "notifications",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "type", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "moderationActions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "moderationActions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "actionType", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "profileViews",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "viewedUserId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "profileViews",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "viewerId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

---

## Performance Tips

### 1. Index Only What You Query
Don't create indexes for queries you don't actually use. Each index increases write costs.

### 2. Monitor Index Usage
Firebase Console shows index usage statistics. Remove unused indexes.

### 3. Optimize Complex Queries
If a query requires 3+ fields in an index, consider:
- Denormalizing data
- Breaking into multiple simpler queries
- Using client-side filtering for rare queries

### 4. Array Queries Limitation
`where('field', 'array-contains', value)` can only be used ONCE per query.

For People Tab queries (users in arrays), consider:
- Using the `in` operator with chunking (max 10 items)
- Fetching all and filtering client-side for small datasets
- Creating separate collection for large datasets

### 5. Index Build Time
Large indexes may take hours to build. Monitor progress in Firebase Console.

---

## Deployment Checklist

Before going to production:

- [ ] Create all required composite indexes
- [ ] Wait for all indexes to finish building (check status)
- [ ] Test all queries work without errors
- [ ] Monitor Firestore usage dashboard
- [ ] Optimize or remove unused indexes
- [ ] Set up query monitoring alerts

---

**End of Indexes Documentation**
