# **Product Requirements Document (PRD)**

## **Project Name**
**Nasibni** (ناسبني) - Marriage-focused mobile app

---

## **Overview**
Nasibni is a culturally-aligned marriage app for Saudi Arabia and the Arab world. Users sign in with Google, complete detailed onboarding (23 questions) to create their profile, browse other profiles, like/view profiles, and chat with matches. Chat has a 2-message limit until the recipient accepts the conversation.

---

## **Target Audience**
- Arab Muslims (18+) in KSA and GCC
- Serious about marriage (not casual dating)
- Both genders, prefer Arabic or English UI

---

## **Key Features**
1. **Google Sign-In** - Simple authentication
2. **Mandatory Onboarding** - 23-question profile creation
3. **Profile Browse** - View cards with filters (Home tab) with lazy loading
4. **People Management** - Track who viewed you, who you liked, who liked you
5. **Text Chat** - 2-message limit before accept/decline
6. **Report & Block** - Safety controls in chat
7. **Settings** - Language, theme, privacy controls

---

## **Screens**

### **Auth Flow**
- Splash Screen (purple + logo)
- Welcome Carousel (3 screens with language toggle)
- Google Sign-In Screen

### **Onboarding Flow (23 Questions)**
1. App Language (ar/en)
2. Enable Location (optional)
3. Gender
4. Birth Year (18+ validation)
5. Height (cm)
6. Current Residence (Country + City)
7. Nationality
8. Marital Status (+ Children if divorced/widowed)
9. Religion
10. Madhhab (if Islam only)
11. Religiosity Level
12. Prayer Habit (optional)
13. Education Level
14. Work Status (optional)
15. Marriage Type (Normal/Misyar/Polygyny*) *males only
16. Marriage Plan
17. Kids Preference
18. Chat Languages (up to 3)
19. Smoking (optional)
20. Photos (1-5 photos)
21. About Me (80-250 chars)
22. Ideal Partner (80-250 chars)
23. Review & Finish

### **Main App (Bottom Tabs)**
- **Home Tab**: Profile cards with filters + lazy loading
- **People Tab**: 3 top tabs (ViewedMe / ILiked / LikedMe)
- **Chats Tab**: Chat list + Chat room screen
- **Profile Tab**: View profile + Edit profile + Settings

### **Additional Screens**
- Profile Detail Screen (full profile view)
- Edit Profile (reuse onboarding steps)
- Settings Screen
- Block List Screen
- Report Screen

---

## **Technical Stack**
- **Framework**: React Native with Expo
- **Language**: JavaScript only
- **Platform**: iOS & Android
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Styling**: NativeWind (Tailwind CSS)
- **Animations**: Reanimated + Moti
- **State**: Zustand + @tanstack/react-query
- **Navigation**: React Navigation + @gorhom/bottom-sheet
- **Forms**: react-hook-form + zod
- **Lists**: FlashList (lazy loading)
- **i18n**: expo-localization + JSON
- **Storage**: react-native-mmkv
- **Icons**: lucide-react-native
- **Fonts**: Cairo (Google Fonts) - Regular, Medium, SemiBold, Bold

---

## **Design System**

### **Colors**
```javascript
primary: '#5B2C91'      // Purple - buttons, headers
secondary: '#F4A460'    // Orange - logo, , accents
white: '#FFFFFF'        // Main background (90%)
background: '#F5F5F5'   // Secondary backgrounds
text: '#333333'         // Primary text
textLight: '#999999'    // Secondary text
border: '#E0E0E0'       // Borders
error: '#E53E3E'        // Errors
success: '#38A169'      // Success states
```

### **Typography**
- **Cairo_400Regular** - Body text
- **Cairo_500Medium** - Subtitles
- **Cairo_600SemiBold** - Section headers
- **Cairo_700Bold** - App name, titles

### **Design Requirements**
- **UI Language**: Arabic (RTL) & English (LTR)
- **Theme**: System / Light / Dark mode support
- **Style**: Clean, white-first (90%), minimal design
- **Accessibility**: Dynamic font sizes, high contrast
- **Branding**: Arabic-first, culturally respectful
- **Images**: Profile photos only (1-5 per user), no chat media

---

## **Core Rules**
1. **Default landing**: Always Home tab
2. **Chat restrictions**: 
   - Text-only forever (no images/voice/video)
   - Max 2 messages before accept
   - Accept lifts restrictions for both
   - Decline blocks sender (decliner can reopen later)
3. **Profile photos**: 1-5 photos required
4. **Bios**: Never translated (UI language only)
5. **Polygyny option**: Visible for males only
6. **Madhhab question**: Only for Muslims
7. **Lazy Loading**: 10 cards at a time
8. **Profile Cards**: Show name, age, height, nationality, country only
9. **Full Profile**: All details on tap

---

## **Home Tab - Profile Cards**

### **Card Display (Summary)**
Each card shows ONLY:
- Profile photo (first photo)
- Name
- Age (calculated from birthYear)
- Height
- Nationality
- Country

### **Lazy Loading**
- Initial load: 10 cards
- On scroll: fetch next 10
- Firestore pagination (limit + startAfter cursor)
- Loading indicator while fetching

### **Full Profile View**
- Tap card → Profile Detail Screen
- Shows ALL data: all photos, all fields, bios

---

## **Data Model (Firestore)**

### **users/{uid}**
```javascript
{
  prefs: { language, theme },
  location: { geoEnabled, countryCode, city },
  gender, birthYear, height, nationality,
  maritalStatus, hasChildren,
  religion, madhhab, religiosity, prayHabit,
  education, workStatus,
  marriageType, marriagePlan, kidsPreference,
  chatLanguages: [],
  smoking,
  photos: [{ url, createdAt }],
  aboutMe, idealPartner,
  available: true,
  visibility: "normal",
  profile: { completed: false },
  createdAt, updatedAt
}
```

### **publicProfiles/{uid}**
```javascript
{
  name, age, height, nationality, country,
  firstPhoto, gender, createdAt
}
```

### **chats/{chatId}**
```javascript
{
  participants: [uidA, uidB],
  acceptedBy: { uidA: bool, uidB: bool },
  restrictions: { [uid]: { sentBeforeAccept: 0-2 } },
  lastMessage: {}
}
```

### **Collections**
- `messages/{msgId}`: { from, text, at, type: "text" }
- `likes/{uid}/{targetUid}`: true
- `views/{uid}/{viewerUid}`: true
- `reports/{id}`: { by, on, type, reason, note, at }
- `blocks/{uid}/{blockedUid}`: true

---

## **Success Metrics**
- Onboarding completion: ≥70%
- Chat initiation: ≥3 per user/week
- Performance: Launch to Home <2.5s
- Stability: >99% crash-free sessions

---

## **Out of Scope (MVP)**
- Payments/Subscriptions
- Media in chat
- Voice/video calls
- Advanced matching
- Content moderation (automated)
- KYC/ID verification
- Apple/Phone sign-in

---

## **Timeline**

### **Phase 0: Setup** (1 day) ✅ DONE
- Expo project
- Dependencies
- NativeWind
- Cairo fonts

### **Phase 1: Initial Screens** (3-5 days) ✅ DONE
- Splash Screen
- Welcome Carousel (3 screens)
- Sign-In Screen (UI only)

### **Phase 2: Firebase + Auth** (2-3 days)
- Firebase setup
- Google Sign-In integration
- AuthContext
- User document creation

### **Phase 3: Onboarding** (7-10 days)
- 23 questions across 11 screens
- Forms with validation
- Photo upload to Firebase Storage
- Save to Firestore after each step
- Conditional logic (madhhab, polygyny)
- Set profile.completed = true

### **Phase 4: Home & People** (5-7 days)
- Home: Profile cards with FlashList
- Lazy loading (pagination)
- Filters UI
- People: ViewedMe/ILiked/LikedMe tabs
- Profile detail view
- Like/view tracking

### **Phase 5: Profile & Edit** (3-4 days)
- Display own profile
- Edit profile
- Settings structure

### **Phase 6: Chat System** (5-7 days)
- Chat list
- Chat room UI
- Real-time messages
- 2-message restriction
- Accept/Decline
- Text-only enforcement

### **Phase 7: Safety** (2-3 days)
- Report functionality
- Block feature
- Block list

### **Phase 8: Settings** (2-3 days)
- Language switch (ar/en)
- Theme toggle
- Privacy settings
- Logout/Delete account

### **Phase 9: Polish** (5-7 days)
- RTL/LTR verification
- Loading states
- Error handling
- Animations
- Bug fixes

### **Phase 10: Pre-Launch** (3-5 days)
- Firebase security rules
- Analytics
- App store prep
- Final QA

---

**Total Estimated Time: 6-8 weeks (40-50 days)**

---

## **Future Considerations (DO NOT IMPLEMENT NOW)**

### **Store/Marketplace Feature**
- A header button **may be added in the future** to navigate to a store/marketplace
- This is part of a potential "super app" vision
- **For MVP: DO NOT implement any store functionality**
- **For MVP: DO NOT add any store button**
- **For MVP: Leave this for later phases (post-launch)**
- When implemented later: Store opens via header button, Home remains default landing

---

**Note for Development:**
- Build incrementally, test each phase
- Focus on functionality first, polish later
- Use Firestore pagination properly
- Maintain 90% white-based design
- **Store feature is future work - ignore for now**

---

**Ready to build.**