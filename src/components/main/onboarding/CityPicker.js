import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Modal, ScrollView, Pressable } from 'react-native';
import { City } from 'country-state-city';
import Text from '../Text';
import { useTranslation } from '../../../contexts/TranslationContext';

/**
 * CityPicker Component
 *
 * Renders a city picker based on selected country
 * Works offline with country-state-city package
 */
const CityPickerComponent = ({
  countryCode,
  value,
  onChange,
  isArabic = false,
  placeholder,
  disabled = false
}) => {
  const { getPlaceholder } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (countryCode) {
      setLoading(true);
      try {
        // Get cities for the selected country
        const countryCities = City.getCitiesOfCountry(countryCode);
        console.log(`Found ${countryCities?.length || 0} cities for country: ${countryCode}`);
        setCities(countryCities || []);
      } catch (error) {
        console.error('Error loading cities:', error);
        setCities([]);
      } finally {
        setLoading(false);
      }
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

  const displayText = value || getPlaceholder(placeholder, isArabic ? 'اختر المدينة' : 'Select City');

  return (
    <>
      {/* Input Field */}
      <TouchableOpacity
        className={`bg-white rounded-card border-2 border-border p-4 ${
          disabled || !countryCode ? 'opacity-50' : ''
        }`}
        onPress={() => {
          if (countryCode && !disabled) {
            setModalVisible(true);
          }
        }}
        activeOpacity={0.7}
        disabled={!countryCode || disabled}
      >
        <View className="flex-row items-center justify-between">
          <Text
            className={`text-base ${
              value ? 'text-text-primary font-semibold' : 'text-text-muted font-normal'
            } ${isArabic ? 'text-right' : 'text-left'} flex-1`}
          >
            {displayText}
          </Text>
          <Text className="text-text-muted text-base">
            ▼
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
            <View className="border-b border-border p-4">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-lg font-bold text-primary">
                  {isArabic ? 'اختر المدينة' : 'Select City'}
                </Text>
                <TouchableOpacity 
                  onPress={() => setModalVisible(false)}
                  className="w-8 h-8 items-center justify-center"
                >
                  <Text className="text-2xl text-text-muted">×</Text>
                </TouchableOpacity>
              </View>

              {/* Search Input */}
              {cities.length > 10 && (
                <View className="bg-background-alt rounded-lg p-3">
                  <Text
                    className={`text-base text-text-primary ${
                      isArabic ? 'text-right' : 'text-left'
                    }`}
                  >
                    {isArabic ? 'بحث...' : 'Search...'}
                  </Text>
                </View>
              )}
            </View>

            {/* Cities List */}
            <ScrollView className="px-4 py-2" showsVerticalScrollIndicator={false}>
              {loading ? (
                <View className="py-8 items-center">
                  <Text className="text-base text-text-muted">
                    {isArabic ? 'جاري التحميل...' : 'Loading...'}
                  </Text>
                </View>
              ) : filteredCities.length > 0 ? (
                filteredCities.map((city, index) => {
                  const isSelected = value === city.name;

                  return (
                    <TouchableOpacity
                      key={`${city.name}-${index}`}
                      className={`py-4 border-b border-border flex-row items-center justify-between ${
                        isSelected ? 'bg-primary/5' : ''
                      }`}
                      onPress={() => handleSelect(city)}
                      activeOpacity={0.6}
                    >
                      <Text
                        className={`text-base ${
                          isSelected ? 'text-primary font-semibold' : 'text-text-primary font-normal'
                        } ${isArabic ? 'text-right' : 'text-left'} flex-1`}
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
                })
              ) : (
                <View className="py-8 items-center">
                  <Text className="text-base text-text-muted">
                    {isArabic ? 'لا توجد مدن' : 'No cities found'}
                  </Text>
                  {!countryCode && (
                    <Text className="text-sm text-text-muted mt-2">
                      {isArabic ? 'يرجى اختيار الدولة أولاً' : 'Please select a country first'}
                    </Text>
                  )}
                </View>
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

export default CityPickerComponent;
