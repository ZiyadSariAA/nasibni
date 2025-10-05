import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import CountryPicker from './CountryPicker';
import CityPicker from './CityPicker';

/**
 * Example component to test Country and City pickers
 * You can use this to test the functionality
 */
const CountryCityExample = ({ isArabic = false }) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');

  const handleCountrySelect = (country) => {
    console.log('Selected Country:', country);
    setSelectedCountry(country);
    setSelectedCity(''); // Reset city when country changes
  };

  const handleCitySelect = (city) => {
    console.log('Selected City:', city);
    setSelectedCity(city);
  };

  const testData = () => {
    Alert.alert(
      'Test Data',
      `Country: ${selectedCountry?.name || 'None'}\nCity: ${selectedCity || 'None'}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View className="p-4 space-y-4">
      <CountryPicker
        value={selectedCountry}
        onChange={handleCountrySelect}
        isArabic={isArabic}
        placeholder={isArabic ? 'اختر الدولة' : 'Select Country'}
      />

      <CityPicker
        countryCode={selectedCountry?.countryCode}
        value={selectedCity}
        onChange={handleCitySelect}
        isArabic={isArabic}
        placeholder={isArabic ? 'اختر المدينة' : 'Select City'}
      />

      {/* Debug info */}
      <View className="bg-gray-100 p-3 rounded-lg">
        <Text className="text-sm text-gray-600">
          Selected Country: {selectedCountry?.name || 'None'}
        </Text>
        <Text className="text-sm text-gray-600">
          Country Code: {selectedCountry?.countryCode || 'None'}
        </Text>
        <Text className="text-sm text-gray-600">
          Selected City: {selectedCity || 'None'}
        </Text>
      </View>
    </View>
  );
};

export default CountryCityExample;
