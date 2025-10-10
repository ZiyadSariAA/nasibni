import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { useTranslation } from '../../../contexts/TranslationContext';
import CountryDataService from '../../../services/CountryDataService';

const EnhancedCountryPicker = ({ 
  value, 
  onChange, 
  isArabic = true, // العربية هي الافتراضي
  placeholder,
  showFlags = true 
}) => {
  const { t } = useTranslation();
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCountries();
  }, [isArabic]);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const results = CountryDataService.searchCountries(searchQuery, isArabic ? 'ar' : 'en');
      setFilteredCountries(results.slice(0, 50)); // تحديد النتائج للأداء
    } else {
      setFilteredCountries(countries.slice(0, 50));
    }
  }, [searchQuery, countries, isArabic]);

  const loadCountries = async () => {
    try {
      setIsLoading(true);
      // استخدام العربية كلغة افتراضية
      const countryList = CountryDataService.getPopularCountries(isArabic ? 'ar' : 'en');
      setCountries(countryList);
      setFilteredCountries(countryList.slice(0, 50));
    } catch (error) {
      console.error('خطأ في تحميل الدول:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCountrySelect = (country) => {
    onChange({
      countryCode: country.alpha2,
      countryName: country.label[isArabic ? 'ar' : 'en'],
      alpha2: country.alpha2,
      alpha3: country.alpha3,
      numeric: country.numeric,
      flag: country.flag
    });
  };

  const getSelectedCountryName = () => {
    if (!value) return '';
    
    if (typeof value === 'object' && value.countryName) {
      return value.countryName;
    }
    
    // احتياطي: البحث عن الدولة بالكود
    const country = CountryDataService.getCountryByAlpha2(
      typeof value === 'string' ? value : value?.countryCode,
      isArabic ? 'ar' : 'en'
    );
    return country?.label[isArabic ? 'ar' : 'en'] || '';
  };

  const renderCountryItem = (country) => (
    <TouchableOpacity
      key={country.alpha2}
      onPress={() => handleCountrySelect(country)}
      className={`flex-row items-center py-4 px-4 border-b border-border ${
        isArabic ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {showFlags && (
        <View className={`${isArabic ? 'ml-3' : 'mr-3'} w-6 h-4 rounded-sm overflow-hidden`}>
          <Image
            source={country.flag}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      )}
      
      <View className="flex-1">
        <Text
          className={`text-base text-text-primary ${
            isArabic ? 'text-right' : 'text-left'
          }`}
          style={{ fontFamily: 'Tajawal_400Regular' }}
        >
          {country.label[isArabic ? 'ar' : 'en']}
        </Text>
        
        {country.alpha2 && (
          <Text
            className={`text-sm text-text-muted mt-1 ${
              isArabic ? 'text-right' : 'text-left'
            }`}
            style={{ fontFamily: 'Tajawal_400Regular' }}
          >
            {country.alpha2.toUpperCase()}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center py-8">
        <Text 
          className="text-text-muted"
          style={{ fontFamily: 'Tajawal_400Regular' }}
        >
          {isArabic ? 'جاري التحميل...' : 'Loading...'}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* شريط البحث */}
      <View className="px-4 py-3 border-b border-border">
        <TextInput
          placeholder={isArabic ? 'بحث...' : 'Search...'}
          placeholderTextColor="#6B7280"
          value={searchQuery}
          onChangeText={setSearchQuery}
          className={`h-12 px-4 border border-border rounded-lg text-base ${
            isArabic ? 'text-right' : 'text-left'
          }`}
          style={{ fontFamily: 'Tajawal_400Regular' }}
        />
      </View>

      {/* قائمة الدول */}
      <ScrollView className="flex-1">
        {filteredCountries.length > 0 ? (
          filteredCountries.map(renderCountryItem)
        ) : (
          <View className="flex-1 justify-center items-center py-8">
            <Text 
              className="text-text-muted text-center"
              style={{ fontFamily: 'Tajawal_400Regular' }}
            >
              {isArabic ? 'لا توجد نتائج' : 'No results found'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* عرض الدولة المختارة */}
      {value && (
        <View className="px-4 py-3 bg-background-alt border-t border-border">
          <Text
            className={`text-sm text-text-muted ${
              isArabic ? 'text-right' : 'text-left'
            }`}
            style={{ fontFamily: 'Tajawal_400Regular' }}
          >
            {isArabic ? 'المحدد:' : 'Selected:'} {getSelectedCountryName()}
          </Text>
        </View>
      )}
    </View>
  );
};

export default EnhancedCountryPicker;
