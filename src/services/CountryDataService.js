/**
 * خدمة بيانات الدول لناسبني
 * 
 * تستخدم البيانات المحلية من src/assets/data/Countriesdata/
 * مع التركيز على العربية كلغة أساسية
 */

import countriesAr from '../assets/data/Countriesdata/Arabic/countries.json';
import countriesEn from '../assets/data/Countriesdata/English/countries.json';
import worldAr from '../assets/data/Countriesdata/Arabic/world.json';
import worldEn from '../assets/data/Countriesdata/English/world.json';
import FLAGS from '../assets/data/Countriesdata/images/flat/16x12/flagMap';

class CountryDataService {
  constructor() {
    this.countriesAr = countriesAr;
    this.countriesEn = countriesEn;
    this.worldAr = worldAr;
    this.worldEn = worldEn;
    
    // إنشاء خرائط البحث للوصول السريع
    this.countriesByAlpha2Ar = new Map();
    this.countriesByAlpha2En = new Map();
    this.countriesByAlpha3Ar = new Map();
    this.countriesByAlpha3En = new Map();
    
    this.initializeLookups();
  }

  initializeLookups() {
    // إنشاء خرائط البحث للبيانات العربية
    this.countriesAr.forEach(country => {
      this.countriesByAlpha2Ar.set(country.alpha2, country);
      this.countriesByAlpha3Ar.set(country.alpha3, country);
    });

    // إنشاء خرائط البحث للبيانات الإنجليزية
    this.countriesEn.forEach(country => {
      this.countriesByAlpha2En.set(country.alpha2, country);
      this.countriesByAlpha3En.set(country.alpha3, country);
    });
  }

  /**
   * الحصول على جميع الدول بتنسيق مناسب لواجهة ناسبني
   * @param {string} language - 'ar' أو 'en' (الافتراضي: 'ar')
   * @returns {Array} مصفوفة الدول المنسقة
   */
  getAllCountries(language = 'ar') {
    const countries = language === 'ar' ? this.countriesAr : this.countriesEn;
    
    return countries.map(country => ({
      id: country.alpha2, // استخدام alpha2 كمعرف
      alpha2: country.alpha2,
      alpha3: country.alpha3,
      numeric: country.id,
      name: country.name,
      // مسار العلم المحلي من الخريطة الثابتة
      flag: FLAGS[country.alpha2] || FLAGS['us'], // fallback to US flag if not found
      // تسميات متعددة اللغات
      label: {
        ar: this.countriesAr.find(c => c.alpha2 === country.alpha2)?.name || country.name,
        en: this.countriesEn.find(c => c.alpha2 === country.alpha2)?.name || country.name
      }
    }));
  }

  /**
   * الحصول على الدول المفضلة للمستخدمين العرب
   * مرتبة حسب الأولوية للمنطقة العربية
   */
  getPopularCountries(language = 'ar') {
    // الدول المفضلة للمستخدمين العرب (مرتبة حسب الأولوية)
    const popularAlpha2Codes = [
      'sa', // السعودية
      'ae', // الإمارات
      'eg', // مصر
      'jo', // الأردن
      'ps', // فلسطين
      'lb', // لبنان
      'sy', // سوريا
      'iq', // العراق
      'kw', // الكويت
      'bh', // البحرين
      'qa', // قطر
      'om', // عمان
      'ye', // اليمن
      'ma', // المغرب
      'dz', // الجزائر
      'tn', // تونس
      'ly', // ليبيا
      'sd', // السودان
      'tr', // تركيا
      'pk', // باكستان
      'in', // الهند
      'bd', // بنغلاديش
      'id', // إندونيسيا
      'my', // ماليزيا
      'gb', // المملكة المتحدة
      'us', // الولايات المتحدة
      'ca', // كندا
      'fr', // فرنسا
      'de', // ألمانيا
    ];

    const allCountries = this.getAllCountries(language);
    
    // الحصول على الدول المفضلة أولاً
    const popularCountries = popularAlpha2Codes
      .map(code => allCountries.find(country => country.alpha2 === code))
      .filter(Boolean);

    // إضافة باقي الدول
    const remainingCountries = allCountries.filter(
      country => !popularAlpha2Codes.includes(country.alpha2)
    );

    return [...popularCountries, ...remainingCountries];
  }

  /**
   * البحث في الدول بالاسم
   * @param {string} query - مصطلح البحث
   * @param {string} language - 'ar' أو 'en' (الافتراضي: 'ar')
   * @returns {Array} الدول المطابقة
   */
  searchCountries(query, language = 'ar') {
    if (!query || query.length < 2) return [];

    const countries = this.getAllCountries(language);
    const searchTerm = query.toLowerCase();

    return countries.filter(country => {
      const name = language === 'ar' ? country.label.ar : country.label.en;
      return name.toLowerCase().includes(searchTerm);
    });
  }

  /**
   * الحصول على دولة بواسطة كود alpha2
   * @param {string} alpha2 - الكود المكون من حرفين
   * @param {string} language - 'ar' أو 'en' (الافتراضي: 'ar')
   * @returns {Object|null} بيانات الدولة
   */
  getCountryByAlpha2(alpha2, language = 'ar') {
    const countryMap = language === 'ar' ? this.countriesByAlpha2Ar : this.countriesByAlpha2En;
    const country = countryMap.get(alpha2?.toLowerCase());
    if (!country) return null;

    return {
      id: country.alpha2,
      alpha2: country.alpha2,
      alpha3: country.alpha3,
      numeric: country.id,
      name: country.name,
      flag: FLAGS[country.alpha2] || FLAGS['us'],
      label: {
        ar: this.countriesAr.find(c => c.alpha2 === country.alpha2)?.name || country.name,
        en: this.countriesEn.find(c => c.alpha2 === country.alpha2)?.name || country.name
      }
    };
  }

  /**
   * الحصول على دولة بواسطة كود alpha3
   * @param {string} alpha3 - الكود المكون من ثلاثة أحرف
   * @param {string} language - 'ar' أو 'en' (الافتراضي: 'ar')
   * @returns {Object|null} بيانات الدولة
   */
  getCountryByAlpha3(alpha3, language = 'ar') {
    const countryMap = language === 'ar' ? this.countriesByAlpha3Ar : this.countriesByAlpha3En;
    const country = countryMap.get(alpha3?.toLowerCase());
    if (!country) return null;

    return this.getCountryByAlpha2(country.alpha2, language);
  }

  /**
   * التحقق من صحة كود الدولة
   * @param {string} alpha2 - الكود المكون من حرفين
   * @returns {boolean} صحيح إذا كان الكود صالح
   */
  isValidCountryCode(alpha2) {
    return this.countriesByAlpha2Ar.has(alpha2?.toLowerCase()) || 
           this.countriesByAlpha2En.has(alpha2?.toLowerCase());
  }

  /**
   * الحصول على عدد الدول
   * @returns {number} إجمالي عدد الدول
   */
  getCountriesCount() {
    return this.countriesAr.length;
  }

  /**
   * الحصول على الدول العربية فقط
   * @returns {Array} الدول العربية
   */
  getArabCountries() {
    const arabCountries = ['sa', 'ae', 'eg', 'jo', 'ps', 'lb', 'sy', 'iq', 'kw', 'bh', 'qa', 'om', 'ye', 'ma', 'dz', 'tn', 'ly', 'sd'];
    
    return arabCountries
      .map(code => this.getCountryByAlpha2(code, 'ar'))
      .filter(Boolean);
  }
}

// تصدير نسخة واحدة من الخدمة
export default new CountryDataService();
