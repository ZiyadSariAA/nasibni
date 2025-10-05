/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Primary colors from Nasabni brand identity
        primary: '#4F2396', // Royal Purple
        'primary-hover': '#3A1972',
        'primary-tint': '#6B4BB4',
        
        // Accent colors
        accent: '#F69554', // Warm Orange
        'accent-hover': '#D97F45',
        'accent-tint': '#FFD8C2',
        
        // Background colors
        background: '#FFFFFF', // Page background
        'background-alt': '#F8F8FB', // Section Alt background
        'card-surface': '#FFFFFF', // Card surface
        
        // Text colors
        text: {
          primary: '#1A1A1A', // Headings
          secondary: '#2B2B2B', // Body
          muted: '#6B7280', // Muted
          inverted: '#FFFFFF', // Inverted
        },
        
        // Border colors
        border: '#E7E5EA',
        
        // Feedback states
        success: '#16A34A',
        warning: '#F59E0B',
        error: '#DC2626',
        info: '#2563EB',
        'focus-ring': '#8D6AE1',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '80px',
        '5xl': '96px',
        // Custom spacing for consistent UI
        'safe-top': '44px',
        'safe-bottom': '34px',
        'header-height': '60px',
        'button-height-sm': '36px',
        'button-height-md': '44px',
        'button-height-lg': '52px',
        'input-height': '52px',
        'card-padding': '20px',
        'screen-padding': '24px',
      },
      fontSize: {
        'xs': ['12px', '16px'],
        'sm': ['14px', '20px'],
        'base': ['16px', '24px'],
        'lg': ['18px', '28px'],
        'xl': ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['28px', '36px'],
        '4xl': ['32px', '40px'],
        '5xl': ['36px', '44px'],
        '6xl': ['40px', '48px'],
        // Custom font sizes
        'button-sm': ['14px', '20px'],
        'button-md': ['16px', '24px'],
        'button-lg': ['18px', '24px'],
        'heading-sm': ['20px', '28px'],
        'heading-md': ['24px', '32px'],
        'heading-lg': ['28px', '36px'],
        'heading-xl': ['32px', '40px'],
      },
      borderRadius: {
        'none': '0px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        'full': '9999px',
        // Custom border radius
        'button': '12px',
        'input': '12px',
        'card': '16px',
        'modal': '20px',
      },
    },
  },
  plugins: [],
}