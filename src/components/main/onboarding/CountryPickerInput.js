import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, ScrollView, TextInput, Image, Pressable } from 'react-native';
import Text from '../Text';
import { FONTS } from '../../../config/fonts';
import CountryDataService from '../../../services/CountryDataService';

/**
 * CountryPickerInput Component
 *
 * Renders a country picker with flag and search functionality
 * Uses local CountryDataService instead of react-native-country-picker-modal
 */
const CountryPickerInput = ({ value, onChange, isArabic, placeholder }) => {
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [countries, setCountries] = useState([]);

  React.useEffect(() => {
    if (visible) {
      const countryList = CountryDataService.getPopularCountries(isArabic ? 'ar' : 'en');
      setCountries(countryList);
    }
  }, [visible, isArabic]);

  const handleSelect = (country) => {
    onChange({
      countryCode: country.alpha2,
      countryName: country.label[isArabic ? 'ar' : 'en'],
      alpha2: country.alpha2,
      alpha3: country.alpha3,
      numeric: country.numeric,
      flag: country.flag
    });
    setVisible(false);
    setSearchQuery('');
  };

  const filteredCountries = searchQuery.length >= 2
    ? CountryDataService.searchCountries(searchQuery, isArabic ? 'ar' : 'en')
    : countries.slice(0, 50);

  const displayText = value?.countryName || value?.name || placeholder || (isArabic ? 'اختر الدولة' : 'Select Country');

  return (
    <View>
      <TouchableOpacity
        className="bg-white rounded-card border-2 border-border p-4"
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center justify-between">
          <Text
            style={{
              fontFamily: value ? FONTS.semibold : FONTS.regular,
              fontSize: 16,
              color: value ? '#1F2937' : '#9CA3AF',
              textAlign: isArabic ? 'right' : 'left',
              flex: 1,
            }}
          >
            {displayText}
          </Text>
          <Text style={{ fontSize: 16, color: '#9CA3AF', marginLeft: 8 }}>▼</Text>
        </View>
      </TouchableOpacity>

      {/* Modal Picker */}
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/50"
          onPress={() => setVisible(false)}
        >
          <Pressable
            className="mt-auto bg-white rounded-t-3xl"
            style={{ maxHeight: '80%' }}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View className="border-b border-border p-4">
              <View className="flex-row items-center justify-between mb-3">
                <Text
                  style={{
                    fontFamily: FONTS.bold,
                    fontSize: 18,
                    color: '#4F2396',
                  }}
                >
                  {isArabic ? 'اختر الدولة' : 'Select Country'}
                </Text>
                <TouchableOpacity onPress={() => setVisible(false)}>
                  <Text style={{ fontSize: 24, color: '#9CA3AF' }}>×</Text>
                </TouchableOpacity>
              </View>

              {/* Search Input */}
              <TextInput
                placeholder={isArabic ? 'بحث...' : 'Search...'}
                placeholderTextColor="#6B7280"
                value={searchQuery}
                onChangeText={setSearchQuery}
                className={`h-12 px-4 border border-border rounded-lg text-base ${
                  isArabic ? 'text-right' : 'text-left'
                }`}
                style={{ fontFamily: FONTS.regular }}
              />
            </View>

            {/* Countries List */}
            <ScrollView className="px-4 py-2" showsVerticalScrollIndicator={false}>
              {filteredCountries.map((country) => (
                <TouchableOpacity
                  key={country.alpha2}
                  onPress={() => handleSelect(country)}
                  className={`flex-row items-center py-4 border-b border-border ${
                    isArabic ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <View className={`${isArabic ? 'ml-3' : 'mr-3'} w-6 h-4 rounded-sm overflow-hidden`}>
                    <Image
                      source={country.flag}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>

                  <View className="flex-1">
                    <Text
                      className={`text-base text-text-primary ${
                        isArabic ? 'text-right' : 'text-left'
                      }`}
                      style={{ fontFamily: FONTS.regular }}
                    >
                      {country.label[isArabic ? 'ar' : 'en']}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}

              {filteredCountries.length === 0 && (
                <View className="py-8 items-center">
                  <Text
                    style={{
                      fontFamily: FONTS.regular,
                      fontSize: 16,
                      color: '#9CA3AF',
                    }}
                  >
                    {isArabic ? 'لا توجد نتائج' : 'No results found'}
                  </Text>
                </View>
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default CountryPickerInput;
