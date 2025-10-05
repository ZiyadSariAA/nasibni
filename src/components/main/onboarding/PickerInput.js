import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, ScrollView, Pressable } from 'react-native';
import Text from '../Text';
import Input from '../Input';
import { FONTS } from '../../../config/fonts';
import { useTranslation } from '../../../contexts/TranslationContext';

/**
 * PickerInput Component
 *
 * Renders a dropdown-style picker with a modal for selecting from many options
 * Perfect for long lists like countries, ages, heights, etc.
 */
const PickerInput = ({ options, value, onChange, isArabic, placeholder }) => {
  const { getLabel, getPlaceholder, t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Find the selected option label
  const selectedOption = options.find(opt => opt.id === value);
  const selectedLabel = selectedOption
    ? getLabel(selectedOption)
    : getPlaceholder(placeholder, t('selectFromList'));

  // Filter options based on search
  const filteredOptions = searchQuery
    ? options.filter(option => {
        const label = getLabel(option);
        return label.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : options;

  const handleSelect = (optionId) => {
    onChange(optionId);
    setModalVisible(false);
    setSearchQuery('');
  };

  return (
    <>
      {/* Input Field */}
      <TouchableOpacity
        className="bg-white rounded-card border-2 border-border p-4"
        onPress={() => setModalVisible(true)}
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
            {selectedLabel}
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
                   {t('selectOption')}
                 </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={{ fontSize: 24, color: '#9CA3AF' }}>×</Text>
                </TouchableOpacity>
              </View>

              {/* Search Input - Only show if more than 10 options */}
              {options.length > 10 && (
                 <Input
                   value={searchQuery}
                   onChangeText={setSearchQuery}
                   placeholder={t('search')}
                   style={{ marginBottom: 0 }}
                   inputStyle={{
                     fontFamily: FONTS.regular,
                     fontSize: 16,
                     textAlign: isArabic ? 'right' : 'left',
                   }}
                 />
              )}
            </View>

            {/* Options List */}
            <ScrollView className="px-4 py-2" showsVerticalScrollIndicator={false}>
               {filteredOptions.map((option) => {
                 const isSelected = value === option.id;
                 const label = getLabel(option);

                return (
                  <TouchableOpacity
                    key={option.id.toString()}
                    className={`py-4 border-b border-gray-100 flex-row items-center justify-between ${
                      isSelected ? 'bg-primary/5' : ''
                    }`}
                    onPress={() => handleSelect(option.id)}
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
                      {label}
                    </Text>

                    {isSelected && (
                      <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                        <Text className="text-white text-sm font-bold">✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}

               {filteredOptions.length === 0 && (
                 <View className="py-8 items-center">
                   <Text
                     style={{
                       fontFamily: FONTS.regular,
                       fontSize: 16,
                       color: '#9CA3AF',
                     }}
                   >
                     {t('noResults')}
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

export default PickerInput;
