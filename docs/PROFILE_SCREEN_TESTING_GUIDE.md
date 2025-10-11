# 🧪 ProfileScreen Testing Guide

**Purpose:** Verify all translation fixes and new fields display correctly  
**Date:** 2025-10-09  
**File:** `src/screens/main/Profile/ProfileScreen.js`

---

## 📋 PRE-TESTING CHECKLIST

### ✅ Before You Start:
1. [ ] App is running on emulator/device
2. [ ] You have a test user account with complete profile data
3. [ ] Test user has completed all 27 onboarding questions
4. [ ] You can switch between Arabic and English in Settings

---

## 🎯 TESTING SCENARIOS

### Test 1: Field Display - Personal Information
**Navigate to:** Profile Tab

**Check these fields appear:**
- [ ] Gender (Arabic: ذكر/أنثى, English: Male/Female)
- [ ] Age (with proper unit: سنة/years)
- [ ] Height (with proper unit: سم/cm)
- [ ] Weight (with proper unit: كجم/kg)
- [ ] **NEW:** Skin Tone (if user has this data)
  - Check translation: white = أبيض/White
  - Check translation: wheat = قمحي/Wheat
- [ ] **NEW:** Tribe Affiliation (if user has this data)
  - Check boolean: نعم/Yes or لا/No

**Expected Icons:**
- person-outline (Gender)
- calendar-outline (Age)
- resize-outline (Height)
- fitness-outline (Weight)
- color-palette-outline (Skin Tone)
- people-outline (Tribe Affiliation)

---

### Test 2: Field Display - Marital & Family
**Navigate to:** Profile Tab → Scroll to "Marital & Family" section

**Check these fields appear:**
- [ ] Marital Status
  - Test translation: single = أعزب/Single
  - Test translation: divorced_with_children = مطلق مع أطفال/Divorced with children
- [ ] Has Children
  - Check boolean: نعم/Yes or لا/No
- [ ] **FIXED:** Children Timing (replaces "Kids Preference")
  - Check field label: وقت الإنجاب/Children Timing
  - Test translation: asap = في أقرب وقت/As soon as possible
  - Test translation: after_two_years = بعد سنتين على الأقل/After at least two years
  - Test translation: no_children = لا أريد الإنجاب/I don't want children

**Expected Icons:**
- heart-outline (Marital Status)
- people-outline (Has Children)
- time-outline (Children Timing)

**⚠️ Common Issues:**
- If "Kids Preference" still shows → Field name wasn't updated
- If Arabic shows English text → Translation missing

---

### Test 3: Field Display - Prayer Habit (UPDATED)
**Navigate to:** Profile Tab → Scroll to "Religion & Practice" section

**Check Prayer Habit field:**
- [ ] Field displays correctly
- [ ] Test NEW translations:
  - daily = يوميًا/Daily
  - weekly = أسبوعيًا/Weekly
  - sometimes = أحيانًا/Sometimes
  - religious_occasions = في المناسبات الدينية/On religious occasions
  - never = أبدًا/Never

**⚠️ Common Issues:**
- If you see "always", "mostly", "rarely" → Old translations still in use

---

### Test 4: Multi-Select - Marriage Types (CRITICAL)
**Navigate to:** Profile Tab → Scroll to "Marriage Preferences" section

**Check Marriage Types field:**
- [ ] Field label: أنواع الزواج المقبولة/Accepted Marriage Types
- [ ] Multiple values display with `•` separator
- [ ] Test translations:
  - traditional = عادي/Traditional
  - civil = مدني (غير ديني)/Civil (non-religious)
  - polygamy = تعدد/Polygamy
  - misyar = مسيار/Misyar
  - doesnt_matter = لا يهمني/Doesn't matter

**Expected Display Examples:**
- Arabic: `عادي • مسيار • تعدد`
- English: `Traditional • Misyar • Polygamy`

**⚠️ Common Issues:**
- Only one value shows → Still using single-select
- No separator → Not using `translateArray()`
- Field label says "Marriage Type" (singular) → Not updated

---

### Test 5: Multi-Select - Health Status (NEW)
**Navigate to:** Profile Tab → Scroll to find "Health & Wellness" section

**Check Health Status field:**
- [ ] Section appears if user has `healthStatus` data
- [ ] Section title: الصحة/Health & Wellness
- [ ] Multiple values display with `•` separator
- [ ] Test translations:
  - chronic_illness = أعاني من مرض مزمن/Chronic illness
  - special_needs = من ذوي الاحتياجات الخاصة/Special needs
  - infertile = عقيم/Infertile
  - good_health = بصحة جيدة/Good health

**Expected Icon:** medkit-outline

**⚠️ Common Issues:**
- Section doesn't appear → User data missing `healthStatus` field
- Single value only → Not using `translateArray()`

---

### Test 6: NEW Section - Financial Information
**Navigate to:** Profile Tab → Scroll between "Education & Work" and "Marriage Preferences"

**Check Financial Information section:**
- [ ] Section appears if user has `incomeLevel` data
- [ ] Section title: المعلومات المالية/Financial Information
- [ ] Income Level field displays
- [ ] Test translations:
  - high = مرتفع/High
  - medium = متوسط/Medium
  - low = منخفض/Low
  - no_income = لا دخل مادي/No income

**Expected Icon:** wallet-outline

**⚠️ Common Issues:**
- Section doesn't appear → User data missing `incomeLevel` field
- Section in wrong order → Check section numbering

---

### Test 7: NEW Fields - Marriage Preferences
**Navigate to:** Profile Tab → Scroll to "Marriage Preferences" section

**Check these NEW fields appear:**
1. [ ] **Residence After Marriage**
   - Field label: مكان السكن بعد الزواج/Residence After Marriage
   - Test translations:
     - own_home = في منزلي الخاص/My own home
     - parents_home = في منزل أهلي/With my parents
     - undecided = لم أقرر بعد/Undecided
   - Expected icon: home-outline

2. [ ] **Allow Wife Work/Study**
   - Field label: عمل أو دراسة الزوجة/Wife Work/Study
   - Test translations:
     - yes = نعم/Yes
     - yes_from_home = نعم، ولكن من المنزل/Yes, but from home
     - depends = حسب الظروف/Depends
     - no = لا/No
   - Expected icon: briefcase-outline

**⚠️ Common Issues:**
- Fields don't appear → User data missing
- Wrong section → Should be in "Marriage Preferences" (Section #8)

---

### Test 8: Multi-Select - Chat Languages (EXPANDED)
**Navigate to:** Profile Tab → Scroll to "Lifestyle" section

**Check Chat Languages field:**
- [ ] Multiple values display with `•` separator
- [ ] Test translations (especially NEW ones):
  - arabic = العربية/Arabic
  - english = الإنجليزية/English
  - **NEW:** indonesian = الإندونيسية/Indonesian
  - **NEW:** malay = الماليزية/Malay
  - turkish = التركية/Turkish
  - urdu = الأردية/Urdu
  - french = الفرنسية/French
  - spanish = الإسبانية/Spanish

**Expected Display Example:**
- Arabic: `العربية • الإنجليزية • الفرنسية`
- English: `Arabic • English • French`

**⚠️ Common Issues:**
- Indonesian/Malay don't show → User data might not include them yet

---

### Test 9: Updated Marriage Plan (FIXED)
**Navigate to:** Profile Tab → Scroll to "Marriage Preferences" section

**Check Marriage Plan field:**
- [ ] Test UPDATED translations:
  - asap = في أقرب وقت ممكن/As soon as possible
  - need_time = أحتاج لبعض الوقت/I need some time
  - no_hurry = لست في عجلة من أمري/I'm not in a hurry

**⚠️ Common Issues:**
- Old options like "within_year", "few_years" → User data not updated yet

---

### Test 10: Section Organization
**Navigate to:** Profile Tab → Scroll through entire profile

**Check section order:**
1. [ ] Profile Header (photo, name, age, email)
2. [ ] About Me (if exists)
3. [ ] Ideal Partner (if exists)
4. [ ] Section 1: Personal Information
5. [ ] Section 2: Location & Nationality
6. [ ] Section 3: Marital & Family
7. [ ] Section 4: Religion & Practice
8. [ ] Section 5: Education & Work
9. [ ] **Section 6: Financial Information** (NEW - conditional)
10. [ ] **Section 7: Health & Wellness** (NEW - conditional)
11. [ ] **Section 8: Marriage Preferences** (was Section 6)
12. [ ] **Section 9: Lifestyle** (was Section 7)

**⚠️ Common Issues:**
- Section numbers wrong → Renumbering not complete
- New sections in wrong place → Check code line numbers

---

## 🔄 LANGUAGE SWITCHING TEST

### Test 11: Arabic ↔ English Toggle
**Steps:**
1. [ ] Start in English
2. [ ] Check all field labels are in English
3. [ ] Check all field values are in English
4. [ ] Navigate to Settings
5. [ ] Switch language to Arabic
6. [ ] Return to Profile Tab
7. [ ] Check all field labels are in Arabic
8. [ ] Check all field values are in Arabic
9. [ ] Check multi-select separators display correctly (`•`)
10. [ ] Check RTL alignment for Arabic text

**Expected Behavior:**
- All text switches instantly
- No English text remains in Arabic mode
- No Arabic text remains in English mode
- No "undefined" or "[object Object]" values

**⚠️ Common Issues:**
- Some fields still in English → Translation missing
- Mixed language display → Context not updating
- Console shows "⚠️ Missing translation" → Check translation object

---

## 🐛 DEBUGGING TESTS

### Test 12: Console Logging
**Open:** Developer Console

**Check for warnings:**
- [ ] No `⚠️ Missing translation for [field]: [value]` warnings
- [ ] If warnings appear, note which fields/values are missing

**Expected Console Output:**
- Clean console (no translation warnings)
- If user data incomplete, some fields won't display (expected behavior)

---

### Test 13: Missing Data Test
**Create a test user with INCOMPLETE profile data:**

**Check behavior:**
- [ ] Fields with no data don't display
- [ ] Sections with no data don't display
- [ ] No crashes or errors
- [ ] No empty sections
- [ ] No "null" or "undefined" text displayed

**Expected Behavior:**
- Profile shows only populated fields
- Empty sections hidden (Financial, Health)
- Graceful degradation for missing data

---

## 📊 FIELD COVERAGE CHECKLIST

### All Onboarding Fields (27 total)

#### ✅ Basic Info (4 fields)
- [x] Display Name (shown in header)
- [x] Gender
- [x] Age
- [ ] App Language (Settings only, not profile)

#### ✅ Physical Attributes (3 fields)
- [x] Height
- [x] Weight
- [x] **Skin Tone** (NEW)

#### ✅ Location (4 fields)
- [x] Residence Country
- [x] Residence City
- [x] Nationality
- [ ] Enable Location Services (Setting only)

#### ✅ Marital/Family (3 fields)
- [x] Marital Status
- [x] Has Children
- [x] **Children Timing** (FIXED)

#### ✅ Religion (4 fields)
- [x] Religion
- [x] Madhhab
- [x] Religiosity Level
- [x] Prayer Habit (FIXED translations)

#### ✅ Education/Work (2 fields)
- [x] Education Level
- [x] Work Status

#### ✅ Financial (1 field)
- [x] **Income Level** (NEW)

#### ✅ Health (1 field)
- [x] **Health Status** (NEW)

#### ✅ Marriage Preferences (4 fields)
- [x] **Marriage Types** (FIXED multi-select)
- [x] Marriage Plan (FIXED translations)
- [x] **Residence After Marriage** (NEW)
- [x] **Allow Wife Work/Study** (NEW)

#### ✅ Lifestyle (3 fields)
- [x] Chat Languages (EXPANDED)
- [x] Smoking
- [x] **Tribe Affiliation** (NEW)

#### ✅ Text Fields (2 fields)
- [x] About Me
- [x] Ideal Partner

#### ❌ Photos (Deferred)
- [ ] Photos (1-6) - Only first photo shown in header
- [ ] Photo gallery - Not implemented (per user request)

---

## 🎯 PASS/FAIL CRITERIA

### ✅ PASS if:
- All 27 fields display correctly (except photo gallery)
- All Arabic translations correct
- All English translations correct
- Multi-select fields show multiple values with `•` separator
- New sections appear in correct order
- Language switching works perfectly
- No console warnings about missing translations
- No crashes or errors

### ❌ FAIL if:
- Any field shows English in Arabic mode
- Any field shows "undefined" or "[object Object]"
- Console shows translation warnings
- Multi-select fields show only one value
- "Kids Preference" still appears (should be "Children Timing")
- "Marriage Type" singular (should be "Marriage Types" plural)
- New sections missing or in wrong order
- App crashes when viewing profile

---

## 📝 BUG REPORT TEMPLATE

If you find issues, report them like this:

```markdown
## Bug: [Short description]

**Field:** [Field name]
**Section:** [Section name]
**Language:** Arabic / English
**Expected:** [What should happen]
**Actual:** [What actually happened]
**Screenshot:** [If possible]
**Console Output:** [Any errors/warnings]

**Steps to Reproduce:**
1. Open Profile Tab
2. Scroll to [Section]
3. Observe [Field]

**User Data:**
`profileData.[fieldName]` = [value]
```

---

## 🏁 TESTING COMPLETION

### Summary Checklist
- [ ] All 13 tests completed
- [ ] All fields display correctly in Arabic
- [ ] All fields display correctly in English
- [ ] Multi-select fields working
- [ ] New sections displaying
- [ ] No console errors
- [ ] No translation warnings
- [ ] Language switching works
- [ ] Missing data handled gracefully

### If All Tests Pass:
**✅ ProfileScreen fixes verified and ready for production!**

### If Tests Fail:
- Review error messages
- Check console warnings
- Compare with `PROFILE_SCREEN_FIXES_COMPLETE.md`
- Submit bug report
- Request fixes

---

**Testing Time:** ~30-45 minutes for complete verification  
**Complexity:** Medium (requires test user with complete data)  
**Priority:** HIGH (critical for user experience)


