import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';

/**
 * SmartStatusBar Component
 *
 * Automatically adapts status bar style based on:
 * - Background color (light vs dark)
 * - Device color scheme (dark mode vs light mode)
 *
 * Usage:
 * <SmartStatusBar backgroundColor="#4F2396" /> // Purple background -> light content
 * <SmartStatusBar backgroundColor="#FFFFFF" /> // White background -> dark content
 * <SmartStatusBar /> // Auto-detect from device theme
 */
const SmartStatusBar = ({
  backgroundColor = null,
  barStyle = null,
  translucent = false,
  hidden = false
}) => {
  const colorScheme = useColorScheme(); // 'light' or 'dark'

  // Function to determine if a color is light or dark
  const isLightColor = (hexColor) => {
    if (!hexColor) return true;

    // Remove # if present
    const color = hexColor.replace('#', '');

    // Convert to RGB
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);

    // Calculate luminance (perceived brightness)
    // Using the formula: (0.299*R + 0.587*G + 0.114*B)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);

    // If luminance > 186, it's a light color
    return luminance > 186;
  };

  // Determine the appropriate status bar style
  const getBarStyle = () => {
    // If barStyle is explicitly provided, use it
    if (barStyle) {
      return barStyle;
    }

    // If backgroundColor is provided, determine based on background
    if (backgroundColor) {
      return isLightColor(backgroundColor) ? 'dark-content' : 'light-content';
    }

    // Otherwise, use device color scheme
    // In dark mode, use light content; in light mode, use dark content
    return colorScheme === 'dark' ? 'light-content' : 'dark-content';
  };

  // Get background color based on color scheme if not provided
  const getBackgroundColor = () => {
    if (backgroundColor) {
      return backgroundColor;
    }

    // Use appropriate background for device theme
    return colorScheme === 'dark' ? '#000000' : '#FFFFFF';
  };

  return (
    <StatusBar
      barStyle={getBarStyle()}
      backgroundColor={getBackgroundColor()}
      translucent={translucent}
      hidden={hidden}
      animated={true}
    />
  );
};

export default SmartStatusBar;
