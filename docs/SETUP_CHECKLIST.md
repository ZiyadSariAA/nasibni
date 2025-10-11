# Setup Checklist for New Contributors

Use this checklist when setting up the project for the first time.

## ✅ Initial Setup (5 minutes)

### 1. Prerequisites Installed
- [ ] Node.js (18.x or 20.x) - Check: `node --version`
- [ ] npm - Check: `npm --version`
- [ ] Git - Check: `git --version`
- [ ] Expo Go app on your phone

### 2. Clone & Install
- [ ] Clone the repository: `git clone <url>`
- [ ] Navigate to directory: `cd nasibni`
- [ ] Install dependencies: `npm install`
- [ ] Wait for installation to complete (~2-3 minutes)

### 3. Firebase Configuration
- [ ] Create `.env` file in root directory
- [ ] Copy template from `.env.example` (if available)
- [ ] Get Firebase credentials from team lead OR
- [ ] Create your own Firebase project (see [FIREBASE_SETUP.md](FIREBASE_SETUP.md))
- [ ] Add all 7 Firebase values to `.env`:
  - [ ] FIREBASE_API_KEY
  - [ ] FIREBASE_AUTH_DOMAIN
  - [ ] FIREBASE_PROJECT_ID
  - [ ] FIREBASE_STORAGE_BUCKET
  - [ ] FIREBASE_MESSAGING_SENDER_ID
  - [ ] FIREBASE_APP_ID
  - [ ] FIREBASE_MEASUREMENT_ID

### 4. Start Development Server
- [ ] Run: `npm start`
- [ ] Wait for QR code to appear
- [ ] No errors in terminal

### 5. Test on Your Device
- [ ] **iOS**: Scan QR with Camera app
- [ ] **Android**: Open Expo Go → Scan QR
- [ ] App loads successfully
- [ ] No white screen or errors

## ✅ Verify Everything Works

### Visual Checks
- [ ] Splash screen appears (ناسبني logo)
- [ ] Welcome carousel slides work
- [ ] Sign up/Sign in buttons visible
- [ ] Can navigate between screens
- [ ] Tab bar shows at bottom
- [ ] Fonts look correct (Arabic text readable)

### Platform-Specific Checks

#### iOS
- [ ] Tab bar has blur/glassmorphism effect
- [ ] Status bar adapts to screen colors
- [ ] Haptic feedback on tab switches

#### Android
- [ ] Tab bar has solid background
- [ ] Status bar doesn't overlap content
- [ ] Keyboard pushes content up (doesn't cover inputs)
- [ ] No blur artifacts or visual glitches

### Firebase Connection
- [ ] Can create a new account (test email)
- [ ] Can sign in with created account
- [ ] No Firebase connection errors in terminal

## ✅ Optional: Generate Test Users

For full app testing with sample data:

- [ ] Download Firebase Admin SDK key
- [ ] Save as `firebase-admin-key.json` in root
- [ ] Run: `npm run generate-users`
- [ ] 20 test users created successfully
- [ ] Can sign in with: `male1@nasibni.com` / `Test123456`
- [ ] See test profiles in Home screen

See [SETUP_USERS.md](SETUP_USERS.md) for details.

## 🐛 Troubleshooting

### App not loading / White screen

**Try in order:**
1. Clear cache: `npx expo start --clear`
2. Reload app (shake device → Reload)
3. Clear Expo Go cache (Settings → Clear Cache)
4. Restart: Kill terminal, run `npm start` again

### "Firebase not initialized" error

**Check:**
1. `.env` file exists in root directory
2. All Firebase values are filled in
3. No extra spaces or quotes in `.env`
4. Restart dev server after creating `.env`

### Screens look broken on Android

**This is fixed!** If you still see issues:
1. Pull latest changes: `git pull`
2. Clean install: `rm -rf node_modules .expo && npm install`
3. Clear start: `npx expo start --clear`

### Fonts not loading / Text looks wrong

**Try:**
1. Clear cache: `npx expo start --clear`
2. On device: Expo Go → Settings → Clear Cache
3. Force reload app
4. If still broken, reinstall: `npm install`

### Different look on iOS vs Android

**This is normal!** See [ANDROID_IOS_COMPATIBILITY.md](ANDROID_IOS_COMPATIBILITY.md) for details.

The app has platform-specific styling:
- iOS: Blur effects, glassmorphism
- Android: Solid backgrounds, elevation

Both are correct and intentional.

## 📚 Next Steps

After successful setup:

1. **Read the docs:**
   - [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Code organization
   - [FIREBASE_SCHEMA.md](FIREBASE_SCHEMA.md) - Database structure
   - [PERFORMANCE_OPTIMIZATIONS.md](PERFORMANCE_OPTIMIZATIONS.md) - How the app is optimized

2. **Explore the code:**
   - `src/screens/` - All app screens
   - `src/components/` - Reusable components
   - `src/services/` - Firebase operations
   - `src/navigation/` - Navigation setup

3. **Make your first change:**
   - Try editing a text string
   - Change a color
   - Add a console.log
   - See it update in real-time!

4. **Test on both platforms:**
   - If you only have iPhone, test on Android emulator
   - If you only have Android, ask teammate to test on iOS
   - Always verify changes work on both platforms

## ✨ You're Ready!

If all checks pass, you're ready to develop! 🎉

**Happy coding!** 🚀

---

**Questions?** Check the [main README](../README.md) or ask your team lead.



