import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { db } from '../config/firebase';

const OnboardingContext = createContext();

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider = ({ children }) => {
  const { user, updateProfileCompletion } = useAuth();
  
  const [onboardingData, setOnboardingData] = useState({
    // Question 1: Display Name
    displayName: null,

    // Question 2: App Language
    appLanguage: null,

    // Question 3: Enable Location
    enableLocation: null,

    // Question 4: Gender
    gender: null,

    // Question 4: Age
    age: null,

    // Question 5: Height
    height: null,

    // Question 6: Current Residence
    residenceCountry: null,
    residenceCity: null,

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
      displayName: null,
      appLanguage: null,
      enableLocation: null,
      gender: null,
      age: null,
      height: null,
      residenceCountry: null,
      residenceCity: null,
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
      console.log('🚀 Starting onboarding completion...');
      console.log('👤 User UID:', user?.uid);
      console.log('📧 User Email:', user?.email);

      if (!user || !user.uid) {
        console.error('User object:', user);
        throw new Error('User not found or invalid');
      }

      if (!onboardingData) {
        console.error('Onboarding data is undefined:', onboardingData);
        throw new Error('Onboarding data not found');
      }

      // Mark as completed
      const completedData = {
        ...onboardingData,
        isCompleted: true,
      };

      setOnboardingData(completedData);

      // Prepare onboarding answers to save
      const userOnboardingData = {
        displayName: onboardingData.displayName,
        appLanguage: onboardingData.appLanguage,
        enableLocation: onboardingData.enableLocation,
        gender: onboardingData.gender,
        age: onboardingData.age,
        height: onboardingData.height,
        residenceCountry: onboardingData.residenceCountry,
        residenceCity: onboardingData.residenceCity,
        nationality: onboardingData.nationality,
        maritalStatus: onboardingData.maritalStatus,
        hasChildren: onboardingData.hasChildren,
        religion: onboardingData.religion,
        madhhab: onboardingData.madhhab,
        religiosityLevel: onboardingData.religiosityLevel,
        prayerHabit: onboardingData.prayerHabit,
        educationLevel: onboardingData.educationLevel,
        workStatus: onboardingData.workStatus,
        marriageType: onboardingData.marriageType,
        marriagePlan: onboardingData.marriagePlan,
        kidsPreference: onboardingData.kidsPreference,
        chatLanguages: onboardingData.chatLanguages,
        smoking: onboardingData.smoking,
        photos: onboardingData.photos,
        aboutMe: onboardingData.aboutMe,
        idealPartner: onboardingData.idealPartner,
        completedAt: new Date().toISOString()
      };

      // Prepare photos array with metadata
      const photosArray = Array.isArray(onboardingData.photos)
        ? onboardingData.photos.map((photoUrl, index) => ({
            url: photoUrl,
            order: index,
            uploadedAt: new Date().toISOString(),
            isProfilePhoto: index === 0 // First photo is profile photo
          }))
        : [];

      const firstPhotoUrl = photosArray.length > 0 ? photosArray[0].url : null;

      // Save to Firestore with all necessary fields
      console.log('💾 Preparing to save to Firestore...');
      const userDocRef = doc(db, 'users', user.uid);
      console.log('📄 Document path:', `users/${user.uid}`);

      // Check if document exists
      console.log('🔍 Checking if document exists...');
      const existingDoc = await getDoc(userDocRef);

      const dataToSave = {
        // Profile data with all onboarding answers
        profileData: userOnboardingData,

        // Profile completion
        profileCompleted: true,

        // Basic user info
        userId: user.uid,
        email: user.email,
        displayName: onboardingData.displayName,

        // Account status
        accountStatus: 'active',

        // Location settings
        gpsEnabled: onboardingData.enableLocation === true,

        // Photos
        photos: photosArray,
        profilePhotoUrl: firstPhotoUrl,

        // Timestamps
        updatedAt: new Date().toISOString(),
        ...((!existingDoc.exists()) && { createdAt: new Date().toISOString() })
      };

      console.log('📦 Data to save:', JSON.stringify(dataToSave, null, 2));
      console.log('📊 Document exists:', existingDoc.exists());
      console.log('🔄 Calling setDoc...');

      // Use merge: true to preserve any existing fields
      await setDoc(userDocRef, dataToSave, { merge: true });

      console.log('✅ Onboarding data saved to Firestore for user:', user.uid);

      // Also save to AsyncStorage as backup
      const existingData = await AsyncStorage.getItem('onboardingData');
      const data = existingData ? JSON.parse(existingData) : { responses: [] };

      // Remove existing response for this user if any
      data.responses = data.responses.filter(r => r.userId !== user.uid);

      // Add new response
      data.responses.push({
        userId: user.uid,
        answers: userOnboardingData
      });

      await AsyncStorage.setItem('onboardingData', JSON.stringify(data));

      // Update auth context to mark profile as completed
      await updateProfileCompletion(true, userOnboardingData);

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