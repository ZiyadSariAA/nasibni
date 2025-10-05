import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Modal, ScrollView, Pressable } from 'react-native';
import { City } from 'country-state-city';
import Text from '../Text';
import Input from '../Input';
import { FONTS } from '../../../config/fonts';

/**
 * CityPickerInput Component
 *
 * Renders a city picker based on selected country
 */
const CityPickerInput = ({ countryCode, value, onChange, isArabic, placeholder }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (countryCode) {
      // Get cities for the selected country
      const countryCities = City.getCitiesOfCountry(countryCode);
      setCities(countryCities || []);
    } else {
      setCities([]);
    }
  }, [countryCode]);

  // Filter cities based on search
  const filteredCities = searchQuery
    ? cities.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : cities;

  const handleSelect = (city) => {
    onChange(city.name);
    setModalVisible(false);
    setSearchQuery('');
  };

  const displayText = value || placeholder || (isArabic ? 'اختر المدينة' : 'Select City');

  return (
    <>
      {/* Input Field */}
      <TouchableOpacity
        className="bg-white rounded-card border-2 border-border p-4"
        onPress={() => {
          if (countryCode) {
            setModalVisible(true);
          }
        }}
        activeOpacity={0.7}
        disabled={!countryCode}
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
          <Text style={{ fontSize: 16, color: '#9CA3AF', marginLeft: 8 }}>
            {isArabic ? '▼' : '▼'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Modal Picker */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/50"
          onPress={() => setModalVisible(false)}
        >
          <Pressable
            className="mt-auto bg-white rounded-t-3xl"
            style={{ maxHeight: '80%' }}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View className="border-b border-gray-200 p-4">
              <View className="flex-row items-center justify-between mb-3">
                <Text
                  style={{
                    fontFamily: FONTS.bold,
                    fontSize: 18,
                    color: '#4F2396',
                  }}
                >
                  {isArabic ? 'اختر المدينة' : 'Select City'}
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={{ fontSize: 24, color: '#9CA3AF' }}>×</Text>
                </TouchableOpacity>
              </View>

              {/* Search Input */}
              {cities.length > 10 && (
                <Input
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder={isArabic ? 'بحث...' : 'Search...'}
                  style={{ marginBottom: 0 }}
                  inputStyle={{
                    fontFamily: FONTS.regular,
                    fontSize: 16,
                    textAlign: isArabic ? 'right' : 'left',
                  }}
                />
              )}
            </View>

            {/* Cities List */}
            <ScrollView className="px-4 py-2" showsVerticalScrollIndicator={false}>
              {filteredCities.map((city) => {
                const isSelected = value === city.name;

                return (
                  <TouchableOpacity
                    key={city.name}
                    className={`py-4 border-b border-gray-100 flex-row items-center justify-between ${
                      isSelected ? 'bg-primary/5' : ''
                    }`}
                    onPress={() => handleSelect(city)}
                    activeOpacity={0.6}
                  >
                    <Text
                      style={{
                        fontFamily: isSelected ? FONTS.semibold : FONTS.regular,
                        fontSize: 16,
                        color: isSelected ? '#4F2396' : '#1F2937',
                        textAlign: isArabic ? 'right' : 'left',
                        flex: 1,
                      }}
                    >
                      {city.name}
                    </Text>

                    {isSelected && (
                      <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                        <Text className="text-white text-sm font-bold">✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}

              {filteredCities.length === 0 && (
                <View className="py-8 items-center">
                  <Text
                    style={{
                      fontFamily: FONTS.regular,
                      fontSize: 16,
                      color: '#9CA3AF',
                    }}
                  >
                    {isArabic ? 'لا توجد مدن' : 'No cities found'}
                  </Text>
                </View>
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

export default CityPickerInput;
