import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { colors, spacing } from '../../../config/theme';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import { Button, Text, Input } from '../../../components/main';
import { FONTS, APP_NAME_STYLE } from '../../../config/fonts';

export default function SignInScreen({ navigation }) {
  const { isArabic } = useLanguage();
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    
    // Validation
    if (!email || !password) {
      Alert.alert(
        isArabic ? 'خطأ' : 'Error',
        isArabic ? 'الرجاء إدخال البريد الإلكتروني وكلمة المرور' : 'Please enter email and password'
      );
      setIsLoading(false);
      return;
    }

    try {
      const user = await signInWithEmail(email, password);
      
      if (user) {
        console.log('✅ Signed in:', user.displayName);
        console.log('Profile completed:', user.profile.completed);
        // Navigation handled automatically by AppNavigator
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      Alert.alert(
        isArabic ? 'خطأ في تسجيل الدخول' : 'Sign-in Error',
        error.message || (isArabic ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email or password')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const logoText = isArabic ? 'ناسبني' : 'Nasibni';
  const taglineText = isArabic ? 'اعثر على شريك حياتك' : 'Find your life partner';
  const emailLabel = isArabic ? 'البريد الإلكتروني' : 'Email';
  const emailPlaceholder = isArabic ? 'example@email.com' : 'example@email.com';
  const passwordLabel = isArabic ? 'كلمة المرور' : 'Password';
  const passwordPlaceholder = isArabic ? '••••••••' : '••••••••';
  const signInButton = isArabic ? 'تسجيل الدخول' : 'Sign In';
  const forgotPassword = isArabic ? 'نسيت كلمة المرور؟' : 'Forgot Password?';
  const noAccount = isArabic ? 'ليس لديك حساب؟' : "Don't have an account?";
  const signUp = isArabic ? 'إنشاء حساب' : 'Sign Up';

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../assets/logos/Logo1.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text 
            variant="h2" 
            weight="bold" 
            align="center"
            style={[styles.logoText, APP_NAME_STYLE, isArabic && styles.rtlText]}
          >
            {logoText}
          </Text>
          <Text 
            variant="body" 
            color="secondary" 
            align="center"
            style={[styles.tagline, isArabic && styles.rtlText]}
          >
            {taglineText}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <Text 
              variant="body" 
              weight="semibold"
              style={[styles.label, isArabic && styles.rtlText]}
            >
              {emailLabel}
            </Text>
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder={emailPlaceholder}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              style={styles.input}
              textAlign={isArabic ? 'right' : 'left'}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <Text 
              variant="body" 
              weight="semibold"
              style={[styles.label, isArabic && styles.rtlText]}
            >
              {passwordLabel}
            </Text>
            <Input
              value={password}
              onChangeText={setPassword}
              placeholder={passwordPlaceholder}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              style={styles.input}
              textAlign={isArabic ? 'right' : 'left'}
            />
          </View>

          {/* Forgot Password */}
          <TouchableOpacity 
            style={[styles.forgotPasswordContainer, isArabic && styles.forgotPasswordRTL]}
            onPress={() => {
              // TODO: Navigate to forgot password screen
              console.log('Forgot password pressed');
            }}
          >
            <Text 
              variant="body" 
              style={[styles.forgotPasswordText, isArabic && styles.rtlText]}
            >
              {forgotPassword}
            </Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <Button
            title={signInButton}
            variant="primary"
            size="large"
            onPress={handleSignIn}
            loading={isLoading}
            disabled={isLoading}
            style={styles.signInButton}
            textStyle={[styles.buttonText, isArabic && styles.rtlText]}
          />

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text 
              variant="body" 
              color="secondary"
              style={[styles.noAccountText, isArabic && styles.rtlText]}
            >
              {noAccount}{' '}
            </Text>
            <TouchableOpacity onPress={() => {
              // TODO: Navigate to sign up screen
              console.log('Sign up pressed');
            }}>
              <Text 
                variant="body" 
                weight="semibold"
                style={[styles.signUpText, isArabic && styles.rtlText]}
              >
                {signUp}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  logoText: {
    fontSize: 38,
    color: '#5B2C91',
    lineHeight: 50,
    includeFontPadding: true,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: FONTS.regular,
    lineHeight: 24,
    includeFontPadding: true,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    color: '#1A1A1A',
    marginBottom: 8,
    fontFamily: FONTS.semibold,
  },
  input: {
    height: 52,
    backgroundColor: '#F8F8FB',
    borderWidth: 1.5,
    borderColor: '#E7E5EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: '#1A1A1A',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordRTL: {
    alignItems: 'flex-start',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#5B2C91',
    fontFamily: FONTS.medium,
  },
  signInButton: {
    width: '100%',
    height: 54,
    backgroundColor: '#5B2C91',
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#5B2C91',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: '#FFFFFF',
    lineHeight: 26,
    includeFontPadding: true,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  noAccountText: {
    fontSize: 15,
    color: '#6B7280',
    fontFamily: FONTS.regular,
  },
  signUpText: {
    fontSize: 15,
    color: '#5B2C91',
    fontFamily: FONTS.bold,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
