import React from 'react';
import { Ionicons } from '@expo/vector-icons';

/**
 * Custom Icon Component
 *
 * Unified interface for using Ionicons throughout the app
 */
const Icon = ({
  name,
  size = 24,
  color = '#4F2396',
  style,
  ...props
}) => {
  return (
    <Ionicons
      name={name}
      size={size}
      color={color}
      style={style}
      {...props}
    />
  );
};

export default Icon;
