# Nasibni - Project Structure Documentation

## Project Overview

**Nasibni** (ناسبني - "Suits Me" in Arabic) is a React Native mobile application designed for halal matchmaking and Muslim marriage connections. The app provides a culturally-sensitive, faith-based platform for Muslims seeking marriage partners, with a focus on Arabic-speaking communities while maintaining full bilingual support (Arabic/English).

### Core Purpose
- Facilitate halal matchmaking for Muslims
- Provide comprehensive profile creation with Islamic values in mind
- Enable meaningful connections based on compatibility factors
- Support both Arabic and English languages with RTL/LTR text direction
- Maintain cultural sensitivity and religious considerations

---

## Technology Stack

### Frontend Framework
- **React Native**: 0.81.4
- **React**: 19.1.0
- **Expo SDK**: ~54.0.12

### Navigation
- **React Navigation**: 7.1.18
  - Native Stack Navigator: 7.3.27
  - Bottom Tabs Navigator: 7.4.8
  - Safe Area Context: 5.6.0

### Styling & UI
- **NativeWind**: 4.2.1 (Tailwind CSS for React Native)
- **TailwindCSS**: 3.4.17
- **Custom Design System**: Purple-based brand identity (#4F2396)
- **Cairo Font**: Arabic-optimized typography

### Backend & Database
- **Firebase**: 12.3.0
  - Firebase Authentication (Email/Password)
  - Cloud Firestore (User profiles, matching data)
  - Firebase Storage (Photo uploads)
  - AsyncStorage for local persistence

### State Management
- **React Context API**:
  - AuthContext (User authentication state)
  - OnboardingContext (23-step profile creation)
  - LanguageContext (Localization)
  - TranslationContext (Text translation)

### Localization
- **expo-localization**: 17.0.7
- **Custom Translation System**: Bilingual support (Arabic/English)

### Key Dependencies
- **@expo-google-fonts/cairo**: 0.4.2 (Arabic typography)
- **country-state-city**: 3.2.1 (Location data)
- **expo-haptics**: 15.0.7 (Tactile feedback)
- **AsyncStorage**: 2.2.0 (Local data persistence)

---

## Complete Project Structure

```
nasibni/
├── .claude/                          # Claude AI configuration
├── .expo/                            # Expo build cache
├── .git/                             # Git repository
├── node_modules/                     # Dependencies
│
├── src/                              # Source code root
│   ├── assets/                       # Static assets
│   │   ├── data/                     # Data files
│   │   │   └── Countriesdata/        # Country/city data
│   │   │       ├── Arabic/           # Arabic country names
│   │   │       │   ├── countries.json
│   │   │       │   └── world.json
│   │   │       ├── English/          # English country names
│   │   │       │   ├── countries.json
│   │   │       │   └── world.json
│   │   │       └── images/flat/16x12/ # Country flags
│   │   │           └── flagMap.js
│   │   ├── fonts/                    # Custom fonts
│   │   │   └── Cairo/                # Arabic-optimized font family
│   │   ├── images/                   # App images
│   │   │   ├── undraw_*.png          # Onboarding illustrations
│   │   │   └── ...
│   │   └── logos/                    # Brand logos
│   │       └── Group1.png            # App logo
│   │
│   ├── components/                   # Reusable components
│   │   └── main/                     # Main UI components
│   │       ├── Button.js             # Primary button component
│   │       ├── Card.js               # Card container component
│   │       ├── Header.js             # App header with logo
│   │       ├── Icon.js               # Icon wrapper component
│   │       ├── Input.js              # Text input component
│   │       ├── ProfileCard.js        # User profile card display
│   │       ├── Text.js               # Typography component
│   │       ├── WelcomeDots.js        # Carousel pagination dots
│   │       ├── WelcomeNavigation.js  # Welcome screen navigation
│   │       ├── WelcomeSlide.js       # Welcome carousel slide
│   │       ├── index.js              # Component exports
│   │       └── onboarding/           # Onboarding-specific components
│   │           ├── AnimatedNumberInput.js      # Animated number picker
│   │           ├── AnimatedProgressBar.js      # Progress indicator
│   │           ├── AnimatedSelectInput.js      # Animated select input
│   │           ├── CityPicker.js               # City selection component
│   │           ├── CityPickerInput.js          # City picker with input
│   │           ├── CountryCityExample.js       # Example component
│   │           ├── CountryPicker.js            # Country selection component
│   │           ├── CountryPickerInput.js       # Country picker with input
│   │           ├── EnhancedCountryPicker.js    # Enhanced country selector
│   │           ├── MultiSelectInput.js         # Multiple selection input
│   │           ├── NestedTextInput.js          # Nested text input
│   │           ├── NumberInput.js              # Number input component
│   │           ├── OnboardingQuestion.js       # Question wrapper component
│   │           ├── PhotoUploadInput.js         # Photo upload interface
│   │           ├── PickerInput.js              # Generic picker input
│   │           ├── SelectInput.js              # Single select input
│   │           ├── SelectWithConditionalInput.js  # Conditional select
│   │           ├── SelectWithDescriptionInput.js  # Select with description
│   │           ├── TextAreaInput.js            # Multi-line text input
│   │           ├── TextInput.js                # Single-line text input
│   │           └── index.js                    # Onboarding exports
│   │
│   ├── config/                       # Configuration files
│   │   ├── firebase.js               # Firebase initialization & config
│   │   ├── fonts.js                  # Font configuration (Cairo family)
│   │   └── onboardingQuestions.js    # 23 onboarding questions config
│   │
│   ├── contexts/                     # React Context providers
│   │   ├── AuthContext.js            # Authentication state management
│   │   ├── LanguageContext.js        # Language selection (ar/en)
│   │   ├── OnboardingContext.js      # Onboarding flow state
│   │   └── TranslationContext.js     # Translation utilities
│   │
│   ├── navigation/                   # Navigation configuration
│   │   └── AppNavigator.js           # Main navigation stack
│   │
│   ├── screens/                      # Screen components
│   │   └── main/                     # Main screens
│   │       ├── Chats/                # Chat screens
│   │       │   ├── ChatsScreen.js    # Chat list screen
│   │       │   └── index.js
│   │       ├── Home/                 # Home screens
│   │       │   ├── HomeScreen.js     # Main home/discover screen
│   │       │   └── index.js
│   │       ├── Onboarding/           # Onboarding screens
│   │       │   ├── DynamicOnboardingScreen.js  # Dynamic question screens
│   │       │   ├── OnboardingReviewScreen.js   # Profile review screen
│   │       │   └── index.js
│   │       ├── People/               # People screens
│   │       │   ├── PeopleScreen.js   # Browse people screen
│   │       │   └── index.js
│   │       ├── Profile/              # Profile screens
│   │       │   ├── ProfileDetailScreen.js  # Detailed profile view
│   │       │   ├── ProfileScreen.js        # User's own profile
│   │       │   └── index.js
│   │       ├── SigninAndSignup/      # Authentication screens
│   │       │   ├── SignInScreen.js   # Login screen
│   │       │   ├── SignUpScreen.js   # Registration screen
│   │       │   └── index.js
│   │       ├── splash/               # Splash screen
│   │       │   └── SplashScreen.js   # App launch screen
│   │       └── welcome/              # Welcome screens
│   │           ├── WelcomeCarouselScreen.js  # Onboarding carousel
│   │           └── welcomeData.js            # Welcome content data
│   │
│   └── services/                     # Business logic services
│       ├── CountryDataService.js     # Country/city data management
│       └── ProfileService.js         # Profile fetching & matching
│
├── App.js                            # Root application component
├── app.json                          # Expo configuration
├── babel.config.js                   # Babel configuration
├── index.js                          # App entry point
├── nativewind-env.d.ts               # NativeWind TypeScript definitions
├── package.json                      # Dependencies & scripts
├── package-lock.json                 # Locked dependency versions
├── tailwind.config.js                # Tailwind CSS configuration
├── .env                              # Environment variables (Firebase keys)
├── .gitignore                        # Git ignore rules
└── PROJECT_STRUCTURE.md              # This documentation file
```

---

## Key Features

### 1. User Authentication
- **Email/Password Registration**: Firebase Authentication
- **Secure Login**: Email/password with error handling
- **Password Reset**: Email-based password recovery
- **Session Persistence**: AsyncStorage for offline capability
- **Profile Completion Tracking**: Distinguishes incomplete vs complete profiles

### 2. Comprehensive Onboarding System (23 Questions)
A data-driven, multi-step profile creation process covering:

1. **Display Name** (text)
2. **App Language** (Arabic/English)
3. **Location Services** (optional)
4. **Gender** (male/female)
5. **Age** (18-100, numeric validation)
6. **Height** (140-230 cm)
7. **Weight** (40-200 kg)
8. **Current Residence Country** (country picker)
9. **Nationality** (country picker)
10. **Marital Status** (single/divorced/widowed + conditional children question)
11. **Religion** (Muslim/Christian/Other)
12. **Madhhab** (Sunni/Shia - conditional on Muslim religion)
13. **Religiosity Level** (4-level scale)
14. **Prayer Habit** (optional, 5-level frequency)
15. **Education Level** (6 options from high school to PhD)
16. **Work Status** (optional text field)
17. **Marriage Type** (traditional/modern/both)
18. **Marriage Plan** (timeline: 6 months to not sure)
19. **Kids Preference** (yes/no/not sure)
20. **Chat Languages** (multi-select: Arabic, English, French, etc.)
21. **Smoking** (optional: yes/no/occasionally)
22. **Photos** (optional: up to 6 photos)
23. **About Me** (500 chars max)
24. **Ideal Partner Description** (500 chars max)

**Features**:
- Conditional question logic (e.g., madhhab only shown to Muslims)
- Dynamic question navigation
- Progress tracking
- Input validation with custom error messages
- Optional vs required questions
- Bilingual question text and options

### 3. Profile Matching & Discovery
- **Gender-based Filtering**: Shows opposite gender profiles
- **Completed Profiles Only**: Only matches users with complete profiles
- **Pagination**: Load 5 profiles at a time
- **Profile Cards**: Rich profile display with photos, bio, compatibility data
- **Infinite Scroll**: Load more profiles as user scrolls

### 4. Bilingual Support (Arabic/English)
- **Auto Language Detection**: Device language detection
- **Manual Language Switch**: User can change language anytime
- **RTL/LTL Support**: Proper text direction for Arabic
- **Localized Content**: All UI text, questions, and options translated
- **Cairo Font**: Optimized for Arabic readability

### 5. Location & Geography
- **Country Data**: 195+ countries with Arabic/English names
- **City Selection**: Comprehensive city data per country
- **Popular Countries**: Prioritized list for Arab users (Saudi Arabia, UAE, etc.)
- **Flag Icons**: Visual country flags for better UX
- **Search Functionality**: Search countries and cities

### 6. Navigation Structure
- **Stack Navigation**: Welcome → Auth → Onboarding → Main App
- **Bottom Tabs**: Home | People | Chats | Profile
- **Deep Linking Support**: Navigate to specific screens
- **Safe Area Handling**: iOS notch and Android navigation bar support

### 7. Design System
- **Brand Colors**:
  - Primary: Royal Purple (#4F2396)
  - Accent: Warm Orange (#F69554)
  - Background: White (#FFFFFF) / Alt (#F8F8FB)
- **Typography**: Cairo font family (Regular, SemiBold, Bold)
- **Consistent Spacing**: Predefined spacing scale (xs to 5xl)
- **Component Library**: Button, Input, Card, Text, Header, etc.
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: Proper touch targets and contrast ratios

---

## Data Flow & Architecture

### Authentication Flow
```
1. App Launch → SplashScreen (2.5s)
2. Check AuthContext → Firebase Auth State
3. If no user → WelcomeCarousel → SignIn/SignUp
4. After SignUp → Redirect to Onboarding
5. After Onboarding completion → Main App (Home)
6. If user exists + profile complete → Main App (Home)
```

### Onboarding Flow
```
1. User creates account → OnboardingContext initialized
2. DynamicOnboardingScreen renders questions sequentially
3. Each answer saved to OnboardingContext state
4. Navigation logic: getNextQuestionId() determines next question
5. Conditional questions shown/hidden based on previous answers
6. Final step → OnboardingReviewScreen shows all data
7. User confirms → Data saved to Firestore
8. Profile completion flag set → Navigate to Home
```

### Profile Matching Flow
```
1. User lands on HomeScreen
2. ProfileService.getInitialProfiles(userGender) called
3. Firestore query: opposite gender + profileCompleted = true
4. Results sorted by createdAt (newest first)
5. ProfileCards rendered in FlatList
6. User scrolls → onEndReached triggers loadMoreProfiles()
7. Pagination via lastDoc cursor
```

### Data Persistence
```
- Firebase Auth: User credentials
- Firestore 'users' collection:
  {
    uid: string,
    email: string,
    displayName: string,
    profileCompleted: boolean,
    profileData: {
      // 23 onboarding question answers
    },
    createdAt: timestamp,
    updatedAt: timestamp
  }
- AsyncStorage: Local cache of current user (when profile complete)
```

---

## Main Components & Their Purpose

### Core UI Components

#### `Button.js`
- **Purpose**: Primary button with variants and states
- **Props**: title, variant (primary/secondary/outline/ghost), size (small/medium/large), loading, disabled
- **Styling**: TailwindCSS classes with dynamic state management

#### `Card.js`
- **Purpose**: Container component for content cards
- **Props**: variant (default/elevated/outlined/flat), padding (small/medium/large), onPress (optional)
- **Usage**: Profile cards, list items, content sections

#### `Input.js`
- **Purpose**: Text input with label, error states, and password toggle
- **Features**: Focus states, validation errors, disabled state, multiline support
- **Props**: label, placeholder, value, onChangeText, secureTextEntry, error, disabled

#### `Text.js`
- **Purpose**: Typography component with predefined variants
- **Variants**: h1-h4 (headings), body, caption, small
- **Props**: variant, color, align, weight, style
- **Fonts**: Cairo family (Regular, SemiBold, Bold)

#### `Header.js`
- **Purpose**: App header with logo, title, back button
- **Features**: Safe area handling, RTL support, customizable background
- **Props**: title, subtitle, showBackButton, onBackPress, rightComponent

#### `ProfileCard.js`
- **Purpose**: Display user profile in card format
- **Features**: Photo display, name, age, bio, location, compatibility indicators
- **Actions**: View profile, send message, like/skip
- **Usage**: Home screen matching, people browse

### Onboarding Components

#### `OnboardingQuestion.js`
- **Purpose**: Wrapper for each onboarding question
- **Features**: Progress bar, question text, scrollable content, navigation buttons
- **Props**: question, currentStep, totalSteps, onNext, onBack, isArabic, nextDisabled

#### `SelectInput.js`
- **Purpose**: Single-select option list
- **Features**: Icon support, selected state, Arabic/English labels
- **Usage**: Gender, religion, education, etc.

#### `CountryPicker.js` / `CityPicker.js`
- **Purpose**: Country and city selection with search
- **Features**: Search functionality, popular countries first, flag icons
- **Data Source**: CountryDataService

#### `PhotoUploadInput.js`
- **Purpose**: Photo upload interface (placeholder for future implementation)
- **Planned Features**: Multi-photo upload, crop/resize, preview

#### `AnimatedProgressBar.js`
- **Purpose**: Visual progress indicator for onboarding
- **Features**: Smooth width animation, percentage calculation

### Welcome Components

#### `WelcomeSlide.js`
- **Purpose**: Individual slide in welcome carousel
- **Features**: Animated image, title, description with fade/scale effects
- **Props**: slide (image, icon, title, description), isArabic

#### `WelcomeDots.js`
- **Purpose**: Pagination indicator for carousel
- **Features**: Animated dot scaling, active state
- **Props**: slides, currentIndex

#### `WelcomeNavigation.js`
- **Purpose**: Navigation controls for welcome carousel
- **Features**: Skip button, Next/Get Started button, pulse animation
- **Props**: currentIndex, slidesLength, onSkip, onNext, isArabic

---

## Context Providers

### 1. AuthContext
**Location**: `src/contexts/AuthContext.js`

**Purpose**: Manages user authentication state across the app

**State**:
- `user`: Current user object (uid, email, displayName, profile)
- `loading`: Loading state for auth operations
- `initializing`: Initial auth state check

**Methods**:
- `signInWithEmail(email, password)`: Firebase email/password login
- `signUpWithEmail(email, password, displayName)`: Create new account
- `resetPassword(email)`: Send password reset email
- `updateProfileCompletion(completed, profileData)`: Update profile status
- `signOut()`: Sign out and clear local storage
- `isSignedIn()`: Check if user is authenticated

**Firebase Integration**:
- Listens to `onAuthStateChanged` for real-time auth state
- Syncs with Firestore `users` collection
- Persists completed profiles to AsyncStorage

**Error Handling**: Localized error messages in Arabic

### 2. OnboardingContext
**Location**: `src/contexts/OnboardingContext.js`

**Purpose**: Manages the 23-step onboarding flow

**State**:
- `onboardingData`: Object storing all 23 question answers
- `currentQuestionIndex`: Current question being answered
- `currentQuestionId`: ID of current question
- `isOnboardingComplete`: Flag for completion status

**Methods**:
- `updateField(field, value)`: Update a single onboarding field
- `goToNextQuestion()`: Navigate to next question with conditional logic
- `goToPreviousQuestion()`: Navigate to previous question
- `completeOnboarding()`: Finalize and save profile to Firestore
- `resetOnboarding()`: Clear all onboarding data

**Question Logic**:
- Dynamic question routing based on previous answers
- Conditional question visibility (e.g., madhhab only for Muslims)
- Validation before allowing progression

### 3. LanguageContext
**Location**: `src/contexts/LanguageContext.js`

**Purpose**: Manages app language (Arabic/English)

**State**:
- `language`: Current language code ('ar' or 'en')
- `isArabic`: Boolean for Arabic language
- `isEnglish`: Boolean for English language
- `isLoading`: Loading state during language detection

**Methods**:
- `changeLanguage(newLanguage)`: Switch app language

**Auto-Detection**: Uses `expo-localization` to detect device language

### 4. TranslationContext
**Location**: `src/contexts/TranslationContext.js`

**Purpose**: Provides translation utilities for bilingual content

**Methods**:
- `getText(textObject)`: Get localized text from {en, ar} object
- `getLabel(option)`: Get option label in current language
- `getPlaceholder(placeholder, fallback)`: Get placeholder text
- `t(key)`: Translate common UI terms (search, selectCountry, etc.)

**Usage**:
```javascript
const { getText, isArabic } = useTranslation();
const questionText = getText(question); // Returns ar or en version
```

---

## Navigation Flow

### Navigation Stack Hierarchy

```
AppNavigator (Stack Navigator)
│
├─ SplashScreen (Initial)
│   └─ Auto-navigates to Welcome after 2.5s
│
├─ Welcome (WelcomeCarouselScreen)
│   └─ Skip/Get Started → SignIn
│
├─ SignIn (SignInScreen)
│   ├─ Login Success → Check profile completion
│   │   ├─ Incomplete → DynamicOnboarding
│   │   └─ Complete → Main
│   └─ Sign Up → SignUp
│
├─ SignUp (SignUpScreen)
│   └─ Account Created → DynamicOnboarding
│
├─ DynamicOnboarding (DynamicOnboardingScreen)
│   ├─ 23 Questions sequentially
│   └─ Complete → OnboardingReview
│
├─ OnboardingReview (OnboardingReviewScreen)
│   └─ Confirm → Main (with profileCompleted = true)
│
└─ Main (Bottom Tab Navigator)
    ├─ Home Tab (HomeScreen)
    │   └─ Profile Discovery & Matching
    │
    ├─ People Tab (PeopleScreen)
    │   └─ Browse All Users (Placeholder)
    │
    ├─ Chats Tab (ChatsScreen)
    │   └─ Message Conversations (Placeholder)
    │
    └─ Profile Tab (ProfileScreen)
        ├─ View Own Profile
        └─ ProfileDetailScreen (View other users)
```

### Navigation Guards
- **Auth Guard**: Unauthenticated users redirected to Welcome
- **Profile Completion Guard**: Incomplete profiles redirected to Onboarding
- **Tab Access**: Only available after profile completion

---

## Firebase Integration

### Firebase Services Configured

#### 1. Firebase Authentication
**Setup**: `src/config/firebase.js`

**Features**:
- Email/Password authentication
- AsyncStorage persistence for offline support
- Session management via `onAuthStateChanged`

**Error Codes Handled**:
- `auth/invalid-email`: Invalid email format
- `auth/user-not-found`: User doesn't exist
- `auth/wrong-password`: Incorrect password
- `auth/email-already-in-use`: Email taken during signup
- `auth/weak-password`: Password too short (< 6 chars)

#### 2. Cloud Firestore
**Collections**:

**`users` Collection**:
```javascript
{
  uid: "firebase_user_uid",
  email: "user@example.com",
  displayName: "User Name",
  profileCompleted: true,
  profileData: {
    // 23 onboarding fields
    displayName: "Ahmed",
    appLanguage: "ar",
    gender: "male",
    age: 28,
    height: 175,
    weight: 70,
    residenceCountry: { alpha2: "sa", name: "السعودية" },
    nationality: { alpha2: "sa", name: "السعودية" },
    maritalStatus: "single",
    religion: "muslim",
    madhhab: "sunni",
    religiosityLevel: "very_religious",
    // ... all other fields
  },
  createdAt: "2025-10-06T12:00:00.000Z",
  updatedAt: "2025-10-06T12:30:00.000Z"
}
```

**Queries Used**:
- Get opposite gender profiles: `where('profileData.gender', '==', oppositeGender)`
- Get completed profiles only: `where('profileCompleted', '==', true)`
- Pagination: `limit(5)` + `startAfter(lastDoc)`

#### 3. Firebase Storage
**Purpose**: Photo storage for profile pictures

**Structure** (Planned):
```
gs://bucket-name/
└── users/
    └── {uid}/
        ├── photo1.jpg
        ├── photo2.jpg
        └── ...
```

**Upload Process** (To be implemented):
1. User selects photos in PhotoUploadInput
2. Photos compressed/resized client-side
3. Uploaded to `users/{uid}/photoN.jpg`
4. Download URLs saved to profileData.photos array

### Environment Variables
**File**: `.env` (not committed to git)

```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Access**: Via `expo-constants` and `app.json` extra config

**Validation**: `validateFirebaseConfig()` checks all required keys on startup

---

## Onboarding System Explanation

### Architecture

The onboarding system is **data-driven** and **highly configurable**, defined in `src/config/onboardingQuestions.js`.

### Key Design Principles

1. **Data-Driven**: All 23 questions defined in a single configuration array
2. **Dynamic Rendering**: Questions render based on type (text, select, number, country-picker, etc.)
3. **Conditional Logic**: Questions can be shown/hidden based on previous answers
4. **Validation**: Each question has custom validation rules
5. **Bilingual**: All text (questions, options, placeholders) in Arabic/English
6. **Progress Tracking**: User can see progress and navigate back

### Question Types

| Type | Component | Usage Example |
|------|-----------|---------------|
| `text` | TextInput | Display name, work status |
| `number` | NumberInput | Age, height, weight |
| `select` | SelectInput | Gender, religion, education |
| `select-with-description` | SelectWithDescriptionInput | Location services |
| `select-with-conditional` | SelectWithConditionalInput | Marital status (+ children) |
| `multi-select` | MultiSelectInput | Languages spoken |
| `country-picker` | CountryPickerInput | Residence country, nationality |
| `textarea` | TextAreaInput | About me, ideal partner |
| `photo-upload` | PhotoUploadInput | Profile photos |

### Conditional Question Logic

**Example 1: Madhhab question only for Muslims**
```javascript
{
  id: 'madhhab',
  showOnlyIf: (onboardingData) => onboardingData.religion === 'muslim',
  // ...
}
```

**Example 2: Children question for divorced/widowed**
```javascript
{
  id: 'maritalStatus',
  conditionalField: {
    field: 'hasChildren',
    condition: (value) => value === 'divorced' || value === 'widowed',
    // ...
  }
}
```

### Navigation Logic

**Next Question**:
```javascript
export const getNextQuestionId = (currentQuestion, answer, onboardingData) => {
  // 1. Check if current question has custom next logic
  if (currentQuestion.nextQuestion) {
    return currentQuestion.nextQuestion(answer);
  }

  // 2. Find next question that should be shown
  while (nextIndex < TOTAL_QUESTIONS) {
    const nextQuestion = ONBOARDING_QUESTIONS[nextIndex];

    if (nextQuestion.showOnlyIf) {
      if (nextQuestion.showOnlyIf(onboardingData)) {
        return nextQuestion.id; // Show this question
      }
      nextIndex++; // Skip this question
    } else {
      return nextQuestion.id; // Show this question
    }
  }

  return null; // No more questions
};
```

### Validation System

**Per-Question Validation**:
```javascript
{
  id: 'age',
  validation: {
    min: 18,
    max: 100
  }
}
```

**Global Validation** (in DynamicOnboardingScreen):
- Required fields must have values
- Min/max validation for numbers
- Pattern validation for text (e.g., names)
- Multi-select min selection count

**Error Messages**: Bilingual error messages shown below inputs

### Review & Submission

**OnboardingReviewScreen**:
1. Displays all collected data in organized sections
2. User can review and edit any field (navigate back)
3. Confirm button triggers:
   - `onboardingContext.completeOnboarding()`
   - Saves profileData to Firestore
   - Sets profileCompleted = true
   - Navigates to Main app

---

## Styling & Design System

### TailwindCSS Configuration

**File**: `tailwind.config.js`

**Custom Theme Extensions**:

#### Colors (Brand Identity)
- **Primary**: Royal Purple (#4F2396)
- **Accent**: Warm Orange (#F69554)
- **Background**: White (#FFFFFF), Alt (#F8F8FB)
- **Text**: Primary (#1A1A1A), Secondary (#2B2B2B), Muted (#6B7280)
- **Feedback**: Success, Warning, Error, Info

#### Spacing Scale
```javascript
'xs': '4px',
'sm': '8px',
'md': '16px',
'lg': '24px',
'xl': '32px',
'2xl': '48px',
// Custom spacing
'safe-top': '44px',      // iOS status bar
'safe-bottom': '34px',   // iOS home indicator
'header-height': '60px',
'button-height-md': '44px',
'input-height': '52px',
'card-padding': '20px',
'screen-padding': '24px'
```

#### Typography
```javascript
fontSize: {
  'heading-sm': ['20px', '28px'],
  'heading-md': ['24px', '32px'],
  'heading-lg': ['28px', '36px'],
  'heading-xl': ['32px', '40px'],
  'button-md': ['16px', '24px'],
  // ...
}
```

#### Border Radius
```javascript
borderRadius: {
  'button': '12px',
  'input': '12px',
  'card': '16px',
  'modal': '20px'
}
```

### Component Styling Patterns

**Variant System** (Button example):
```javascript
const variantClasses = {
  primary: 'bg-primary text-white',
  secondary: 'bg-accent text-text-primary',
  outline: 'bg-white border border-border text-text-primary',
  ghost: 'bg-transparent text-text-muted'
};
```

**State Management** (Input example):
```javascript
const getContainerClasses = () => {
  if (isFocused) return 'border-primary';
  if (error) return 'border-error';
  if (disabled) return 'bg-background-alt opacity-60';
  return 'border-border';
};
```

### Typography System (Cairo Font)

**Font Family**:
```javascript
FONTS = {
  appName: 'Cairo_700Bold',
  regular: 'Cairo_400Regular',
  semibold: 'Cairo_600SemiBold',
  bold: 'Cairo_700Bold'
}
```

**Usage**:
```javascript
<Text
  variant="h2"
  weight="bold"
  style={{ fontFamily: FONTS.bold }}
>
  ناسبني
</Text>
```

**Benefits**:
- Optimized for Arabic script
- Excellent readability in both languages
- Consistent across iOS/Android

### Animations

**Welcome Carousel** (WelcomeSlide.js):
- Image: Fade in + scale (0.8 → 1.0)
- Title: Fade in + slide up (translateY: 20 → 0)
- Description: Fade in + slide up (delay 150ms)

**Button Animations** (WelcomeNavigation.js):
- Pulse effect on slide change
- Scale: 1 → 0.95 → 1

**Progress Bar**:
- Smooth width animation based on percentage

---

## Development Guidelines

### Running the App

```bash
# Install dependencies
npm install

# Start Expo development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web (limited support)
npm run web
```

### Environment Setup

1. Create `.env` file in project root
2. Add Firebase configuration keys
3. Update `app.json` with environment variables
4. Restart Expo server after .env changes

### Code Structure Best Practices

1. **Component Organization**:
   - Keep components small and focused
   - Export default at the bottom
   - Use named exports for utilities

2. **Context Usage**:
   - Always use `useContext` with error checking
   - Provide meaningful error messages
   - Keep context state minimal

3. **Styling**:
   - Use TailwindCSS classes first
   - Inline styles only for dynamic values
   - Follow naming conventions (variant, size, state)

4. **Bilingual Support**:
   - All user-facing text must have {en, ar} format
   - Use `useTranslation()` hook for text retrieval
   - Test both RTL and LTR layouts

5. **Firebase Operations**:
   - Always wrap in try-catch blocks
   - Provide user-friendly error messages
   - Log errors for debugging

### Testing Checklist

- [ ] Sign up flow works
- [ ] Sign in flow works
- [ ] All 23 onboarding questions render correctly
- [ ] Conditional questions show/hide properly
- [ ] Profile data saves to Firestore
- [ ] Home screen displays profiles
- [ ] Pagination works (load more profiles)
- [ ] Language switching works
- [ ] RTL layout works for Arabic
- [ ] Back button navigation works
- [ ] Input validation shows errors
- [ ] Photos upload (when implemented)

---

## Future Enhancements

### Planned Features

1. **Photo Upload Implementation**:
   - Multi-photo selection
   - Image cropping and compression
   - Firebase Storage integration
   - Photo reordering

2. **Matching Algorithm**:
   - Compatibility score calculation
   - Preference-based filtering
   - Location-based matching
   - Active user prioritization

3. **Chat System**:
   - Real-time messaging (Firebase Realtime Database)
   - Push notifications
   - Message encryption
   - Read receipts

4. **Profile Enhancements**:
   - Profile verification badges
   - Photo verification
   - Video profiles
   - Detailed preference filters

5. **Social Features**:
   - Like/unlike profiles
   - Favorites list
   - Block/report users
   - Match notifications

6. **Premium Features**:
   - Unlimited likes
   - See who liked you
   - Advanced filters
   - Profile boost

7. **Admin Panel**:
   - User management
   - Content moderation
   - Analytics dashboard
   - Report management

---

## Troubleshooting

### Common Issues

**1. Firebase Configuration Error**
```
⚠️ Missing Firebase configuration keys
```
**Solution**: Check `.env` file has all required Firebase keys

**2. Font Not Loading**
```
Font Cairo_700Bold not loaded
```
**Solution**: Ensure `@expo-google-fonts/cairo` is installed and fonts are loaded in App.js

**3. Navigation Not Working**
```
Cannot read property 'navigate' of undefined
```
**Solution**: Ensure screen is wrapped in NavigationContainer and stack navigator

**4. AsyncStorage Error**
```
AsyncStorage is null or undefined
```
**Solution**: Install `@react-native-async-storage/async-storage` and restart Metro

**5. Firestore Permission Denied**
```
Missing or insufficient permissions
```
**Solution**: Check Firebase security rules allow read/write for authenticated users

### Debug Tips

1. **Console Logging**: Check console for Firebase/auth logs
2. **React DevTools**: Inspect component state and props
3. **Network Tab**: Monitor Firestore queries
4. **Expo DevTools**: Use Expo debugger for React Native
5. **Firebase Console**: Check Firestore data directly

---

## Contact & Support

**App Name**: Nasibni (ناسبني)
**Version**: 1.0.0
**Platform**: React Native (iOS/Android)
**License**: Private

For questions or issues, refer to:
- Firebase documentation: https://firebase.google.com/docs
- React Navigation: https://reactnavigation.org
- NativeWind: https://nativewind.dev
- Expo documentation: https://docs.expo.dev

---

**Last Updated**: October 6, 2025
**Document Version**: 1.0.0
