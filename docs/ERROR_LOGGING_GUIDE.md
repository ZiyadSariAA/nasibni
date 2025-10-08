# 🔴 Error Logging Guide

All errors in the app are now logged to console with a consistent format for easy copy/paste debugging.

## Error Log Format

Every error is logged with this format:

```
═══════════════════════════════════════
🔴 ERROR: [Context/Function Name]
═══════════════════════════════════════
Error Message: [error.message]
Error Stack: [error.stack]
Error Code: [error.code] (if available)
Error Object: [full error object]
[Additional Context]: [relevant data]
Timestamp: [ISO timestamp]
═══════════════════════════════════════
```

## Error Locations

### 1. **ErrorState Component**
- **File:** `src/components/main/ErrorState.js`
- **When:** Whenever ErrorState is displayed on screen
- **Logs:**
  - Title
  - Message
  - Full error object (if passed)
  - Error stack
  - Timestamp

### 2. **HomeScreen**
- **File:** `src/screens/main/Home/HomeScreen.js`

#### Loading Initial Profiles Error
```
🔴 ERROR: Loading Initial Profiles
- Error Message
- Error Stack
- Error Object
- User Gender
- Timestamp
```

#### Loading More Profiles Error
```
🔴 ERROR: Loading More Profiles
- Error Message
- Error Stack
- Error Object
- Current Profiles Count
- Has More flag
- Timestamp
```

### 3. **DetailedUserScreen**
- **File:** `src/screens/main/Home/detailedUserScreen/DetailedUserScreen.js`

#### Loading Profile Details Error
```
🔴 ERROR: Loading Profile Details
- Error Message
- Error Stack
- Error Object
- Profile ID
- Timestamp
```

### 4. **ProfileService**
- **File:** `src/services/ProfileService.js`

#### Get Profiles Error
```
🔴 ERROR: ProfileService.getProfiles
- Error Message
- Error Stack
- Error Code (Firebase)
- Error Object
- Query Gender
- Limit Count
- Has Last Doc
- Timestamp
```

### 5. **AuthContext**
- **File:** `src/contexts/AuthContext.js`

#### Sign-In Error
```
🔴 ERROR: Sign-In
- Error Message
- Error Code (Firebase auth code)
- Error Stack
- Error Object
- Email
- Timestamp
```

#### Sign-Up Error
```
🔴 ERROR: Sign-Up
- Error Message
- Error Code (Firebase auth code)
- Error Stack
- Error Object
- Email
- Display Name
- Timestamp
```

## How to Use Error Logs

### 1. **Copy Error from Console**
When an error appears:
1. Open React Native debugger console
2. Look for the bordered error log (starts with `═══`)
3. Copy the entire error block
4. Save to a file or send for debugging

### 2. **Error Includes Context**
Each error log includes:
- What went wrong (error message)
- Where it happened (stack trace)
- When it happened (timestamp)
- Relevant data (user info, query params, etc.)

### 3. **Search Errors**
Use the error emoji to quickly find all errors:
```
Search console for: 🔴 ERROR
```

## Common Errors

### Firebase Errors
- `auth/invalid-email` - Invalid email format
- `auth/user-not-found` - User doesn't exist
- `auth/wrong-password` - Incorrect password
- `auth/email-already-in-use` - Email already registered
- `permission-denied` - Firestore security rules violation

### Profile Loading Errors
- `profileData is undefined` - User profile incomplete
- `Document does not exist` - Profile ID not found
- Query errors - Usually Firestore permission or index issues

## Error Reporting Template

When reporting errors, include:

```
**Error Type:** [e.g., Sign-In Error]
**Timestamp:** [from error log]
**Error Message:** [from error log]
**Error Code:** [if available]

**Context:**
[Copy full error block from console]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
...

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happened]
```

## Best Practices

1. ✅ **Always check console** when an error occurs
2. ✅ **Copy the full bordered error block** (═══)
3. ✅ **Include timestamp** when reporting issues
4. ✅ **Note the error code** for Firebase errors
5. ✅ **Save error logs** for debugging later

## Example Error Log

```
═══════════════════════════════════════
🔴 ERROR: Sign-In
═══════════════════════════════════════
Error Message: Firebase: Error (auth/user-not-found).
Error Code: auth/user-not-found
Error Stack: FirebaseError: Firebase: Error (auth/user-not-found).
    at createErrorInternal (firebase-auth.js:223:33)
    at _fail (firebase-auth.js:247:9)
    ...
Error Object: [FirebaseError object]
Email: test@example.com
Timestamp: 2025-10-07T14:23:45.678Z
═══════════════════════════════════════
```

This error shows:
- User tried to sign in
- Email doesn't exist in Firebase
- Happened at 14:23:45 on Oct 7, 2025
- Can see full stack trace for debugging
