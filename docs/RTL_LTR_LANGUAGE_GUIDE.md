# RTL/LTR and Language System Guide

## Overview

The app now fully supports **both Arabic (RTL) and English (LTR)** with automatic direction switching and comprehensive translations.

## Features

### ✅ What's Implemented

1. **Automatic Language Detection**
   - Detects device language on first launch
   - Saves user preference in AsyncStorage
   - Persists across app restarts

2. **RTL/LTR Support**
   - Arabic: Right-to-Left layout
   - English: Left-to-Right layout
   - Uses React Native's I18nManager
   - Automatic layout mirroring

3. **Language Switching**
   - Settings → Language → Choose Arabic/English
   - Changes apply immediately
   - No app restart required
   - Preference saved permanently

4. **Comprehensive Translations**
   - 100+ translated strings
   - Categories: common, auth, navigation, home, profile, chat, settings, etc.
   - Easy to add more translations

## For Users

### How to Change Language

1. **Open the app**
2. **Go to Profile tab** (bottom right for LTR, bottom left for RTL)
3. **Tap Settings** (⚙️ icon)
4. **Tap "Language" / "اللغة"**
5. **Choose**:
   - **العربية** for Arabic
   - **English** for English
6. **Tap OK** - Changes apply immediately!

### What Changes

When you switch language:
- ✅ **All text** translates instantly
- ✅ **Layout direction** flips (RTL ↔️ LTR)
- ✅ **Icons and buttons** mirror positions
- ✅ **Navigation** respects direction
- ✅ **Preference saved** - stays on app restart

## For Developers

### Using the Translation System

#### 1. Basic Translation Hook

```javascript
import { useTranslation } from '../contexts/TranslationContext';

function MyComponent() {
  const { t, isArabic, isRTL } = useTranslation();
  
  return (
    <View>
      <Text>{t('common.skip')}</Text>  {/* "تخطي" or "Skip" */}
      <Text>{t('settings.language')}</Text>  {/* "اللغة" or "Language" */}
    </View>
  );
}
```

#### 2. Using Language Context

```javascript
import { useLanguage } from '../contexts/LanguageContext';

function MyComponent() {
  const { language, isArabic, isEnglish, isRTL, changeLanguage } = useLanguage();
  
  return (
    <View>
      <Text>Current: {language}</Text>  {/* "ar" or "en" */}
      <Button 
        title={isArabic ? 'English' : 'العربية'}
        onPress={() => changeLanguage(isArabic ? 'en' : 'ar')}
      />
    </View>
  );
}
```

#### 3. Conditional Rendering by Language

```javascript
const { isArabic } = useLanguage();

return (
  <View>
    {isArabic ? (
      <Text>مرحباً</Text>
    ) : (
      <Text>Hello</Text>
    )}
  </View>
);
```

#### 4. RTL/LTR Layout

```javascript
const { isRTL } = useLanguage();

return (
  <View style={{
    flexDirection: isRTL ? 'row-reverse' : 'row'
  }}>
    <Image source={logo} />
    <Text>App Name</Text>
  </View>
);
```

#### 5. Conditional Margins/Padding

```javascript
const { isRTL } = useLanguage();

return (
  <View style={{
    marginRight: isRTL ? 16 : 0,
    marginLeft: isRTL ? 0 : 16
  }}>
    <Text>Content</Text>
  </View>
);
```

### Adding New Translations

1. **Open** `src/contexts/translations.json`
2. **Add your key** in the appropriate category:

```json
{
  "myCategory": {
    "myKey": {
      "ar": "النص بالعربية",
      "en": "Text in English"
    }
  }
}
```

3. **Use it in your component**:

```javascript
const { t } = useTranslation();

<Text>{t('myCategory.myKey')}</Text>
```

### Translation Categories

Available categories in `translations.json`:

- **common** - Skip, Next, Cancel, OK, etc.
- **app** - App name, tagline, description
- **auth** - Sign in, sign up, passwords, etc.
- **welcome** - Welcome slides, introductions
- **navigation** - Tab names, screen titles
- **home** - Discover, profiles, etc.
- **profile** - Profile fields, actions
- **chat** - Messages, typing, etc.
- **people** - Likes, views, etc.
- **settings** - Settings options
- **actions** - Like, block, report, etc.
- **messages** - Success/error messages
- **errors** - Error messages
- **onboarding** - Onboarding steps

### Helper Functions

#### getText()
Extracts text from bilingual objects:
```javascript
const { getText } = useTranslation();

const bilingualObject = { ar: 'مرحباً', en: 'Hello' };
const text = getText(bilingualObject);  // Returns based on current language
```

#### getLabel()
Gets label from option objects:
```javascript
const { getLabel } = useTranslation();

const option = { 
  value: 'male', 
  label: { ar: 'ذكر', en: 'Male' } 
};
const label = getLabel(option);  // Returns "ذكر" or "Male"
```

#### common Object
Direct access to common translations:
```javascript
const { common } = useTranslation();

<Text>{common.skip}</Text>  // "تخطي" or "Skip"
<Text>{common.next}</Text>  // "التالي" or "Next"
```

## Technical Implementation

### Language Context
Location: `src/contexts/LanguageContext.js`

**Features:**
- AsyncStorage persistence
- Device language detection
- I18nManager RTL/LTR control
- Language change handler

**State:**
- `language`: Current language code ('ar' or 'en')
- `isArabic`: Boolean
- `isEnglish`: Boolean
- `isRTL`: Boolean (same as isArabic)
- `isLoading`: Boolean
- `changeLanguage(lang)`: Function

### Translation Context
Location: `src/contexts/TranslationContext.js`

**Features:**
- Nested key support ("common.skip")
- Helper functions for text extraction
- Direct common translations access

**Methods:**
- `t(key)`: Main translation function
- `getText(obj)`: Extract from bilingual object
- `getLabel(option)`: Get option label
- `getPlaceholder(text, fallback)`: Get placeholder text
- `common`: Object with common translations

### Translations File
Location: `src/contexts/translations.json`

**Structure:**
```json
{
  "category": {
    "key": {
      "ar": "Arabic text",
      "en": "English text"
    }
  }
}
```

## RTL Layout Rules

### What Gets Mirrored

✅ **Automatically Mirrored:**
- `flexDirection: 'row'` becomes `'row-reverse'`
- `marginLeft` ↔️ `marginRight`
- `paddingLeft` ↔️ `paddingRight`
- `left` ↔️ `right`
- Text alignment

❌ **Not Mirrored:**
- `flexDirection: 'column'`
- Top/bottom spacing
- Border radius
- Absolute positioning (unless using left/right)

### Best Practices

#### ✅ DO:

```javascript
// Use conditional flexDirection
flexDirection: isRTL ? 'row-reverse' : 'row'

// Use conditional margins
marginRight: isRTL ? 16 : 0,
marginLeft: isRTL ? 0 : 16

// Use textAlign with direction
textAlign: isRTL ? 'right' : 'left'

// Check direction for animations
const slideDirection = isRTL ? 150 : -150;
```

#### ❌ DON'T:

```javascript
// Don't hardcode direction
flexDirection: 'row-reverse'  // Bad! Works only for Arabic

// Don't use absolute left/right without checking direction
style={{ position: 'absolute', right: 0 }}  // Bad! Wrong in LTR

// Don't assume text direction
textAlign: 'right'  // Bad! Always right, even in English
```

## Testing

### Test Checklist

When adding new features, test:

- [ ] Text displays correctly in both languages
- [ ] Layout respects RTL/LTR direction
- [ ] Icons and images position correctly
- [ ] Animations go in the right direction
- [ ] Margins and padding look good
- [ ] Navigation flows naturally
- [ ] Language switch works immediately
- [ ] Preference persists after app restart

### How to Test

1. **Open app** - Should detect your device language
2. **Switch to Arabic** - Everything RTL
3. **Switch to English** - Everything LTR
4. **Close app** - Kill completely
5. **Reopen app** - Should remember your choice
6. **Navigate screens** - Check all layouts
7. **Test forms** - Check input fields
8. **Test animations** - Check slide directions

## Examples

### Example 1: Simple Button

```javascript
import { useTranslation } from '../contexts/TranslationContext';

function MyButton() {
  const { t } = useTranslation();
  
  return (
    <TouchableOpacity>
      <Text>{t('common.save')}</Text>  {/* "حفظ" or "Save" */}
    </TouchableOpacity>
  );
}
```

### Example 2: Conditional Layout

```javascript
import { useLanguage } from '../contexts/LanguageContext';

function Header() {
  const { isRTL, isArabic } = useLanguage();
  
  return (
    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
      <Image source={logo} />
      <Text>{isArabic ? 'ناسبني' : 'Nasibni'}</Text>
    </View>
  );
}
```

### Example 3: Form with Translation

```javascript
import { useTranslation } from '../contexts/TranslationContext';

function LoginForm() {
  const { t, isRTL } = useTranslation();
  
  return (
    <View>
      <TextInput 
        placeholder={t('auth.email')}
        textAlign={isRTL ? 'right' : 'left'}
      />
      <TextInput 
        placeholder={t('auth.password')}
        textAlign={isRTL ? 'right' : 'left'}
        secureTextEntry
      />
      <Button title={t('auth.signIn')} />
    </View>
  );
}
```

## Troubleshooting

### Layout Broken After Language Switch

**Fix:** Make sure you're using conditional flexDirection:
```javascript
flexDirection: isRTL ? 'row-reverse' : 'row'
```

### Text Not Translating

**Fix:** Check translation key exists in `translations.json`:
```javascript
// Make sure key exists
console.log(t('your.key'));  // Should not return the key itself
```

### Preference Not Saving

**Fix:** Language context handles this automatically. If issues:
```javascript
// Check AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
const lang = await AsyncStorage.getItem('@app_language');
console.log('Saved language:', lang);
```

### RTL Not Applying

**Fix:** I18nManager is set automatically. To verify:
```javascript
import { I18nManager } from 'react-native';
console.log('Is RTL:', I18nManager.isRTL);
```

## Summary

✅ **Full RTL/LTR support**
✅ **Automatic language detection**
✅ **Persistent preferences**  
✅ **100+ translations**
✅ **Easy to use hooks**
✅ **Immediate switching**
✅ **No app restart needed**

Your app now provides a seamless experience for both Arabic and English users!



