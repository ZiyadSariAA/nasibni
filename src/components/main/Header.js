import React from 'react';
import { View, StatusBar, Platform, Image } from 'react-native';
import Text from './Text';
import { FONTS } from '../../config/fonts';

const Header = ({ 
  title, 
  subtitle,
  showBackButton = false,
  onBackPress,
  rightComponent,
  backgroundColor = '#4F2396',
  textColor = 'white'
}) => {
  const headerClasses = `pt-safe-top pb-3 px-screen-padding shadow-lg z-50 relative`;
  
  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={backgroundColor}
        translucent={true}
      />
      <View 
        className={headerClasses}
        style={{ backgroundColor }}
      >
        <View className="flex-row items-center justify-between h-header-height">
          {/* Left side - Back button */}
          <View className="flex-1 items-start justify-center">
            {showBackButton && (
              <Text 
                className="text-2xl font-bold px-2 py-1"
                onPress={onBackPress}
                color="inverted"
                variant="body"
              >
                ←
              </Text>
            )}
          </View>
          
          {/* Center - Title */}
          <View className="flex-2 items-center justify-center px-4">
            <Text 
              variant="h3" 
              weight="bold" 
              color="inverted"
              align="center"
              className="text-heading-xl"
              style={{
                fontFamily: FONTS.appName,
                color: '#FFFFFF',
                fontWeight: '700',
                textShadowColor: 'rgba(0, 0, 0, 0.3)',
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 4,
                includeFontPadding: false,
                textAlignVertical: 'center',
                writingDirection: 'rtl',
                textAlign: 'center',
                letterSpacing: 0,
              }}
              allowFontScaling={false}
            >
              {title}
            </Text>
            {subtitle && (
              <Text 
                variant="caption" 
                color="inverted"
                align="center"
                className="opacity-90 mt-1"
                style={{
                  fontSize: 14,
                  lineHeight: 20,
                }}
              >
                {subtitle}
              </Text>
            )}
          </View>
          
          {/* Right side - Logo */}
          <View className="flex-1 items-end justify-center">
            <Image 
              source={require('../../assets/logos/Group1.png')} 
              className="w-12 h-12"
              resizeMode="contain"
            />
            {rightComponent}
          </View>
        </View>
      </View>
    </>
  );
};

export default Header;
