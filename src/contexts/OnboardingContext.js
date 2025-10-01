import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const OnboardingContext = createContext();

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider = ({ children }) => {
  const { updateProfileCompletion } = useAuth();
  
  const [onboardingData, setOnboardingData] = useState({
    // Question 1: App Language
    appLanguage: null,
    
    // Question 2: Enable Location
    enableLocation: null,
    
    // Question 3: Gender
    gender: null,
    
    // Question 4: Birth Year
    birthYear: null,
    
    // Question 5: Height
    height: null,
    
    // Question 6: Current Residence
    residence: {
      country: null,
      city: null,
    },
    
    // Question 7: Nationality
    nationality: null,
    
    // Question 8: Marital Status
    maritalStatus: null,
    hasChildren: null, // Only if divorced/widowed
    
    // Question 9: Religion
    religion: null,
    
    // Question 10: Madhhab (only if Islam)
    madhhab: null,
    
    // Question 11: Religiosity Level
    religiosityLevel: null,
    
    // Question 12: Prayer Habit (optional)
    prayerHabit: null,
    
    // Question 13: Education Level
    educationLevel: null,
    
    // Question 14: Work Status (optional)
    workStatus: null,
    
    // Question 15: Marriage Type
    marriageType: null,
    
    // Question 16: Marriage Plan
    marriagePlan: null,
    
    // Question 17: Kids Preference
    kidsPreference: null,
    
    // Question 18: Chat Languages
    chatLanguages: [],
    
    // Question 19: Smoking (optional)
    smoking: null,
    
    // Question 20: Photos
    photos: [],
    
    // Question 21: About Me
    aboutMe: '',
    
    // Question 22: Ideal Partner
    idealPartner: '',
    
    // Completion status
    isCompleted: false,
  });

  const updateOnboardingData = (field, value) => {
    setOnboardingData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateNestedData = (field, subField, value) => {
    setOnboardingData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [subField]: value,
      },
    }));
  };

  const resetOnboardingData = () => {
    setOnboardingData({
      appLanguage: null,
      enableLocation: null,
      gender: null,
      birthYear: null,
      height: null,
      residence: {
        country: null,
        city: null,
      },
      nationality: null,
      maritalStatus: null,
      hasChildren: null,
      religion: null,
      madhhab: null,
      religiosityLevel: null,
      prayerHabit: null,
      educationLevel: null,
      workStatus: null,
      marriageType: null,
      marriagePlan: null,
      kidsPreference: null,
      chatLanguages: [],
      smoking: null,
      photos: [],
      aboutMe: '',
      idealPartner: '',
      isCompleted: false,
    });
  };

  const completeOnboarding = async () => {
    try {
      // Mark as completed
      const completedData = {
        ...onboardingData,
        isCompleted: true,
      };
      
      setOnboardingData(completedData);

      // Save to AsyncStorage (as fake backend)
      const userProfileKey = `userProfile_${Date.now()}`;
      await AsyncStorage.setItem(userProfileKey, JSON.stringify(completedData));

      // Also save to a list of all completed profiles
      const existingProfiles = await AsyncStorage.getItem('completedProfiles');
      const profilesList = existingProfiles ? JSON.parse(existingProfiles) : [];
      profilesList.push({
        id: userProfileKey,
        completedAt: new Date().toISOString(),
        data: completedData,
      });
      await AsyncStorage.setItem('completedProfiles', JSON.stringify(profilesList));

      console.log('✅ Onboarding data saved to fake database');
      console.log('Profile Data:', completedData);

      // Update auth context to mark profile as completed
      await updateProfileCompletion(true, completedData);

      console.log('✅ Onboarding completed successfully!');
      
      return true;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  };

  const value = {
    onboardingData,
    updateOnboardingData,
    updateNestedData,
    resetOnboardingData,
    completeOnboarding,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
