import React from 'react';
import { Ionicons, MaterialIcons, FontAwesome, AntDesign, Feather } from '@expo/vector-icons';

/**
 * Custom Icon Component
 * 
 * Provides a unified interface for using icons from different libraries
 * Supports Ionicons, MaterialIcons, FontAwesome, AntDesign, and Feather
 */
const Icon = ({ 
  name, 
  size = 24, 
  color = '#4F2396', 
  type = 'ionicons',
  style,
  ...props 
}) => {
  const iconProps = { 
    name, 
    size, 
    color, 
    style,
    ...props 
  };

  switch (type) {
    case 'material':
      return <MaterialIcons {...iconProps} />;
    case 'fontawesome':
      return <FontAwesome {...iconProps} />;
    case 'antdesign':
      return <AntDesign {...iconProps} />;
    case 'feather':
      return <Feather {...iconProps} />;
    case 'ionicons':
    default:
      return <Ionicons {...iconProps} />;
  }
};

export default Icon;
