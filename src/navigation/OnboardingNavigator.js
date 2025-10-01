import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  OnboardingLanguageScreen,
  OnboardingLocationScreen,
  OnboardingGenderScreen,
  OnboardingBirthYearScreen,
  OnboardingHeightScreen,
  OnboardingResidenceScreen,
  OnboardingNationalityScreen,
  OnboardingMaritalStatusScreen,
  OnboardingReligionScreen,
  OnboardingMadhhabScreen,
  OnboardingReligiosityScreen,
  OnboardingPrayerScreen,
  OnboardingEducationScreen,
  OnboardingWorkScreen,
  OnboardingMarriageTypeScreen,
  OnboardingMarriagePlanScreen,
  OnboardingKidsScreen,
  OnboardingLanguagesScreen,
  OnboardingSmokingScreen,
  OnboardingPhotosScreen,
  OnboardingAboutScreen,
  OnboardingIdealPartnerScreen,
  OnboardingReviewScreen,
} from '../screens/Onboarding/index.js';

const Stack = createNativeStackNavigator();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="OnboardingLanguage"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Prevent swipe back - user must use back button
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="OnboardingLanguage" component={OnboardingLanguageScreen} />
      <Stack.Screen name="OnboardingLocation" component={OnboardingLocationScreen} />
      <Stack.Screen name="OnboardingGender" component={OnboardingGenderScreen} />
      <Stack.Screen name="OnboardingBirthYear" component={OnboardingBirthYearScreen} />
      <Stack.Screen name="OnboardingHeight" component={OnboardingHeightScreen} />
      <Stack.Screen name="OnboardingResidence" component={OnboardingResidenceScreen} />
      <Stack.Screen name="OnboardingNationality" component={OnboardingNationalityScreen} />
      <Stack.Screen name="OnboardingMaritalStatus" component={OnboardingMaritalStatusScreen} />
      <Stack.Screen name="OnboardingReligion" component={OnboardingReligionScreen} />
      <Stack.Screen name="OnboardingMadhhab" component={OnboardingMadhhabScreen} />
      <Stack.Screen name="OnboardingReligiosity" component={OnboardingReligiosityScreen} />
      <Stack.Screen name="OnboardingPrayer" component={OnboardingPrayerScreen} />
      <Stack.Screen name="OnboardingEducation" component={OnboardingEducationScreen} />
      <Stack.Screen name="OnboardingWork" component={OnboardingWorkScreen} />
      <Stack.Screen name="OnboardingMarriageType" component={OnboardingMarriageTypeScreen} />
      <Stack.Screen name="OnboardingMarriagePlan" component={OnboardingMarriagePlanScreen} />
      <Stack.Screen name="OnboardingKids" component={OnboardingKidsScreen} />
      <Stack.Screen name="OnboardingLanguages" component={OnboardingLanguagesScreen} />
      <Stack.Screen name="OnboardingSmoking" component={OnboardingSmokingScreen} />
      <Stack.Screen name="OnboardingPhotos" component={OnboardingPhotosScreen} />
      <Stack.Screen name="OnboardingAbout" component={OnboardingAboutScreen} />
      <Stack.Screen name="OnboardingIdealPartner" component={OnboardingIdealPartnerScreen} />
      <Stack.Screen name="OnboardingReview" component={OnboardingReviewScreen} />
    </Stack.Navigator>
  );
}
