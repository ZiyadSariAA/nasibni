export const FONTS = {
  // Tajawal - خط عربي عصري لجميع النصوص
  appName: 'Tajawal_900Black',
  regular: 'Tajawal_400Regular',
  medium: 'Tajawal_500Medium',
  semibold: 'Tajawal_700Bold',  // Tajawal doesn't have 600, using 700
  bold: 'Tajawal_700Bold',
  black: 'Tajawal_900Black',
};

export const APP_NAME_STYLE = {
  fontFamily: FONTS.appName,
  fontSize: 32,
  color: '#4F2396',
};

export const TEXT_STYLES = {
  // Titles
  title: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: '#4F2396',
  },

  // Subtitles
  subtitle: {
    fontFamily: FONTS.semibold,
    fontSize: 18,
    color: '#2B2B2B',
  },
  
  // Body text
  body: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: '#6B7280',
  },
  
  // Small text
  small: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: '#6B7280',
  },
};
