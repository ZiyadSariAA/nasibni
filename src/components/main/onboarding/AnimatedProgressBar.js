import React from 'react';
import { View } from 'react-native';

/**
 * ProgressBar Component
 *
 * Simple progress bar for onboarding
 * Purple gradient (#5B2C91) matching Nasibni brand
 */
const AnimatedProgressBar = ({ currentStep, totalSteps }) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <View className="h-2 bg-border rounded-full overflow-hidden">
      <View
        className="h-full bg-primary rounded-full"
        style={{ width: `${progressPercentage}%` }}
      />
    </View>
  );
};

export default AnimatedProgressBar;
