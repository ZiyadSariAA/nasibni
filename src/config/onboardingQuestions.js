/**
 * Nasibni Onboarding Questions Configuration
 *
 * Updated configuration with 27 fields from UI mockups.
 * Primary color: #4F2396
 * Arabic labels are canonical; English labels included for i18n.
 */

import CountryDataService from '../services/CountryDataService';
import { Ionicons } from '@expo/vector-icons';

// Helper function to get countries list
const getCountriesList = () => {
  return CountryDataService.getPopularCountries('ar').map(country => ({
    id: country.alpha2,
    label: country.label
  }));
};

export const ONBOARDING_QUESTIONS = [
  // Question 1: Display Name
  {
    id: 'displayName',
    type: 'text',
    field: 'displayName',
    question: {
      ar: 'ما اسمك؟',
      en: 'Display Name'
    },
    placeholder: {
      ar: 'أدخل اسمك',
      en: 'Enter your name'
    },
    maxLength: 14,
    required: true,
    validation: {
      minLength: 3,
      maxLength: 14,
      maxDigits: 5, // digits < 5 total
      pattern: /^[a-zA-Z\u0600-\u06FF0-9]+$/, // no spaces or symbols
      message: {
        ar: 'الاسم يجب أن يكون من 3-14 حرفًا، بدون مسافات أو رموز، وأقل من 5 أرقام',
        en: 'Name must be 3-14 characters, no spaces/symbols, less than 5 digits'
      }
    },
    showBack: false
  },

  // Question 2: Gender
  {
    id: 'gender',
    type: 'select',
    field: 'gender',
    question: {
      ar: 'ما هو جنسك؟',
      en: 'Gender'
    },
    options: [
      { id: 'male', label: { ar: 'رجل', en: 'Male' } },
      { id: 'female', label: { ar: 'امرأة', en: 'Female' } }
    ],
    required: true,
    showBack: true
  },

  // Question 3: Age
  {
    id: 'age',
    type: 'number',
    field: 'age',
    question: {
      ar: 'كم تبلغ من العمر؟',
      en: 'Age'
    },
    placeholder: {
      ar: 'أدخل عمرك',
      en: 'Enter your age'
    },
    maxLength: 2,
    keyboardType: 'number-pad',
    validation: {
      min: 18,
      max: 77
    },
    required: true
  },

  // Question 4: Weight
  {
    id: 'weight',
    type: 'number',
    field: 'weight',
    question: {
      ar: 'كم وزنك؟',
      en: 'Weight (kg)'
    },
    placeholder: {
      ar: 'أدخل وزنك بالكيلوجرام',
      en: 'Enter your weight in kg'
    },
    maxLength: 3,
    keyboardType: 'number-pad',
    validation: {
      min: 30,
      max: 119
    },
    required: true
  },

  // Question 5: Height
  {
    id: 'height',
    type: 'number',
    field: 'height',
    question: {
      ar: 'كم طولك؟',
      en: 'Height (cm)'
    },
    placeholder: {
      ar: 'أدخل طولك بالسنتيمتر',
      en: 'Enter your height in cm'
    },
    maxLength: 3,
    keyboardType: 'number-pad',
    validation: {
      min: 120,
      max: 199
    },
    required: true
  },

  // Question 6: Education Level
  {
    id: 'education',
    type: 'select',
    field: 'educationLevel',
    question: {
      ar: 'ما هو مستواك العلمي؟',
      en: 'Education Level'
    },
    options: [
      { id: 'below_high_school', label: { ar: 'أقل من الثانوية العامة', en: 'Below High School' } },
      { id: 'diploma', label: { ar: 'تعليم متوسط/معهد', en: 'Diploma/Institute' } },
      { id: 'bachelors', label: { ar: 'شهادة جامعية', en: "Bachelor's" } },
      { id: 'masters', label: { ar: 'ماجستير', en: "Master's" } },
      { id: 'phd', label: { ar: 'دكتوراه', en: 'PhD' } }
    ],
    required: true
  },

  // Question 7: Work Status
  {
    id: 'work',
    type: 'select',
    field: 'workStatus',
    question: {
      ar: 'ما هي درجتك الوظيفية؟',
      en: 'Work Status'
    },
    options: [
      { id: 'employee', label: { ar: 'موظف', en: 'Employee' } },
      { id: 'senior_employee', label: { ar: 'موظف برتبة عالية', en: 'Senior Employee' } },
      { id: 'manager', label: { ar: 'مدير', en: 'Manager' } },
      { id: 'unemployed', label: { ar: 'عاطل عن العمل', en: 'Unemployed' } },
      { id: 'retired', label: { ar: 'متقاعد', en: 'Retired' } },
      { id: 'prefer_not_say', label: { ar: 'أفضل عدم الإجابة', en: 'Prefer not to say' } }
    ],
    required: true
  },

  // Question 8: Enable Location (Optional)
  {
    id: 'location',
    type: 'select',
    field: 'enableLocation',
    question: {
      ar: 'موقع الـGPS يستخدم فقط للحصول على ملفات تطابق قريبة',
      en: 'Enable GPS Location'
    },
    helpText: {
      ar: 'الموقع يساعد في العثور على أشخاص قريبين منك',
      en: 'Location helps find people near you'
    },
    options: [
      { id: true, label: { ar: 'تمكين الـGPS (ينصح بشدة)', en: 'Enable GPS (recommended)' } },
      { id: false, label: { ar: 'لاحقًا', en: 'Later' } }
    ],
    required: false,
    isOptional: true,
    defaultValue: false
  },

  // Question 9: Nationality
  {
    id: 'nationality',
    type: 'country-picker',
    field: 'nationality',
    question: {
      ar: 'ما هي جنسيتك؟',
      en: 'Nationality'
    },
    placeholder: {
      ar: 'اختر الجنسية',
      en: 'Select nationality'
    },
    required: true,
    getOptions: () => getCountriesList()
  },

  // Question 10: Residence Country
  {
    id: 'residenceCountry',
    type: 'country-picker',
    field: 'residenceCountry',
    question: {
      ar: 'ما هو بلد إقامتك؟',
      en: 'Country of Residence'
    },
    placeholder: {
      ar: 'اختر البلد',
      en: 'Select country'
    },
    required: true,
    getOptions: () => getCountriesList()
  },

  // Question 11: Religion
  {
    id: 'religion',
    type: 'select',
    field: 'religion',
    question: {
      ar: 'ما دينك؟',
      en: 'Religion'
    },
    options: [
      { id: 'muslim', label: { ar: 'مسلم', en: 'Muslim' } },
      { id: 'muslim_sunni', label: { ar: 'مسلم سني', en: 'Muslim Sunni' } },
      { id: 'muslim_shia', label: { ar: 'مسلم شيعي', en: 'Muslim Shia' } },
      { id: 'other', label: { ar: 'دين آخر', en: 'Other Religion' } }
    ],
    required: true
  },

  // Question 12: Prayer Habit (Optional)
  {
    id: 'prayer',
    type: 'select',
    field: 'prayerHabit',
    question: {
      ar: 'متى تصلي؟',
      en: 'Prayer Habit'
    },
    options: [
      { id: 'daily', label: { ar: 'يوميًا', en: 'Daily' } },
      { id: 'weekly', label: { ar: 'أسبوعيًا', en: 'Weekly' } },
      { id: 'sometimes', label: { ar: 'أحيانًا', en: 'Sometimes' } },
      { id: 'religious_occasions', label: { ar: 'في المناسبات الدينية', en: 'On religious occasions' } },
      { id: 'never', label: { ar: 'أبدًا', en: 'Never' } }
    ],
    required: false,
    isOptional: true
  },

  // Question 13: Marital Status
  {
    id: 'maritalStatus',
    type: 'select',
    field: 'maritalStatus',
    question: {
      ar: 'ما هي حالتك الاجتماعية؟',
      en: 'Marital Status'
    },
    options: [
      { id: 'single', label: { ar: 'أعزب', en: 'Single' } },
      { id: 'divorced_no_children', label: { ar: 'مطلق من دون أطفال', en: 'Divorced without children' } },
      { id: 'divorced_with_children', label: { ar: 'مطلق مع أطفال', en: 'Divorced with children' } },
      { id: 'widowed_no_children', label: { ar: 'أرمل من دون أطفال', en: 'Widowed without children' } },
      { id: 'widowed_with_children', label: { ar: 'أرمل مع أطفال', en: 'Widowed with children' } },
      { id: 'married', label: { ar: 'متزوج', en: 'Married' } }
    ],
    required: true
  },

  // Question 14: Marriage Types You Accept (Multi-select, max 3)
  {
    id: 'marriageTypes',
    type: 'multi-select',
    field: 'marriageTypes',
    question: {
      ar: 'أنواع الزواج التي أقبل بها',
      en: 'Marriage Types You Accept'
    },
    subtitle: {
      ar: '(اختر حتى 3 خيارات)',
      en: '(Select up to 3)'
    },
    options: [
      { id: 'traditional', label: { ar: 'عادي', en: 'Traditional' } },
      { id: 'civil', label: { ar: 'مدني (غير ديني)', en: 'Civil (non-religious)' } },
      { id: 'polygamy', label: { ar: 'تعدد', en: 'Polygamy' } },
      { id: 'misyar', label: { ar: 'مسيار', en: 'Misyar' } },
      { id: 'doesnt_matter', label: { ar: 'لا يهمني', en: "Doesn't matter" } }
    ],
    required: true,
    minSelection: 1,
    maxSelection: 3
  },

  // Question 15: Marriage Plan
  {
    id: 'marriagePlan',
    type: 'select',
    field: 'marriagePlan',
    question: {
      ar: 'متى تخطط أن تتزوج؟',
      en: 'Marriage Plan'
    },
    options: [
      { id: 'asap', label: { ar: 'أرغب بالزواج بأسرع ما يمكن', en: 'As soon as possible' } },
      { id: 'need_time', label: { ar: 'أحتاج لبعض الوقت', en: 'I need some time' } },
      { id: 'no_hurry', label: { ar: 'لست في عجلة من أمري', en: "I'm not in a hurry" } }
    ],
    required: true
  },

  // Question 16: Residence After Marriage
  {
    id: 'residenceAfterMarriage',
    type: 'select',
    field: 'residenceAfterMarriage',
    question: {
      ar: 'أين تخطط أن تسكن بعد الزواج؟',
      en: 'Residence After Marriage'
    },
    options: [
      { id: 'own_home', label: { ar: 'في منزلي الخاص', en: 'My own home' } },
      { id: 'parents_home', label: { ar: 'في منزل أهلي', en: 'With my parents' } },
      { id: 'parents_temporary', label: { ar: 'في منزل أهلي مؤقتًا', en: 'With my parents (temporary)' } },
      { id: 'undecided', label: { ar: 'لم أقرر بعد', en: 'Undecided' } }
    ],
    required: true
  },

  // Question 17: Smoking (Optional)
  {
    id: 'smoking',
    type: 'select',
    field: 'smoking',
    question: {
      ar: 'هل تدخن؟',
      en: 'Smoking'
    },
    options: [
      { id: 'yes', label: { ar: 'نعم', en: 'Yes' } },
      { id: 'sometimes', label: { ar: 'أحيانًا', en: 'Sometimes' } },
      { id: 'no', label: { ar: 'لا', en: 'No' } }
    ],
    required: false,
    isOptional: true
  },

  // Question 18: Tribe Affiliation (Optional)
  {
    id: 'tribe',
    type: 'select',
    field: 'tribeAffiliation',
    question: {
      ar: 'هل تنتمي إلى قبيلة؟',
      en: 'Do you belong to a tribe?'
    },
    options: [
      { id: 'yes', label: { ar: 'نعم', en: 'Yes' } },
      { id: 'no', label: { ar: 'لا', en: 'No' } }
    ],
    required: false,
    isOptional: true
  },

  // Question 19: Skin Tone
  {
    id: 'skinTone',
    type: 'select',
    field: 'skinTone',
    question: {
      ar: 'ما لون بشرتك؟',
      en: 'Skin Tone'
    },
    options: [
      { id: 'white', label: { ar: 'أبيض', en: 'White' } },
      { id: 'light_wheat', label: { ar: 'قمحي فاتح', en: 'Light Wheat' } },
      { id: 'wheat', label: { ar: 'قمحي', en: 'Wheat' } },
      { id: 'bronze', label: { ar: 'برونزي', en: 'Bronze' } },
      { id: 'light_brown', label: { ar: 'أسمر فاتح', en: 'Light Brown' } },
      { id: 'dark_brown', label: { ar: 'أسمر غامق', en: 'Dark Brown' } }
    ],
    required: true
  },

  // Question 20: Chat Languages (Multi-select, max 3)
  {
    id: 'languages',
    type: 'multi-select',
    field: 'chatLanguages',
    question: {
      ar: 'في الدردشة أفضل استخدام اللغة',
      en: 'Preferred Chat Languages'
    },
    subtitle: {
      ar: '(اختر حتى 3 لغات)',
      en: '(Select up to 3 languages)'
    },
    options: [
      { id: 'arabic', label: { ar: 'العربية', en: 'Arabic' } },
      { id: 'english', label: { ar: 'الإنجليزية', en: 'English' } },
      { id: 'french', label: { ar: 'الفرنسية', en: 'French' } },
      { id: 'spanish', label: { ar: 'الإسبانية', en: 'Spanish' } },
      { id: 'turkish', label: { ar: 'التركية', en: 'Turkish' } },
      { id: 'indonesian', label: { ar: 'الإندونيسية', en: 'Indonesian' } },
      { id: 'urdu', label: { ar: 'الأردية', en: 'Urdu' } },
      { id: 'malay', label: { ar: 'الماليزية', en: 'Malay' } }
    ],
    required: true,
    minSelection: 1,
    maxSelection: 3
  },

  // Question 21: Income Level
  {
    id: 'income',
    type: 'select',
    field: 'incomeLevel',
    question: {
      ar: 'ما مستوى دخلك المادي؟',
      en: 'Income Level'
    },
    options: [
      { id: 'high', label: { ar: 'مرتفع', en: 'High' } },
      { id: 'medium', label: { ar: 'متوسط', en: 'Medium' } },
      { id: 'low', label: { ar: 'منخفض', en: 'Low' } },
      { id: 'no_income', label: { ar: 'لا دخل مادي', en: 'No income' } }
    ],
    required: true
  },

  // Question 22: Children Timing Preference
  {
    id: 'childrenTiming',
    type: 'select',
    field: 'childrenTiming',
    question: {
      ar: 'بالنسبة للإنجاب بعد الزواج',
      en: 'Children (Timing)'
    },
    options: [
      { id: 'asap', label: { ar: 'في أقرب وقت', en: 'As soon as possible' } },
      { id: 'after_two_years', label: { ar: 'بعد سنتين على الأقل', en: 'After at least two years' } },
      { id: 'depends', label: { ar: 'حسب الظروف', en: 'Depends on circumstances' } },
      { id: 'no_children', label: { ar: 'لا أريد الإنجاب', en: "I don't want children" } }
    ],
    required: true
  },

  // Question 23: Allow Wife to Work/Study (Men only)
  {
    id: 'wifeWorkStudy',
    type: 'select',
    field: 'allowWifeWorkStudy',
    question: {
      ar: 'هل تسمح لزوجتك بالعمل أو الدراسة؟',
      en: 'Allow Wife to Work/Study?'
    },
    options: [
      { id: 'yes', label: { ar: 'نعم', en: 'Yes' } },
      { id: 'yes_from_home', label: { ar: 'نعم، ولكن من المنزل', en: 'Yes, but from home' } },
      { id: 'depends', label: { ar: 'حسب الظروف', en: 'Depends' } },
      { id: 'no', label: { ar: 'لا', en: 'No' } }
    ],
    required: true,
    showOnlyIf: (onboardingData) => onboardingData.gender === 'male'
  },

  // Question 24: Health Status (Multi-select, max 2)
  {
    id: 'health',
    type: 'multi-select',
    field: 'healthStatus',
    question: {
      ar: 'كيف تصف حالتك الصحية؟',
      en: 'Health Status'
    },
    subtitle: {
      ar: '(اختر حتى خيارين)',
      en: '(Select up to 2)'
    },
    options: [
      { id: 'chronic_illness', label: { ar: 'أعاني من مرض مزمن', en: 'Chronic illness' } },
      { id: 'special_needs', label: { ar: 'من ذوي الاحتياجات الخاصة', en: 'Special needs' } },
      { id: 'infertile', label: { ar: 'عقيم', en: 'Infertile' } },
      { id: 'good_health', label: { ar: 'بصحة جيدة', en: 'Good health' } }
    ],
    required: true,
    minSelection: 1,
    maxSelection: 2
  },

  // Question 25: Photos (Optional)
  {
    id: 'photos',
    type: 'photo-upload',
    field: 'photos',
    question: {
      ar: 'الصور',
      en: 'Photos'
    },
    subtitle: {
      ar: '(اختياري - يمكنك إضافة حتى 6 صور)',
      en: '(Optional - You can add up to 6 photos)'
    },
    helpText: {
      ar: 'الصور الشخصية تساعد في زيادة فرص التوافق',
      en: 'Profile photos help increase your matching chances'
    },
    skipText: {
      ar: 'لاحقًا',
      en: 'Later'
    },
    maxPhotos: 6,
    required: false,
    isOptional: true
  },

  // Question 26: About Me
  {
    id: 'about',
    type: 'textarea',
    field: 'aboutMe',
    question: {
      ar: 'وصفي — صف نفسك',
      en: 'About Me'
    },
    placeholder: {
      ar: 'أخبرنا عن نفسك...',
      en: 'Tell us about yourself...'
    },
    maxLength: 250,
    multiline: true,
    minHeight: 120,
    required: true,
    validation: {
      minLength: 80,
      maxLength: 250,
      message: {
        ar: 'يجب أن يكون الوصف بين 80 و 250 حرفًا',
        en: 'Description must be between 80 and 250 characters'
      }
    }
  },

  // Question 27: Ideal Partner
  {
    id: 'idealPartner',
    type: 'textarea',
    field: 'idealPartner',
    question: {
      ar: 'وصف الشريكة المثالية',
      en: 'Ideal Partner'
    },
    placeholder: {
      ar: 'صف شريك حياتك المثالي...',
      en: 'Describe your ideal partner...'
    },
    maxLength: 250,
    multiline: true,
    minHeight: 120,
    required: true,
    validation: {
      minLength: 80,
      maxLength: 250,
      message: {
        ar: 'يجب أن يكون الوصف بين 80 و 250 حرفًا',
        en: 'Description must be between 80 and 250 characters'
      }
    }
  }
];

// Helper function to get question by ID
export const getQuestionById = (id) => {
  return ONBOARDING_QUESTIONS.find(q => q.id === id);
};

// Helper function to get question by index
export const getQuestionByIndex = (index) => {
  return ONBOARDING_QUESTIONS[index];
};

// Total number of questions (27 questions)
export const TOTAL_QUESTIONS = ONBOARDING_QUESTIONS.length;

// Get next question based on current question and answer
export const getNextQuestionId = (currentQuestion, answer, onboardingData = {}) => {
  const currentIndex = ONBOARDING_QUESTIONS.findIndex(q => q.id === currentQuestion.id);

  // Check if current question has custom next logic
  if (currentQuestion.nextQuestion && typeof currentQuestion.nextQuestion === 'function') {
    const nextId = currentQuestion.nextQuestion(answer);
    return nextId;
  }

  // Check if next question should be shown based on conditions
  let nextIndex = currentIndex + 1;
  while (nextIndex < ONBOARDING_QUESTIONS.length) {
    const nextQuestion = ONBOARDING_QUESTIONS[nextIndex];

    if (nextQuestion.showOnlyIf && typeof nextQuestion.showOnlyIf === 'function') {
      try {
        // Safe call with null checks
        if (nextQuestion.showOnlyIf(onboardingData || {})) {
          return nextQuestion.id;
        }
      } catch (error) {
        console.error('Error in showOnlyIf for question:', nextQuestion.id, error);
        // Skip this question on error
      }
      nextIndex++;
    } else {
      return nextQuestion.id;
    }
  }

  return null; // No more questions
};

// Get previous question (skips hidden questions)
export const getPreviousQuestionId = (currentQuestion, onboardingData = {}) => {
  const currentIndex = ONBOARDING_QUESTIONS.findIndex(q => q.id === currentQuestion.id);

  let prevIndex = currentIndex - 1;
  while (prevIndex >= 0) {
    const prevQuestion = ONBOARDING_QUESTIONS[prevIndex];

    if (prevQuestion.showOnlyIf && typeof prevQuestion.showOnlyIf === 'function') {
      try {
        // Safe call with null checks
        if (prevQuestion.showOnlyIf(onboardingData || {})) {
          return prevQuestion.id;
        }
      } catch (error) {
        console.error('Error in showOnlyIf for question:', prevQuestion.id, error);
        // Skip this question on error
      }
      prevIndex--;
    } else {
      return prevQuestion.id;
    }
  }

  return null; // No previous question
};
