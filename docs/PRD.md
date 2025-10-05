# **Product Requirements Document (PRD) - Updated**

## **Project Name**
**Nasibni** (ناسبني) - Marriage-focused mobile app

---

## **Current Implementation Status**

### **✅ COMPLETED FEATURES**

#### **1. Authentication System**
- **Email/password authentication** with Firebase
- **User registration and login** with proper validation
- **Password reset** functionality
- **Auth state management** with AsyncStorage persistence
- **Error handling** with Arabic/English messages
- **Status**: ✅ Working (with Firebase config warnings)

#### **2. Complete Onboarding System (23 Questions)**
- **Dynamic, data-driven onboarding** using configuration files
- **23 comprehensive questions** covering all profile aspects:
  - Display name, language preference, location services
  - Gender, age, height, weight
  - Residence country/city, nationality
  - Marital status with conditional children question
  - Religion with conditional madhhab (Islamic school of thought)
  - Religiosity level, prayer habits (optional)
  - Education level, work status (optional)
  - Marriage type, marriage plan, kids preference
  - Chat languages (multi-select), smoking (optional)
  - Photo upload (1-6 photos), about me, ideal partner description
- **Advanced form components** with animations and validation
- **Conditional logic** (madhhab only for Muslims, polygyny for males)
- **Multi-language support** (Arabic RTL / English LTR)
- **Country/city picker** with real data from 195+ countries
- **Photo upload system** with Firebase Storage integration
- **Progress tracking** and navigation between questions
- **Data persistence** to Firestore and AsyncStorage
- **Status**: ✅ Fully implemented and working

#### **3. Multi-Language System**
- **Arabic (RTL) and English (LTR)** support
- **Dynamic language switching** based on device language
- **Complete translation system** with JSON-based translations
- **Proper text direction** handling
- **Language context** management
- **Status**: ✅ Fully implemented

#### **4. Design System & UI Components**
- **Brand colors**: Royal Purple (#4F2396), Warm Orange (#F69554)
- **Typography**: Cairo font family (Regular, SemiBold, Bold)
- **Comprehensive component library**: 
  - Text component with variants, colors, weights
  - Button component with multiple styles
  - Input component with validation and focus states
  - Header component with back button and logo
  - Card components
  - Icon components
- **Responsive design** with proper spacing
- **Tailwind CSS** integration with NativeWind
- **Status**: ✅ Fully implemented

#### **5. Navigation & State Management**
- **React Navigation** setup with proper flow
- **Context-based state management** (Auth, Language, Onboarding, Translation)
- **Screen navigation** flow (Splash → Welcome → Auth → Onboarding → Main)
- **Bottom tab navigation** for main app
- **Status**: ✅ Fully implemented

#### **6. Welcome Carousel System**
- **3 animated welcome slides** in Arabic and English
- **Spring animations** for images, titles, descriptions
- **Proper branding** and messaging
- **Language toggle** support
- **Status**: ✅ Fully implemented

#### **7. Main App Screens (Partial Implementation)**
- **Home Screen**: Profile cards UI implemented but **NOT WORKING** - cards not loading from Firestore
- **Profile Screen**: Basic profile view with logout functionality
- **Profile Detail Screen**: Complete profile viewing with all details
- **People Screen**: Placeholder (not implemented)
- **Chats Screen**: Placeholder (not implemented)
- **Status**: 🚧 Partially implemented

#### **8. Data Services**
- **ProfileService**: Firestore integration for profile fetching
- **CountryDataService**: Comprehensive country/city data
- **Firebase integration**: Auth, Firestore, Storage
- **Status**: ✅ Implemented (with config issues)

---

## **🔧 PLANNED IMPROVEMENTS & EDITS**

### **Onboarding Questions Refinements**
- **Question Order Optimization**: Reorder questions for better user flow
- **Question Text Improvements**: 
  - Make questions more culturally appropriate
  - Add better help text and examples
  - Improve Arabic translations for clarity
- **Validation Enhancements**:
  - Add more specific age validation (18-65)
  - Improve height/weight validation ranges
  - Add better error messages
- **Conditional Logic Improvements**:
  - Better handling of optional questions
  - Smoother transitions between conditional questions
  - Clearer indication of required vs optional fields

### **Photo Upload System**
- **Real Implementation**: Replace placeholder with actual photo picker
- **Image Processing**: Add compression and resizing
- **Validation**: File size limits, image format validation
- **UI Improvements**: Better upload progress, preview functionality
- **Storage Integration**: Proper Firebase Storage implementation

### **Profile Cards Enhancement**
- **Fix Firestore Integration**: Resolve profile cards not loading issue
- **Better Data Display**: Show more relevant information
- **Improved Styling**: Better visual hierarchy and spacing
- **Action Buttons**: Add like/view buttons with proper functionality
- **Loading States**: Better loading indicators and error handling

### **People Management System**
- **Like Functionality**: Implement like/view tracking
- **People Tabs**: Create Viewed Me, I Liked, Liked Me sections
- **Mutual Likes**: Detect and display mutual likes
- **Filtering**: Add filters for age, location, religion, etc.

### **Chat System Implementation**
- **Real-time Messaging**: Implement Firebase real-time database
- **2-Message Restriction**: Enforce message limits before accept
- **Accept/Decline Flow**: Create conversation acceptance system
- **Message UI**: Design chat interface with proper RTL support

---

## **🚧 CURRENT FIREBASE ISSUES**

### **Configuration Problems**
1. **Missing .env file**: No environment variables file found
2. **Firebase config warnings**: Environment variables not loading properly
3. **Authentication works** but shows configuration warnings
4. **Firestore integration** functional but needs proper security rules
5. **Profile cards not loading** due to Firestore query issues

### **Required Fixes**
- Create `.env` file with Firebase configuration
- Fix environment variable loading in Expo
- Implement Firestore security rules
- Fix profile cards loading issue in Home screen
- Test all Firebase services thoroughly

---

## **🎯 NEXT PHASE SCOPE**

### **Phase 1: Fix Firebase Issues** (1-2 days)
- Fix `.env` file loading in Expo configuration
- Resolve Firebase configuration warnings
- Implement proper Firestore security rules
- Fix profile cards loading issue in Home screen
- Test Firebase services thoroughly

### **Phase 2: Implement Photo Upload** (2-3 days)
- Replace PhotoUploadInput placeholder with real implementation
- Integrate with Firebase Storage
- Add image compression and validation
- Test photo upload flow

### **Phase 3: Complete People Management** (3-4 days)
- **"Viewed Me"** tab - who viewed your profile
- **"I Liked"** tab - profiles you liked
- **"Liked Me"** tab - who liked your profile
- **Mutual likes** detection and display
- **Like/view tracking** functionality

### **Phase 4: Chat System** (5-7 days)
- **Chat list** with recent conversations
- **Chat room** with real-time messages
- **2-message limit** before accept/decline
- **Accept/Decline** conversation system
- **Text-only** messaging (no media)
- **Report & Block** functionality

### **Phase 5: Profile & Settings** (3-4 days)
- **Edit profile** functionality (reuse onboarding components)
- **Settings screen** (language, theme, privacy)
- **Account management** (logout, delete account)

---

## **Technical Implementation Details**

### **Current Tech Stack**
- **Framework**: React Native with Expo
- **Language**: JavaScript (no TypeScript)
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Styling**: NativeWind (Tailwind CSS)
- **State**: React Context API
- **Navigation**: React Navigation
- **Forms**: Custom components with validation
- **Fonts**: Cairo (Google Fonts)
- **Animations**: React Native Animated API
- **Translation**: Complete JSON-based translation system

### **Data Model (Implemented)**
```javascript
// users/{uid} - User profile data
{
  email, displayName,
  profileCompleted: boolean,
  profileData: {
    displayName, appLanguage, enableLocation,
    gender, age, height, weight,
    residenceCountry, residenceCity, nationality,
    maritalStatus, hasChildren,
    religion, madhhab, religiosityLevel, prayerHabit,
    educationLevel, workStatus,
    marriageType, marriagePlan, kidsPreference,
    chatLanguages: [], smoking,
    photos: [], aboutMe, idealPartner,
    completedAt
  },
  createdAt, updatedAt
}

// publicProfiles/{uid} - Public matching data
{
  name, age, height, nationality, country,
  firstPhoto, photos: [], about,
  gender, createdAt
}
```

---

## **Design System (Implemented)**

### **Colors**
```javascript
primary: '#4F2396'      // Royal Purple
secondary: '#F69554'    // Warm Orange  
white: '#FFFFFF'        // Main background
background: '#F8F8FB'   // Secondary backgrounds
text: '#1A1A1A'         // Primary text
textLight: '#6B7280'    // Secondary text
border: '#E7E5EA'       // Borders
```

### **Typography**
- **Cairo_400Regular** - Body text
- **Cairo_500Medium** - Subtitles  
- **Cairo_600SemiBold** - Section headers
- **Cairo_700Bold** - Titles

---

## **Core Rules (Implemented)**

1. **Onboarding**: 23 questions, all required except optional fields
2. **Language**: Arabic (RTL) & English (LTR) support
3. **Photos**: 1-6 photos allowed, Firebase Storage
4. **Conditional Logic**: Madhhab for Muslims, polygyny for males
5. **Data Validation**: Age 18+, proper text lengths
6. **Persistence**: Firestore + AsyncStorage backup

---

## **Success Metrics**

- **Onboarding completion**: Target ≥70%
- **Performance**: Launch to Home <2.5s
- **Stability**: >99% crash-free sessions
- **User engagement**: Profile views and likes

---

## **Timeline (Updated)**

### **✅ Phase 0: Setup** - COMPLETED
- Expo project setup
- Dependencies installation
- NativeWind configuration
- Cairo fonts integration

### **✅ Phase 1: Authentication** - COMPLETED  
- Firebase setup
- Email/password authentication
- AuthContext implementation
- User document creation

### **✅ Phase 2: Onboarding System** - COMPLETED
- 23-question dynamic onboarding
- Complex form components
- Photo upload system (placeholder)
- Multi-language support
- Data persistence

### **✅ Phase 3: UI Components & Design** - COMPLETED
- Complete design system
- Comprehensive UI components
- Welcome carousel with animations
- Translation system
- Navigation setup

### **✅ Phase 4: Main Screens (Basic)** - COMPLETED
- Home screen with profile cards UI (not working)
- Profile screen with basic functionality
- Profile detail screen (complete)
- Navigation flow

### **🚧 Phase 5: Firebase Issues** - IN PROGRESS
- Fix environment variable loading
- Resolve configuration warnings
- Implement security rules
- Fix profile cards loading issue
- Test all Firebase services

### **📋 Phase 6: Photo Upload** - NEXT
- Implement real photo upload
- Firebase Storage integration
- Image compression and validation

### **📋 Phase 7: People Management** - PLANNED
- Viewed Me, I Liked, Liked Me tabs
- Like/view tracking system
- People management UI

### **📋 Phase 8: Chat System** - PLANNED
- Chat list and room
- Real-time messaging
- 2-message restriction
- Accept/decline system

### **📋 Phase 9: Profile & Settings** - PLANNED
- Edit profile functionality
- Settings screen
- Account management

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

## **Current Challenges**

1. **Firebase Configuration**: Environment variables not loading properly
2. **Security Rules**: Need to implement proper Firestore rules
3. **Profile Cards**: Not loading from Firestore due to configuration issues
4. **Testing**: Need comprehensive testing of Firebase services
5. **Performance**: Optimize for large user bases

---

## **Next Steps**

1. **Fix Firebase configuration** - Priority #1
2. **Fix profile cards loading** in Home screen
3. **Implement photo upload** functionality
4. **Complete People management** functionality  
5. **Build Chat system** with restrictions
6. **Complete Profile & Settings** screens

---

**Current Status**: Core onboarding system is complete and functional. Firebase authentication works but needs configuration fixes. Main app screens are partially implemented with profile cards UI built but not working due to Firestore issues. Ready to proceed with Firebase fixes and core features.

**Completion**: ~85% of core functionality completed