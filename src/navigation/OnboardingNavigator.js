import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DynamicOnboardingScreen from '../screens/main/Onboarding/DynamicOnboardingScreen';
import OnboardingReviewScreen from '../screens/main/Onboarding/OnboardingReviewScreen';

const Stack = createNativeStackNavigator();

/**
 * OnboardingNavigator - Refactored
 *
 * Now uses ONE dynamic screen for all 23 questions!
 * Questions are configured in src/config/onboardingQuestions.js
 */
export default function OnboardingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Prevent swipe back - user must use back button
        animation: 'slide_from_right',
      }}
    >
      {/* Dynamic screen handles ALL questions (1-23) */}
      <Stack.Screen
        name="DynamicOnboarding"
        component={DynamicOnboardingScreen}
        initialParams={{ questionId: 'displayName' }} // Start with first question
      />

      {/* Review screen (question 24) */}
      <Stack.Screen name="OnboardingReview" component={OnboardingReviewScreen} />
    </Stack.Navigator>
  );
}