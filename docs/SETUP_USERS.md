# 🚀 Quick Setup: Generate 20 Test Users

Follow these simple steps to generate 20 complete test users in Firebase.

## ⚡ Quick Start (5 minutes)

### Step 1: Install Firebase Admin SDK

```bash
npm install
```

This will install `firebase-admin` along with other dependencies.

### Step 2: Get Your Firebase Admin Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your **Nasibni** project
3. Click the **⚙️ Settings** icon → **Project Settings**
4. Click **Service Accounts** tab
5. Click **Generate New Private Key** button
6. Click **Generate Key** in the popup
7. A JSON file will download - save it as `firebase-admin-key.json` in your project root

**Your project structure should look like:**

```
nasibni/
├── firebase-admin-key.json  ← Put it here!
├── scripts/
│   └── generateUsersSimple.js
├── src/
├── package.json
└── ...
```

### Step 3: Run the Script

```bash
npm run generate-users
```

Or:

```bash
node scripts/generateUsersSimple.js
```

### Step 4: Wait for Completion

You'll see output like:

```
🚀 NASIBNI USER GENERATION SCRIPT
================================================
📊 Generating 20 users (10 male + 10 female)
🔐 Default password for all users: Test123456
================================================

👨 CREATING MALE USERS
--------------------------------------------------
Creating male user: أحمد محمد (male1@nasibni.com)
  ✅ Auth created: abc123...
  ✅ Firestore document created

... (continues for all 20 users)

================================================
🎉 USER GENERATION COMPLETE!
================================================
✅ Successfully created: 20 users
```

## 🎯 What You Get

### 20 Complete Users

- **10 Male Users** (male1@nasibni.com to male10@nasibni.com)
- **10 Female Users** (female1@nasibni.com to female10@nasibni.com)
- **Password for all**: Test123456

### All Fields Filled

✅ Name, Age, Height, Weight
✅ Country, City, Nationality
✅ Religion, Education, Job
✅ About Me (detailed Arabic text)
✅ Ideal Partner (detailed Arabic text)
✅ Marriage preferences
✅ Chat languages
✅ **NO EMPTY FIELDS!**

## 🧪 Test Your App

### 1. Login with Any User

```
Email: male1@nasibni.com
Password: Test123456
```

Or:

```
Email: female1@nasibni.com
Password: Test123456
```

### 2. View Profile Cards

- Go to **Home** screen
- You should see profile cards of opposite gender
- Male users see female profiles
- Female users see male profiles

### 3. Test Features

✅ View profiles
✅ Like profiles
✅ Chat functionality
✅ People management

## 📋 User List

### Male Users

| # | Email | Name | Age | Country |
|---|-------|------|-----|---------|
| 1 | male1@nasibni.com | أحمد محمد | 32 | 🇸🇦 السعودية |
| 2 | male2@nasibni.com | محمد علي | 29 | 🇪🇬 مصر |
| 3 | male3@nasibni.com | عمر خالد | 35 | 🇦🇪 الإمارات |
| 4 | male4@nasibni.com | يوسف حسن | 28 | 🇯🇴 الأردن |
| 5 | male5@nasibni.com | كريم عادل | 31 | 🇰🇼 الكويت |
| 6 | male6@nasibni.com | طارق سعيد | 33 | 🇶🇦 قطر |
| 7 | male7@nasibni.com | حسام رشيد | 30 | 🇧🇭 البحرين |
| 8 | male8@nasibni.com | زياد نبيل | 34 | 🇴🇲 عُمان |
| 9 | male9@nasibni.com | سامر وليد | 27 | 🇱🇧 لبنان |
| 10 | male10@nasibni.com | فادي جمال | 36 | 🇲🇦 المغرب |

### Female Users

| # | Email | Name | Age | Country |
|---|-------|------|-----|---------|
| 1 | female1@nasibni.com | فاطمة أحمد | 26 | 🇸🇦 السعودية |
| 2 | female2@nasibni.com | مريم سعيد | 28 | 🇪🇬 مصر |
| 3 | female3@nasibni.com | نور الهدى | 25 | 🇦🇪 الإمارات |
| 4 | female4@nasibni.com | سارة خالد | 27 | 🇯🇴 الأردن |
| 5 | female5@nasibni.com | ليلى حسن | 29 | 🇰🇼 الكويت |
| 6 | female6@nasibni.com | هدى عادل | 24 | 🇶🇦 قطر |
| 7 | female7@nasibni.com | رنا وليد | 30 | 🇧🇭 البحرين |
| 8 | female8@nasibni.com | دينا محمد | 26 | 🇴🇲 عُمان |
| 9 | female9@nasibni.com | ياسمين علي | 23 | 🇱🇧 لبنان |
| 10 | female10@nasibni.com | ريم طارق | 31 | 🇲🇦 المغرب |

## ✅ Verify in Firebase Console

### Check Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** → **Users**
4. You should see 20 users

### Check Firestore

1. Go to **Firestore Database**
2. Click **users** collection
3. You should see 20 documents
4. Click any document to see all fields

## 🐛 Troubleshooting

### Error: "Cannot find module 'firebase-admin'"

**Fix:**
```bash
npm install
```

### Error: "Cannot find module '../firebase-admin-key.json'"

**Fix:**
- Download the service account key from Firebase Console
- Save it as `firebase-admin-key.json` in the project root (same folder as package.json)

### Error: "Email already exists"

**Fix:**
- The users already exist in your Firebase project
- Either delete them from Firebase Console and re-run
- Or edit the script to use different email addresses

### Error: "Permission denied"

**Fix:**
- Download a fresh service account key from Firebase Console
- Make sure you're using the correct Firebase project

## ⚠️ Security Warning

🔒 **NEVER commit** `firebase-admin-key.json` to Git!

The file is already in `.gitignore` but double-check:

```bash
git status
```

If you see `firebase-admin-key.json` in the output, DO NOT COMMIT!

## 🧹 Delete Test Users (When Done)

### Option 1: Firebase Console

1. Go to **Authentication** → **Users**
2. Select the checkbox next to each test user
3. Click **Delete** (trash icon)

### Option 2: Delete All at Once

In Firebase Console:
1. **Authentication** → **Users**
2. Select all users
3. Click **Delete selected users**

## 📚 Next Steps

After generating users:

1. ✅ **Test Login** - Sign in with male1@nasibni.com
2. ✅ **Check Home Screen** - View profile cards
3. ✅ **Test Profile View** - Click on a profile
4. ✅ **Test Features** - Like, chat, etc.
5. ✅ **Switch Users** - Test with different accounts

## 🎉 Success!

If you see profiles in your Home screen, **you're all set!** 🚀

Happy testing! 🎊

---

**Need Help?**

Check `scripts/README.md` for detailed documentation.
