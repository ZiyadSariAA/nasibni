/**
 * Nasibni Onboarding Questions Configuration
 *
 * This file contains all 23 onboarding questions in a data-driven format.
 * Each question defines its type, field name, question text, options, and validation.
 */

import CountryDataService from '../services/CountryDataService';
import { Ionicons } from '@expo/vector-icons';

// دالة للحصول على قائمة الدول المفضلة
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
      en: 'What is your name?',
      ar: 'ما اسمك؟'
    },
    helpText: {
      en: 'This is the name that will appear on your profile',
      ar: 'هذا هو الاسم الذي سيظهر في ملفك الشخصي'
    },
    placeholder: {
      en: 'Enter your name',
      ar: 'أدخل اسمك'
    },
    maxLength: 50,
    required: true,
    validation: {
      minLength: 2,
      pattern: /^[a-zA-Z\u0600-\u06FF\s]+$/,
      message: {
        en: 'Name must be at least 2 characters',
        ar: 'يجب أن يكون الاسم حرفين على الأقل'
      }
    },
    showBack: false
  },

  // Question 2: App Language
  {
    id: 'language',
    type: 'select',
    field: 'appLanguage',
    question: {
      en: 'Choose your app language',
      ar: 'اختر لغة التطبيق'
    },
    helpText: {
      en: 'This changes the interface language only',
      ar: 'هذا يغير لغة الواجهة فقط'
    },
    options: [
      { id: 'ar', label: { en: 'Arabic', ar: 'العربية' } },
      { id: 'en', label: { en: 'English', ar: 'English' } }
    ],
    required: true,
    showBack: true
  },

  // Question 3: Enable Location
  {
    id: 'location',
    type: 'select-with-description',
    field: 'enableLocation',
    question: {
      en: 'Do you want to enable location services?',
      ar: 'هل تريد تفعيل خدمات الموقع؟'
    },
    options: [
      {
        id: true,
        label: { en: 'Yes, enable location', ar: 'نعم، تفعيل الموقع' },
        description: { en: 'To find people near you', ar: 'للعثور على أشخاص قريبين منك' }
      },
      {
        id: false,
        label: { en: 'No, maybe later', ar: 'لا، لاحقاً' },
        description: { en: 'You can enable it later from settings', ar: 'يمكنك تفعيله لاحقاً من الإعدادات' }
      }
    ],
    required: false,
    isOptional: true,
    defaultValue: false
  },

  // Question 3: Gender
  {
    id: 'gender',
    type: 'select',
    field: 'gender',
    question: {
      en: 'What is your gender?',
      ar: 'ما هو جنسك؟'
    },
    options: [
      { id: 'male', label: { en: 'Male', ar: 'ذكر' }, icon: <Ionicons name="person" size={20} color="#4F2396" /> },
      { id: 'female', label: { en: 'Female', ar: 'أنثى' }, icon: <Ionicons name="person-outline" size={20} color="#4F2396" /> }
    ],
    required: true
  },

  // Question 4: Age
  {
    id: 'age',
    type: 'number',
    field: 'age',
    question: {
      en: 'What is your age?',
      ar: 'كم عمرك؟'
    },
    helpText: {
      en: 'You must be 18 years or older',
      ar: 'يجب أن يكون عمرك 18 سنة أو أكثر'
    },
    placeholder: {
      en: 'Enter your age',
      ar: 'أدخل عمرك'
    },
    maxLength: 3,
    keyboardType: 'number-pad',
    validation: {
      min: 18,
      max: 100
    },
    required: true
  },

  // Question 5: Height
  {
    id: 'height',
    type: 'number',
    field: 'height',
    question: {
      en: 'What is your height?',
      ar: 'ما هو طولك؟'
    },
    helpText: {
      en: 'Enter your height in centimeters',
      ar: 'أدخل طولك بالسنتيمتر'
    },
    placeholder: {
      en: 'Height in cm',
      ar: 'الطول بالسنتيمتر'
    },
    maxLength: 3,
    keyboardType: 'number-pad',
    validation: {
      min: 140,
      max: 230
    },
    required: true
  },

  // Question 6: Weight
  {
    id: 'weight',
    type: 'number',
    field: 'weight',
    question: {
      en: 'What is your weight?',
      ar: 'ما هو وزنك؟'
    },
    helpText: {
      en: 'Enter your weight in kilograms',
      ar: 'أدخل وزنك بالكيلوجرام'
    },
    placeholder: {
      en: 'Weight in kg',
      ar: 'الوزن بالكيلوجرام'
    },
    maxLength: 3,
    keyboardType: 'number-pad',
    validation: {
      min: 40,
      max: 200
    },
    required: true
  },

  // Question 7: Current Residence Country
  {
    id: 'residenceCountry',
    type: 'country-picker',
    field: 'residenceCountry',
    question: {
      en: 'Which country do you currently live in?',
      ar: 'في أي دولة تعيش حالياً؟'
    },
    placeholder: {
      en: 'Select Country',
      ar: 'اختر الدولة'
    },
    required: true,
    getOptions: () => getCountriesList()
  },

  // Question 8: Nationality
  {
    id: 'nationality',
    type: 'country-picker',
    field: 'nationality',
    question: {
      en: 'What is your nationality?',
      ar: 'ما هي جنسيتك؟'
    },
    placeholder: {
      en: 'Select nationality',
      ar: 'اختر الجنسية'
    },
    required: true,
    getOptions: () => getCountriesList()
  },

  // Question 9: Marital Status
  {
    id: 'maritalStatus',
    type: 'select-with-conditional',
    field: 'maritalStatus',
    question: {
      en: 'What is your marital status?',
      ar: 'ما هي حالتك الاجتماعية؟'
    },
    options: [
      { id: 'single', label: { en: 'Single', ar: 'أعزب/عزباء' } },
      { id: 'divorced', label: { en: 'Divorced', ar: 'مطلق/مطلقة' } },
      { id: 'widowed', label: { en: 'Widowed', ar: 'أرمل/أرملة' } }
    ],
    conditionalField: {
      field: 'hasChildren',
      condition: (value) => value === 'divorced' || value === 'widowed',
      question: {
        en: 'Do you have children?',
        ar: 'هل لديك أطفال؟'
      },
      options: [
        { id: true, label: { en: 'Yes', ar: 'نعم' } },
        { id: false, label: { en: 'No', ar: 'لا' } }
      ]
    },
    required: true
  },

  // Question 10: Religion
  {
    id: 'religion',
    type: 'select',
    field: 'religion',
    question: {
      en: 'What is your religion?',
      ar: 'ما هو دينك؟'
    },
    options: [
      { id: 'muslim', label: { en: 'Muslim', ar: 'مسلم/مسلمة' } },
      { id: 'christian', label: { en: 'Christian', ar: 'مسيحي/مسيحية' } },
      { id: 'other', label: { en: 'Other', ar: 'أخرى' } }
    ],
    required: true,
    nextQuestion: (value) => value === 'muslim' ? 'madhhab' : 'religiosity'
  },

  // Question 11: Madhhab (Islamic School of Thought)
  {
    id: 'madhhab',
    type: 'select',
    field: 'madhhab',
    question: {
      en: 'What is your Islamic school of thought?',
      ar: 'ما هو مذهبك الفقهي؟'
    },
    options: [
      { id: 'sunni', label: { en: 'Sunni', ar: 'سني' } },
      { id: 'shia', label: { en: 'Shia', ar: 'شيعي' } },
      { id: 'other', label: { en: 'Other', ar: 'أخرى' } }
    ],
    required: true,
    showOnlyIf: (onboardingData) => onboardingData.religion === 'muslim'
  },

  // Question 12: Religiosity Level
  {
    id: 'religiosity',
    type: 'select',
    field: 'religiosityLevel',
    question: {
      en: 'How would you describe your religiosity level?',
      ar: 'كيف تصف مستوى التزامك الديني؟'
    },
    options: [
      { id: 'very_religious', label: { en: 'Very religious', ar: 'ملتزم جداً' } },
      { id: 'moderately_religious', label: { en: 'Moderately religious', ar: 'ملتزم بشكل معتدل' } },
      { id: 'somewhat_religious', label: { en: 'Somewhat religious', ar: 'ملتزم نوعاً ما' } },
      { id: 'not_religious', label: { en: 'Not religious', ar: 'غير ملتزم' } }
    ],
    required: true
  },

  // Question 13: Prayer Habit (Optional)
  {
    id: 'prayer',
    type: 'select',
    field: 'prayerHabit',
    question: {
      en: 'How often do you pray?',
      ar: 'كم مرة تصلي؟'
    },
    options: [
      { id: 'always', label: { en: 'Always (5 times daily)', ar: 'دائماً (5 مرات يومياً)' } },
      { id: 'usually', label: { en: 'Usually', ar: 'عادةً' } },
      { id: 'sometimes', label: { en: 'Sometimes', ar: 'أحياناً' } },
      { id: 'rarely', label: { en: 'Rarely', ar: 'نادراً' } },
      { id: 'never', label: { en: 'Never', ar: 'أبداً' } }
    ],
    required: false,
    isOptional: true
  },

  // Question 14: Education Level
  {
    id: 'education',
    type: 'select',
    field: 'educationLevel',
    question: {
      en: 'What is your education level?',
      ar: 'ما هو مستواك التعليمي؟'
    },
    options: [
      { id: 'high_school', label: { en: 'High School', ar: 'ثانوية عامة' } },
      { id: 'diploma', label: { en: 'Diploma', ar: 'دبلوم' } },
      { id: 'bachelors', label: { en: "Bachelor's Degree", ar: 'بكالوريوس' } },
      { id: 'masters', label: { en: "Master's Degree", ar: 'ماجستير' } },
      { id: 'phd', label: { en: 'PhD', ar: 'دكتوراه' } },
      { id: 'other', label: { en: 'Other', ar: 'أخرى' } }
    ],
    required: true
  },

  // Question 15: Work Status (Optional)
  {
    id: 'work',
    type: 'text',
    field: 'workStatus',
    question: {
      en: 'What do you do for work?',
      ar: 'ما هو عملك؟'
    },
    placeholder: {
      en: 'Example: Engineer, Teacher, Student...',
      ar: 'مثال: مهندس، معلم، طالب...'
    },
    required: false,
    isOptional: true
  },

  // Question 16: Marriage Type
  {
    id: 'marriageType',
    type: 'select',
    field: 'marriageType',
    question: {
      en: 'What type of marriage are you looking for?',
      ar: 'ما نوع الزواج الذي تبحث عنه؟'
    },
    options: [
      { id: 'traditional', label: { en: 'Traditional', ar: 'تقليدي' } },
      { id: 'modern', label: { en: 'Modern', ar: 'عصري' } },
      { id: 'both', label: { en: 'Both', ar: 'كلاهما' } }
    ],
    required: true
  },

  // Question 17: Marriage Plan
  {
    id: 'marriagePlan',
    type: 'select',
    field: 'marriagePlan',
    question: {
      en: 'When are you planning to get married?',
      ar: 'متى تخطط للزواج؟'
    },
    options: [
      { id: 'within_6_months', label: { en: 'Within 6 months', ar: 'خلال 6 أشهر' } },
      { id: 'within_year', label: { en: 'Within a year', ar: 'خلال سنة' } },
      { id: 'within_2_years', label: { en: 'Within 2 years', ar: 'خلال سنتين' } },
      { id: 'not_sure', label: { en: 'Not sure yet', ar: 'لست متأكداً بعد' } }
    ],
    required: true
  },

  // Question 18: Kids Preference
  {
    id: 'kids',
    type: 'select',
    field: 'kidsPreference',
    question: {
      en: 'Do you want children in the future?',
      ar: 'هل تريد إنجاب أطفال في المستقبل؟'
    },
    options: [
      { id: 'yes', label: { en: 'Yes', ar: 'نعم' } },
      { id: 'no', label: { en: 'No', ar: 'لا' } },
      { id: 'not_sure', label: { en: 'Not sure', ar: 'لست متأكداً' } }
    ],
    required: true
  },

  // Question 19: Chat Languages (Multi-select)
  {
    id: 'languages',
    type: 'multi-select',
    field: 'chatLanguages',
    question: {
      en: 'What languages do you speak?',
      ar: 'ما اللغات التي تتحدث بها؟'
    },
    subtitle: {
      en: '(Select one or more)',
      ar: '(اختر واحدة أو أكثر)'
    },
    options: [
      { id: 'arabic', label: { en: 'Arabic', ar: 'العربية' } },
      { id: 'english', label: { en: 'English', ar: 'الإنجليزية' } },
      { id: 'french', label: { en: 'French', ar: 'الفرنسية' } },
      { id: 'urdu', label: { en: 'Urdu', ar: 'الأردية' } },
      { id: 'turkish', label: { en: 'Turkish', ar: 'التركية' } },
      { id: 'malay', label: { en: 'Malay', ar: 'الماليزية' } }
    ],
    required: true,
    minSelection: 1
  },

  // Question 20: Smoking (Optional)
  {
    id: 'smoking',
    type: 'select',
    field: 'smoking',
    question: {
      en: 'Do you smoke?',
      ar: 'هل تدخن؟'
    },
    options: [
      { id: 'yes', label: { en: 'Yes', ar: 'نعم' } },
      { id: 'no', label: { en: 'No', ar: 'لا' } },
      { id: 'occasionally', label: { en: 'Occasionally', ar: 'أحياناً' } }
    ],
    required: false,
    isOptional: true
  },

  // Question 21: Photos (Special type)
  {
    id: 'photos',
    type: 'photo-upload',
    field: 'photos',
    question: {
      en: 'Add your photos',
      ar: 'أضف صورك الشخصية'
    },
    subtitle: {
      en: '(Optional - You can add up to 6 photos)',
      ar: '(اختياري - يمكنك إضافة حتى 6 صور)'
    },
    helpText: {
      en: 'Note: Profile photos help increase your matching chances',
      ar: 'ملاحظة: الصور الشخصية تساعد في زيادة فرص التوافق'
    },
    skipText: {
      en: 'Skip for now, add photos later',
      ar: 'تخطي الآن وإضافة الصور لاحقاً'
    },
    maxPhotos: 6,
    required: false,
    isOptional: true
  },

  // Question 22: About Me
  {
    id: 'about',
    type: 'textarea',
    field: 'aboutMe',
    question: {
      en: 'Write about yourself',
      ar: 'اكتب عن نفسك'
    },
    placeholder: {
      en: "Example: I'm a calm person, I love reading and sports...",
      ar: 'مثال: أنا شخص هادئ، أحب القراءة والرياضة...'
    },
    maxLength: 500,
    multiline: true,
    minHeight: 150,
    required: true
  },

  // Question 23: Ideal Partner
  {
    id: 'idealPartner',
    type: 'textarea',
    field: 'idealPartner',
    question: {
      en: 'Describe your ideal partner',
      ar: 'صف شريك حياتك المثالي'
    },
    placeholder: {
      en: 'Example: I\'m looking for someone who is kind, caring...',
      ar: 'مثال: أبحث عن شخص طيب القلب، حنون...'
    },
    maxLength: 500,
    multiline: true,
    minHeight: 150,
    required: true
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

// Total number of questions (23 questions)
export const TOTAL_QUESTIONS = ONBOARDING_QUESTIONS.length;

// Get next question based on current question and answer
export const getNextQuestionId = (currentQuestion, answer, onboardingData) => {
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
      if (nextQuestion.showOnlyIf(onboardingData)) {
        return nextQuestion.id;
      }
      nextIndex++;
    } else {
      return nextQuestion.id;
    }
  }

  return null; // No more questions
};

// Get previous question (skips hidden questions)
export const getPreviousQuestionId = (currentQuestion, onboardingData) => {
  const currentIndex = ONBOARDING_QUESTIONS.findIndex(q => q.id === currentQuestion.id);

  let prevIndex = currentIndex - 1;
  while (prevIndex >= 0) {
    const prevQuestion = ONBOARDING_QUESTIONS[prevIndex];

    if (prevQuestion.showOnlyIf && typeof prevQuestion.showOnlyIf === 'function') {
      if (prevQuestion.showOnlyIf(onboardingData)) {
        return prevQuestion.id;
      }
      prevIndex--;
    } else {
      return prevQuestion.id;
    }
  }

  return null; // No previous question
};